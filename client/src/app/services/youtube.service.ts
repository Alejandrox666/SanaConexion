import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VideoAdapter } from '../adapters/video-adapter.token'; 

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  private apiKey = 'AIzaSyBuEsieZr1Pm4k4xAXyqb7mRQa6tS6FVlI';
  private apiUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(private http: HttpClient) {}

  // Implementamos el método definido en la interfaz
  buscarVideosPorConsulta(query: string): Observable<any> {
    const url = `${this.apiUrl}/search?key=${this.apiKey}&part=snippet&type=video&q=${query}&maxResults=10`;
    return this.http.get(url);
  }
  
}
