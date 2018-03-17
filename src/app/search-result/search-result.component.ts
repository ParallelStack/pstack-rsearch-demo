import { SearchFiter } from './../search-filter';
import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  activeIndex: string = "products"

  indexList: any = [
    { title: 'Products', index: 'products' },
    { title: 'News', index: 'news' },
    { title: 'Reviews', index: 'reviews' },
    { title: 'Feature Stories', index: 'feature_stories' },
    { title: 'Popular News', index: 'popular_news' },
    { title: 'Slideshows', index: 'slideshows' },
    { title: 'Videos', index: 'videos' },
    { title: 'How Tos', index: 'how_tos' },
  ]

  defaultIndexs = ["products"];

  searchFilters: SearchFiter[] = [];

  constructor(private route: ActivatedRoute,
    private service: AppService,
    private router: Router) { }

  ngOnInit() {
    this.page = 1;
    this.route.queryParams
      .filter(params => params.q)
      .subscribe(params => {
        this.searchQuery = params.q;
        this.onSearchQuery(this.searchQuery);
      });
  }

  onSearchQuery(event) {
    if (event) {
      this.searchRequest(event, this.defaultIndexs, {}, true);
    }
  }



  //Query for search result
  searchResult(indexes: string[], filter: any, reload: boolean) {
    this.searchRequest(this.searchQuery, indexes, filter, reload);
  }
  searchRequest(searchQuery: string, indexes: string[], filter: any, reload: boolean) {
    this.service.search(searchQuery, indexes, filter, this.page)
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
  filterResult(indexName: string, fieldName: string, isChecked: boolean) {
    if (isChecked) {
      //add item filter
      this.searchFilters.push({ indexName: indexName, fieldName: fieldName });
    } else {
      //remove item from filter
      this.searchFilters = this.searchFilters.filter((data: SearchFiter) => {
        return !(data.fieldName == fieldName && data.indexName == indexName)
      });
    }
    this.loadData();
  }

  loadData() {
    if (this.searchFilters.length > 0) {
      let filterCatetories = this.searchFilters
        .map((data: SearchFiter) => {
          return data.fieldName;
        })
        .filter(data => data !== "all");

      let indexes = this.searchFilters.map((data: SearchFiter) => {
        return data.indexName;
      })
      if (filterCatetories.length > 0) {
        this.searchResult(Array.from(new Set(indexes)),
          { category: Array.from(new Set(filterCatetories)) }, false)
      } else {
        this.searchResult(Array.from(new Set(indexes)), {}, false)
      }

    } else {
      this.searchResult(this.defaultIndexs, {}, false);
    }
  }

  filterByIndex(indexName: string) {
    this.activeIndex = indexName;
    this.searchResult([indexName], {}, true);
  }

  showDetail(detail: any, event) {
    event.preventDefault();
    if(this.activeIndex=='products'){
      this.router.navigate(['/product'],
      { queryParams: { docId: detail.document_id, index: this.activeIndex } })
    }else{
      this.router.navigate(['/artical'],
      { queryParams: { docId: detail.document_id, index: this.activeIndex } })
    }
  }

}
