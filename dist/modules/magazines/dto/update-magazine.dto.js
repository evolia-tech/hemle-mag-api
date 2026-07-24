"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMagazineDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_magazine_dto_1 = require("./create-magazine.dto");
class UpdateMagazineDto extends (0, mapped_types_1.PartialType)(create_magazine_dto_1.CreateMagazineDto) {
}
exports.UpdateMagazineDto = UpdateMagazineDto;
//# sourceMappingURL=update-magazine.dto.js.map