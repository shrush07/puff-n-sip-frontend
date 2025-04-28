import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { UserService } from '../../services/user.service';
import { User } from '../../shared/models/User';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    standalone: false
})
export class HeaderComponent implements OnInit{
  
  cartQuantity = 0;
  user!: User;

  constructor(cartService: CartService, private userService: UserService){
    cartService.getCartObservable().subscribe((newCart) => {
      this.cartQuantity = newCart.totalCount;
    })

  userService.userObservable.subscribe((newUser) => {
    this.user = newUser;
  })
  }

  ngOnInit(){
    
  }

  logout(){
    this.userService.logout();
  }

  get isAuth(){
    return this.user.token;
  }
}
