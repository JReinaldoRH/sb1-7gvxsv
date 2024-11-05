import { Observable, Frame, alert } from '@nativescript/core';
import { database } from '../../services/database.service';
import { Account, SavingGoal, FixedExpense, Reminder } from '../../models/types';

export class DashboardViewModel extends Observable {
  private _accounts: Account[] = [];
  private _savingGoals: SavingGoal[] = [];
  private _fixedExpenses: FixedExpense[] = [];
  private _activeReminders: Reminder[] = [];
  private _totalBalance: number = 0;
  private _monthlyIncome: number = 3500;
  private _monthlyExpenses: number = 2100;
  private _monthlyIncomePercentage: number = 5.2;
  private _monthlyExpensesPercentage: number = -2.8;
  private _isQuickMenuOpen: boolean = false;

  constructor() {
    super();
    this.loadData();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    database.on('accountsChange', () => this.loadAccounts());
    database.on('savingGoalsChange', () => this.loadSavingGoals());
    database.on('fixedExpensesChange', () => this.loadFixedExpenses());
    database.on('remindersChange', () => this.loadReminders());

    // Actualizar datos cada minuto
    setInterval(() => this.checkDueDates(), 60000);
  }

  get accounts(): Account[] {
    return this._accounts;
  }

  get savingGoals(): SavingGoal[] {
    return this._savingGoals;
  }

  get fixedExpenses(): FixedExpense[] {
    return this._fixedExpenses;
  }

  get activeReminders(): Reminder[] {
    return this._activeReminders;
  }

  get totalBalance(): number {
    return this._totalBalance;
  }

  get monthlyIncome(): number {
    return this._monthlyIncome;
  }

  get monthlyExpenses(): number {
    return this._monthlyExpenses;
  }

  get monthlyIncomePercentage(): number {
    return this._monthlyIncomePercentage;
  }

  get monthlyExpensesPercentage(): number {
    return this._monthlyExpensesPercentage;
  }

  get isQuickMenuOpen(): boolean {
    return this._isQuickMenuOpen;
  }

  private loadData(): void {
    this.loadAccounts();
    this.loadSavingGoals();
    this.loadFixedExpenses();
    this.loadReminders();
    this.calculateTotalBalance();
  }

  private loadAccounts(): void {
    this._accounts = database.getAccounts().map(account => ({
      ...account,
      icon: this.getAccountIcon(account.type)
    }));
    this.notifyPropertyChange('accounts', this._accounts);
    this.calculateTotalBalance();
  }

  private loadSavingGoals(): void {
    this._savingGoals = database.getSavingGoals().map(goal => ({
      ...goal,
      progressPercentage: Math.round((goal.currentAmount / goal.targetAmount) * 100),
      daysRemaining: goal.deadline ? this.calculateDaysRemaining(goal.deadline) : null
    }));
    this.notifyPropertyChange('savingGoals', this._savingGoals);
  }

  private loadFixedExpenses(): void {
    this._fixedExpenses = database.getFixedExpenses();
    this.notifyPropertyChange('fixedExpenses', this._fixedExpenses);
  }

  private loadReminders(): void {
    this._activeReminders = database.getReminders().filter(r => !r.isRead);
    this.notifyPropertyChange('activeReminders', this._activeReminders);
  }

  private calculateTotalBalance(): void {
    this._totalBalance = this._accounts.reduce((sum, account) => 
      sum + (account.type === 'credit' ? -account.balance : account.balance), 0);
    this.notifyPropertyChange('totalBalance', this._totalBalance);
  }

  private getAccountIcon(type: string): string {
    switch (type) {
      case 'savings': return '&#xf555;';
      case 'checking': return '&#xf19c;';
      case 'credit': return '&#xf09d;';
      default: return '&#xf0d6;';
    }
  }

  private calculateDaysRemaining(deadline: Date): number {
    const today = new Date();
    const diff = deadline.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  private checkDueDates(): void {
    const today = new Date();
    this._fixedExpenses.forEach(expense => {
      if (!expense.isPaid && expense.nextDueDate) {
        const daysUntilDue = this.calculateDaysRemaining(expense.nextDueDate);
        if (daysUntilDue <= expense.reminder!) {
          this.showNotification(
            'Recordatorio de pago',
            `${expense.name} vence en ${daysUntilDue} días`
          );
        }
      }
    });
  }

  // UI Actions
  toggleQuickMenu(): void {
    this._isQuickMenuOpen = !this._isQuickMenuOpen;
    this.notifyPropertyChange('isQuickMenuOpen', this._isQuickMenuOpen);
  }

  onQuickIncome(): void {
    this.toggleQuickMenu();
    // Implementar lógica
  }

  onQuickExpense(): void {
    this.toggleQuickMenu();
    // Implementar lógica
  }

  onQuickTransfer(): void {
    this.toggleQuickMenu();
    // Implementar lógica
  }

  onQuickBudget(): void {
    this.toggleQuickMenu();
    // Implementar lógica
  }

  onAccountDetailTap(args: any): void {
    const account = args.object.bindingContext;
    // Navegar a detalles de cuenta
  }

  onGoalDetailTap(args: any): void {
    const goal = args.object.bindingContext;
    // Navegar a detalles de meta
  }

  onExpenseDetailTap(args: any): void {
    const expense = args.object.bindingContext;
    // Navegar a detalles de gasto fijo
  }

  dismissReminder(args: any): void {
    const reminder = args.object.bindingContext;
    // Marcar recordatorio como leído
  }

  onShowReportsTap(): void {
    // Navegar a reportes
  }

  onNotificationsTap(): void {
    // Mostrar centro de notificaciones
  }

  private showNotification(title: string, message: string): void {
    // Implementar sistema de notificaciones
  }

  // ... resto de métodos existentes ...
}