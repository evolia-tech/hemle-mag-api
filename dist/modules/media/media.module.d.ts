import { DynamicModule } from '@nestjs/common';
import { MediaModuleOptions } from './interfaces/media-module-options.interface';
export declare class MediaModule {
    static forRoot(options: MediaModuleOptions): DynamicModule;
    static registerMedia(): DynamicModule;
}
