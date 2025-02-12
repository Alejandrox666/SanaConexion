import { InjectionToken } from '@angular/core';
import { VideoAdapter } from './video-adapter.interface';

export const VIDEO_ADAPTER_TOKEN = new InjectionToken<VideoAdapter>('VIDEO_ADAPTER_TOKEN');
