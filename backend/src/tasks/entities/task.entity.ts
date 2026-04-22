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
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Short title entered by the user
   */
  @Column()
  title: string;

  /**
   * Short task description.
   * Can be an input from the user or created by IA
   */
  @Column()
  description: string;

  /**
   * Marks if the task is fully completed -> the steps are all completed
   */
  @Column({ default: false })
  completed: boolean;

  /**
   * Steps associated with this task
   */
  @OneToMany(() => Step, (step) => step.task)
  steps: Step[];

  @CreateDateColumn()
  createdAt: Date;
}
