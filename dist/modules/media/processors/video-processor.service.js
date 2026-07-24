"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoProcessorService = void 0;
const common_1 = require("@nestjs/common");
const ffmpeg = __importStar(require("fluent-ffmpeg"));
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
const os_1 = require("os");
const path_1 = require("path");
const fs_1 = require("fs");
let VideoProcessorService = class VideoProcessorService {
    async process(buffer, config) {
        const { maxWidth = 1280, crf = 23, } = config || {};
        const inputPath = (0, path_1.join)((0, os_1.tmpdir)(), `input-${Date.now()}`);
        const outputPath = (0, path_1.join)((0, os_1.tmpdir)(), `output-${Date.now()}.mp4`);
        try {
            (0, fs_1.writeFileSync)(inputPath, buffer);
            await new Promise((resolve, reject) => {
                ffmpeg(inputPath)
                    .setFfmpegPath(ffmpeg_static_1.default)
                    .videoCodec('libx264')
                    .outputOptions([
                    `-crf ${crf}`,
                    '-preset medium',
                    `-vf scale='min(${maxWidth},iw)':-2`,
                    '-movflags +faststart',
                ])
                    .format('mp4')
                    .save(outputPath)
                    .on('end', resolve)
                    .on('error', reject);
            });
            const outputBuffer = (0, fs_1.readFileSync)(outputPath);
            return {
                buffer: outputBuffer,
                mimeType: 'video/mp4',
                format: 'mp4',
            };
        }
        finally {
            try {
                (0, fs_1.unlinkSync)(inputPath);
                (0, fs_1.unlinkSync)(outputPath);
            }
            catch (e) {
            }
        }
    }
};
exports.VideoProcessorService = VideoProcessorService;
exports.VideoProcessorService = VideoProcessorService = __decorate([
    (0, common_1.Injectable)()
], VideoProcessorService);
//# sourceMappingURL=video-processor.service.js.map