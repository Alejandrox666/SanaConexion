import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VideoAdapter } from '../adapters/video-adapter.interface'; // Importa la interfaz

@Injectable({
  providedIn: 'root',
})
export class YoutubeService implements VideoAdapter {
  private apiKey = 'AIzaSyBuEsieZr1Pm4k4xAXyqb7mRQa6tS6FVlI';
  private apiUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(private http: HttpClient) {}

  // Implementamos el método definido en la interfaz
  getVideos(query: string): Observable<any> {
    const url = `${this.apiUrl}/search?key=${this.apiKey}&part=snippet&type=video&q=${query}`;
    return this.http.get(url);
  }
}
