import { Module } from '@nestjs/common';
import { EventsService } from './events.service';

@Module({
  controllers: [],
  providers: [EventsService],
})
export class EventsModule {}
