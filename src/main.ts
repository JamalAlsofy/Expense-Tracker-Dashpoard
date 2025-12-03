import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Routes, provideRouter } from '@angular/router';
import { ExpenseListComponent } from './app/expense-list/expense-list.component';

const routes: Routes = [];

bootstrapApplication(ExpenseListComponent, {
providers: [provideAnimationsAsync(), provideRouter(routes),provideRouter(routes), provideClientHydration()],
}).catch((err) => console.error(err));