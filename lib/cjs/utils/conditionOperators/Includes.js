"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConditionOperator_1 = __importDefault(require("./ConditionOperator"));
const lodash_1 = __importDefault(require("lodash"));
class Includes extends ConditionOperator_1.default {
    static get operatorKey() {
        return 'includes';
    }
    static get displayedName() {
        return 'Includes';
    }
    execute({ value, comparedValue }) {
        return lodash_1.default.includes(value, comparedValue);
    }
}
exports.default = Includes;
