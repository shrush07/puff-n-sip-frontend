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
    const backendUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:5000' 
      : 'https://puff-sip.onrender.com';

    const cleanedFileName = imageFileName.replace(/^assets\/images\//, '').replace(/^assets\//, '');
    return `${backendUrl}/images/${cleanedFileName}`;
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

