import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountPageComponent } from './account-page/account-page.component';
import { CategoryPageComponent } from './category-page/category-page.component';
import { ElementsComponent } from './elements/elements.component';
import { ItemPageComponent } from './item-page/item-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AuthGuard } from './login-page/auth.guard';
import { LoginPageComponent } from './login-page/login-page.component';
import { OrderPageComponent } from './order-page/order-page.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'home', component: LandingPageComponent, canActivate: [AuthGuard] },

  {
    path: 'category',
    component: CategoryPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'category/:id/:hasFood',
    component: CategoryPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'category/:id',
    component: CategoryPageComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'items/:id/:hasFood/:name',
    component: ItemPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders',
    component: OrderPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'account',
    component: AccountPageComponent,
    canActivate: [AuthGuard],
  },
  { path: 'elements', component: ElementsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
