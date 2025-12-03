import { ExpenseListComponent } from './app/expense-list/expense-list.component';
import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Routes, provideRouter } from '@angular/router';


const routes: Routes = [];

bootstrapApplication(ExpenseListComponent, {
providers: [provideAnimationsAsync(), provideRouter(routes),provideRouter(routes), provideClientHydration()],
}).catch((err) => console.error(err));