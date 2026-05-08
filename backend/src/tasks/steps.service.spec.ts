import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Mock } from 'jest-mock';

import { Step } from './entities/step.entity';
import { Task } from './entities/task.entity';
import { StepsService } from './steps.service';

type TasksRepositoryMock = {
  findOne: Mock<(options: unknown) => Promise<Task | null>>;
  save: Mock<(task: Task) => Promise<Task>>;
};

type StepsRepositoryMock = {
  find: Mock<(options: unknown) => Promise<Step[]>>;
  findOne: Mock<(options: unknown) => Promise<Step | null>>;
  remove: Mock<(step: Step) => Promise<Step>>;
  save: Mock<(steps: Step[]) => Promise<Step[]>>;
};

describe('StepsService', () => {
  let service: StepsService;
  let tasksRepository: TasksRepositoryMock;
  let stepsRepository: StepsRepositoryMock;

  beforeEach(async () => {
    tasksRepository = {
      findOne: jest.fn<(options: unknown) => Promise<Task | null>>(),
      save: jest.fn<(task: Task) => Promise<Task>>(),
    };
    stepsRepository = {
      find: jest.fn<(options: unknown) => Promise<Step[]>>(),
      findOne: jest.fn<(options: unknown) => Promise<Step | null>>(),
      remove: jest.fn<(step: Step) => Promise<Step>>(),
      save: jest.fn<(steps: Step[]) => Promise<Step[]>>(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StepsService,
        {
          provide: getRepositoryToken(Task),
          useValue: tasksRepository,
        },
        {
          provide: getRepositoryToken(Step),
          useValue: stepsRepository,
        },
      ],
    }).compile();

    service = module.get<StepsService>(StepsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('renumbers sibling step positions after deleting a step', async () => {
    const task = { id: 1 } as Task;
    const stepToDelete = { id: 2, position: 2, task } as Step;
    const remainingSteps = [
      { id: 1, position: 1, completed: false },
      { id: 3, position: 3, completed: false },
      { id: 4, position: 4, completed: false },
    ] as Step[];

    stepsRepository.findOne.mockResolvedValue(stepToDelete);
    stepsRepository.remove.mockResolvedValue(stepToDelete);
    stepsRepository.find.mockResolvedValue(remainingSteps);
    tasksRepository.findOne.mockResolvedValue({
      ...task,
      completed: false,
      steps: remainingSteps,
    } as Task);
    tasksRepository.save.mockResolvedValue(task);

    await service.remove(stepToDelete.id);

    expect(remainingSteps.map((step) => step.position)).toEqual([1, 2, 3]);
    expect(stepsRepository.save).toHaveBeenCalledWith([
      remainingSteps[1],
      remainingSteps[2],
    ]);
    expect(tasksRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ completed: false }),
    );
  });
});
