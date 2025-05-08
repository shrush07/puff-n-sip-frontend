import { Component, OnInit } from '@angular/core';
import { Tag } from '../../../shared/models/Tag';
import { FoodService } from '../../../services/food.service';

@Component({
    selector: 'app-tags',
    templateUrl: './tags.component.html',
    styleUrls: ['./tags.component.css'],
    standalone: false
})
export class TagsComponent implements OnInit {
  tags?: Tag[];
  constructor(foodService: FoodService) {
    foodService.getAllTags().subscribe(serverTags => {
      console.log("Received tags:", serverTags);
      this.tags= serverTags;
    });
  }

  ngOnInit(): void {}
}
