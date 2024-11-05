export interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'savings' | 'checking' | 'credit';
  color?: string;
  icon?: string;
  lastTransaction?: Date;
  creditLimit?: number;
  dueDate?: number;
}

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  description: string;
  accountId: string;
  toAccountId?: string;
  attachments?: string[];
  location?: string;
  tags?: string[];
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface SavingGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  color?: string;
  category?: string;
  monthlyContribution?: number;
  notifications?: boolean;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  notifications?: boolean;
  rollover?: boolean;
}

export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
  dueDay: number;
  isPaid: boolean;
  accountId: string;
  frequency: 'monthly' | 'bimonthly' | 'quarterly' | 'yearly';
  automaticPayment?: boolean;
  reminder?: number; // días antes
  lastPaidDate?: Date;
  nextDueDate?: Date;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  budget?: number;
  parent?: string;
  subcategories?: string[];
}

export interface Reminder {
  id: string;
  title: string;
  message: string;
  date: Date;
  type: 'expense' | 'goal' | 'debt' | 'budget';
  relatedId: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface Report {
  type: 'expense' | 'income' | 'savings' | 'budget';
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  data: any;
  date: Date;
}