import { Component } from '@angular/core';

import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styles: [],
  providers: [AppService]
})

export class AppComponent {
}

