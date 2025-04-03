"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const en_1 = __importDefault(require("./translations/en"));
const utils_1 = require("./utils/utils");
exports.default = {
    lng: 'en',
    nsSeparator: '::',
    keySeparator: '.|.',
    pluralSeparator: '._.',
    contextSeparator: '._.',
    resources: {
        en: {
            translation: (0, utils_1.fastCloneDeep)(en_1.default)
        }
    }
};
