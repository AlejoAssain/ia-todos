import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IaService } from '../ia/ia.service';
import { Task } from './entities/task.entity';
import { StepsService } from './steps.service';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            findOne: jest.fn(),
            manager: {
              transaction: jest.fn(),
            },
            remove: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: IaService,
          useValue: {
            generateSteps: jest.fn(),
            inferTaskDescription: jest.fn(),
          },
        },
        {
          provide: StepsService,
          useValue: {
            createGeneratedForTask: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
