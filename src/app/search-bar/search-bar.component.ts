import { AppService } from './../app.service';
import { Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  @Input() searchQuery: string;
  @Output() onSearchQuery: EventEmitter<any> = new EventEmitter();

  constructor(private service: AppService) { }

  ngOnInit() {
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

  onSearch() {
   this.onSearchQuery.emit(this.searchQuery);
  }

  selectItem($event){
    this.onSearchQuery.emit($event.item);
  }
}
