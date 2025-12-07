import { loadExpensesSuccess } from './../expense-list/expense.actions';

import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { ExpenseService } from '../expense-list/expense-data.service';
import { Expense } from '@domain/models/expense';
import { ImportsModule } from '../imports';
import { TopbarComponent } from '../topbar/topbar.component';
import { Store } from '@ngrx/store';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ImportsModule],
  providers:[ExpenseService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private expenseSrv = inject(ExpenseService);
  private store: Store = inject(Store);
  expenses = signal<Expense[]>([]);
  latestFive = computed(() =>
    [...this.expenses()].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)
  );

  totalExpenses = computed(() =>
    this.expenses().reduce((sum, e) => sum + e.amount, 0)
  );

  currentMonthExpenses = computed(() => {
    const month = new Date().getMonth();
    return this.expenses()
      .filter(e => new Date(e.date).getMonth() === month)
      .reduce((s, e) => s + e.amount, 0);
  });

  totalTransactions = computed(() => this.expenses().length);

  avgExpenses = computed(() =>
    this.totalTransactions() === 0 ? 0 : this.totalExpenses() / this.totalTransactions()
  );

  // charts
  categoryChart: any;
  monthlyChart: any;

  ngOnInit(): void {
    this.expenseSrv.loadMock().subscribe(data => {
      this.store.dispatch(loadExpensesSuccess({ expense: data }));
      this.expenses.set(data);
    });
   
  }

  renderCharts() {
    this.renderCategoryPie();
    this.renderMonthlyBar();
  }

  renderCategoryPie() {
    const map: Record<string, number> = {};
    this.expenses().forEach(e => {
      map[e.categoryId] = (map[e.categoryId] || 0) + e.amount;
    });

    const labels = Object.keys(map);
    const values = Object.values(map);

    if (this.categoryChart) this.categoryChart.destroy();

    this.categoryChart = new Chart('categoryChart', {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data: values
        }]
      }
    });
  }

  renderMonthlyBar() {
    const months = Array(12).fill(0);
    this.expenses().forEach(e => {
      const m = new Date(e.date).getMonth();
      months[m] += e.amount;
    });

    if (this.monthlyChart) this.monthlyChart.destroy();

    this.monthlyChart = new Chart('monthlyChart', {
      type: 'bar',
      data: {
        labels: [
          'Jan','Feb','Mar','Apr','May','Jun',
          'Jul','Aug','Sep','Oct','Nov','Dec'
        ],
        datasets: [{
          label: 'Monthly Spending',
          data: months
        }]
      }
    });
  }
  isDark() {
    /********* */
  }
  changeLang() { }
  toggleTheme() { }
  currentLang(){}
}


