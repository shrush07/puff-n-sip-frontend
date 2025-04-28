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

}
