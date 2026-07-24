import { EventsService } from '../events.service';
import { UpdateEventDto } from '../dto/update-event.dto';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    create(body: any, image: Express.Multer.File, staffId: string): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateEventDto: UpdateEventDto): string;
    remove(id: string): string;
}
