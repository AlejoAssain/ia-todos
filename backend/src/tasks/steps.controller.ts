import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';

import { CreateEmptyStepDto } from './dto/create-empty-step.dto';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { StepsService } from './steps.service';

@Controller('steps')
export class StepsController {
  constructor(private readonly stepsService: StepsService) {}

  @Post()
  createStep(@Body() createStepDto: CreateStepDto) {
    return this.stepsService.create(createStepDto);
  }

  @Post('empty')
  createEmptyStep(@Body() createEmptyStepDto: CreateEmptyStepDto) {
    return this.stepsService.createEmpty(createEmptyStepDto);
  }

  @Patch(':stepId')
  updateStep(
    @Param('stepId') stepId: string,
    @Body() updateStepDto: UpdateStepDto,
  ) {
    return this.stepsService.update(+stepId, updateStepDto);
  }

  @Patch(':stepId/status')
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
  removeStep(@Param('stepId') stepId: string) {
    return this.stepsService.remove(+stepId);
  }
}
