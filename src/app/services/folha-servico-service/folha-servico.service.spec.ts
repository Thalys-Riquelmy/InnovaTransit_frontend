import { TestBed } from '@angular/core/testing';

import { FolhaServicoService } from './folha-servico.service';

describe('FolhaServicoService', () => {
  let service: FolhaServicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FolhaServicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
