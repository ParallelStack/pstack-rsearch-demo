import { RouterModule, Routes } from '@angular/router';
import { AppService } from './app.service';
import { Config } from './config';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchComponent } from './search/search.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { ProductComponent } from './product/product.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { AffiliateComponent } from './affiliate/affiliate.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: SearchComponent },
  { path: 'search', component: SearchResultComponent },
  { path: 'product', component: ProductComponent }
]

@NgModule({
  declarations: [
    AppComponent,

    SearchComponent,
    SearchResultComponent,
    ProductComponent,
    SearchBarComponent,
    AffiliateComponent
],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    JsonpModule,
    HttpClientModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  providers: [{
    provide: Config, useClass: Config,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
