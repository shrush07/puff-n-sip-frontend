import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'input-container',
    templateUrl: './input-container.component.html',
    styleUrls: ['./input-container.component.css'],
    standalone: false
})
export class InputContainerComponent implements OnInit {

  @Input()
  label!:string;
  @Input()
  bgColor = 'white';

  constructor() { }

  ngOnInit(): void {
  }

}