"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAuthDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const login_dto_1 = require("./login.dto");
class UpdateAuthDto extends (0, mapped_types_1.PartialType)(login_dto_1.LoginDto) {
}
exports.UpdateAuthDto = UpdateAuthDto;
//# sourceMappingURL=update-auth.dto.js.map