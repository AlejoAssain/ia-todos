import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { IaService } from '../ia/ia.service';
import { StepsService } from './steps.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    private readonly iaService: IaService,
    private readonly stepsService: StepsService,
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

      const newTask = tasksRepository.create({
        title: createTaskDto.title,
        description,
      });

      const savedTask = await tasksRepository.save(newTask);

      savedTask.steps = await this.stepsService.createGeneratedForTask(
        savedTask,
        stepsContent,
        manager,
      );

      return savedTask;
    });
  }

  findAll() {
    return this.tasksRepository.find({
      relations: {
        steps: true,
      },
      order: {
        steps: {
          position: 'ASC',
        },
      },
    });
  }

  async findOne(id: number) {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: { steps: true },
      order: {
        steps: {
          position: 'ASC',
        },
      },
    });
    if (!task) throw new NotFoundException(`Task #${id} not found`);
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id);
    Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    return this.tasksRepository.remove(task);
  }
}
