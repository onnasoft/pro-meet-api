import { Test, TestingModule } from '@nestjs/testing';
import { TaskLabelsController } from './task-labels.controller';
import { TaskLabelsService } from './task-labels.service';

describe('TaskLabelsController', () => {
  let controller: TaskLabelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskLabelsController],
      providers: [TaskLabelsService],
    }).compile();

    controller = module.get<TaskLabelsController>(TaskLabelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
