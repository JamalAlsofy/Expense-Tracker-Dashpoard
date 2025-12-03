import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MessageService, ConfirmationService } from 'primeng/api';
import { expenseService } from '@service/expenseservice';
import { commonService } from '@service/commonservice';
import { Expenses } from '@domain/models/expense';
import { AddEditExpenseComponent } from './add-edit-expense/add-edit-expense.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ImportsModule } from '../imports';
import { Table, TableService } from 'primeng/table';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [ImportsModule],
  providers: [MessageService, TableService,Table,ConfirmationService, expenseService, commonService, DialogService],
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {

  expenses: Expenses[] = [];
  displayed: Expenses[] = [];
  filteredCount = 0;
  selectedexpenses: Expenses[] = [];

  
  search = new FormControl('');
  categoryFilter = new FormControl('all');
  fromDateCtrl = new FormControl(null);
  toDateCtrl = new FormControl(null);

  
  sortBy = { key: 'title' as 'title' | 'amount' | 'date', dir: 'asc' as 'asc' | 'desc' };

  
  page = 0; 
  pageSize = 8;
  pageSizeOptions = [
    { label: '8', value: 10 },
    { label: '12', value: 12 },
    { label: '20', value: 20 },
    { label: '50', value: 50 },
    { label: '80', value: 80 },
    { label: '100', value: 100 }
  ];

  
  pages: number[] = [];
  totalPages = 1;

  categories = [
    { id: 1, name: 'Food' },
    { id: 2, name: 'Transport' },
   
  ];

  constructor(
    private expensesService: expenseService,
    private uiService: commonService,
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    private dialog: DialogService
  ) {}

  ngOnInit(): void {
    this.restoreUIState();
    this.subscribeToexpenseList();
    this.attachFilterListeners();
  }

  private restoreUIState(): void {
    const ui = this.uiService.loadUIState();
    if (!ui) return;
    this.search.setValue(ui.search ?? '');
    this.categoryFilter.setValue(ui.category ?? 'all');
    this.fromDateCtrl.setValue(ui.fromDate ?? null);
    this.toDateCtrl.setValue(ui.toDate ?? null);
    this.page = ui.page ?? 0;
    this.pageSize = ui.pageSize ?? 8;
    this.sortBy = ui.sortBy ?? this.sortBy;
  }

  private subscribeToexpenseList(): void {
    this.expensesService.expenses.subscribe(list => {
      this.expenses = [...list];
      this.applyFilters();
    });
  }

  private attachFilterListeners(): void {
    this.search.valueChanges.pipe(debounceTime(200)).subscribe(() => { this.page = 0; this.applyFilters(); });
    this.categoryFilter.valueChanges.subscribe(() => { this.page = 0; this.applyFilters(); });
    this.fromDateCtrl.valueChanges.subscribe(() => { this.page = 0; this.applyFilters(); });
    this.toDateCtrl.valueChanges.subscribe(() => { this.page = 0; this.applyFilters(); });
  }

  clearFilters(): void {
    this.search.setValue('');
    this.categoryFilter.setValue('all');
    this.fromDateCtrl.setValue(null);
    this.toDateCtrl.setValue(null);
    this.page = 0;
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.expenses];

    const keyword = (this.search.value || '').toLowerCase();
    if (keyword) filtered = filtered.filter(p => p.title?.toLowerCase().includes(keyword));

    const category = this.categoryFilter.value;
    if (category !== 'all' && category != null) filtered = filtered.filter(p => p.categoryId === +category);
     const from = this.fromDateCtrl.value ? new Date(this.fromDateCtrl.value) : null;
    const to = this.toDateCtrl.value ? new Date(this.toDateCtrl.value) : null;
    if (from) filtered = filtered.filter(p => new Date(p.date) >= startOfDay(from));
    if (to) filtered = filtered.filter(p => new Date(p.date) <= endOfDay(to));

       filtered = this.applySorting(filtered);

    this.filteredCount = filtered.length;

 
    this.totalPages = Math.max(1, Math.ceil(filtered.length / this.pageSize));
    if (this.page >= this.totalPages) this.page = this.totalPages - 1;
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i);

    this.displayed = this.applyPagination(filtered);

     this.saveUIState();
  }

  private applySorting(list: Expenses[]): Expenses[] {
    const copy = [...list];
    copy.sort((a, b) => {
      let aValue: any = this.sortBy.key === 'title' ? (a.title ?? '') : this.sortBy.key === 'amount' ? a.amount : new Date(a.date).getTime();
      let bValue: any = this.sortBy.key === 'title' ? (b.title ?? '') : this.sortBy.key === 'amount' ? b.amount : new Date(b.date).getTime();

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return this.sortBy.dir === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortBy.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }

  private applyPagination(list: Expenses[]): Expenses[] {
    const start = this.page * this.pageSize;
    return list.slice(start, start + this.pageSize);
  }

  private saveUIState(): void {
    this.uiService.saveUIState({
      search: this.search.value,
      category: this.categoryFilter.value,
      fromDate: this.fromDateCtrl.value,
      toDate: this.toDateCtrl.value,
      page: this.page,
      pageSize: this.pageSize,
      sortBy: this.sortBy
    });
  }

  changeSort(key: 'title' | 'amount' | 'date'): void {
    if (this.sortBy.key === key) {
      this.sortBy.dir = this.sortBy.dir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = { key, dir: 'asc' };
    }
    this.applyFilters();
  }


  goPage(p: number): void { this.page = p; this.applyFilters(); }
  prevPage(): void { if (this.page>0) { this.page--; this.applyFilters(); } }
  nextPage(): void { if ((this.page+1)<this.totalPages) { this.page++; this.applyFilters(); } }
  onPageSizeChange(size: number): void { this.pageSize = size; this.page = 0; this.applyFilters(); }

  openForm(event: any): void {
    const isEdit = !!event?.id;
    const ref = this.dialog.open(AddEditExpenseComponent, {
      header: isEdit ? 'Edit expense' : 'Add expense',
      width: '40%',
      styleClass: 'my-dialog',
      data: { editMode: isEdit, items: event, id: event?.id }
    });

    ref.onClose.subscribe(result => {
       
      if (result != null) {
  window.location.reload();
        this.messageService.add({ severity: 'success', summary: 'Done', detail: 'Saved successfully' });
      }
    });
  }

  deleteSelectedexpenses(): void {
    this.confirmation.confirm({
      message: 'Are you sure you want to delete the selected items?',
      header: 'To be sure',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const selectedIds = this.selectedexpenses?.map(p => p.id) || [];
      
        selectedIds.forEach(id => this.expensesService.remove(id));
        this.selectedexpenses = [];
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'The selected items have been deleted' });
      }
    });
  }

  deleteexpense(expense: Expenses): void {
    this.confirmation.confirm({
      message: `"Do you want to delete ${expense.title}"؟`,
      header: 'To be sure',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.expensesService.remove(expense.id);
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'The selected items have been deleted' });
      }
    });
  }

  getCategoryName(categoryId: number | string): string {
    if (!this.categories || !categoryId) return 'unknown';
    const category = this.categories.find(cat => cat.id == categoryId);
    return category ? category.name : 'unknown';
  }
}


function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}
function endOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}





