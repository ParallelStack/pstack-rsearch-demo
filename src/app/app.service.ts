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

    let url = `${this.config.basePath}/indexes/${this.config.indexName}/document_types/${this.config.documentType}/suggest?q=${term}&auth_token=${this.config.authToken}`;

    return this.httpClient
      .get(url, {
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

  search(searchText: string, pageNumber: number) {
    let url = `${this.config.basePath}/indexes/${this.config.indexName}/document_types/${this.config.documentType}/search?auth_token=${this.config.authToken}`;
    return this.httpClient
      .post(url, {
        "search": {
          "query": searchText,
          "page_count": 20,
          "page_num": pageNumber,
        }
      }, {
        observe: 'body',
        headers: new HttpHeaders()
          .set('X-RSearch-App-ID', this.config.appId)
      })
  }


}
