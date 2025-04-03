"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConditionOperator_1 = __importDefault(require("./ConditionOperator"));
const lodash_1 = __importDefault(require("lodash"));
const utils_1 = require("../utils");
class IsEqualTo extends ConditionOperator_1.default {
    static get operatorKey() {
        return 'isEqual';
    }
    static get displayedName() {
        return 'Is Equal To';
    }
    execute({ value, comparedValue, instance, path }) {
        var _a, _b;
        if ((value || value === false) && comparedValue && typeof value !== typeof comparedValue && lodash_1.default.isString(comparedValue)) {
            try {
                comparedValue = JSON.parse(comparedValue);
            }
            // eslint-disable-next-line no-empty
            catch (e) { }
        }
        if ((_a = instance === null || instance === void 0 ? void 0 : instance.root) === null || _a === void 0 ? void 0 : _a.getComponent) {
            const conditionTriggerComponent = instance.root.getComponent(path);
            if (conditionTriggerComponent
                && (0, utils_1.isSelectResourceWithObjectValue)(conditionTriggerComponent.component)
                && ((_b = conditionTriggerComponent.component) === null || _b === void 0 ? void 0 : _b.template)) {
                return (0, utils_1.compareSelectResourceWithObjectTypeValues)(value, comparedValue, conditionTriggerComponent.component);
            }
        }
        //special check for select boxes
        if (lodash_1.default.isObject(value) && comparedValue && lodash_1.default.isBoolean(value[comparedValue])) {
            return value[comparedValue];
        }
        return lodash_1.default.isEqual(value, comparedValue);
    }
}
exports.default = IsEqualTo;
