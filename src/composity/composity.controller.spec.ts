import { Test, TestingModule } from '@nestjs/testing';
import { ComposityController } from './composity.controller';
import { ComposityService } from './composity.service';

describe('ComposityController', () => {
  let controller: ComposityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComposityController],
      providers: [ComposityService],
    }).compile();

    controller = module.get<ComposityController>(ComposityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
