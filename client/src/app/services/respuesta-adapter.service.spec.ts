import { TestBed } from '@angular/core/testing';

import { RespuestaAdapterService } from './respuesta-adapter.service';

describe('RespuestaAdapterService', () => {
  let service: RespuestaAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RespuestaAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
