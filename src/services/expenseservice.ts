import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Expenses } from '@domain/models/expense';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../domain/localstorage/storge.util';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class expenseService {
  private expenses$ = new BehaviorSubject<Expenses[]>([]);
  expenses = this.expenses$.asObservable();

  
  constructor(private http: HttpClient) {
    this.loadInitial();
  }
  private loadInitial() {
    const fromStorage = loadFromStorage<Expenses[]>(STORAGE_KEYS.EXPENSE);
    if (fromStorage && fromStorage.length) {
      this.expenses$.next(fromStorage);
    } else {
      this.http.get<Expenses[]>('../assets/mock/expense.json').subscribe(data => {
        this.expenses$.next(data);
        saveToStorage(STORAGE_KEYS.EXPENSE, data);
      });
    }
  }
  getAll(): Observable<Expenses[]> {
    return this.expenses$.asObservable();
  }
  getSnapshot(): Expenses[] {
    return this.expenses$.getValue();
  }
  findById(id: number): Expenses | undefined {
    return this.getSnapshot().find(e => e.id === id);
  }
 
  add(expensePartial: Omit<Expenses, 'id' | 'createdAt'>) {
    const newEmp: Expenses = {
      ...expensePartial,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    const next = [newEmp, ...this.getSnapshot()];
    this.expenses$.next(next);
    saveToStorage(STORAGE_KEYS.EXPENSE, next);
    return newEmp;
  }
  update(id: number, changes: Partial<Expenses>) {
    const arr = this.getSnapshot().map(e => e.id === id ? { ...e, ...changes } : e);
    this.expenses$.next(arr);
    saveToStorage(STORAGE_KEYS.EXPENSE, arr);
  }
  remove(id: number) {
    const arr = this.getSnapshot().filter(e => e.id !== id);
    this.expenses$.next(arr);
    saveToStorage(STORAGE_KEYS.EXPENSE, arr);
  }
  
}
/***
 * 
 */