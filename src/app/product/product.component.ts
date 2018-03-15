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
  docId:string;
  indexName:string;
  detailInfo:any={};
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
    this.service.productDetail(this.indexName,this.indexName,this.docId)
    .subscribe(data=>{
      this.detailInfo={};
      data.document.result.fields.forEach(element => {
        this.detailInfo[element.name]= element.value;
      });
      console.log(data);
      console.log(this.detailInfo);

    })

  }

}
