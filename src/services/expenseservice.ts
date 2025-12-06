import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Expense } from '@domain/models/expense';
import { ExpensesState } from '../app/store/expense.reducer';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@domain/localstorage/storge.util';


@Injectable({ providedIn: 'root' })
export class ExpenseService {
  //private expenses$ = new BehaviorSubject<Expense[]>([]);
  //expenses = this.expenses$.asObservable();


  constructor(private http: HttpClient, private store: Store<ExpensesState>) { }
  
  //  loadInitial() {
  //   const fromStorage = loadFromStorage<Expense[]>(STORAGE_KEYS.EXPENSE);
  //   if (fromStorage && fromStorage.length) {
  //     this.expenses$.next(fromStorage);
  //   } else {
  //     this.http.get<Expense[]>('../assets/mock/expense.json').subscribe(data => {
  //       this.expenses$.next(data);
  //       saveToStorage(STORAGE_KEYS.EXPENSE, data);
  //     });
  //   }
  // }

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
}





