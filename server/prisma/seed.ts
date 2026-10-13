/**
 * Idempotent demo seed. Safe to re-run: categories and users are upserted, and only the
 * seeded demo users' expenses and budgets are replaced. Real registered users are never touched.
 *
 * Data is deterministic (seeded PRNG), spans the current and previous two months, and is
 * deliberately uneven so the admin "top 5" / "bottom 5" categories differ and one category
 * has zero expenses.
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import { PaymentMethod, PrismaClient, Role } from '../src/generated/prisma/client.js';

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL (or DIRECT_URL) is not set');

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD;
const USER_PASSWORD = process.env.SEED_USER_PASSWORD;
if (!ADMIN_PASSWORD || !USER_PASSWORD) {
  throw new Error('SEED_ADMIN_PASSWORD and SEED_USER_PASSWORD must be set');
}

/** Deterministic PRNG (mulberry32) so every seed run produces the same data. */
const createRandom = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const random = createRandom(20261019);
const randInt = (min: number, max: number) => Math.floor(random() * (max - min + 1)) + min;
const pick = <T>(items: readonly T[]): T => items[Math.floor(random() * items.length)]!;

// weight = relative usage; [min, max] = amount range in RWF
const CATEGORIES = [
  { name: 'Uncategorized', color: '#94a3b8', isDefault: true, weight: 1, range: [1_000, 8_000] },
  { name: 'Food & Dining', color: '#f97316', weight: 22, range: [2_000, 15_000] },
  { name: 'Groceries', color: '#22c55e', weight: 18, range: [5_000, 40_000] },
  { name: 'Transport', color: '#3b82f6', weight: 16, range: [500, 10_000] },
  { name: 'Utilities', color: '#eab308', weight: 8, range: [5_000, 35_000] },
  { name: 'Shopping', color: '#ec4899', weight: 8, range: [5_000, 60_000] },
  { name: 'Entertainment', color: '#a855f7', weight: 6, range: [3_000, 25_000] },
  { name: 'Health', color: '#ef4444', weight: 4, range: [3_000, 50_000] },
  { name: 'Housing & Rent', color: '#0ea5e9', weight: 3, range: [80_000, 250_000] },
  { name: 'Education', color: '#14b8a6', weight: 2, range: [10_000, 90_000] },
  { name: 'Travel', color: '#6366f1', weight: 1, range: [20_000, 150_000] },
  { name: 'Gifts & Donations', color: '#f43f5e', weight: 0, range: [5_000, 30_000] }, // intentionally unused
] as const;

const TITLES: Record<string, readonly string[]> = {
  Uncategorized: ['Miscellaneous', 'Cash withdrawal fee', 'Bank charges'],
  'Food & Dining': [
    'Lunch at work',
    'Brochettes & chips',
    'Coffee',
    'Dinner out',
    'Isombe lunch',
    'Pizza night',
  ],
  Groceries: ['Weekly groceries', 'Market run', 'Supermarket top-up', 'Fruit & vegetables'],
  Transport: ['Moto ride', 'Bus fare', 'Fuel', 'Yego cab', 'Taxi to airport'],
  Utilities: [
    'Electricity (Cash Power)',
    'Water bill (WASAC)',
    'Internet subscription',
    'Mobile data bundle',
  ],
  Shopping: ['New shoes', 'Clothing', 'Phone accessories', 'Home items'],
  Entertainment: ['Cinema tickets', 'Netflix', 'Spotify', 'Concert tickets', 'Game night'],
  Health: ['Pharmacy', 'Doctor visit', 'Gym membership', 'Lab tests'],
  'Housing & Rent': ['Monthly rent', 'Home repairs'],
  Education: ['Online course', 'Textbooks', 'Workshop fee'],
  Travel: ['Weekend trip to Musanze', 'Hotel stay', 'Bus to Rubavu'],
  'Gifts & Donations': ['Birthday gift'],
};

const PAYMENT_METHODS = [
  PaymentMethod.MOBILE_MONEY,
  PaymentMethod.MOBILE_MONEY,
  PaymentMethod.CARD,
  PaymentMethod.CARD,
  PaymentMethod.CASH,
  PaymentMethod.BANK_TRANSFER,
] as const;

const NOTES = [
  'Split with a friend',
  'Paid in advance',
  'Recurring',
  'Discount applied',
  null,
  null,
  null,
  null,
];

// budgetRatios: spend / budget for [two months ago, last month, this month] → drives within / approaching / over
const DEMO_USERS = [
  { name: 'Aline Uwase', email: 'demo@example.com', expenses: 45, budgetRatios: [0.6, 1.15, 0.86] },
  { name: 'Eric Mugisha', email: 'eric@example.com', expenses: 30, budgetRatios: [0.9, 0.7, 1.1] },
  {
    name: 'Grace Uwimana',
    email: 'grace@example.com',
    expenses: 28,
    budgetRatios: [0.5, 0.82, 0.4],
  },
  {
    name: 'Jean Habimana',
    email: 'jean@example.com',
    expenses: 25,
    budgetRatios: [1.2, 0.95, 0.65],
  },
  {
    name: 'Divine Ingabire',
    email: 'divine@example.com',
    expenses: 22,
    budgetRatios: [0.75, 0.55, 0.9],
  },
] as const;

/** First day of the month `offset` months before the current one, as UTC midnight. */
const monthStart = (offset: number) => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
};
const monthKey = (date: Date) => date.toISOString().slice(0, 7);

/** Random date-only value within the month, never in the future. */
const randomDateInMonth = (start: Date) => {
  const today = new Date();
  const lastDay = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0),
  ).getUTCDate();
  const isCurrentMonth = monthKey(start) === monthKey(today);
  const maxDay = isCurrentMonth ? today.getUTCDate() : lastDay;
  return new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), randInt(1, maxDay)));
};

const weightedCategory = () => {
  const total = CATEGORIES.reduce((sum, c) => sum + c.weight, 0);
  let roll = random() * total;
  for (const category of CATEGORIES) {
    roll -= category.weight;
    if (roll < 0) return category;
  }
  return CATEGORIES[1];
};

async function main() {
  console.log('Seeding categories…');
  const categoryIds = new Map<string, string>();
  for (const { name, color, ...rest } of CATEGORIES) {
    const isDefault = 'isDefault' in rest && rest.isDefault;
    const category = await prisma.category.upsert({
      where: { name },
      update: { color, isDefault },
      create: { name, color, isDefault },
    });
    categoryIds.set(name, category.id);
  }

  console.log('Seeding admin…');
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: Role.ADMIN },
    create: {
      name: 'Retain Admin',
      email: ADMIN_EMAIL,
      role: Role.ADMIN,
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD!, 12),
    },
  });

  console.log('Seeding demo users, expenses and budgets…');
  const userPasswordHash = await bcrypt.hash(USER_PASSWORD!, 12);
  const months = [monthStart(2), monthStart(1), monthStart(0)];
  let expenseCount = 0;

  for (const demo of DEMO_USERS) {
    const user = await prisma.user.upsert({
      where: { email: demo.email },
      update: { name: demo.name },
      create: { name: demo.name, email: demo.email, passwordHash: userPasswordHash },
    });

    // Replace this demo user's data so re-runs stay deterministic.
    await prisma.expense.deleteMany({ where: { userId: user.id } });
    await prisma.budget.deleteMany({ where: { userId: user.id } });

    const expenses = Array.from({ length: demo.expenses }, (_, i) => {
      const category = weightedCategory();
      const [min, max] = category.range;
      return {
        userId: user.id,
        categoryId: categoryIds.get(category.name)!,
        title: pick(TITLES[category.name]!),
        amount: Math.round(randInt(min, max) / 100) * 100, // whole francs, to the nearest 100
        date: randomDateInMonth(months[i % months.length]!),
        paymentMethod: pick(PAYMENT_METHODS),
        notes: pick(NOTES),
      };
    });
    await prisma.expense.createMany({ data: expenses });
    expenseCount += expenses.length;

    // Budgets are derived from actual spend so each month lands in the intended status.
    for (const [i, start] of months.entries()) {
      const month = monthKey(start);
      const spent = expenses
        .filter((e) => monthKey(e.date) === month)
        .reduce((sum, e) => sum + e.amount, 0);
      const amount = Math.max(50_000, Math.round(spent / demo.budgetRatios[i]! / 10_000) * 10_000);
      await prisma.budget.create({ data: { userId: user.id, month, amount } });
    }
  }

  console.log(
    `Done: ${CATEGORIES.length} categories, 1 admin, ${DEMO_USERS.length} users, ${expenseCount} expenses.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
