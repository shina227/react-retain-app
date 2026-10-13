import { Bank, BankNote01, CreditCard02, Phone01 } from '@untitledui/icons';
import type { IconComponent } from '@/types/icon';
import type { PaymentMethod } from '@/types/api';

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  CASH: 'Cash',
  CARD: 'Card',
  MOBILE_MONEY: 'Mobile money',
  BANK_TRANSFER: 'Bank transfer',
};

export const paymentMethodIcons: Record<PaymentMethod, IconComponent> = {
  CASH: BankNote01,
  CARD: CreditCard02,
  MOBILE_MONEY: Phone01,
  BANK_TRANSFER: Bank,
};

export const PAGE_SIZE = 10;
