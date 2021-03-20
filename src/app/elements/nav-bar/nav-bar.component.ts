import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  @Input() pageTitle: String = 'My Gimig';
  @Input() mainAction: String = 'Home';

  constructor() {}

  ngOnInit(): void {}
}
