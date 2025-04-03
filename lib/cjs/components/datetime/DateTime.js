"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const moment_1 = __importDefault(require("moment"));
const utils_1 = __importDefault(require("../../utils"));
const utils_2 = require("../../utils/utils");
const Input_1 = __importDefault(require("../_classes/input/Input"));
class DateTimeComponent extends Input_1.default {
    static schema(...extend) {
        return Input_1.default.schema({
            type: 'datetime',
            label: 'Date / Time',
            key: 'dateTime',
            format: 'yyyy-MM-dd hh:mm a',
            useLocaleSettings: false,
            allowInput: true,
            enableDate: true,
            enableTime: true,
            defaultValue: '',
            defaultDate: '',
            displayInTimezone: 'viewer',
            timezone: '',
            datepickerMode: 'day',
            datePicker: {
                showWeeks: true,
                startingDay: 0,
                initDate: '',
                minMode: 'day',
                maxMode: 'year',
                yearRows: 4,
                yearColumns: 5,
                minDate: null,
                maxDate: null
            },
            timePicker: {
                hourStep: 1,
                minuteStep: 1,
                showMeridian: true,
                readonlyInput: false,
                mousewheel: true,
                arrowkeys: true
            },
            customOptions: {},
        }, ...extend);
    }
    static get builderInfo() {
        return {
            title: 'Date / Time',
            group: 'advanced',
            icon: 'calendar',
            documentation: '/userguide/form-building/advanced-components#date-and-time',
            weight: 40,
            schema: DateTimeComponent.schema()
        };
    }
    static get serverConditionSettings() {
        return DateTimeComponent.conditionOperatorsSettings;
    }
    static get conditionOperatorsSettings() {
        return Object.assign(Object.assign({}, super.conditionOperatorsSettings), { operators: ['isDateEqual', 'isNotDateEqual', 'isEmpty', 'isNotEmpty', 'dateLessThan', 'dateGreaterThan', 'dateLessThanOrEqual', 'dateGreaterThanOrEqual'], valueComponent(classComp) {
                return Object.assign(Object.assign({}, classComp), { type: 'datetime' });
            } });
    }
    static savedValueTypes(schema) {
        schema = schema || {};
        return (0, utils_2.getComponentSavedTypes)(schema) || [utils_2.componentValueTypes.date];
    }
    constructor(component, options, data) {
        super(component, options, data);
        const timezone = (this.component.timezone || this.options.timezone);
        const time24hr = !lodash_1.default.get(this.component, 'timePicker.showMeridian', true);
        // Change the format to map to the settings.
        if (!this.component.enableDate) {
            this.component.format = this.component.format.replace(/yyyy-MM-dd /g, '');
        }
        else if (this.component.enableDate && !/[yMd]/.test(this.component.format) && this.builderMode) {
            this.component.format = `yyyy-MM-dd ${this.component.format}`;
        }
        if (!this.component.enableTime) {
            this.component.format = this.component.format.replace(/ hh:mm a$/g, '');
        }
        else if (this.component.enableTime && !/[mhH]/.test(this.component.format) && this.builderMode) {
            this.component.format = `${this.component.format} hh:mm a`;
        }
        else if (time24hr) {
            this.component.format = this.component.format.replace(/hh:mm a$/g, 'HH:mm');
        }
        else {
            this.component.format = this.component.format.replace(/HH:mm$/g, 'hh:mm a');
        }
        let customOptions = this.component.customOptions || {};
        if (typeof customOptions === 'string') {
            try {
                customOptions = JSON.parse(customOptions);
            }
            catch (err) {
                console.warn(err.message);
                customOptions = {};
            }
        }
        /* eslint-disable camelcase */
        this.component.widget = Object.assign({ type: 'calendar', timezone, displayInTimezone: lodash_1.default.get(this.component, 'displayInTimezone', 'viewer'), locale: this.options.language, useLocaleSettings: lodash_1.default.get(this.component, 'useLocaleSettings', false), allowInput: lodash_1.default.get(this.component, 'allowInput', true), mode: 'single', enableTime: lodash_1.default.get(this.component, 'enableTime', true), noCalendar: !lodash_1.default.get(this.component, 'enableDate', true), format: this.component.format, hourIncrement: lodash_1.default.get(this.component, 'timePicker.hourStep', 1), minuteIncrement: lodash_1.default.get(this.component, 'timePicker.minuteStep', 5), time_24hr: time24hr, readOnly: this.options.readOnly, minDate: lodash_1.default.get(this.component, 'datePicker.minDate'), disabledDates: lodash_1.default.get(this.component, 'datePicker.disable'), disableWeekends: lodash_1.default.get(this.component, 'datePicker.disableWeekends'), disableWeekdays: lodash_1.default.get(this.component, 'datePicker.disableWeekdays'), disableFunction: lodash_1.default.get(this.component, 'datePicker.disableFunction'), maxDate: lodash_1.default.get(this.component, 'datePicker.maxDate') }, customOptions);
        // update originalComponent to include widget and other updated settings
        // it is done here since these settings depend on properties present after the component is initialized
        // originalComponent is used to restore the component (and widget) after evaluating field logic
        this.originalComponent = (0, utils_2.fastCloneDeep)(this.component);
        /* eslint-enable camelcase */
    }
    get defaultSchema() {
        return DateTimeComponent.schema();
    }
    get defaultValue() {
        let defaultValue = super.defaultValue;
        if (!defaultValue && this.component.defaultDate) {
            defaultValue = utils_1.default.getDateSetting(this.component.defaultDate);
            defaultValue = defaultValue ? defaultValue.toISOString() : '';
        }
        return defaultValue;
    }
    get emptyValue() {
        return '';
    }
    get momentFormat() {
        return utils_1.default.convertFormatToMoment(this.component.format);
    }
    isEmpty(value = this.dataValue) {
        if (value && (value.toString() === 'Invalid Date')) {
            return true;
        }
        return super.isEmpty(value);
    }
    formatValue(input) {
        const result = moment_1.default.utc(input).toISOString();
        return result === 'Invalid date' ? input : result;
    }
    isEqual(valueA, valueB = this.dataValue) {
        return (this.isEmpty(valueA) && this.isEmpty(valueB))
            || moment_1.default.utc(valueA).format(this.momentFormat) === moment_1.default.utc(valueB).format(this.momentFormat);
    }
    createWrapper() {
        return false;
    }
    checkValidity(data, dirty, rowData) {
        if (this.refs.input) {
            this.refs.input.forEach((input) => {
                if (input.widget && input.widget.enteredDate) {
                    dirty = true;
                }
            });
        }
        return super.checkValidity(data, dirty, rowData);
    }
    getValueAsString(value, options) {
        let format = utils_1.default.convertFormatToMoment(this.component.format);
        format += format.match(/z$/) ? '' : ' z';
        const timezone = this.timezone;
        if (value && !this.attached && timezone) {
            if (Array.isArray(value) && this.component.multiple) {
                return value.map(item => lodash_1.default.trim(utils_1.default.momentDate(item, format, timezone, options).format(format))).join(', ');
            }
            return lodash_1.default.trim(utils_1.default.momentDate(value, format, timezone, options).format(format));
        }
        if (Array.isArray(value) && this.component.multiple) {
            return value.map(item => lodash_1.default.trim((0, moment_1.default)(item).format(format))).join(', ');
        }
        return (value ? lodash_1.default.trim((0, moment_1.default)(value).format(format)) : value) || '';
    }
}
exports.default = DateTimeComponent;
