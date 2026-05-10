import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a task and generate its initial steps',
    description:
      'Creates a task. If description is omitted, the configured AI provider infers one from the title. The backend then asks the AI provider to generate the initial step list.',
  })
  @ApiBody({ type: CreateTaskDto })
  @ApiCreatedResponse({
    description: 'Task created with generated steps.',
    type: Task,
  })
  @ApiBadRequestResponse({
    description:
      'The request body failed validation or the AI provider returned an invalid response.',
  })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List tasks',
    description:
      'Returns all tasks with their steps included and ordered by step position.',
  })
  @ApiOkResponse({
    description: 'List of tasks.',
    type: [Task],
  })
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a task by ID',
    description:
      'Returns a single task with its steps included and ordered by step position.',
  })
  @ApiParam({
    name: 'id',
    description: 'Task ID.',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Task found.',
    type: Task,
  })
  @ApiNotFoundResponse({
    description: 'No task exists for the provided ID.',
  })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a task',
    description:
      'Updates task fields such as title, description, or completed status.',
  })
  @ApiParam({
    name: 'id',
    description: 'Task ID.',
    example: 1,
  })
  @ApiBody({ type: UpdateTaskDto })
  @ApiOkResponse({
    description: 'Task updated.',
    type: Task,
  })
  @ApiBadRequestResponse({
    description: 'The request body failed validation.',
  })
  @ApiNotFoundResponse({
    description: 'No task exists for the provided ID.',
  })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a task',
    description:
      'Deletes a task and cascades deletion to its associated steps.',
  })
  @ApiParam({
    name: 'id',
    description: 'Task ID.',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Task deleted.',
    type: Task,
  })
  @ApiNotFoundResponse({
    description: 'No task exists for the provided ID.',
  })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
