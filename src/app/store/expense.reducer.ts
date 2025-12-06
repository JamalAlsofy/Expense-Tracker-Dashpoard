import { createReducer, on } from '@ngrx/store';
import * as ExpenseActions from './expense.actions';
import { Expense } from '@domain/models/expense';


export interface ExpensesState {
expenses: Expense[];
loading: boolean;
error: any | null;
ui: {
filterCategory: number | null;
filterFrom: string | null;
filterTo: string | null;
sortField: string | null;
sortDirection: 'asc' | 'desc' | null;
page: number;
pageSize: number;
};
}


export const initialState: ExpensesState = {
expenses: [],
loading: false,
error: null,
ui: {
filterCategory: null,
filterFrom: null,
filterTo: null,
sortField: null,
sortDirection: null,
page: 1,
pageSize: 5
}
};


export const ExpensesReducer = createReducer(
initialState,
on(ExpenseActions.loadExpenses, state => ({ ...state, loading: true })),
on(ExpenseActions.loadExpensesSuccess, (state, { expense }) => ({ ...state, loading: false, expense })),
on(ExpenseActions.loadExpensesFailure, (state, { error }) => ({ ...state, loading: false, error })),
on(ExpenseActions.addExpense, (state, { expense }) => ({ ...state, expenses: [...state.expenses, expense] })),
on(ExpenseActions.updateExpense, (state, { expense }) => ({
...state,
Expenses: state.expenses.map(p => (p.id === expense.id ? { ...expense } : p))
})),
on(ExpenseActions.deleteExpense, (state, { id }) => ({ ...state, Expenses: state.expenses.filter(p => p.id !== id) })),


// UI
on(ExpenseActions.setFilterCategory, (state, { category }) => ({ ...state, ui: { ...state.ui, filterCategory: category, page: 1 } })),
on(ExpenseActions.setFilterDateRange, (state, { from, to }) => ({ ...state, ui: { ...state.ui, filterFrom: from, filterTo: to, page: 1 } })),
on(ExpenseActions.setSort, (state, { field, direction }) => ({ ...state, ui: { ...state.ui, sortField: field, sortDirection: direction } })),
on(ExpenseActions.setPagination, (state, { page, pageSize }) => ({ ...state, ui: { ...state.ui, page, pageSize } }))
);