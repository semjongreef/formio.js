"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const utils_1 = require("../../utils/utils");
const Field_1 = __importDefault(require("../_classes/field/Field"));
class CheckBoxComponent extends Field_1.default {
    static schema(...extend) {
        return Field_1.default.schema({
            type: 'checkbox',
            inputType: 'checkbox',
            label: 'Checkbox',
            key: 'checkbox',
            dataGridLabel: true,
            labelPosition: 'right',
            value: '',
            name: ''
        }, ...extend);
    }
    static get builderInfo() {
        return {
            title: 'Checkbox',
            group: 'basic',
            icon: 'check-square',
            documentation: '/userguide/form-building/form-components#check-box',
            weight: 50,
            schema: CheckBoxComponent.schema()
        };
    }
    static get serverConditionSettings() {
        return CheckBoxComponent.conditionOperatorsSettings;
    }
    static get conditionOperatorsSettings() {
        return Object.assign(Object.assign({}, super.conditionOperatorsSettings), { operators: ['isEqual'], valueComponent() {
                return {
                    valueType: 'boolean',
                    data: {
                        values: [
                            { label: 'Checked', value: 'true' },
                            { label: 'Not Checked', value: 'false' },
                        ]
                    },
                    type: 'select'
                };
            } });
    }
    static savedValueTypes(schema) {
        schema = schema || {};
        const types = (0, utils_1.getComponentSavedTypes)(schema);
        if (lodash_1.default.isArray(types)) {
            return types;
        }
        if (schema.inputType === 'radio') {
            return [utils_1.componentValueTypes.string];
        }
        return [utils_1.componentValueTypes.boolean];
    }
    get defaultSchema() {
        return CheckBoxComponent.schema();
    }
    get labelClass() {
        let className = '';
        if (this.isInputComponent
            && !this.options.inputsOnly
            && this.component.validate
            && this.component.validate.required) {
            className += ' field-required';
        }
        return `${className}`;
    }
    get hasSetValue() {
        return this.hasValue();
    }
    get inputInfo() {
        const info = super.elementInfo();
        info.type = 'input';
        info.changeEvent = 'click';
        info.attr.type = this.component.inputType || 'checkbox';
        info.attr.class = 'form-check-input';
        if (this.component.name) {
            info.attr.name = `data[${this.component.name}]`;
        }
        info.attr.value = this.component.value ? this.component.value : 0;
        info.label = this.t(this.component.label, { _userInput: true });
        info.labelClass = this.labelClass;
        return info;
    }
    get labelInfo() {
        return {
            hidden: true
        };
    }
    render() {
        return super.render(this.renderTemplate('checkbox', {
            input: this.inputInfo,
            checked: this.checked,
            tooltip: this.interpolate(this.t(this.component.tooltip) || '', { _userInput: true }).replace(/(?:\r\n|\r|\n)/g, '<br />')
        }));
    }
    attach(element) {
        this.loadRefs(element, { input: 'multiple' });
        this.input = this.refs.input[0];
        if (this.refs.input) {
            this.addEventListener(this.input, this.inputInfo.changeEvent, () => this.updateValue(null, {
                modified: true
            }));
            this.addShortcut(this.input);
        }
        return super.attach(element);
    }
    detach(element) {
        if (element && this.input) {
            this.removeShortcut(this.input);
        }
        super.detach();
    }
    get emptyValue() {
        return this.component.inputType === 'radio' ? '' : false;
    }
    isEmpty(value = this.dataValue) {
        return super.isEmpty(value) || value === false;
    }
    get key() {
        return this.component.name ? this.component.name : super.key;
    }
    getValueAt(index) {
        if (this.component.name) {
            return this.refs.input[index].checked ? this.component.value : '';
        }
        return !!this.refs.input[index].checked;
    }
    getValue() {
        const value = super.getValue();
        if (this.component.name) {
            return value ? this.setCheckedState(value) : this.setCheckedState(this.dataValue);
        }
        else {
            return (value === '') ? this.dataValue : !!value;
        }
    }
    get checked() {
        if (this.component.name) {
            return (this.dataValue === this.component.value);
        }
        return !!this.dataValue;
    }
    setCheckedState(value) {
        if (!this.input) {
            return;
        }
        if (this.component.name) {
            this.input.value = (value === this.component.value) ? this.component.value : 0;
            this.input.checked = (value === this.component.value) ? 1 : 0;
        }
        else if (value === 'on') {
            this.input.value = 1;
            this.input.checked = 1;
        }
        else if (value === 'off') {
            this.input.value = 0;
            this.input.checked = 0;
        }
        else if (value) {
            this.input.value = 1;
            this.input.checked = 1;
        }
        else {
            this.input.value = 0;
            this.input.checked = 0;
        }
        if (this.input.checked) {
            this.input.setAttribute('checked', true);
        }
        else {
            this.input.removeAttribute('checked');
        }
        return value;
    }
    setValue(value, flags = {}) {
        this.setCheckedState(value);
        return super.setValue(value, flags);
    }
    getValueAsString(value) {
        const { name: componentName, value: componentValue } = this.component;
        const hasValue = componentName ? lodash_1.default.isEqual(value, componentValue) : value;
        if (lodash_1.default.isUndefined(value) && this.inDataTable) {
            return '';
        }
        return this.t(hasValue ? 'yes' : 'no');
    }
    updateValue(value, flags) {
        // If this is a radio and is alredy checked, uncheck it.
        if (this.component.name && flags.modified && (this.dataValue === this.component.value)) {
            this.input.checked = 0;
            this.input.value = 0;
            this.dataValue = '';
            this.updateOnChange(flags, true);
        }
        const changed = super.updateValue(value, flags);
        // Update attributes of the input element
        if (changed && this.input) {
            if (this.input.checked) {
                this.input.setAttribute('checked', 'true');
            }
            else {
                this.input.removeAttribute('checked');
            }
        }
        return changed;
    }
}
exports.default = CheckBoxComponent;
