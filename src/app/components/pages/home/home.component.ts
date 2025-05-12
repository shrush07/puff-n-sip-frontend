import { Component, OnInit } from '@angular/core';
import { FoodService } from '../../../services/food.service';
import { ActivatedRoute } from '@angular/router';
import { Food } from '../../../shared/models/Food';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent implements OnInit {
  foods: Food[] = [];
  currentStartIndex: number = 0; 
  visibleCount: number = 4;

  aboutCards = [
    {
      number: '01',
      title: 'About Us',
      description: 'Lorem Ipsum is simply dummy text of the printing industry.',
    },
    {
      number: '02',
      title: 'Our Coffee',
      description: 'Lorem Ipsum has been the industry\'s standard text.',
    },
    {
      number: '03',
      title: 'Our Mocktails',
      description: 'Lorem Ipsum is used as placeholder text.',
    },
    {
      number: '04',
      title: 'Our Puffs',
      description: 'Lorem Ipsum is a popular text used in design.',
    },
  ];

  constructor(
    private foodService: FoodService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      let foodsObservable;

      if (params.searchTerm) {
        foodsObservable = this.foodService.getAllFoodsBySearchTerm(params.searchTerm);
      } else if (params.tag) {
        foodsObservable = this.foodService.getAllFoodsByTag(params.tag);
      } else {
        foodsObservable = this.foodService.getAll();
      }

      foodsObservable.subscribe({
        next: (foods) => {
          this.foods = foods.sort((a, b) => {
            return new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime();
          });
        },
        error: (error) => {
          console.error('Failed to fetch foods:', error);
        }
      });
    });
  }

  // Getter for the products that should be visible based on the current index
  get visibleFoods(): Food[] {
    return this.foods.slice(this.currentStartIndex, this.currentStartIndex + this.visibleCount);
  }

  // Slide left: Decrease the start index by 1
  slideLeft(): void {
    if (this.currentStartIndex > 0) {
      this.currentStartIndex--;
    }
  }

  // Slide right: Increase the start index by 1
  slideRight(): void {
    if (this.currentStartIndex + this.visibleCount < this.foods.length) {
      this.currentStartIndex++;
    }
  }

  getImageUrl(imageFileName: string): string {
  // If it's already a full URL, return as-is
  if (imageFileName.startsWith('http://') || imageFileName.startsWith('https://')) {
    return imageFileName;
  }

  const backendUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://puff-sip.onrender.com';

  const cleanedFileName = imageFileName
    .replace(/^assets\/images\//, '')
    .replace(/^assets\//, '');

  return `${backendUrl}/images/${cleanedFileName}`;
}


  toggleFavorite(food: Food): void {
    const updatedFavoriteStatus = !food.favorite;
    this.foodService.updateFavoriteStatus(food._id, updatedFavoriteStatus).subscribe({
      next: () => (food.favorite = updatedFavoriteStatus),
      error: (error) => {
        console.error('Error updating favorite:', error);
        alert('Failed to update favorite status.');
      }
    });
  }

  addToCart(food: Food): void {
    this.cartService.addToCart(food).subscribe({
      next: () => console.log(`${food.name} added to cart.`),
      error: (error) => console.error('Cart error:', error),
    });
  }
}
