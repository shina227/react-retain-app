import { ChevronDown, LogOut01, Plus, Settings01, Trash01, User01 } from '@untitledui/icons';
import { toast } from 'sonner';
import { BudgetStatusBadge } from '@/features/budgets/BudgetStatusBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Temporary screen for checking the Untitled UI styling. Removed once real pages exist.

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-primary">{title}</h2>
      {children}
    </section>
  );
}

const rows = [
  {
    title: 'Groceries at Melcom',
    category: 'Food',
    method: 'Cash',
    date: '5 Oct 2026',
    amount: 'RF 12,550',
  },
  {
    title: 'Trotro to work',
    category: 'Transport',
    method: 'Mobile money',
    date: '3 Oct 2026',
    amount: 'RF 1,200',
  },
];

export default function StyleGuide() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10 md:px-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-display-sm font-semibold text-primary">Retain style guide</h1>
        <p className="text-base text-tertiary">Untitled UI styling with an indigo brand.</p>
      </header>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>
            <Plus /> Add expense
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Tertiary</Button>
          <Button variant="destructive">
            <Trash01 /> Delete
          </Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button>Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra large</Button>
          <Button size="icon" variant="secondary" aria-label="Settings">
            <Settings01 />
          </Button>
        </div>
      </Section>

      <Section title="Badges and budget status">
        <div className="flex flex-wrap gap-2">
          <Badge>Gray</Badge>
          <Badge variant="brand" dot>
            Brand
          </Badge>
          <Badge variant="success" dot>
            Success
          </Badge>
          <Badge variant="warning" dot>
            Warning
          </Badge>
          <Badge variant="destructive" dot>
            Error
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <BudgetStatusBadge status="within" />
          <BudgetStatusBadge status="approaching" />
          <BudgetStatusBadge status="over" />
          <BudgetStatusBadge status="none" />
        </div>
      </Section>

      <Section title="Form fields">
        <div className="grid gap-5 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input id="title" placeholder="Groceries at Melcom" />
            <FieldDescription>What did you spend on?</FieldDescription>
          </Field>
          <Field data-invalid>
            <FieldLabel htmlFor="amount">Amount</FieldLabel>
            <Input id="amount" aria-invalid defaultValue="-5" />
            <FieldError>Amount must be greater than 0</FieldError>
          </Field>
          <Field>
            <FieldLabel>Category</FieldLabel>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="disabled">Disabled</FieldLabel>
            <Input id="disabled" disabled value="Can't edit this" readOnly />
          </Field>
        </div>
      </Section>

      <Section title="Cards and progress">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Total spent</CardDescription>
              <CardTitle className="text-display-sm">RF 212,000</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Remaining</CardDescription>
              <CardTitle className="text-display-sm">RF 38,000</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>October budget</CardTitle>
              <CardDescription>RF 212,000 of RF 250,000</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Progress value={84.8} />
              <BudgetStatusBadge status="approaching" />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section title="Table">
        <Card className="py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.title}>
                  <TableCell className="font-medium text-primary">{row.title}</TableCell>
                  <TableCell>
                    <Badge variant="brand">{row.category}</Badge>
                  </TableCell>
                  <TableCell>{row.method}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Section>

      <Section title="Loading">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-10 w-full" />
        </div>
      </Section>

      <Section title="Overlays">
        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete category?</DialogTitle>
                <DialogDescription>
                  12 expenses will be moved to Uncategorized. This can't be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button variant="destructive">Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">Open sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                Ama Mensah <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <User01 /> Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut01 /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="secondary"
            onClick={() =>
              toast.success('Expense added', { description: 'Weekly groceries · RF 12,550' })
            }
          >
            Show toast
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.error("Couldn't delete the expense", {
                description: 'Check your connection and try again.',
              })
            }
          >
            Show error toast
          </Button>
        </div>
      </Section>
    </main>
  );
}
