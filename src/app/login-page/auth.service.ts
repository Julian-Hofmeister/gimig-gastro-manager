import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;
  user = new BehaviorSubject<User>(null);

  constructor(private firebaseAuth: AngularFireAuth, private router: Router) {}

  async signInUser(email: string, password: string) {
    await this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(res.user));
        console.log('IS LOGGED IN: ' + this.isLoggedIn);
        const user = new User(res.user.email);
        this.user.next(user);
        this.router.navigate(['/home']);
        return res.user.email;
      });
  }

  async signUpUser(email: string, password: string) {
    await this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(res.user));
        this.router.navigate(['/home']);
        console.log(res.user);
      });
  }

  autoSignIn() {
    const user: {
      email: string;
    } = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      return null;
    }

    const loadedUser = new User(user.email);
    this.user.next(loadedUser);
    // this.router.navigate(['/home']);
  }

  logout() {
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  public handleError(errorRes: string) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes) {
      return errorMessage;
    }
    switch (errorRes) {
      case 'auth/user-not-found':
        errorMessage = 'Dieses Konto wurde nicht gefunden.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Das eingegebene Passwort ist falsch.';
        break;
      case 'auth/email-already-in-use':
        errorMessage = 'Diese E-mail Adresse existiert bereits.';
        break;
    }
    return errorMessage;
  }
}
