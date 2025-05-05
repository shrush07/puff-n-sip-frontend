import { Component } from '@angular/core';
import { FoodService } from '../../../services/food.service';
import { Food } from '../../../shared/models/Food';

@Component({
    selector: 'app-favorites',
    templateUrl: './favorites.component.html',
    styleUrl: './favorites.component.css',
    standalone: false
})
export class FavoritesComponent {
foods: Food[] = [];
  constructor(private foodService:FoodService){}
  toggleFavorite(food: Food): void {
    console.log('heart clicked');
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
