import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-caption-element',
  templateUrl: './caption-element.component.html',
  styleUrls: ['./caption-element.component.css'],
})
export class CaptionElementComponent implements OnInit {
  @Input() parentName: string;

  constructor() {}

  ngOnInit(): void {}
}
