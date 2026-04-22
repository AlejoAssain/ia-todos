import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { TasksModule } from './tasks/tasks.module';
import { IaModule } from './ia/ia.module';

@Module({
  imports: [DatabaseModule, TasksModule, IaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
