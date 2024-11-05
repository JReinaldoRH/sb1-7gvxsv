import { Application } from '@nativescript/core';
import { database } from './services/database.service';

// Datos de ejemplo
database.addCategory({
  name: 'Salario',
  type: 'income',
  color: '#7C9D96',
  icon: 'fas fa-money-bill'
});

database.addCategory({
  name: 'Alimentación',
  type: 'expense',
  color: '#E76161',
  icon: 'fas fa-utensils'
});

// Cuentas de ejemplo
database.addAccount({
  name: 'Cuenta Principal',
  balance: 5000,
  type: 'checking',
  color: '#7C9D96'
});

database.addAccount({
  name: 'Ahorros',
  balance: 8000,
  type: 'savings',
  color: '#A7D2CB'
});

database.addAccount({
  name: 'Tarjeta de Crédito',
  balance: 1500,
  type: 'credit',
  color: '#E76161'
});

// Metas de ahorro de ejemplo
database.addSavingGoal({
  name: 'Fondo de Emergencia',
  targetAmount: 10000,
  currentAmount: 3000,
  color: '#7C9D96'
});

database.addSavingGoal({
  name: 'Vacaciones',
  targetAmount: 5000,
  currentAmount: 2000,
  color: '#F4DFB6'
});

// Gastos fijos de ejemplo
database.addFixedExpense({
  name: 'Alquiler',
  amount: 1200,
  category: 'Vivienda',
  dueDay: 1,
  isPaid: false,
  accountId: '1'
});

database.addFixedExpense({
  name: 'Netflix',
  amount: 15,
  category: 'Entretenimiento',
  dueDay: 15,
  isPaid: true,
  accountId: '1'
});

database.addFixedExpense({
  name: 'Gimnasio',
  amount: 50,
  category: 'Salud',
  dueDay: 5,
  isPaid: false,
  accountId: '1'
});

Application.run({ moduleName: 'app-root' });