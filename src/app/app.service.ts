import { element } from 'protractor';
import { Config } from './config';
import { Component, Injectable } from '@angular/core';
import { Jsonp, URLSearchParams } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class AppService {

  constructor(private httpClient: HttpClient, private config: Config) { }

  getSuggestion(term: string) {
    if (term === '' || term.length < 3) {
      return Observable.of([]);
    }

    let url = `${this.config.basePath}/indexes/suggest?auth_token=${this.config.authToken}`;

    return this.httpClient
      .post(url, {
        "suggest": {
		  "indexes": ["news", "feature_stories", "popular_news", "reviews","slideshows","videos","how_tos","top_ten","products"],
          "query": term,
          "fields": ["title"],
          "fuzzy": 1,
          "size": 10
        }
      }, {
        observe: 'body',
        headers: new HttpHeaders()
          .set('X-RSearch-App-ID', this.config.appId)
      })
      .map(data => {
        let results = data["suggest_results"].results;
        let suggestions = [];
        results.forEach(element => {
          suggestions.push(element.text)
        });
        return <string[]>suggestions;
      })
  }

  search(searchText: string, indexs:string[],filter:any, pageNumber: number) {
    let url = `${this.config.basePath}/indexes/search?auth_token=${this.config.authToken}`;
    return this.httpClient
      .post<any>(url, {
        "search": {
          "indexes": indexs,
          "query": searchText,
          "page_count": 20,
          "page_num": pageNumber,
          "search_fields": ["title^5", "description"],
          "result_fields": ["title", "link", "description", "category", "thumbnail"],
          "nested_aggregations": 1,
          "filters": filter,
          "aggregations": [
            {
              "field_name": "category",
              "agg_type": "term",
              "term_agg_size": 20
            }
          ]


        }
      }, {
        observe: 'body',
        headers: new HttpHeaders()
          .set('X-RSearch-App-ID', this.config.appId)
      })
  }


}
