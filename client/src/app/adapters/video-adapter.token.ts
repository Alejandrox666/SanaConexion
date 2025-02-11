// src/app/adapters/video-adapter.ts
import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { YoutubeService } from '../services/youtube.service';

// Interfaz del Adapter
export interface VideoAdapter {
  obtenerVideos(query: string): Observable<any>;
}

// InjectionToken para el Adapter
export const VIDEO_ADAPTER_TOKEN = new InjectionToken<VideoAdapter>('VIDEO_ADAPTER_TOKEN');

// Implementación del Adapter para YouTube
@Injectable({
  providedIn: 'root',
})

export class YoutubeAdapter implements VideoAdapter {
    constructor(private youtubeService: YoutubeService) {}
  
    obtenerVideos(query: string): Observable<any> {
      return this.youtubeService.buscarVideosPorConsulta(query);
    }
  }
