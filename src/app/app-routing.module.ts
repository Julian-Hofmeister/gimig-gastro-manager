import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryPageComponent } from './category-page/category-page.component';
import { ElementsComponent } from './elements/elements.component';
import { ItemPageComponent } from './item-page/item-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginPageComponent } from './login-page/login-page.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'home', component: LandingPageComponent },
  {
    path: 'category',
    component: CategoryPageComponent,
  },
  { path: 'category/:name/items', component: ItemPageComponent },
  { path: 'category/:name/category', component: CategoryPageComponent },
  { path: 'items', component: ItemPageComponent },
  { path: 'elements', component: ElementsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
