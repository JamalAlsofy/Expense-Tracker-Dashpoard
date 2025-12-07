import { saveToStorage, STORAGE_KEYS } from '@domain/localstorage/storge.util';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Expense } from './expense.types';
import { Store } from '@ngrx/store';
import { ExpensesState } from './expense.reducer';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
 
  constructor(private http: HttpClient, private store: Store<ExpensesState>) { }
  
 
  loadMock(): Observable<Expense[]> {
    return this.http.get<Expense[]>('../../assets/mock/expense.json');
  }

  loadExpenses(): Observable<Expense[]> {

    const raw = localStorage.getItem(STORAGE_KEYS.EXPENSE);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Expense[];
        return of(parsed);
      } catch (e) {
        console.error('Failed to parse Expenses from localStorage', e);
      }
    }


return this.http.get<Expense[]>('../assets/mock/expense.json').pipe(
      tap(Expenses => {
        localStorage.setItem(STORAGE_KEYS.EXPENSE, JSON.stringify(Expenses));
      })
    );
  }


  getExpensesFromLocalStorage(): Expense[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EXPENSE);
    if (!raw) return [];
    try { return JSON.parse(raw) as Expense[]; } catch { return []; }
  }


  saveExpensesToLocalStorage() {
       this.store.select(state => (state as any).Expenses?.Expenses).subscribe(Expenses => {
      if (Expenses) {
        localStorage.setItem(STORAGE_KEYS.EXPENSE, JSON.stringify(Expenses));
      }
    }).unsubscribe();
  }


  getUIFromLocalStorage(): any {
    const raw = localStorage.getItem(STORAGE_KEYS.UI_STATE);
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  }


   saveUIState(state: any) {
    saveToStorage(STORAGE_KEYS.UI_STATE, state);
  }
  update(id: number, changes: Partial<Expense>) {
    const arr = this.getUIFromLocalStorage().map(e => e.id === id ? { ...e, ...changes } : e);
    //this.expenses$.next(arr);
    saveToStorage(STORAGE_KEYS.EXPENSE, arr);
  }
}

