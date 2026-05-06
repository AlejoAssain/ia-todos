import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { CreateEmptyStepDto } from './dto/create-empty-step.dto';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { Step } from './entities/step.entity';
import { Task } from './entities/task.entity';

@Injectable()
export class StepsService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(Step)
    private readonly stepsRepository: Repository<Step>,
  ) {}

  private async findTask(taskId: number) {
    const task = await this.tasksRepository.findOne({
      where: { id: taskId },
      relations: {
        steps: true,
      },
      order: {
        steps: {
          position: 'ASC',
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task #${taskId} not found`);
    }

    return task;
  }

  private async updateTaskCompletion(taskId: number) {
    const task = await this.findTask(taskId);

    task.completed =
      task.steps.length > 0 &&
      task.steps.every((taskStep) => taskStep.completed);
    await this.tasksRepository.save(task);
  }

  private getNextPosition(task: Task) {
    const highestPosition = task.steps.reduce(
      (highest, step) => Math.max(highest, step.position),
      0,
    );

    return highestPosition + 1;
  }

  async create(createStepDto: CreateStepDto) {
    const task = await this.findTask(createStepDto.taskId);
    const step = this.stepsRepository.create({
      content: createStepDto.content,
      completed: createStepDto.completed ?? false,
      position: createStepDto.position ?? this.getNextPosition(task),
      task,
    });

    const savedStep = await this.stepsRepository.save(step);
    await this.updateTaskCompletion(task.id);

    return savedStep;
  }

  async createEmpty(createEmptyStepDto: CreateEmptyStepDto) {
    const task = await this.findTask(createEmptyStepDto.taskId);
    const step = this.stepsRepository.create({
      content: '',
      completed: createEmptyStepDto.completed ?? false,
      position: createEmptyStepDto.position ?? this.getNextPosition(task),
      task,
    });

    const savedStep = await this.stepsRepository.save(step);
    await this.updateTaskCompletion(task.id);

    return savedStep;
  }

  async createGeneratedForTask(
    task: Task,
    stepContents: string[],
    manager?: EntityManager,
  ) {
    const stepsRepository = manager
      ? manager.getRepository(Step)
      : this.stepsRepository;

    const steps = stepContents.map((stepContent, index) =>
      stepsRepository.create({
        content: stepContent,
        completed: false,
        position: index + 1,
        task,
      }),
    );

    return stepsRepository.save(steps);
  }

  async update(stepId: number, updateStepDto: UpdateStepDto) {
    const step = await this.stepsRepository.findOne({
      where: { id: stepId },
      relations: {
        task: true,
      },
    });

    if (!step) {
      throw new NotFoundException(`Step with id ${stepId} was not found`);
    }

    Object.assign(step, updateStepDto);

    const savedStep = await this.stepsRepository.save(step);

    if (typeof updateStepDto.completed === 'boolean') {
      await this.updateTaskCompletion(step.task.id);
    }

    return savedStep;
  }

  async updateStatus(stepId: number, completed?: boolean) {
    if (typeof completed !== 'boolean') {
      throw new BadRequestException('completed must be a boolean');
    }

    const step = await this.stepsRepository.findOne({
      where: { id: stepId },
      relations: {
        task: true,
      },
    });

    if (!step) {
      throw new NotFoundException(`Step with id ${stepId} was not found`);
    }

    step.completed = completed;

    const savedStep = await this.stepsRepository.save(step);
    await this.updateTaskCompletion(step.task.id);

    return savedStep;
  }

  async remove(stepId: number) {
    const step = await this.stepsRepository.findOne({
      where: { id: stepId },
      relations: {
        task: true,
      },
    });

    if (!step) {
      throw new NotFoundException(`Step with id ${stepId} was not found`);
    }

    const taskId = step.task.id;
    const removedStep = await this.stepsRepository.remove(step);
    await this.updateTaskCompletion(taskId);

    return removedStep;
  }
}
