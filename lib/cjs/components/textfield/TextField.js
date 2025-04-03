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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Input_1 = __importDefault(require("../_classes/input/Input"));
const vanilla_text_mask_1 = require("@formio/vanilla-text-mask");
const inputmask_1 = __importDefault(require("inputmask"));
const FormioUtils = __importStar(require("../../utils/utils"));
const lodash_1 = __importDefault(require("lodash"));
class TextFieldComponent extends Input_1.default {
    static schema(...extend) {
        return Input_1.default.schema({
            label: 'Text Field',
            key: 'textField',
            type: 'textfield',
            mask: false,
            inputType: 'text',
            inputFormat: 'plain',
            inputMask: '',
            displayMask: '',
            tableView: true,
            spellcheck: true,
            truncateMultipleSpaces: false,
            validate: {
                minLength: '',
                maxLength: '',
                pattern: ''
            }
        }, ...extend);
    }
    static get builderInfo() {
        return {
            title: 'Text Field',
            icon: 'terminal',
            group: 'basic',
            documentation: '/userguide/form-building/form-components#text-field',
            weight: 0,
            schema: TextFieldComponent.schema()
        };
    }
    static get serverConditionSettings() {
        return TextFieldComponent.conditionOperatorsSettings;
    }
    static get conditionOperatorsSettings() {
        return Object.assign(Object.assign({}, super.conditionOperatorsSettings), { operators: [...super.conditionOperatorsSettings.operators, 'includes', 'notIncludes', 'endsWith', 'startsWith'], valueComponent(classComp) {
                return Object.assign(Object.assign({}, classComp), { type: 'textfield' });
            } });
    }
    static savedValueTypes(schema) {
        return FormioUtils.getComponentSavedTypes(schema) || [FormioUtils.componentValueTypes.string];
    }
    get defaultSchema() {
        return TextFieldComponent.schema();
    }
    get inputInfo() {
        const info = super.inputInfo;
        info.type = 'input';
        if (this.component.hasOwnProperty('spellcheck')) {
            info.attr.spellcheck = this.component.spellcheck;
        }
        if (this.component.mask) {
            info.attr.type = 'password';
        }
        else {
            info.attr.type = (this.component.inputType === 'password') ? 'password' : 'text';
        }
        info.changeEvent = (this.component.applyMaskOn === 'blur') ? 'blur' : 'input';
        return info;
    }
    get emptyValue() {
        return '';
    }
    constructor(component, options, data) {
        var _a, _b, _c;
        super(component, options, data);
        const timezone = (((_a = this.component.widget) === null || _a === void 0 ? void 0 : _a.timezone) || this.options.timezone);
        const displayInTimezone = (((_b = this.component.widget) === null || _b === void 0 ? void 0 : _b.displayInTimezone) || 'viewer');
        if (((_c = this.component.widget) === null || _c === void 0 ? void 0 : _c.type) === 'calendar') {
            this.component.widget = Object.assign(Object.assign({}, this.component.widget), { readOnly: this.options.readOnly, timezone,
                displayInTimezone, locale: this.component.widget.locale || this.options.language, saveAs: 'text' });
            // update originalComponent to include widget settings after component initialization 
            // originalComponent is used to restore the component (and widget) after evaluating field logic 
            this.originalComponent = FormioUtils.fastCloneDeep(this.component);
        }
    }
    attach(element) {
        this.loadRefs(element, {
            valueMaskInput: 'single',
        });
        return super.attach(element);
    }
    /**
     * Returns the mask value object (mutates value!).
     * @param {any} [value] - The value to convert to a mask value.
     * @param {any} [flags] - The flags to use when converting to a mask value.
     * @returns {*} - The value as a mask value.
     */
    maskValue(value, flags = {}) {
        // Convert it into the correct format.
        if (!value || (typeof value !== 'object')) {
            value = {
                value,
                maskName: this.component.inputMasks[0].label
            };
        }
        // If no value is provided, then set the defaultValue.
        if (!value.value) {
            const defaultValue = flags.noDefault ? this.emptyValue : this.defaultValue;
            value.value = Array.isArray(defaultValue) ? defaultValue[0] : defaultValue;
        }
        return value;
    }
    /**
     * Normalize the value set in the data object.
     * @param {any} value - The value to normalize.
     * @param {any} flags - The flags to use when normalizing the value.
     * @returns {*} - Returns the normalized value.
     */
    normalizeValue(value, flags = {}) {
        if (!this.isMultipleMasksField) {
            return super.normalizeValue(value);
        }
        if (Array.isArray(value)) {
            return super.normalizeValue(value.map((val) => this.maskValue(val, flags)));
        }
        return super.normalizeValue(this.maskValue(value, flags));
    }
    /**
     * Sets the value at this index.
     * @param {number} index - The index to set the value at.
     * @param {any} value - The value to set.
     * @param {any} [flags] - The flags to use when setting the value.
     * @returns {void}
     */
    setValueAt(index, value, flags = {}) {
        if (!this.isMultipleMasksField) {
            return super.setValueAt(index, value, flags);
        }
        value = this.maskValue(value, flags);
        const textValue = value.value || '';
        const textInput = this.refs.mask ? this.refs.mask[index] : null;
        const maskInput = this.refs.select ? this.refs.select[index] : null;
        const mask = this.getMaskPattern(value.maskName);
        if (textInput && maskInput && mask) {
            // We need to set the maskInput (select dropdown) value before calling inputmask.setValue because, this
            // function will trigger a "change" event, which was calling updateValue setting the mask type to an incorrect value.
            maskInput.value = value.maskName;
            if (textInput.inputmask) {
                this.setInputMask(textInput, mask);
                textInput.inputmask.setValue(textValue);
            }
            else {
                const placeholderChar = this.placeholderChar;
                textInput.value = (0, vanilla_text_mask_1.conformToMask)(textValue, FormioUtils.getInputMask(mask), { placeholderChar }).conformedValue;
            }
        }
        else {
            return super.setValueAt(index, textValue, flags);
        }
    }
    unmaskValue(value, format = this.component.displayMask) {
        const mask = FormioUtils.getInputMask(format, this.placeholderChar);
        return FormioUtils.unmaskValue(value, mask, this.placeholderChar);
    }
    /**
     * Returns the value at this index.
     * @param {number} index - The index to get the value from.
     * @returns {*} - The value at the index.
     */
    getValueAt(index) {
        var _a, _b;
        if (!this.isMultipleMasksField) {
            const value = super.getValueAt(index);
            const valueMask = this.component.inputMask;
            const displayMask = this.component.displayMask;
            // If the input has only the valueMask or the displayMask is the same as the valueMask,
            // just return the value which is already formatted
            if (valueMask && !displayMask || displayMask === valueMask) {
                return value;
            }
            // If there is only the displayMask, return the raw (unmasked) value
            if (displayMask && !valueMask) {
                return this.unmaskValue(value, displayMask);
            }
            if (displayMask && displayMask !== valueMask) {
                return inputmask_1.default.format(inputmask_1.default.unmask(value, displayMask), valueMask);
            }
            if (((_a = this.refs.valueMaskInput) === null || _a === void 0 ? void 0 : _a.mask) && this.refs.valueMaskInput.mask.textMaskInputElement) {
                this.refs.valueMaskInput.mask.textMaskInputElement.update(value);
                return (_b = this.refs.valueMaskInput) === null || _b === void 0 ? void 0 : _b.value;
            }
            return value;
        }
        const textInput = this.refs.mask ? this.refs.mask[index] : null;
        const maskInput = this.refs.select ? this.refs.select[index] : null;
        return {
            value: textInput ? textInput.value : undefined,
            maskName: maskInput ? maskInput.value : undefined
        };
    }
    checkInputMaskValue(inputMask) {
        let valid = true;
        const maskValues = lodash_1.default.values(inputMask.split('').reduce((acc, el, i, mask) => {
            var _a;
            if (el === '{' || el === '}') {
                if (mask[i + 1] === '{' || mask[i + 1] === '}') {
                    valid = false;
                }
                acc[el] = ((_a = acc[el]) !== null && _a !== void 0 ? _a : 0) + 1;
            }
            return acc;
        }, {}));
        if (maskValues[0] !== maskValues[1]) {
            valid = false;
        }
        return valid;
    }
    setInputMask(input, inputMask, usePlaceholder) {
        if (this.type !== 'textfield') {
            super.setInputMask(input, inputMask, usePlaceholder);
            return;
        }
        inputMask = inputMask || this.component.displayMask || this.component.inputMask;
        const mask = FormioUtils.getInputMask(inputMask, this.placeholderChar);
        this.defaultMask = mask;
        if (input && inputMask) {
            try {
                //remove previous mask
                if (input.mask) {
                    input.mask.remove();
                }
                if (this.checkInputMaskValue(inputMask)) {
                    input.mask = new inputmask_1.default(inputMask, {
                        clearMaskOnLostFocus: !!this.component.placeholder,
                        showMaskOnHover: !this.component.placeholder,
                        placeholder: this.placeholderChar || '',
                    }).mask(input);
                }
            }
            catch (e) {
                console.warn(e);
            }
            if (mask.numeric) {
                input.setAttribute('pattern', '\\d*');
            }
            if (this.component.placeholder) {
                input.setAttribute('placeholder', this.component.placeholder);
            }
        }
    }
    isHtmlRenderMode() {
        return super.isHtmlRenderMode() ||
            ((this.options.readOnly || this.disabled) &&
                this.component.inputFormat === 'html' &&
                this.type === 'textfield');
    }
    isEmpty(value = this.dataValue) {
        if (!this.isMultipleMasksField) {
            return super.isEmpty((value || '').toString().trim());
        }
        return super.isEmpty(value) || (this.component.multiple ? value.length === 0 : (!value.maskName || !value.value));
    }
    truncateMultipleSpaces(value) {
        if (value) {
            return value.trim().replace(/\s{2,}/g, ' ');
        }
        return value;
    }
    get validationValue() {
        const value = super.validationValue;
        if (value && this.component.truncateMultipleSpaces) {
            return this.truncateMultipleSpaces(value);
        }
        return value;
    }
    beforeSubmit() {
        let value = this.dataValue;
        if (!this.component.truncateMultipleSpaces || !value) {
            return Promise.resolve(value);
        }
        value = this.truncateMultipleSpaces(value);
        this.dataValue = value;
        return Promise.resolve(value).then(() => super.beforeSubmit());
    }
    getValueAsString(value, options) {
        if ((options === null || options === void 0 ? void 0 : options.email) && this.visible && !this.skipInEmail && lodash_1.default.isObject(value)) {
            const result = (`
        <table border="1" style="width:100%">
          <tbody>
          <tr>
            <th style="padding: 5px 10px;">${value.maskName}</th>
            <td style="width:100%;padding:5px 10px;">${value.value}</td>
          </tr>
          </tbody>
        </table>
      `);
            return result;
        }
        if (value && this.component.inputFormat === 'plain' && /<[^<>]+>/g.test(value)) {
            value = value.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
        }
        return super.getValueAsString(value, options);
    }
}
exports.default = TextFieldComponent;
