import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  createuser(email: string, password: string) {}

  login() {}
}
