import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { StepsController } from './steps.controller';
import { StepsService } from './steps.service';
import { Task } from './entities/task.entity';
import { Step } from './entities/step.entity';
import { IaModule } from '../ia/ia.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Step]), IaModule],
  controllers: [TasksController, StepsController],
  providers: [TasksService, StepsService],
})
export class TasksModule {}
