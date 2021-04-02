import { Component } from '@angular/core';
import { AuthService } from './login-page/auth.service';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'gimig-test-project';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.autoSignIn();
  }
}
