import { SearchFiter } from './../search-filter';
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
  defaultIndexs=["news",
    "feature_stories",
    "popular_news",
    "reviews",
    "slideshows",
    "videos",
    "how_tos",
    "top_ten",
    "products"];

  searchFilters:SearchFiter[]=[];

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
    this.searchResult(this.defaultIndexs,{}, true);
  }

  //Query for search result
  searchResult(indexes:string[],filter: any, reload: boolean) {
    console.log("indexes",indexes)
    console.log("filter",filter)
    this.service.search(this.searchQuery, indexes, filter, this.page)
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
  filterResult(indexName:string, fieldName:string, isChecked:boolean) {
    console.log(this.filters);
    if (isChecked) {
      //add item filter
      this.searchFilters.push({indexName:indexName,fieldName:fieldName});
    } else {
      //remove item from filter
      this.searchFilters= this.searchFilters.filter((data:SearchFiter)=>{
        return !(data.fieldName==fieldName && data.indexName==indexName)
      });
    }
    this.loadData();
  }

  loadData(){
    if(this.searchFilters.length>0){
      let filterCatetories=this.searchFilters
        .map((data:SearchFiter)=>{
          return  data.fieldName;
      })
      .filter(data=>data!=="all");

      let indexes=this.searchFilters.map((data:SearchFiter)=>{
        return data.indexName;
      })
      console.log("loaddata");
      if(filterCatetories.length>0){
        this.searchResult(Array.from(new Set(indexes)),
        {category:Array.from(new Set(filterCatetories))},false)
      }else{
        this.searchResult(Array.from(new Set(indexes)),{},false)
      }
      
    }else{
      this.searchResult(this.defaultIndexs,{}, false);
    }
  }

}
