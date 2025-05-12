
import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {isPlatformBrowser} from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    standalone: false
})
export class AppComponent {
  title = 'frontend';
  static isBrowser = new BehaviorSubject<boolean>(true);

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    AppComponent.isBrowser.next(isPlatformBrowser(platformId));
  }

  
}
