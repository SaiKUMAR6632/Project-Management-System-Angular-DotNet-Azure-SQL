import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, tap } from 'rxjs';

export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'https://localhost:7047/api/auth';
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'auth_user';

  private userSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.api}/login`, { email, password })
      .pipe(
        tap(res => {
          this.saveToken(res.token);

          const user: User = {
            userId: res.userId,
            email: res.email,
            firstName: res.firstName,
            lastName: res.lastName
          };

          this.saveUser(user);
        })
      );
  }

  saveToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  saveUser(user: User) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.userSubject.next(user);
  }

  getStoredUser(): User | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) as User : null;
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.userSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }
}
