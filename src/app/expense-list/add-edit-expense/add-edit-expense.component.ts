import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { expenseService } from '@service/expenseservice';
import { ImportsModule } from 'src/app/imports';

@Component({
  selector: 'app-add-edit-expense',
  standalone: true,
  imports: [ImportsModule],
  providers:[expenseService],
  template: `
    <div class="p-fluid">
   <form [formGroup]="form">
       <div class="field">
       
        <label>Title</label>
        <input pInputText type="text" formControlName="title" [ngClass]="{'ng-invalid': form.controls.title.invalid && form.controls.title.touched}" />
        <small *ngIf="form.controls.title.invalid && form.controls.title.touched" class="p-error">This  field is required</small>
      </div>

      <div class="field">
        <label>Amount</label>
        <input pInputText type="number" step="0.01" formControlName="amount" />
        <small *ngIf="form.controls.amount.invalid && form.controls.amount.touched" class="p-error">Please enter more than zero</small>
      </div>

      <div class="field">
        <label>Date</label>
        <p-calendar formControlName="date" [showIcon]="true" dateFormat="dd/mm/yy"></p-calendar>
        <small *ngIf="form.controls.date.invalid && form.controls.date.touched" class="p-error">History is required and valid</small>
      </div>

      <div class="field">
        <label>Category</label>
        <p-dropdown [options]="categories" optionLabel="name" optionValue="id" formControlName="categoryId" placeholder="Choose a Category"></p-dropdown>
        <small *ngIf="form.controls.categoryId.invalid && form.controls.categoryId.touched" class="p-error">This  field is required</small>
      </div>
<!---

--->
      <div class="field">
        <label>Note</label>
        <textarea rows="3" pInputTextarea formControlName="note"></textarea>
      </div>
   </form>

      <div class="flex justify-content-end gap-2 mt-3">
        <button pButton label="Cancel" icon="pi pi-times" (click)="ref.close()" class="p-button-text"></button>
        <button pButton label="Save" icon="pi pi-check" (click)="save()" [disabled]="form.invalid" [style.opacity]="form.invalid ? 0.6 : 1"></button>
      </div>
    </div>
  `,
  styleUrls: ['./add-edit-expense.component.scss']
})
export class AddEditExpenseComponent implements OnInit {
  categories = [
    { id: 1, name: 'Food' },
    { id: 2, name: 'Transport' }
  ];

  form!: FormGroup;
  itemId = 0;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private expenseSrv: expenseService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [0],
      title: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      date: [null, Validators.required],
      note: [''],
      categoryId: [null, Validators.required]
    });

    const data = this.config?.data;
    if (data?.editMode && data.items) {
           const toPatch: any = { ...data.items };
      if (toPatch.date) toPatch.date = new Date(toPatch.date);
      this.form.patchValue(toPatch);
      this.itemId = data.id ?? 0;
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;
    
    const payload = {
      title: raw.title,
      amount: Number(raw.amount),
      date: raw.date instanceof Date ? formatISODate(raw.date) : raw.date,
      note: raw.note,
      categoryId: Number(raw.categoryId)
    };

    if (this.config?.data?.editMode && raw.id) {
  
      this.expenseSrv.update(raw.id, payload);
    } else {
      
      this.expenseSrv.add(payload);
    }

    this.ref.close(true);
  }
}


function formatISODate(d: Date) {
 
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}





