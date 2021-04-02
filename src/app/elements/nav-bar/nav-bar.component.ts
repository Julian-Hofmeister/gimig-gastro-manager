import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/login-page/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  @Input() pageTitle: String = 'My Gimig';
  @Input() mainAction: String = 'Home';

  user: string;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user: {
      email: string;
    } = JSON.parse(localStorage.getItem('user'));
    this.user = user.email;
  }

  logout() {
    this.authService.logout();
  }
}
