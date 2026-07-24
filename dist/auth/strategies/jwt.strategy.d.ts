import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Staff } from "../../modules/staffs/entities/staff.entity";
import { JwtPayload } from '../interfaces/jwt-payload.interface';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private readonly staffRepo;
    constructor(configService: ConfigService, staffRepo: Repository<Staff>);
    validate(payload: JwtPayload): Promise<Omit<Staff, 'password'>>;
}
export {};
