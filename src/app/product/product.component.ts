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
  videosList:any=[];
  newsList:any=[];
  slideShowsList:any=[];
  reviewsList:any=[];
  searchString:string;


  constructor(private activeRoute: ActivatedRoute,
    private service: AppService,
    private router: Router) {
    this.activeRoute.queryParams
      .subscribe(params => {
        console.log(params)
        this.docId = params.docId;
        this.indexName = params.index;
        this.searchString=params.q;
      });
  }

  ngOnInit() {
    this.loadPageContent();
  }

  loadPageContent(){
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
            price:item._source.price,
            title:item._source.title,
            thumbnail:item._source.thumbnail,
            description:item._source.description
          };
        });
        console.log("silimar product",this.similarProducts)
    })

    this.service.search(this.searchString, ['videos'], {}, 1,4)
    .subscribe(data => {
      let results=data.search_results.results;
      this.videosList = results.map(item=>{
        return {
            docId:item.document_id,
            title:item._source.title,
            description:item._source.description,
            thumbnail:item._source.thumbnail
        }
      })
      
    })

    this.service.search(this.searchString, ['news'], {}, 1,4)
    .subscribe(data => {
      let results=data.search_results.results;
      this.newsList = results.map(item=>{
        return {
            docId:item.document_id,
            title:item._source.title,
            description:item._source.description,
            thumbnail:item._source.thumbnail
        }
      })
      
    })
    this.service.search(this.searchString, ['slideshows'], {}, 1,4)
    .subscribe(data => {
      let results=data.search_results.results;
      this.slideShowsList = results.map(item=>{
        return {
            docId:item.document_id,
            title:item._source.title,
            description:item._source.description,
            thumbnail:item._source.thumbnail
        }
      })
      
    })
    this.service.search(this.searchString, ['reviews'], {}, 1,4)
    .subscribe(data => {
      let results=data.search_results.results;
      this.reviewsList = results.map(item=>{
        return {
            docId:item.document_id,
            title:item._source.title,
            description:item._source.description,
            thumbnail:item._source.thumbnail
        }
      })
    })

  }

  searchOther(event,indexName:string,docId:string){
    event.preventDefault();
    if(indexName=='products'){
      
    }else{
      this.router.navigate(['/artical'],
      { queryParams: { docId: docId, index: indexName} })
    }
    
  }

  searchQuery(event) {
    if (event)
      this.router.navigate(['/search'],
        { queryParams: { q: event } });
  }

  show($event,product){
    $event.preventDefault();
    this.searchQuery=product.title;
    this.docId=product.docId;
    this.loadPageContent();
  }
}
