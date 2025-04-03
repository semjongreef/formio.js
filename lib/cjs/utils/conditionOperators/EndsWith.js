"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConditionOperator_1 = __importDefault(require("./ConditionOperator"));
const lodash_1 = __importDefault(require("lodash"));
class EndsWith extends ConditionOperator_1.default {
    static get operatorKey() {
        return 'endsWith';
    }
    static get displayedName() {
        return 'Ends With';
    }
    execute({ value, comparedValue }) {
        return lodash_1.default.endsWith(value, comparedValue);
    }
}
exports.default = EndsWith;
