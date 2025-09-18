import { Component, OnInit } from '@angular/core';
import { Food } from '../../../shared/models/Food';
import { FoodService } from '../../../services/food.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from '../../../services/cart.service';

@Component({
    selector: 'menu',
    templateUrl: './menu-page.component.html',
    styleUrls: ['./menu-page.component.css'],
    standalone: false
})
export class MenuPageComponent implements OnInit{
  foods:Food[] = [];
  router: any;
  constructor(private foodService:FoodService, private activatedRoute:ActivatedRoute, private cartService: CartService) {  }

  ngOnInit(): void { 
    console.log('Component instance:', this);
    let foodsObservable: Observable<Food[]>;
      this.activatedRoute.params.subscribe((params) => {
        if(params.searchTerm)
          foodsObservable = this.foodService.getAllFoodsBySearchTerm(params.searchTerm);
        else if(params.tag)
          foodsObservable = this.foodService.getAllFoodsByTag(params.tag);
        else
        foodsObservable = this.foodService.getAll();
  
        foodsObservable.subscribe({
          next: (serverFoods) => {
            this.foods = serverFoods;
          },
          error: (err) => {
            console.error('Error fetching foods:', err);
          },
      })
    })

  }

  addToCart(food: Food): void {
    if (!food) {
      console.error('Food ID is required to add an item to the cart.');
      return;
    }
  
    this.cartService.addToCart(food).subscribe({
      next: () => {
        console.log('${food.name} added to cart successfully.');
      },
      error: (error) => {
        console.error('Error adding item to cart:', error);
      },
    });
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


  toggleFavorite(food: Food): void {
    if (!food) {
      console.error('Food object is required to toggle favorite.');
      return;
    }
  
    const updatedFavoriteStatus = !food.favorite;
  
    this.foodService.updateFavoriteStatus(food._id, updatedFavoriteStatus).subscribe({
      next: () => {
        console.log(`${food.name} favorite status updated.`);
        food.favorite = updatedFavoriteStatus;
      },
      error: (error) => {
        console.error('Error updating favorite status:', error);
        alert('Failed to update favorite status.');
      },
    });
  }
  
}
