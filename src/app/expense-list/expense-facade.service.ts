
import { inject, Injectable } from '@angular/core';
import * as ExpenseActions from './expense.actions'
import * as ExpenseSelectors from './expense.selectors'
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { UpdateExpense } from './expense.reducer-logic';
import { Expense } from './expense.types';

@Injectable({
  providedIn: 'root'
})
export class ExpenseFacadeService {
private store: Store = inject(Store);
   readonly isexpensesEmpty$: Observable<boolean> = this.store.select(ExpenseSelectors.selectLoading);
  readonly isexpensesLoaded$: Observable<boolean> = this.store.select(ExpenseSelectors.selectLoading);
  readonly isexpensesLoading$: Observable<boolean> = this.store.select(ExpenseSelectors.selectLoading);
  readonly expenses$: Observable<Expense[]> = this.store.select(ExpenseSelectors.selectAllExpenses);
  readonly selectedexpense$: Observable<Expense | undefined> = this.store.select(ExpenseSelectors.);


  selectexpense(expense: Expense): void {
    this.store.dispatch(ExpenseActions.selectExpense({expense}))
  }

  setexpenseForm(expense: Expense[]): void {
    this.store.dispatch(ExpenseActions.loadExpensesSuccess({expense}))
  }

  updateexpense(expense: Expense): void {
    this.store.dispatch(ExpenseActions.updateExpense({expense}))
  }
}
