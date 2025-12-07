


import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectAllExpenses } from '../store/expense.selectors';
import { deleteExpense, loadExpensesSuccess } from './expense.actions';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddEditExpenseComponent } from './add-edit-expense/add-edit-expense.component';
import { commonService } from '@service/commonservice';
import { ImportsModule } from '../imports';
import { STORAGE_KEYS } from '@domain/localstorage/storge.util';
import { loadFromStorage } from '../../domain/localstorage/storge.util';
import { ExpenseService } from './expense-data.service';
import { Expense } from '@domain/models/expense';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  standalone: true,
  imports: [ImportsModule],
  providers: [DialogService, ExpenseService, commonService]
})
export class ExpenseListComponent implements OnInit, OnDestroy {
  
  private store: Store = inject(Store);

  expenses$ = this.store.select(selectAllExpenses);
  

  allExpenses: any[] = [];
  pagedExpenses: any[] = [];
  filteredTotal = 0;

  categories = [
    { label: 'All', value: null },
    { label: 'Food', value: 1 },
    { label: 'Transport', value: 2 },
    { label: 'Utilities', value: 3 },
    { label: 'Health', value: 4 },
    { label: 'Entertainment', value: 5 }
  ];

  filterCategory: number | null = null;
  filterFrom: string | null = null;
  filterTo: string | null = null;

  page = 0;
  rowsPerPage = 10;
  totalPages = 1;
  sortField: string | null = 'date';
  sortDir: 'asc' | 'desc' = 'desc';

  private sub = new Subscription();
  private dialogRef?: DynamicDialogRef;
   constructor(
    private dialog: DialogService,
    private expensesService: ExpenseService
  ) {}

  ngOnInit(): void {
    const raw = localStorage.getItem('EXPENSES');

    if (raw) {
     //this.store.dispatch(loadFromStorage<Expense>({}))
    } else {
      this.expensesService.loadMock().subscribe(data => {
        this.store.dispatch(loadExpensesSuccess({ expense: data }));
      });
    }

    const ui = this.expensesService.getUIFromLocalStorage();
    if (ui) {
      this.page = ui.page ?? 0;
      this.rowsPerPage = ui.pageSize ?? 10;
      this.filterCategory = ui.filterCategory ?? null;
      this.filterFrom = ui.filterFrom ?? null;
      this.filterTo = ui.filterTo ?? null;
      this.sortField = ui.sortField ?? 'date';
      this.sortDir = ui.sortDirection ?? 'desc';
    }

    this.sub.add(
      this.expenses$.subscribe(arr => {
        this.allExpenses = arr || [];
        this.applyFiltersAndPaging();
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    if (this.dialogRef) this.dialogRef.close();
  }

  getCategoryName(id: number) {
    const it = this.categories.find(c => c.value === id);
    return it ? it.label : 'Unknown';
  }

  applyFiltersAndPaging() {
    let items = [...this.allExpenses];

    if (this.filterCategory !== null) {
      items = items.filter(i => i.categoryId === this.filterCategory);
    }

    if (this.filterFrom) {
      items = items.filter(i => i.date >= this.filterFrom);
    }
    if (this.filterTo) {
      items = items.filter(i => i.date <= this.filterTo);
    }

    if (this.sortField) {
      items.sort((a, b) => {
        let av = a[this.sortField!];
        let bv = b[this.sortField!];

        if (this.sortField === 'date' || this.sortField === 'createdAt') {
          av = new Date(av).getTime();
          bv = new Date(bv).getTime();
        }

        return (av > bv ? 1 : av < bv ? -1 : 0) *
               (this.sortDir === 'asc' ? 1 : -1);
      });
    }

    this.filteredTotal = items.length;

    this.totalPages = Math.max(1, Math.ceil(items.length / this.rowsPerPage));
    if (this.page >= this.totalPages) this.page = this.totalPages - 1;

    const start = this.page * this.rowsPerPage;
    this.pagedExpenses = items.slice(start, start + this.rowsPerPage);

    this.saveUIState();
  }

  onFilterChange() {
    this.page = 0;
    this.applyFiltersAndPaging();
  }

  clearFilters() {
    this.filterCategory = null;
    this.filterFrom = null;
    this.filterTo = null;
    this.page = 0;
    this.applyFiltersAndPaging();
  }

  onRowsPerPageChange() {
    this.page = 0;
    this.applyFiltersAndPaging();
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.applyFiltersAndPaging();
    }
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.applyFiltersAndPaging();
    }
  }

  toggleSort(field: string) {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = 'asc';
    }
    this.applyFiltersAndPaging();
  }

  openAdd() {
    this.dialogRef = this.dialog.open(AddEditExpenseComponent, {
      header: 'Add expense',
      width: '40vw',
      data: { mode: 'add' }
    });
    this.dialogRef.onClose.subscribe(res => {
      if (res === 'saved') this.applyFiltersAndPaging();
    });
  }

  openEdit(exp: any) {
    this.dialogRef = this.dialog.open(AddEditExpenseComponent, {
      header: 'Edit expense',
      width: '40vw',
      data: { mode: 'edit', expense: exp }
    });
    this.dialogRef.onClose.subscribe(res => {
      if (res === 'saved') this.applyFiltersAndPaging();
    });
  }

  deleteExpense(id: number) {
    if (!confirm('Delete?')) return;
    this.store.dispatch(deleteExpense({ id }));
  }

  saveUIState() {
    const ui = {
      page: this.page,
      pageSize: this.rowsPerPage,
      filterCategory: this.filterCategory,
      filterFrom: this.filterFrom,
      filterTo: this.filterTo,
      sortField: this.sortField,
      sortDirection: this.sortDir
    };
    this.expensesService.saveUIState(ui);
  }
}

// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
// import { Store } from '@ngrx/store';
// import { Subscription } from 'rxjs';
// import { map } from 'rxjs/operators';

//  import { AppState } from '../store/app.state'; 
// import { selectAllExpenses } from '../store/expense.selectors';
// import {
//   deleteExpense,
//   loadExpenses    
// } from '../store/expense.actions';

// import { AddEditExpenseComponent } from './add-edit-expense/add-edit-expense.component'; 
// import { ImportsModule } from '../imports';


// interface CategoryOption {
//   label: string;
//   value: number | null;
// }

// @Component({
//   selector: 'app-expense-list',
//   templateUrl: './expense-list.component.html',
//   standalone:true,
//   imports:[ImportsModule],
//   providers: [DialogService],
// })
// export class ExpenseListComponent implements OnInit, OnDestroy {
//   expenses: any[] = [];
//   pagedExpenses: any[] = [];


//   categoryOptions: CategoryOption[] = [];
//   filterCategory: number | null = null;
//   filterDateRange: Date[] | null = null;

//   sortField = 'date';
//   sortOrder = -1;


//   pageIndex = 0;
//   rowsPerPage = 10;
//   totalPages = 1;

//   private ref?: DynamicDialogRef;
//   private subscription = new Subscription();

//   constructor(
//     private store: Store<AppState>,
//     public dialogService: DialogService
//   ) {}

//   ngOnInit(): void {
//     // load initial data if needed
//     this.store.dispatch(loadExpenses());

//     // subscribe to expenses
//     const sub = this.store
//       .select(selectAllExpenses)
//       .pipe(
//         map(exps => [...exps]) // clone
//       )
//       .subscribe(exps => {
//         this.expenses = exps;
//         this.updateCategoryOptions();
//         this.applyFilters(); // this also updates pagination
//       });

//     this.subscription.add(sub);
//   }

//   ngOnDestroy(): void {
//     this.subscription.unsubscribe();
//     if (this.ref) {
//       this.ref.close();
//     }
//   }

//   /** Helpers */

//   getCategoryLabel(id: number): string {
//     const opt = this.categoryOptions.find(o => o.value === id);
//     return opt ? opt.label : 'Unknown';
//   }

//   private updateCategoryOptions() {
//     const uniqueIds = Array.from(new Set(this.expenses.map(e => e.category)));
//     // Ideally category names come from a lookup service or constant
//     // For demo, map ids to placeholders
//     this.categoryOptions = uniqueIds
//       .sort((a, b) => (a ?? 0) - (b ?? 0))
//       .map(id => ({
//         label: `Category ${id}`,
//         value: id,
//       }));
//     // Add All option
//     this.categoryOptions.unshift({ label: 'All', value: null });
//   }

//   /** Filters */

//   applyFilters() {
//     let filtered = this.expenses;

//     // Category
//     if (this.filterCategory !== null) {
//       filtered = filtered.filter(e => e.category === this.filterCategory);
//     }

//     // Date range
//     if (this.filterDateRange && this.filterDateRange.length === 2) {
//       const [start, end] = this.filterDateRange;
//       filtered = filtered.filter(e => {
//         const d = new Date(e.date);
//         return d >= start && d <= end;
//       });
//     }

//     // Sorting
//     filtered = filtered.sort((a, b) => {
//       const field = this.sortField as keyof typeof a;
//       let aVal = a[field];
//       let bVal = b[field];
//       if (field === 'date') {
//         aVal = new Date(aVal as any).getTime();
//         bVal = new Date(bVal as any).getTime();
//       }
//       if (aVal == null) return -1;
//       if (bVal == null) return 1;
//       return aVal > bVal ? this.sortOrder : aVal < bVal ? -this.sortOrder : 0;
//     });

//     this.updatePagination(filtered);
//   }

//   clearFilters() {
//     this.filterCategory = null;
//     this.filterDateRange = null;
//     this.applyFilters();
//   }

//   /** Pagination */

//   private updatePagination(filtered: any[]) {
//     this.totalPages = Math.ceil(filtered.length / this.rowsPerPage) || 1;
//     if (this.pageIndex >= this.totalPages) {
//       this.pageIndex = this.totalPages - 1;
//     }
//     const start = this.pageIndex * this.rowsPerPage;
//     this.pagedExpenses = filtered.slice(start, start + this.rowsPerPage);
//   }

//   prevPage() {
//     if (this.pageIndex > 0) {
//       this.pageIndex--;
//       this.applyFilters();
//     }
//   }

//   nextPage() {
//     if (this.pageIndex < this.totalPages - 1) {
//       this.pageIndex++;
//       this.applyFilters();
//     }
//   }

//   /** Sorting triggered from template */
//   onSort(event: any) {
//     this.sortField = event.field;
//     this.sortOrder = event.order;
//     this.applyFilters();
//   }

//   /** CRUD actions */

//   openAddDialog() {
//     this.ref = this.dialogService.open(AddEditExpenseComponent, {
//       header: 'Add Expense',
//       width: '40vw',
//       data: { mode: 'add' },
//       modal: true,
//     });

//     this.ref.onClose.subscribe((result: any) => {
//       if (result === 'saved') {
//         // the store should have been updated by dialog component via action
//         this.applyFilters();
//       }
//     });
//   }

//   openEditDialog(expense: any) {
//     this.ref = this.dialogService.open(AddEditExpenseComponent, {
//       header: 'Edit Expense',
//       width: '40vw',
//       data: { mode: 'edit', expense },
//       modal: true,
//     });

//     this.ref.onClose.subscribe((result: any) => {
//       if (result === 'saved') {
//         this.applyFilters();
//       }
//     });
//   }

//   deleteExpense(id: number) {
//     if (confirm('Are you sure to delete this expense?')) {
//       this.store.dispatch(deleteExpense({ id }));
//       this.applyFilters();
//     }
//   }
// }
