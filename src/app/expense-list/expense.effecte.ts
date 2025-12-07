
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, catchError, of, tap, mergeMap, withLatestFrom } from "rxjs";

import { Expense, ExpenseResponse } from "./expense.types";
import * as ExpenseActions from "./expense.actions";
import * as ExpenseSelectors from "./expense.selectors";
import { concatLatestFrom } from '@ngrx/operators';
import { ExpenseService } from "./expense-data.service";
import { selectExpense, updateExpense } from './expense.actions';
import { STORAGE_KEYS } from "@domain/localstorage/storge.util";
import { UpdateExpenseSuccess, SelectExpense } from './expense.reducer-logic';
@Injectable()
export class ExpenseEffects {
  private actions$: Actions = inject(Actions);
  private router: Router = inject(Router);
  private store: Store = inject(Store);
  // private AlertService: AlertService = inject(AlertService);
  private ExpenseDataService: ExpenseService = inject(ExpenseService);

 

 

  selectExpense$ = createEffect(() => this.actions$.pipe(
    ofType(ExpenseActions.updateExpense),
    tap(() => {
      void this.router.navigateByUrl('/Expense/edit')
    })
  ), { dispatch: false }
  );

  updateExpenses$ = createEffect(() =>
     this.actions$.pipe(  ofType(ExpenseActions.updateExpense)
    // ,
    //   concatLatestFrom(() => this.store.select(ExpenseSelectors.selectExpensesState)),
    //   map(([_arg1, arg2]) => arg2)
    ));
  
  // LOAD from localStorage
  loadFromStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExpenseActions.loadExpenses),
      map(() => {
        const raw = localStorage.getItem(STORAGE_KEYS.EXPENSE);
        const data = raw ? JSON.parse(raw) : [];
        return ExpenseActions.loadExpensesSuccess({ expense: data });
      })
    )
  );

  // SAVE to localStorage when state changes
  saveToStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ExpenseActions.addExpense,
          ExpenseActions.updateExpense,
          ExpenseActions.deleteExpense
        ),
        withLatestFrom(this.store.select(ExpenseSelectors.selectAllExpenses)),
        tap(([_, expenses]) =>
          localStorage.setItem(STORAGE_KEYS.EXPENSE, JSON.stringify(expenses))
        )
      ),
    { dispatch: false }
  );

 
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExpenseActions.loadExpenses),
      mergeMap(() =>
        this.ExpenseDataService.loadExpenses().pipe(
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
        tap(() => this.ExpenseDataService.saveExpensesToLocalStorage())
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
        tap(() => this.ExpenseDataService.getUIFromLocalStorage())
      ),
    { dispatch: false }
  );
}

