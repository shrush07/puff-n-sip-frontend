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
    const backendUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:5000' 
      : 'https://puff-sip.onrender.com';
  
    // Remove 'assets/images/' or 'assets/' if present at the start of the path
    const cleanedFileName = imageFileName.replace(/^assets\/images\//, '').replace(/^assets\//, '');
  
    // Return the URL without the 'assets/images/' prefix
    return `${backendUrl}/images/${cleanedFileName}`;
  }

}
