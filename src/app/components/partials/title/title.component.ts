import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-title',
    templateUrl: './title.component.html',
    styleUrl: './title.component.css',
    standalone: false
})
export class TitleComponent implements OnInit{
  @Input()
  title!: string;

  @Input()
  margin? = '1rem 0 1rem 0.2rem';

  @Input()
  fontSize? = '1.72rem';

  constructor(){

  }

  ngOnInit(): void{
    
  }
}
