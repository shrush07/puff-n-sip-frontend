import { Component, OnInit, Input } from '@angular/core';
import { Order } from '../../../shared/models/Order';

@Component({
    selector: 'order-items-list',
    templateUrl: './order-items-list.component.html',
    styleUrl: './order-items-list.component.css',
    standalone: false
})
export class OrderItemsListComponent implements OnInit {

  @Input()
  order!: Order;
  constructor(){}

  ngOnInit(): void {
    
  }

  getImageUrl(imageFileName: string): string {
      if (!imageFileName) {
        return '';
      }

      if (/^https?:\/\//i.test(imageFileName)) {
        try {
          const imageUrl = new URL(imageFileName);

          if (
            imageUrl.hostname === 'localhost' ||
            imageUrl.hostname === '127.0.0.1'
          ) {
            const fileName = imageUrl.pathname.split('/').pop();
            return fileName ? `/images/${fileName}` : '';
          }

          return imageFileName;
        } catch {
          return imageFileName;
        }
      }

      const fileName = imageFileName.replace(/^\/?images\//, '');
      return fileName ? `/images/${fileName}` : '';
    }

}
