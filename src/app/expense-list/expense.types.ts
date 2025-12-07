
export interface Expense {

    id: number;
    title?: string;
  categoryId?: number;
    amount?: number;
    date: string;
    note?:string;
    createdAt: string;
}

export interface ExpenseResponse {
  id: number;
}

export const expenseFeatureName = 'Expense';

export const expenseFormDataInitial: Expense = {

    
    id: 0,
    title: '',
  categoryId:0,
    amount: 0,
    date: '',
    note:'',
    createdAt: ''

};

export const expenseInitialState: ExpenseState = {
  isexpensesLoading: false,
  isexpenseUpdating: false,
  expenses: [],
};

export interface ExpenseState {
  isexpensesLoading: boolean;
  isexpenseUpdating: boolean;
 expenseForm?: Expense;
  expenses: Expense[];
  selectedexpenseId?: number;
}
