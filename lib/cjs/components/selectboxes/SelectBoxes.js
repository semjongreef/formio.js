"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const utils_1 = require("../../utils/utils");
const Radio_1 = __importDefault(require("../radio/Radio"));
class SelectBoxesComponent extends Radio_1.default {
    static schema(...extend) {
        return Radio_1.default.schema({
            type: 'selectboxes',
            label: 'Select Boxes',
            key: 'selectBoxes',
            inline: false
        }, ...extend);
    }
    static get builderInfo() {
        return {
            title: 'Select Boxes',
            group: 'basic',
            icon: 'plus-square',
            weight: 60,
            documentation: '/userguide/form-building/form-components#select-box',
            schema: SelectBoxesComponent.schema()
        };
    }
    static get serverConditionSettings() {
        return SelectBoxesComponent.conditionOperatorsSettings;
    }
    static get conditionOperatorsSettings() {
        return Object.assign(Object.assign({}, super.conditionOperatorsSettings), { valueComponent(classComp) {
                const isValuesSrc = !classComp.dataSrc || classComp.dataSrc === 'values';
                return isValuesSrc
                    ? {
                        type: 'select',
                        dataSrc: 'custom',
                        valueProperty: 'value',
                        dataType: 'string',
                        data: {
                            custom: `values = ${classComp && classComp.values ? JSON.stringify(classComp.values) : []}`
                        },
                    }
                    : Object.assign(Object.assign({}, classComp), { dataType: 'string', type: 'select' });
            } });
    }
    static savedValueTypes(schema) {
        return (0, utils_1.getComponentSavedTypes)(schema) || [utils_1.componentValueTypes.object];
    }
    constructor(...args) {
        super(...args);
    }
    init() {
        super.init();
        this.component.inputType = 'checkbox';
    }
    get defaultSchema() {
        return SelectBoxesComponent.schema();
    }
    get inputInfo() {
        const info = super.elementInfo();
        info.attr.name += '[]';
        info.attr.type = 'checkbox';
        info.attr.class = 'form-check-input';
        return info;
    }
    get hasDefaultValue() {
        return true;
    }
    get emptyValue() {
        return this.component.values.reduce((prev, value) => {
            if (value.value) {
                prev[value.value] = false;
            }
            return prev;
        }, {});
    }
    get defaultValue() {
        let defaultValue = this.emptyValue;
        if (!lodash_1.default.isEmpty(this.component.defaultValue)) {
            defaultValue = this.component.defaultValue;
        }
        if (this.component.customDefaultValue && !this.options.preview) {
            defaultValue = this.evaluate(this.component.customDefaultValue, { value: '' }, 'value');
        }
        return defaultValue;
    }
    /**
     * Only empty if the values are all false.
     * @param {any} value - The value to check if empty.
     * @returns {boolean} - If the value is empty.
     */
    isEmpty(value = this.dataValue) {
        let empty = true;
        for (const key in value) {
            if (value.hasOwnProperty(key) && value[key]) {
                empty = false;
                break;
            }
        }
        return empty;
    }
    getValue() {
        if (this.viewOnly || !this.refs.input || !this.refs.input.length) {
            return this.dataValue;
        }
        const value = {};
        lodash_1.default.each(this.refs.input, (input) => {
            value[input.value] = !!input.checked;
        });
        return value;
    }
    /**
     * Normalize values coming into updateValue.
     * @param {any} value - The value to normalize.
     * @returns {*} - The normalized value
     */
    normalizeValue(value) {
        value = value || {};
        if (typeof value !== 'object') {
            if (typeof value === 'string') {
                value = {
                    [value]: true
                };
            }
            else {
                value = {};
            }
        }
        if (Array.isArray(value)) {
            lodash_1.default.each(value, (val) => {
                value[val] = true;
            });
        }
        const checkedValues = lodash_1.default.keys(lodash_1.default.pickBy(value, (val) => val));
        if (this.isSelectURL && this.templateData && lodash_1.default.every(checkedValues, (val) => this.templateData[val])) {
            const submission = this.root.submission;
            if (!submission.metadata.selectData) {
                submission.metadata.selectData = {};
            }
            const selectData = [];
            checkedValues.forEach((value) => selectData.push(this.templateData[value]));
            lodash_1.default.set(submission.metadata.selectData, this.path, selectData);
        }
        // Ensure that for dataSrc == 'values' that there are not any other superfluous values.
        if (this.component.dataSrc === 'values') {
            for (const key in value) {
                if (!this.component.values.find((val) => val.value === key)) {
                    delete value[key];
                }
            }
        }
        return value;
    }
    /**
     * Set the value of this component.
     * @param {any} value - The value to set.
     * @param {any} flags - Flags to apply to this update.
     * @returns {boolean} - If the value has changed.
     */
    setValue(value, flags = {}) {
        const changed = this.updateValue(value, flags);
        value = this.dataValue;
        if (this.isHtmlRenderMode()) {
            if (changed) {
                this.redraw();
            }
        }
        else {
            lodash_1.default.each(this.refs.input, (input) => {
                if (lodash_1.default.isUndefined(value[input.value])) {
                    value[input.value] = false;
                }
                input.checked = !!value[input.value];
            });
        }
        return changed;
    }
    getValueAsString(value, options = {}) {
        var _a, _b;
        if (!value) {
            return '';
        }
        if (this.isSelectURL) {
            if (options.modalPreview || this.options.readOnly || this.inDataTable) {
                const checkedItems = lodash_1.default.keys(lodash_1.default.pickBy(value, (val) => val));
                if (((_a = this.selectData) === null || _a === void 0 ? void 0 : _a.length) === checkedItems.length) {
                    return this.selectData.map(item => this.itemTemplate(item)).join(', ');
                }
                else if ((_b = this.loadedOptions) === null || _b === void 0 ? void 0 : _b.length) {
                    return this.loadedOptions.filter((option) => value[option.value]).map((option) => option.label).join(', ');
                }
            }
            return (0, lodash_1.default)(value).pickBy((val) => val).keys().join(', ');
        }
        return (0, lodash_1.default)(this.component.values || [])
            .filter((v) => value[v.value])
            .map('label')
            .join(', ');
    }
    setSelectedClasses() {
        if (this.refs.wrapper) {
            //add/remove selected option class
            const value = this.dataValue;
            const valuesKeys = Object.keys(value);
            this.refs.wrapper.forEach((wrapper, index) => {
                let key = valuesKeys[index];
                const input = this.refs.input[index];
                if ((input === null || input === void 0 ? void 0 : input.value.toString()) !== key) {
                    key = valuesKeys.find((k) => (input === null || input === void 0 ? void 0 : input.value.toString()) === k);
                }
                const isChecked = value[key];
                if ((isChecked && key) || (this.isSelectURL && !this.shouldLoad && this.listData && lodash_1.default.findIndex(this.selectData, this.listData[index]) !== -1)) {
                    //add class to container when selected
                    this.addClass(wrapper, this.optionSelectedClass);
                    //change "checked" attribute
                    input.setAttribute('checked', 'true');
                }
                else if (!isChecked && key) {
                    this.removeClass(wrapper, this.optionSelectedClass);
                    input.removeAttribute('checked');
                }
            });
        }
    }
    setInputsDisabled(value, onlyUnchecked) {
        if (this.refs.input) {
            this.refs.input.forEach(item => {
                if (onlyUnchecked && !item.checked || !onlyUnchecked) {
                    item.disabled = value;
                }
            });
        }
    }
    checkComponentValidity(data, dirty, rowData, options, errors = []) {
        const minCount = this.component.validate.minSelectedCount;
        const maxCount = this.component.validate.maxSelectedCount;
        if (!this.shouldSkipValidation(data, rowData, options)) {
            const isValid = this.isValid(data, dirty);
            if ((maxCount || minCount)) {
                const count = Object.keys(this.validationValue).reduce((total, key) => {
                    if (this.validationValue[key]) {
                        total++;
                    }
                    return total;
                }, 0);
                // Disable the rest of inputs if the max amount is already checked
                if (maxCount && count >= maxCount) {
                    this.setInputsDisabled(true, true);
                }
                else if (maxCount && !this.shouldDisabled) {
                    this.setInputsDisabled(false);
                }
                if (!isValid && maxCount && count > maxCount) {
                    const message = this.t(this.component.maxSelectedCountMessage || 'maxSelectItems', { maxCount });
                    this.errors.push({ message });
                    this.setCustomValidity(message, dirty);
                    return false;
                }
                else if (!isValid && minCount && count < minCount) {
                    this.setInputsDisabled(false);
                    const message = this.t(this.component.minSelectedCountMessage || 'minSelectItems', { minCount });
                    this.errors.push({ message });
                    this.setCustomValidity(message, dirty);
                    return false;
                }
            }
        }
        return super.checkComponentValidity(data, dirty, rowData, options, errors);
    }
    setCustomValidity(messages, dirty, external) {
        if (this.options.building && lodash_1.default.find(messages, { ruleName: 'invalidValueProperty' })) {
            setTimeout(() => {
                this.root && (0, utils_1.getComponent)(this.root.components, 'valueProperty').setCustomValidity(messages, dirty);
            }, 0);
            return super.setCustomValidity(lodash_1.default.filter(messages, (message) => message.ruleName !== 'invalidValueProperty'), dirty, external);
        }
        else {
            return super.setCustomValidity(messages, dirty, external);
        }
    }
    validateValueAvailability(setting, value) {
        if (!(0, utils_1.boolValue)(setting) || !value) {
            return true;
        }
        const values = this.component.dataSrc === 'values' ? this.component.values : this.loadedOptions;
        const availableValueKeys = (values || []).map(({ value: optionValue }) => optionValue);
        const valueKeys = Object.keys(value);
        return valueKeys.every((key) => availableValueKeys.includes(key));
    }
}
exports.default = SelectBoxesComponent;
