import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface UserRegistrationRequest {
  username: string;
  images: string[];
}

interface UserRegistrationResponse {
  // define aquí la estructura que devuelve tu backend, por ejemplo:
  success: boolean;
  message: string;
  userId?: string;
}

interface AuthenticationRequest {
  image: string;
}

interface AuthenticationResponse {
  success: boolean;
  message: string;
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FingerprintService {

  private apiUrl = 'http://localhost:8000';  // Cambia esta URL por la de tu backend

  constructor(private http: HttpClient) { }

  registerUser(data: UserRegistrationRequest): Observable<UserRegistrationResponse> {
    return this.http.post<UserRegistrationResponse>(`${this.apiUrl}/register`, data);
  }

    authenticateUser(data: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.apiUrl}/authenticate`, data);
  }
}
