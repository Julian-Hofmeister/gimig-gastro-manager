import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-title-element',
  templateUrl: './title-element.component.html',
  styleUrls: ['./title-element.component.css'],
})
export class TitleElementComponent {
  constructor(private _location: Location) {}

  backClicked() {
    this._location.back();
  }
}
