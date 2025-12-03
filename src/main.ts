import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Routes, provideRouter } from '@angular/router';
import { HomeComponent } from './app/home/home.component';

const routes: Routes = [];

bootstrapApplication(HomeComponent, {
providers: [provideAnimationsAsync(), provideRouter(routes),provideRouter(routes), provideClientHydration()],
}).catch((err) => console.error(err));