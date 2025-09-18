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
  const isFullUrl = imageFileName.startsWith('http');
  const backendUrl = isFullUrl 
    ? '' 
    : (window.location.hostname === 'localhost' 
        ? 'http://localhost:5000' 
        : 'https://puff-sip.onrender.com');
  return isFullUrl ? imageFileName : `${backendUrl}/images/${imageFileName}`;
}

}
