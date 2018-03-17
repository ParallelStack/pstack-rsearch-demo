import { element } from 'protractor';
import { AppService } from './../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  docId: string;
  indexName: string;
  detailInfo: any = {};
  similarProducts:any=[];

  constructor(private activeRoute: ActivatedRoute,
    private service: AppService,
    private router: Router) {
    this.activeRoute.queryParams
      .subscribe(params => {
        console.log(params)
        this.docId = params.docId;
        this.indexName = params.index;
      });
  }

  ngOnInit() {
    this.service.productDetail(this.indexName, this.indexName, this.docId)
      .subscribe(data => {
        this.detailInfo = {};
        data.document.result.fields.forEach(element => {
          this.detailInfo[element.name] = element.value;
        });
      });
      
      this.service.relatedProduct(this.indexName,this.indexName,this.docId)
      .subscribe(data=>{
          let results=data.algorithm_results.results;
          this.similarProducts=results.map(item=>{
            return  {
              docId:item.document_id,
              title:item._source.title,
              thumbnail:item._source.thumbnail,
              description:item._source.description
            };
          });
      })

  }

  searchQuery(event) {
    if (event)
      this.router.navigate(['/search'],
        { queryParams: { q: event } });
  }

}
