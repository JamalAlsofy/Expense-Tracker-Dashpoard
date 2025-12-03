import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AppLayout } from '../layout/app.layout';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
