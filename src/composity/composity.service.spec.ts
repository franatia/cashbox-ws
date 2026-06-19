import { Test, TestingModule } from '@nestjs/testing';
import { ComposityService } from './composity.service';

describe('ComposityService', () => {
  let service: ComposityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComposityService],
    }).compile();

    service = module.get<ComposityService>(ComposityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
