import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FOODS_BY_SEARCH_URL, FOODS_BY_TAG_URL, FOODS_TAGS_URL, FOODS_URL, FOODS_BY_ID_URL, UPDATE_FAVORITE_URL } from '../shared/constants/urls';
import { Food } from '../shared/models/Food';
import { Tag } from '../shared/models/Tag';
import { sample_foods } from '../../data';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  getFoods() {
    throw new Error('Method not implemented.');
  }

  constructor(private http:HttpClient) { }

  getAll(): Observable<Food[]> {
    return this.http.get<Food[]>(FOODS_URL);
  }

  getAllFoodsBySearchTerm(searchTerm: string) {
    return this.http.get<Food[]>(FOODS_BY_SEARCH_URL + searchTerm);
  }

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(FOODS_TAGS_URL);
  }

  getAllFoodsByTag(tag: string): Observable<Food[]> {
    return tag === "All" ?
      this.getAll() :
      this.http.get<Food[]>(FOODS_BY_TAG_URL + tag);
  }

  // getFoodById(foodId:string):Observable<Food>{
  //   return this.http.get<Food>(FOODS_BY_ID_URL + foodId);
  // }

  getFoodById(foodId: string): Observable<Food> {
    return this.http.get<Food>(`${FOODS_URL}/${foodId}`);
  }

  updateFavoriteStatus(_id: string, _updatedFavoriteStatus: boolean, food: Food): Observable<void> {
    return this.http.patch<void>(`${UPDATE_FAVORITE_URL}/${food._id}`, {
      favorite: food.favorite,
    });
  }
}