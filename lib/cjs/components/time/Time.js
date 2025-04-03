"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const TextField_1 = __importDefault(require("../textfield/TextField"));
const utils_1 = require("../../utils/utils");
const defaultDataFormat = 'HH:mm:ss';
class TimeComponent extends TextField_1.default {
    static schema(...extend) {
        return TextField_1.default.schema({
            type: 'time',
            label: 'Time',
            key: 'time',
            inputType: 'time',
            format: 'HH:mm',
            dataFormat: defaultDataFormat,
        }, ...extend);
    }
    constructor(component, options, data) {
        super(component, options, data);
        const { edge: isEdgeBrowser, version: edgeVersion } = (0, utils_1.getBrowserInfo)();
        this.component.inputMask = this.getInputMaskFromFormat(this.component.format);
        this.component.inputType = isEdgeBrowser && edgeVersion <= 18
            ? 'text'
            : (this.component.inputType || 'time');
        // If default value is given then the raw data needs to be set
        this.rawData = this.component.multiple ? [] : this.getValueAsString(this.defaultValue) || this.emptyValue;
    }
    static get builderInfo() {
        return {
            title: 'Time',
            icon: 'clock-o',
            group: 'advanced',
            documentation: '/userguide/form-building/advanced-components#time-1',
            weight: 55,
            schema: TimeComponent.schema(),
        };
    }
    get dataFormat() {
        return this.component.dataFormat || defaultDataFormat;
    }
    get defaultSchema() {
        return TimeComponent.schema();
    }
    get defaultValue() {
        let value = super.defaultValue;
        if (this.component.multiple && Array.isArray(value)) {
            value = value.map(item => item ? this.getStringAsValue(item) : item);
        }
        else {
            if (value) {
                value = this.getStringAsValue(value);
            }
        }
        return value;
    }
    get inputInfo() {
        const info = super.inputInfo;
        info.attr.type = this.component.inputType;
        return info;
    }
    get skipMaskValidation() {
        return true;
    }
    isNotCompleteInput(value) {
        return value.includes('_');
    }
    removeValue(index) {
        this.rawData = Array.isArray(this.rawData) ? [...this.rawData.slice(0, index), ...this.rawData.slice(index + 1)] : this.emptyValue;
        super.removeValue(index);
    }
    resetRawData(index) {
        if (index) {
            this.setRawValue(this.emptyValue, index);
        }
        else {
            this.rawData = [];
        }
    }
    setRawValue(value, index) {
        if (Array.isArray(this.rawData)) {
            this.rawData[index] = value;
        }
        else {
            this.rawData = value;
        }
    }
    getRawValue(index) {
        if (index && Array.isArray(this.rawData)) {
            return this.rawData[index] || this.emptyValue;
        }
        else {
            return this.rawData;
        }
    }
    getValueAt(index) {
        if (!this.refs.input.length || !this.refs.input[index]) {
            return this.emptyValue;
        }
        const { value } = this.refs.input[index];
        if (!value) {
            this.resetRawData(index);
            return this.emptyValue;
        }
        this.setRawValue(value, index);
        return this.getStringAsValue(value);
    }
    setValueAt(index, value) {
        this.setRawValue(value ? this.getValueAsString(value) : value, index);
        this.refs.input[index].value = this.getRawValue(index);
    }
    getStringAsValue(view) {
        return view ? (0, moment_1.default)(view, this.component.format).format(this.component.dataFormat) : view;
    }
    getValueAsString(value) {
        if (Array.isArray(value) && this.component.multiple) {
            return value.map(item => (0, moment_1.default)(item, this.component.dataFormat).format(this.component.format)).join(', ');
        }
        return (value ? (0, moment_1.default)(value, this.component.dataFormat).format(this.component.format) : value) || '';
    }
    getInputMaskFromFormat(format) {
        if (format === 'LT') {
            return '99:99 AA';
        }
        if (format === 'LTS') {
            return '99:99:99 AA';
        }
        return format.replace(/[hHmMsSk]/g, '9')
            .replace(/[aA]/, 'AA');
    }
    addFocusBlurEvents(element) {
        super.addFocusBlurEvents(element);
        this.addEventListener(element, 'blur', () => {
            element.value = this.getValueAsString(element.value);
        });
    }
}
exports.default = TimeComponent;
