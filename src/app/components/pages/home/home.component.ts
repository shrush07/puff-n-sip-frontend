import { Component, OnInit } from '@angular/core';
import { Food } from '../../../shared/models/Food';
import { FoodService } from '../../../services/food.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from '../../../services/cart.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    standalone: false
})
export class HomeComponent implements OnInit{
  foods:Food[] = [];
  router: any;

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

  constructor(private foodService:FoodService, activatedRoute:ActivatedRoute, private cartService: CartService) {
    let foodsObservable: Observable<Food[]>;
    activatedRoute.params.subscribe((params) => {
      if(params.searchTerm)
        foodsObservable = this.foodService.getAllFoodsBySearchTerm(params.searchTerm);
      else if(params.tag)
        foodsObservable = this.foodService.getAllFoodsByTag(params.tag);
      else
      foodsObservable = foodService.getAll();

      foodsObservable.subscribe((serverFoods) => {
        this.foods = serverFoods;
        this.foods = this.foods.slice(0, 4); // Only keep the first 4 items
    })
  })
  }

  logFood(food: any) {
    console.log('Clicked food:', food);
  }
  

  toggleFavorite(food: Food): void {
    console.log('heart clicked');
    if (!food) {
      console.error('Food object is required to toggle favorite.');
      return;
    }
    const updatedFavoriteStatus = !food.favorite;

    this.foodService.updateFavoriteStatus(food._id, updatedFavoriteStatus, food).subscribe({
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
  
  handleSubmit = async(e:any) =>{
    // e.preventDefault();

    try {
      const response = await fetch("http://puff-n-sip.netlify.app/api/form/contact", {
        method:"POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: e.target.name.value,
          email: e.target.email.value,
          ratings: e.target.ratings.value,
          contact: e.target.contact.value,
          message: e.target.message.value
        })
      });

      if(response.ok){
        const data = await response.json();
        console.log(data);
        alert("Message sent successfully");
        e.target.reset();
      }

    } catch (error) {
      console.log(error);
    }
  }


  ngOnInit(): void {
 
  }
}
