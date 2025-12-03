import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AppLayout } from '../layout/app.layout';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterModule,AppLayout],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
