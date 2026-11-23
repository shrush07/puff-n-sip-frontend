import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Food } from '../../../shared/models/Food';
import { FoodService } from '../../../services/food.service';
import { CartService } from '../../../services/cart.service';
@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  imports: [CommonModule, RouterModule],
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit{
  favoriteFoods: Food[] = [];

  constructor(
    private foodService: FoodService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.foodService.getAll().subscribe({
      next: (foods) => {
        this.favoriteFoods = foods.filter(food => food.favorite);
      },
      error: (err) => {
        console.error('Error loading favorite foods:', err);
      },
    });
  }

  addToCart(food: Food): void {
    this.cartService.addToCart(food).subscribe({
      next: () => {
        console.log(`${food.name} added to cart successfully.`);
      },
      error: (error) => {
        console.error('Error adding item to cart:', error);
      },
    });
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

  toggleFavorite(food: Food): void {
    const updatedFavoriteStatus = !food.favorite;

    this.foodService.updateFavoriteStatus(food._id, updatedFavoriteStatus).subscribe({
      next: () => {
        food.favorite = updatedFavoriteStatus;
        this.favoriteFoods = this.favoriteFoods.filter(f => f.favorite); // Re-filter after update
      },
      error: (error) => {
        console.error('Error updating favorite status:', error);
        alert('Failed to update favorite status.');
      },
    });
  }
}

