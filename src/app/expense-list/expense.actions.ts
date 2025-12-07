import { createAction, props } from '@ngrx/store';
import { Expense } from '@domain/models/expense';
import { expenseFeatureName } from './expense.types';


export const loadExpenses = createAction('[Expenses] Load Expenses');
export const loadExpensesSuccess = createAction('[Expenses] Load Success', props<{ expense: Expense[] }>());
export const loadExpensesFailure = createAction('[Expenses] Load Failure', props<{ error: any }>());


export const addExpense = createAction('[Expenses] Add', props<{ expense: Expense }>());
export const updateExpense = createAction('[Expenses] Update', props<{ expense: Expense }>());
export const selectExpense = createAction('[Expenses] Update', props<{ expense: Expense }>());
export const deleteExpense = createAction('[Expenses] Delete', props<{ id: number }>());
export const getExpenseId = createAction('[Expenses] Delete', props<{ id: number }>());

export const setFilterCategory = createAction('[UI] Set Filter Category', props<{ category: number | null }>());
export const setFilterDateRange = createAction('[UI] Set Filter Date Range', props<{ from: string | null; to: string | null }>());
export const setSort = createAction('[UI] Set Sort', props<{ field: string; direction: 'asc' | 'desc' | null }>());
export const setPagination = createAction('[UI] Set Pagination', props<{ page: number; pageSize: number }>());
export const getExpensesSuccess = createAction(
  `${expenseFeatureName}.getUserexpensesSuccess`,
  props<{ expenses: Expense[] }>()
);
export const updateExpenseError = createAction(
  `${expenseFeatureName}.updatePostError`
);
/***********
 * 
 
export const getUserexpenses = createAction(
  `${expensesFeatureName}.getUserexpenses`
);

export const getUserexpensesError = createAction(
  `${expensesFeatureName}.getUserexpensesError`
);

export const getUserexpensesSuccess = createAction(
  `${expensesFeatureName}.getUserexpensesSuccess`,
  props<{ expenses: expenses[] }>()
);

export const selectexpense = createAction(
  `${expensesFeatureName}.selectexpense`,
  props<{ expenseId: number }>()
);

export const setexpenseForm = createAction(
  `${expensesFeatureName}.setexpenseForm`,
  props<{ expense: expenses }>()
);

export const updateexpense = createAction(
  `${expensesFeatureName}.updateexpense`
);

export const updateexpenseError = createAction(
  `${expensesFeatureName}.updateexpenseError`
);

export const updateexpenseSuccess = createAction(
  `${expensesFeatureName}.updateexpenseSuccess`,
  props<{ expenseResponse: expensesResponse }>()
);

 */