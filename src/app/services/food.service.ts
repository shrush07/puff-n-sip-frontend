import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  FOODS_BY_SEARCH_URL,
  FOODS_BY_TAG_URL,
  FOODS_TAGS_URL,
  FOODS_URL,
  FOODS_BY_ID_URL,
  UPDATE_FAVORITE_URL
} from '../shared/constants/urls';
import { Food } from '../shared/models/Food';
import { Tag } from '../shared/models/Tag';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http: HttpClient) {}

  // ✅ Fixed: getFoods now properly implemented
  getFoods(): Observable<Food[]> {
    return this.http.get<Food[]>(`${FOODS_URL}`);
  }

  getAll(): Observable<Food[]> {
    return this.http.get<Food[]>(FOODS_URL);
  }

  getAllFoodsBySearchTerm(searchTerm: string): Observable<Food[]> {
    return this.http.get<Food[]>(FOODS_BY_SEARCH_URL + searchTerm);
  }

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(FOODS_TAGS_URL);
  }

  getAllFoodsByTag(tag: string): Observable<Food[]> {
    return tag === "All"
      ? this.getAll()
      : this.http.get<Food[]>(FOODS_BY_TAG_URL + tag);
  }

  getFoodById(foodId: string): Observable<Food> {
    return this.http.get<Food>(`${FOODS_URL}/${foodId}`);
  }

  updateFavoriteStatus(_id: string, _updatedFavoriteStatus: boolean, food: Food): Observable<void> {
    return this.http.patch<void>(`${UPDATE_FAVORITE_URL}/${food._id}`, {
      favorite: food.favorite,
    });
  }
}
