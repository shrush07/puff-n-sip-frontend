
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

  private faviconIndex = 0;
  private icons = [
    'assets/icons/favicon.ico',
    'assets/icons/favicon1.png',
    'assets/icons/favicon2.png',
    'assets/icons/favicon3.png',
    'assets/icons/favicon4.png',
    'assets/icons/favicon5.png',
  ];

  ngOnInit() {
    this.changeFaviconRepeatedly();
  }

  changeFaviconRepeatedly() {
    setInterval(() => {
      this.faviconIndex = (this.faviconIndex + 1) % this.icons.length;
      this.setFavicon(this.icons[this.faviconIndex]);
    }, 2000); // change every 2 seconds
  }

  setFavicon(iconUrl: string) {
    const link: HTMLLinkElement =
      document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = iconUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}
