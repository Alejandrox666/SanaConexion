import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VideoAdapter } from './video-adapter.interface';
import { YoutubeService } from '../services/youtube.service';

@Injectable({
  providedIn: 'root',
})
export class YoutubeAdapter implements VideoAdapter {
  constructor(private youtubeService: YoutubeService) {}

  getVideos(query: string): Observable<any> {
    return this.youtubeService.getVideos(query);
  }
}
