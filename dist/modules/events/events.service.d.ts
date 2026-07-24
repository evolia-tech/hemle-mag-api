import { UpdateEventDto } from './dto/update-event.dto';
export declare class EventsService {
    create(body: any, image: Express.Multer.File | undefined, userId: string): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateEventDto: UpdateEventDto): string;
    remove(id: number): string;
}
