import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavBarComponent } from './elements/nav-bar/nav-bar.component';
import { HeadingComponent } from './landing-page/heading/heading.component';
import { BtnRowComponent } from './landing-page/btn-row/btn-row.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ElementsComponent } from './elements/elements.component';
import { LoginFieldComponent } from './login-page/login-field/login-field.component';
import { CategoryPageComponent } from './category-page/category-page.component';
import { TitleElementComponent } from './category-page/title-element/title-element.component';
import { AppRoutingModule } from './app-routing.module';
import { CreateCategoryCardComponent } from './category-page/create-category-card/create-category-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryItemComponent } from './category-page/category-item/category-item.component';
import { ItemPageComponent } from './item-page/item-page.component';
import { CaptionElementComponent } from './caption-element/caption-element.component';
import { CreateItemCardComponent } from './item-page/create-item-card/create-item-card.component';
import { ItemItemComponent } from './item-page/item-item/item-item.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HeadingComponent,
    BtnRowComponent,
    LandingPageComponent,
    LoginPageComponent,
    ElementsComponent,
    LoginFieldComponent,
    CategoryPageComponent,
    TitleElementComponent,
    CreateCategoryCardComponent,
    CategoryItemComponent,
    ItemPageComponent,
    CaptionElementComponent,
    CreateItemCardComponent,
    ItemItemComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'angularfs'),
    AngularFirestoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
