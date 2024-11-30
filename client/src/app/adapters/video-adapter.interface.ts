// src/app/adapters/video-adapter.interface.ts
import { Observable } from 'rxjs';

// La interfaz define un método obligatorio: `getVideos`
export interface VideoAdapter {
  getVideos(query: string): Observable<any>;
}
