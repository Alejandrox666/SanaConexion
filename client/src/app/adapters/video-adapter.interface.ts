// src/app/adapters/video-adapter.interface.ts
import { Observable } from 'rxjs';

export interface VideoAdapter {
  getVideos(query: string): Observable<any>;
}
