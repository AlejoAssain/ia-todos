import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { Step } from './entities/step.entity';
import { IaService } from 'src/ia/ia.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(Step)
    private readonly stepsRepository: Repository<Step>,
    private readonly iaService: IaService,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const description =
      createTaskDto.description ??
      (await this.iaService.inferTaskDescription(createTaskDto.title));
    const stepsContent = await this.iaService.generateSteps(
      createTaskDto.title,
      description,
    );

    return this.tasksRepository.manager.transaction(async (manager) => {
      const tasksRepository = manager.getRepository(Task);
      const stepsRepository = manager.getRepository(Step);

      const newTask = tasksRepository.create({
        title: createTaskDto.title,
        description,
      });

      const savedTask = await tasksRepository.save(newTask);

      const steps = stepsContent.map((stepContent) =>
        stepsRepository.create({
          content: stepContent,
          completed: false,
          task: savedTask,
        }),
      );

      savedTask.steps = await stepsRepository.save(steps);

      return savedTask;
    });
  }

  findAll() {
    return this.tasksRepository.find({
      relations: {
        steps: true,
      },
    });
  }

  async findOne(id: number) {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: { steps: true },
    });
    if (!task) throw new NotFoundException(`Task #${id} not found`);
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id);
    Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  async updateStepStatus(stepId: number, completed: boolean) {
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
    const task = await this.tasksRepository.findOne({
      where: { id: step.task.id },
      relations: {
        steps: true,
      },
    });

    if (task) {
      task.completed =
        task.steps.length > 0 &&
        task.steps.every((taskStep) => taskStep.completed);
      await this.tasksRepository.save(task);
    }

    return savedStep;
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    return this.tasksRepository.remove(task);
  }
}
