import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodService } from '../../../services/food.service';
import { CartService } from '../../../services/cart.service';
import { Food } from '../../../shared/models/Food';

@Component({
    selector: 'app-food-page',
    templateUrl: './food-page.component.html',
    styleUrls: ['./food-page.component.css'],
    standalone: false
})
export class FoodPageComponent implements OnInit {
  food!: Food;
  constructor(private activatedRoute:ActivatedRoute, private foodService:FoodService,
    private cartService:CartService, private router: Router) {
    // activatedRoute.params.subscribe((params) => {
    //   if(params.id)
    //   foodService.getFoodById(params.id).subscribe(serverFood => {
    //     this.food = serverFood;
    //   });
    // })

    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.foodService.getFoodById(params['id']).subscribe(
          (serverFood) => {
            this.food = serverFood;
          },
          (error) => {
            console.error('Error fetching food:', error);
          }
        );
      }
    });
   }

  ngOnInit(): void {
  }

  addToCart(){
    console.log("foodid",this.food);
    this.cartService.addToCart(this.food);
    this.router.navigateByUrl('/cart-page');
  }
}