import { Expense } from '@domain/models/expense';
import { inject, Injectable } from '@angular/core';
import * as ExpenseActions from './expense.actions'
import * as ExpenseSelectors from './expense.selectors'
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class ExpenseFacadeService {
private store: Store = inject(Store);
  readonly isNoSelectedexpense$: Observable<boolean> = this.store.select(ExpenseSelectors.selectVisibleExpenses);//selectIsNoSelectedexpense
  readonly isNoSelectedUser$: Observable<boolean> = this.store.select(ExpenseSelectors.selectIsNoSelectedUser);
  readonly isexpensesEmpty$: Observable<boolean> = this.store.select(ExpenseSelectors.selectLoading);
  readonly isexpensesLoaded$: Observable<boolean> = this.store.select(ExpenseSelectors.selectLoading);
  readonly isexpensesLoading$: Observable<boolean> = this.store.select(ExpenseSelectors.selectLoading);
  readonly isSaveButtonDisabled$: Observable<boolean> = this.store.select(ExpenseSelectors.selectVisibleExpenses);
  readonly expenses$: Observable<Expense[]> = this.store.select(ExpenseSelectors.selectAllExpenses);
  readonly selectedexpense$: Observable<Expense | undefined> = this.store.select(ExpenseSelectors.selectExpensesState);
  readonly selectedexpenseId$: Observable<number | undefined> = this.store.select(ExpenseSelectors.selectSelectedexpenseId);

  // getUserexpenses(): void {
  //   this.store.dispatch(ExpenseActions.())
  // }

  selectexpense(expenseId: number): void {
    this.store.dispatch(ExpenseActions.selectexpense({expenseId}))
  }

  setexpenseForm(expense: Expense): void {
    this.store.dispatch(ExpenseActions.({expense}))
  }

  updateexpense(): void {
    this.store.dispatch(ExpenseActions.updateexpense())
  }
}
/***********
 * 
 
export const getUserPosts = createAction(
  `${xxxPostFeatureName}.getUserPosts`
);

export const getUserPostsError = createAction(
  `${xxxPostFeatureName}.getUserPostsError`
);

export const getUserPostsSuccess = createAction(
  `${xxxPostFeatureName}.getUserPostsSuccess`,
  props<{ posts: XxxPost[] }>()
);

export const selectPost = createAction(
  `${xxxPostFeatureName}.selectPost`,
  props<{ postId: number }>()
);

export const setPostForm = createAction(
  `${xxxPostFeatureName}.setPostForm`,
  props<{ post: XxxPost }>()
);

export const updatePost = createAction(
  `${xxxPostFeatureName}.updatePost`
);

export const updatePostError = createAction(
  `${xxxPostFeatureName}.updatePostError`
);

export const updatePostSuccess = createAction(
  `${xxxPostFeatureName}.updatePostSuccess`,
  props<{ postResponse: XxxPostResponse }>()
);

 */