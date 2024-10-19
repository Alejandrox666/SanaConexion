import { TestBed } from '@angular/core/testing';

import { DatosEspService } from './datos-esp.service';

describe('DatosEspService', () => {
  let service: DatosEspService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatosEspService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
