import { Observable } from 'rxjs/Observable';
import { AppService } from '../app.service';
import { Component,OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router'

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent  {

  model: any;
  searchFailed = false;
  result:any;
  searchQuery:string;
  totalCount:number=0;

  constructor(private service: AppService, private router:Router) {
  }

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .switchMap(term =>
        this.service.getSuggestion(term)
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          })
      )

  submitSearch(){
    this.searchRequest(this.model);
  }

  searchRequest(searchQuery:string){
    if(searchQuery)
    this.router.navigate(['/search'], 
    { queryParams: { q: searchQuery}, queryParamsHandling: 'merge' });
  }
  
  selectItem(event){
    this.searchRequest(event.item);
    console.log("Event",event);
  }
}
