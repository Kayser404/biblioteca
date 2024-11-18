import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // URL con el parámetro 'lang=es' para obtener chistes en español
  private apiUrl = 'https://v2.jokeapi.dev/joke/Any?lang=es&type=single'; 

  constructor(private http: HttpClient) {}

  getRandomJoke(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
