import { Component ,signal} from '@angular/core';
import { RouterModule } from '@angular/router';




@Component({
selector: 'app-topbar',
  standalone: true,
imports:[RouterModule],
templateUrl: './topbar.component.html',
styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
isDark = signal(false);
currentLang = signal('en');


toggleTheme() {
this.isDark.set(!this.isDark());
document.body.classList.toggle('dark-theme', this.isDark());
}


changeLang() {
this.currentLang.set(this.currentLang() === 'en' ? 'ar' : 'en');
document.documentElement.lang = this.currentLang();
}
}