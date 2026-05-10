import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
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

import { CreateEmptyStepDto } from './dto/create-empty-step.dto';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { Step } from './entities/step.entity';
import { StepsService } from './steps.service';

@ApiTags('steps')
@Controller('steps')
export class StepsController {
  constructor(private readonly stepsService: StepsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a step',
    description:
      'Adds a new step to an existing task. If no position is provided, the step is appended after the current last step.',
  })
  @ApiBody({ type: CreateStepDto })
  @ApiCreatedResponse({
    description: 'Step created.',
    type: Step,
  })
  @ApiBadRequestResponse({
    description: 'The request body failed validation.',
  })
  @ApiNotFoundResponse({
    description: 'No task exists for the provided taskId.',
  })
  createStep(@Body() createStepDto: CreateStepDto) {
    return this.stepsService.create(createStepDto);
  }

  @Post('empty')
  @ApiOperation({
    summary: 'Create an empty step',
    description:
      'Adds an empty editable step to an existing task. This is useful when the UI needs to create a blank row before the user writes the step text.',
  })
  @ApiBody({ type: CreateEmptyStepDto })
  @ApiCreatedResponse({
    description: 'Empty step created.',
    type: Step,
  })
  @ApiBadRequestResponse({
    description: 'The request body failed validation.',
  })
  @ApiNotFoundResponse({
    description: 'No task exists for the provided taskId.',
  })
  createEmptyStep(@Body() createEmptyStepDto: CreateEmptyStepDto) {
    return this.stepsService.createEmpty(createEmptyStepDto);
  }

  @Patch(':stepId')
  @ApiOperation({
    summary: 'Update a step',
    description:
      'Updates step fields such as content, position, or completed status. When completed changes, the parent task completion status is recalculated.',
  })
  @ApiParam({
    name: 'stepId',
    description: 'Step ID.',
    example: 1,
  })
  @ApiBody({ type: UpdateStepDto })
  @ApiOkResponse({
    description: 'Step updated.',
    type: Step,
  })
  @ApiBadRequestResponse({
    description: 'The request body failed validation.',
  })
  @ApiNotFoundResponse({
    description: 'No step exists for the provided stepId.',
  })
  updateStep(
    @Param('stepId') stepId: string,
    @Body() updateStepDto: UpdateStepDto,
  ) {
    return this.stepsService.update(+stepId, updateStepDto);
  }

  @Patch(':stepId/status')
  @ApiOperation({
    summary: 'Update a step completion status',
    description:
      'Updates only the completed state of a step and recalculates the parent task completion status.',
  })
  @ApiParam({
    name: 'stepId',
    description: 'Step ID.',
    example: 1,
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['completed'],
      properties: {
        completed: {
          type: 'boolean',
          example: true,
          description: 'New completion status for the step.',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Step status updated.',
    type: Step,
  })
  @ApiBadRequestResponse({
    description: 'completed must be a boolean.',
  })
  @ApiNotFoundResponse({
    description: 'No step exists for the provided stepId.',
  })
  updateStepStatus(
    @Param('stepId') stepId: string,
    @Body() updateStepStatusDto: UpdateStepDto,
  ) {
    return this.stepsService.updateStatus(
      +stepId,
      updateStepStatusDto.completed,
    );
  }

  @Delete(':stepId')
  @ApiOperation({
    summary: 'Delete a step',
    description:
      'Deletes a step, renumbers the remaining sibling steps, and recalculates the parent task completion status.',
  })
  @ApiParam({
    name: 'stepId',
    description: 'Step ID.',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Step deleted.',
    type: Step,
  })
  @ApiNotFoundResponse({
    description: 'No step exists for the provided stepId.',
  })
  removeStep(@Param('stepId') stepId: string) {
    return this.stepsService.remove(+stepId);
  }
}
