import { createAction, props } from '@ngrx/store';
import { Expense } from '@domain/models/expense';


export const loadExpenses = createAction('[Expenses] Load Expenses');
export const loadExpensesSuccess = createAction('[Expenses] Load Success', props<{ expense: Expense[] }>());
export const loadExpensesFailure = createAction('[Expenses] Load Failure', props<{ error: any }>());


export const addExpense = createAction('[Expenses] Add', props<{ expense: Expense }>());
export const updateExpense = createAction('[Expenses] Update', props<{ expense: Expense }>());
export const deleteExpense = createAction('[Expenses] Delete', props<{ id: number }>());


// UI state actions
export const setFilterCategory = createAction('[UI] Set Filter Category', props<{ category: number | null }>());
export const setFilterDateRange = createAction('[UI] Set Filter Date Range', props<{ from: string | null; to: string | null }>());
export const setSort = createAction('[UI] Set Sort', props<{ field: string; direction: 'asc' | 'desc' | null }>());
export const setPagination = createAction('[UI] Set Pagination', props<{ page: number; pageSize: number }>());