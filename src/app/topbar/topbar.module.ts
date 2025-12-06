import { NgModule } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { TopbarComponent } from "./topbar.component";

@NgModule({
  declarations: [TopbarComponent],
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  exports: [
    TopbarComponent
  ]
})
export class TopbarModule {
}
