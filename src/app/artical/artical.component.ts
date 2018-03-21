import { AppService } from './../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-artical',
  templateUrl: './artical.component.html',
  styleUrls: ['./artical.component.css']
})
export class ArticalComponent implements OnInit {
  docId: string;
  indexName: string;
  detailInfo: any = {};

  relatedProductList: any = [];
  relatedContentList: any = [];

  constructor(private activeRoute: ActivatedRoute,
    private service: AppService,
    private router: Router) {
    this.activeRoute.queryParams
      .subscribe(params => {

        this.docId = params.docId;
        this.indexName = params.index;
      });
  }

  ngOnInit() {
    this.loadContent();

  }

  loadContent(){
    this.service.productDetail(this.indexName, this.indexName, this.docId)
    .subscribe(data => {
      console.log(data);
      this.detailInfo = {};
      data.document.result.fields.forEach(element => {
        this.detailInfo[element.name] = element.value;
      });
      console.log(data);
      console.log(this.detailInfo);
    })

  this.service.relatedProduct(this.indexName, this.indexName, this.docId)
    .subscribe(data => {
      let results = data.algorithm_results.results;
      this.relatedProductList = results.map(item => {
        return {
          docId: item.document_id,
          title: item._source.title,
          thumbnail: item._source.thumbnail,
          description: item._source.description
        };
      });
    })

  this.service.relatedContent(this.indexName, this.indexName, this.docId)
    .subscribe(data => {
      let results = data.algorithm_results.results;
      this.relatedContentList = results.map(item => {
        return {
          docId: item.document_id,
          title: item._source.title,
          description: item._source.description
        };
      });
    })
  }

  searchQuery(event) {
    if (event)
      this.router.navigate(['/search'],
        { queryParams: { q: event } });
  }
  showProduct($event, product) {
    $event.preventDefault();
    this.router.navigate(['/product'],
      { queryParams: { q: product.title, docId: product.docId, index: 'products' } })

  }

  showContent($event,content){
    $event.preventDefault();
    this.docId=content.docId;
    this.loadContent();
  }
}
