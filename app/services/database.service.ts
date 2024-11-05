import { Observable } from '@nativescript/core';
import { 
  Account, Transaction, SavingGoal, Budget, 
  FixedExpense, Category, Reminder, Report 
} from '../models/types';

class DatabaseService extends Observable {
  private accounts: Account[] = [];
  private transactions: Transaction[] = [];
  private savingGoals: SavingGoal[] = [];
  private budgets: Budget[] = [];
  private fixedExpenses: FixedExpense[] = [];
  private categories: Category[] = [];
  private reminders: Reminder[] = [];

  // Accounts
  getAccounts(): Account[] {
    return [...this.accounts];
  }

  addAccount(account: Omit<Account, 'id'>): Account {
    const newAccount = { 
      ...account, 
      id: Date.now().toString(),
      lastTransaction: new Date()
    };
    this.accounts.push(newAccount);
    this.notifyPropertyChange('accounts', this.accounts);
    return newAccount;
  }

  updateAccount(id: string, updates: Partial<Account>): void {
    const index = this.accounts.findIndex(a => a.id === id);
    if (index !== -1) {
      this.accounts[index] = { ...this.accounts[index], ...updates };
      this.notifyPropertyChange('accounts', this.accounts);
    }
  }

  // Transactions
  getTransactions(filters?: {
    startDate?: Date;
    endDate?: Date;
    type?: Transaction['type'];
    categoryId?: string;
    accountId?: string;
  }): Transaction[] {
    let filtered = [...this.transactions];

    if (filters) {
      if (filters.startDate) {
        filtered = filtered.filter(t => t.date >= filters.startDate!);
      }
      if (filters.endDate) {
        filtered = filtered.filter(t => t.date <= filters.endDate!);
      }
      if (filters.type) {
        filtered = filtered.filter(t => t.type === filters.type);
      }
      if (filters.categoryId) {
        filtered = filtered.filter(t => t.category === filters.categoryId);
      }
      if (filters.accountId) {
        filtered = filtered.filter(t => t.accountId === filters.accountId);
      }
    }

    return filtered;
  }

  addTransaction(transaction: Omit<Transaction, 'id'>): void {
    const newTransaction = { ...transaction, id: Date.now().toString() };
    this.transactions.push(newTransaction);
    this.updateAccountBalance(transaction);
    this.updateBudgets(transaction);
    this.notifyPropertyChange('transactions', this.transactions);
  }

  private updateAccountBalance(transaction: Omit<Transaction, 'id'>): void {
    const account = this.accounts.find(a => a.id === transaction.accountId);
    if (!account) return;

    if (transaction.type === 'income') {
      account.balance += transaction.amount;
    } else if (transaction.type === 'expense') {
      account.balance -= transaction.amount;
    } else if (transaction.type === 'transfer' && transaction.toAccountId) {
      const toAccount = this.accounts.find(a => a.id === transaction.toAccountId);
      if (toAccount) {
        account.balance -= transaction.amount;
        toAccount.balance += transaction.amount;
      }
    }
    
    account.lastTransaction = new Date();
    this.notifyPropertyChange('accounts', this.accounts);
  }

  // Budgets
  getBudgets(): Budget[] {
    return [...this.budgets];
  }

  addBudget(budget: Omit<Budget, 'id'>): void {
    const newBudget = { ...budget, id: Date.now().toString() };
    this.budgets.push(newBudget);
    this.notifyPropertyChange('budgets', this.budgets);
  }

  updateBudgets(transaction: Omit<Transaction, 'id'>): void {
    if (transaction.type !== 'expense') return;

    const category = this.categories.find(c => c.id === transaction.category);
    if (!category) return;

    const budget = this.budgets.find(b => b.categoryId === category.id);
    if (budget) {
      budget.spent += transaction.amount;
      this.notifyPropertyChange('budgets', this.budgets);
    }
  }

  // Saving Goals
  getSavingGoals(): SavingGoal[] {
    return [...this.savingGoals];
  }

  addSavingGoal(goal: Omit<SavingGoal, 'id'>): void {
    const newGoal = { ...goal, id: Date.now().toString() };
    this.savingGoals.push(newGoal);
    this.notifyPropertyChange('savingGoals', this.savingGoals);
  }

  updateSavingGoal(goalId: string, amount: number): void {
    const goal = this.savingGoals.find(g => g.id === goalId);
    if (goal) {
      goal.currentAmount += amount;
      this.notifyPropertyChange('savingGoals', this.savingGoals);
      this.checkGoalCompletion(goal);
    }
  }

  private checkGoalCompletion(goal: SavingGoal): void {
    if (goal.currentAmount >= goal.targetAmount) {
      this.addReminder({
        title: '¡Meta alcanzada!',
        message: `Has completado tu meta: ${goal.name}`,
        date: new Date(),
        type: 'goal',
        relatedId: goal.id,
        isRead: false,
        priority: 'high'
      });
    }
  }

  // Fixed Expenses
  getFixedExpenses(): FixedExpense[] {
    return [...this.fixedExpenses];
  }

  addFixedExpense(expense: Omit<FixedExpense, 'id'>): void {
    const newExpense = { 
      ...expense, 
      id: Date.now().toString(),
      nextDueDate: this.calculateNextDueDate(expense.dueDay)
    };
    this.fixedExpenses.push(newExpense);
    this.notifyPropertyChange('fixedExpenses', this.fixedExpenses);
  }

  toggleFixedExpensePaid(expenseId: string): void {
    const expense = this.fixedExpenses.find(e => e.id === expenseId);
    if (expense) {
      expense.isPaid = !expense.isPaid;
      if (expense.isPaid) {
        expense.lastPaidDate = new Date();
        expense.nextDueDate = this.calculateNextDueDate(expense.dueDay);
      }
      this.notifyPropertyChange('fixedExpenses', this.fixedExpenses);
    }
  }

  private calculateNextDueDate(dueDay: number): Date {
    const today = new Date();
    let nextDate = new Date(today.getFullYear(), today.getMonth(), dueDay);
    
    if (today.getDate() >= dueDay) {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }
    
    return nextDate;
  }

  // Categories
  getCategories(): Category[] {
    return [...this.categories];
  }

  addCategory(category: Omit<Category, 'id'>): void {
    const newCategory = { ...category, id: Date.now().toString() };
    this.categories.push(newCategory);
    this.notifyPropertyChange('categories', this.categories);
  }

  // Reminders
  private addReminder(reminder: Omit<Reminder, 'id'>): void {
    const newReminder = { ...reminder, id: Date.now().toString() };
    this.reminders.push(newReminder);
    this.notifyPropertyChange('reminders', this.reminders);
  }

  getReminders(): Reminder[] {
    return [...this.reminders].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  // Reports
  generateReport(type: Report['type'], period: Report['period']): Report {
    // Implementar lógica de generación de reportes
    return {
      type,
      period,
      data: {},
      date: new Date()
    };
  }
}

export const database = new DatabaseService();