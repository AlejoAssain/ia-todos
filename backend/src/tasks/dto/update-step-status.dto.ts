import { IsBoolean } from 'class-validator';

export class UpdateStepStatusDto {
  @IsBoolean()
  completed: boolean;
}
