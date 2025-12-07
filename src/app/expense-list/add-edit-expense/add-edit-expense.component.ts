
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.state'; 
import {
  addExpense,
  updateExpense,
} from '../expense.actions';
import { ImportsModule } from 'src/app/imports';

@Component({
  selector: 'app-add-edit-expense',
  standalone: true,
    imports:[ImportsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-fluid">
      <div class="field">
        <label for="title">Title</label>
        <input
          id="title"
          type="text"
          pInputText
          formControlName="title"
          [ngClass]="{ 'p-invalid': isControlInvalid('title') }"
        />
        <small *ngIf="isControlInvalid('title')" class="p-error">
          Title is required.
        </small>
      </div>
      <div class="field">
        <label for="category">Category</label>
        <p-dropdown
          id="category"
          [options]="categoryOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select category"
          formControlName="category"
          [ngClass]="{ 'p-invalid': isControlInvalid('category') }"
        ></p-dropdown>
        <small *ngIf="isControlInvalid('category')" class="p-error">
          Category is required.
        </small>
      </div>
      <div class="field">
        <label for="amount">Amount</label>
        <input
          id="amount"
          type="number"
          pInputText
          formControlName="amount"
          [ngClass]="{ 'p-invalid': isControlInvalid('amount') }"
          min="0.01"
          step="0.01"
        />
        <small *ngIf="isControlInvalid('amount')" class="p-error">
          Amount must be greater than 0.
        </small>
      </div>

      <div class="field">
        <label for="date">Date</label>
        <p-calendar
          id="date"
          formControlName="date"
          dateFormat="yy-mm-dd"
          [showIcon]="true"
          [ngClass]="{ 'p-invalid': isControlInvalid('date') }"
        ></p-calendar>
        <small *ngIf="isControlInvalid('date')" class="p-error">
          Valid date is required.
        </small>
      </div>

      <div class="field">
        <label for="note">Note</label>
        <textarea
          id="note"
          pInputTextarea
          rows="3"
          formControlName="note"
        ></textarea>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <button
          pButton
          type="button"
          label="Cancel"
          class="p-button-secondary"
          (click)="ref.close(null)"
        ></button>
        <button
          pButton
          type="submit"
          label="Save"
          [disabled]="form.invalid"
        ></button>
      </div>
    </form>
  `,
})
export class AddEditExpenseComponent implements OnInit {
  form!: FormGroup;
  mode: 'add' | 'edit' = 'add';
  expenseData: any = null;


  categoryOptions = [
    { label: 'Food', value: 1 },
    { label: 'Transport', value: 2 },
    { label: 'Utilities', value: 3 },
 
  ];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.mode = this.config.data?.mode || 'add';
    this.expenseData = this.config.data?.expense || null;

    this.form = this.fb.group({
      title: ['', Validators.required],
      category: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      date: [null, Validators.required],
      note: [''],
    });

    if (this.mode === 'edit' && this.expenseData) {
      this.form.patchValue({
        title: this.expenseData.title,
        category: this.expenseData.category,
        amount: this.expenseData.amount,
        date: new Date(this.expenseData.date),
        note: this.expenseData.note || '',
      });
    }
  }

  isControlInvalid(name: string): boolean {
    const c = this.form.get(name);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload = {
      ...raw,
   
      date: raw.date instanceof Date ? raw.date.toISOString().split('T')[0] : raw.date,
    };

    if (this.mode === 'add') {

      const newExpense = {
        id: this.generateId(),
        ...payload,
        createdAt: new Date().toISOString(),
      };
      this.store.dispatch(addExpense({ expense: newExpense }));
    } else if (this.mode === 'edit' && this.expenseData) {
      const updated = {
        ...this.expenseData,
        ...payload,
      };
      this.store.dispatch(updateExpense({ expense: updated }));
    }

    this.ref.close('saved');
  }

  private generateId(): number {
  
    return Date.now();
  }
}
