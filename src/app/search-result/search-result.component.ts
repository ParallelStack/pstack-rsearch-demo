import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  searchQuery: string = "";
  totalCount: number = 0;
  result: any;
  page: number;

  constructor(private route: ActivatedRoute, private service: AppService) { }

  ngOnInit() {
    this.page = 1;
    this.route.queryParams
      .filter(params => params.q)
      .subscribe(params => {
        this.searchQuery = params.q;
        this.searchResult();
      });
  }

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .switchMap(term =>
        this.service.getSuggestion(term)
          .catch(() => {
            return Observable.of([]);
          })
      )

  searchResult() {
    this.service.search(this.searchQuery, this.page)
      .subscribe(data => {
        this.result = data["search_results"].results;
        this.totalCount = data["search_results"].metadata.number_search_results;
        this.searchQuery = data["search_results"].metadata.query;
      }, error => {
        this.result = [];
        this.totalCount = 0;
      })
  }

}
