import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Step } from './step.entity';

/**
 * Represents a user task that can be broken down into smaller actionable steps.
 */
@Entity()
export class Task {
  @ApiProperty({
    description: 'Unique task identifier.',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Short title entered by the user
   */
  @ApiProperty({
    description: 'Short title entered by the user.',
    example: 'Prepare portfolio presentation',
  })
  @Column()
  title: string;

  /**
   * Short task description.
   * Can be an input from the user or created by IA
   */
  @ApiProperty({
    description:
      'Short task description provided by the user or inferred by the configured AI provider.',
    example: 'Create a concise presentation showing the project goal, tech stack, and current MVP status.',
  })
  @Column()
  description: string;

  /**
   * Marks if the task is fully completed -> the steps are all completed
   */
  @ApiProperty({
    description: 'Whether every step in the task is completed.',
    example: false,
  })
  @Column({ default: false })
  completed: boolean;

  /**
   * Steps associated with this task
   */
  @ApiProperty({
    description: 'Steps associated with this task, ordered by position.',
    type: () => [Step],
  })
  @OneToMany(() => Step, (step) => step.task)
  steps: Step[];

  @ApiProperty({
    description: 'Timestamp when the task was created.',
    example: '2026-05-09T12:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;
}
