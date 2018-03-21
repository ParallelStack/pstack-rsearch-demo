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
          "indexes": ["products"],
          "query": term,
          "fields": ["title"],
          "fuzzy": 0,
          "size": 20
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

  search(searchText: string, indexs: string[], filter: any, pageNumber: number, pageCount:number) {
    let url = `${this.config.basePath}/indexes/search?auth_token=${this.config.authToken}`;
    return this.httpClient
      .post<any>(url, {
        "search": {
          "indexes": indexs,
          "query": searchText,
          "page_count": pageCount,
          "page_num": pageNumber,
          "search_fields": ["title^5", "description"],
          "result_fields": ["title", "link", "description", "category", "thumbnail", "price", "index"],
          "nested_aggregations": 1,
		  "fuzzy": 1,
          "filters": {
            "index_filter": filter
          },
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

  productDetail(indexName, docType, docId) {
    let url = `${this.config.basePath}/indexes/${indexName}/document_types/${docType}/documents/${docId}?auth_token=${this.config.authToken}`;
    return this.httpClient.get<any>(url, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('X-RSearch-App-ID', this.config.appId)
    });
  }

  relatedProduct(indexName,docType,docId){
    let url = `${this.config.basePath}/indexes/algorithms/similardocs?auth_token=${this.config.authToken}`;
    return this.httpClient.post<any>(url,{
      "algorithm": {
        "similar": {
          "indexes": ['products'],
          "similar_fields": ["title", "description"],
          "page_count": 4,
          "page_num": 1,
          "origin": [
            {
              "index": indexName,
              "document_type": docType,
              "document_id": docId
            }
          ]
        }
      }
    },
    {
      observe: 'body',
      headers: new HttpHeaders()
        .set('X-RSearch-App-ID', this.config.appId)
    })
  }
  

  relatedContent(indexName,docType,docId){
    let url = `${this.config.basePath}/indexes/algorithms/similardocs?auth_token=${this.config.authToken}`;
    return this.httpClient.post<any>(url,{
      "algorithm": {
        "similar": {
          "indexes": ['news'],
          "similar_fields": ["title", "description"],
          "page_count": 4,
          "page_num": 1,
          "origin": [
            {
              "index": indexName,
              "document_type": docType,
              "document_id": docId
            }
          ]
        }
      }
    },
    {
      observe: 'body',
      headers: new HttpHeaders()
        .set('X-RSearch-App-ID', this.config.appId)
    })
  }

}
