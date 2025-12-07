import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ExpensesState } from './expense.reducer';

 


export const selectExpensesFeature = createFeatureSelector<ExpensesState>('Expenses');

export const selectLoading = createSelector(selectExpensesFeature, s => s.loading);
export const selectUI = createSelector(selectExpensesFeature, s => s.ui);



export const selectExpensesState =
  createFeatureSelector<ExpensesState>('expenses');
 export const selectAllExpenses = createSelector(
  selectExpensesState,
  (state) => state?.expenses ?? [] 
);

export const selectVisibleExpenses = createSelector(
    selectAllExpenses,
    selectUI,
    (expenses, ui) => {
        let data = [...expenses];


        // category filter
        if (ui.filterCategory !== null && ui.filterCategory !== undefined) {
            data = data.filter(p => p.categoryId === ui.filterCategory);
        }


        // date range filter
        if (ui.filterFrom) {
            data = data.filter(p => p.date >= ui.filterFrom);
        }
        if (ui.filterTo) {
            data = data.filter(p => p.date <= ui.filterTo);
        }


        // sort
        if (ui.sortField) {
            data.sort((a: any, b: any) => {
                const fa = a[ui.sortField!];
                const fb = b[ui.sortField!];
                if (fa == null) return 1;
                if (fb == null) return -1;
                if (ui.sortDirection === 'asc') return fa > fb ? 1 : fa < fb ? -1 : 0;
                if (ui.sortDirection === 'desc') return fa < fb ? 1 : fa > fb ? -1 : 0;
                return 0;
            });
        }


        // total before paging
        const total = data.length;


        // pagination (client-side)
        const start = (ui.page - 1) * ui.pageSize;
        const paged = data.slice(start, start + ui.pageSize);


        return { total, items: paged };
    }
);