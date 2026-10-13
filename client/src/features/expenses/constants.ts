import type { PaymentMethod } from '@/types/api';

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  CASH: 'Cash',
  CARD: 'Card',
  MOBILE_MONEY: 'Mobile money',
  BANK_TRANSFER: 'Bank transfer',
};

export const PAGE_SIZE = 10;
