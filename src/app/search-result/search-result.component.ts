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
  filters: any = [];
  result: any;
  page: number;

  indexes = ["news",
    "feature_stories",
    "popular_news",
    "reviews",
    "slideshows",
    "videos",
    "how_tos",
    "top_ten",
    "products"];

  filterCategory: string[] = [];

  constructor(private route: ActivatedRoute, private service: AppService) { }

  ngOnInit() {
    this.page = 1;
    this.route.queryParams
      .filter(params => params.q)
      .subscribe(params => {
        this.searchQuery = params.q;
        this.onSearch();
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

  //Called when search button is clicked, this will reset all the filters    
  onSearch() {
    this.searchResult({}, true);
  }

  //Query for search result
  searchResult(filter: any, reload: boolean) {
    this.service.search(this.searchQuery, this.indexes, filter, this.page)
      .subscribe(data => {
        this.result = data.search_results.results;
        this.totalCount = data.search_results.metadata.number_search_results;
        this.searchQuery = data.search_results.metadata.query;
        if (reload) {
          this.filters = data.search_results.metadata.aggregated.by_index_agg.buckets;
        }
      }, error => {
        this.result = [];
        this.totalCount = 0;
      })
  }

  //Called when filter checkbox is checked or unchecked
  filterResult(index, field, isChecked) {
    if (isChecked) {
      //add item filter
      this.filterCategory.push(field);
    } else {
      //remove item from filter
      this.filterCategory = this.filterCategory.filter(item => item !== field);
    }
    if (this.filterCategory.length > 0) {
      this.searchResult({ category: this.filterCategory }, false);
    } else {
      this.searchResult({}, false);
    }
  }

}
