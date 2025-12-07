
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ExpenseActions from '../expense-list/expense.actions';
import { ExpenseService } from '@service/expenseservice';
import { commonService } from '@service/commonservice';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { loadExpenses } from '../expense-list/expense.actions';


@Injectable()
export class ExpenseEffects {
load$ = createEffect(() =>
this.actions$.pipe(
ofType(ExpenseActions.loadExpenses),
mergeMap(() =>
this.expenseService.loadExpenses().pipe(
map(expense => ExpenseActions.loadExpensesSuccess({ expense })),
catchError(error => of(ExpenseActions.loadExpensesFailure({ error })))
)
)
)
);


// After any mutation, persist to localStorage
persistAdd$ = createEffect(
() =>
this.actions$.pipe(
ofType(ExpenseActions.addExpense, ExpenseActions.updateExpense, ExpenseActions.deleteExpense),
tap(() => this.expenseService.saveExpensesToLocalStorage())
),
{ dispatch: false }
);


// Persist UI state to localStorage when UI actions occur
persistUI$ = createEffect(
() =>
this.actions$.pipe(
ofType(
ExpenseActions.setFilterCategory,
ExpenseActions.setFilterDateRange,
ExpenseActions.setPagination,
ExpenseActions.setSort
),
tap(() => this.expenseService.getUIFromLocalStorage())
),
{ dispatch: false }
);


constructor(private actions$: Actions, private expenseService: ExpenseService) {}
}