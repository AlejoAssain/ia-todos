import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class CreateEmptyStepDto {
  @IsInt()
  taskId: number;

  @IsInt()
  @IsOptional()
  position?: number;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
