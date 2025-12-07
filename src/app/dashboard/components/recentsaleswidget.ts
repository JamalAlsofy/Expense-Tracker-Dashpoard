import { Component } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';


import { Expense } from '@domain/models/expense';
import { ExpenseService } from 'src/app/expense-list/expense-data.service';

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule],
    template: `<div class="card mb-8!">
        <div class="font-semibold text-xl mb-4">Recent Sales</div>
        <p-table [value]="expenses" [paginator]="true" [rows]="5" responsiveLayout="scroll">
            <ng-template #header>
                <tr>
                    <th>Code</th>
                    <th pSortableColumn="title">title <p-sortIcon field="title"></p-sortIcon></th>
                    <th pSortableColumn="amount">Amount <p-sortIcon field="amount"></p-sortIcon></th>
                    <th>View</th>
                </tr>
            </ng-template>
            <ng-template #body let-expense>
                <tr>
                    <td style="width: 15%; min-width: 5rem;">
                      {{ expense.id }}
                    </td>
                    <td style="width: 35%; min-width: 7rem;">{{ product.title }}</td>
                    <td style="width: 35%; min-width: 8rem;">{{ product.Amount | currency: 'USD' }}</td>
                    <td style="width: 15%;">
                        <button pButton pRipple type="button" icon="pi pi-search" class="p-button p-component p-button-text p-button-icon-only"></button>
                    </td>
                </tr>
            </ng-template>
        </p-table>
    </div>`,
    providers: [ExpenseService]
})
export class RecentSalesWidget {
    expenses: Expense[]=[];

    constructor(private expensesService: ExpenseService) {}

    ngOnInit() {
    //       this.expensesService.expense.subscribe(list => {
    //   this.expenses = [...list];
    //   //this.applyFilters();
        //       });
        
              
        
    }
}
