"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Formio_1 = require("../Formio");
const InputWidget_1 = __importDefault(require("./InputWidget"));
const utils_1 = require("../utils/utils");
const moment_1 = __importDefault(require("moment"));
const lodash_1 = __importDefault(require("lodash"));
const DEFAULT_FORMAT = 'yyyy-MM-dd hh:mm a';
const ISO_8601_FORMAT = 'yyyy-MM-ddTHH:mm:ssZ';
const isIEBrowser = (0, utils_1.getBrowserInfo)().ie;
class CalendarWidget extends InputWidget_1.default {
    /* eslint-disable camelcase */
    static get defaultSettings() {
        return {
            type: 'calendar',
            altInput: true,
            allowInput: true,
            clickOpens: true,
            enableDate: true,
            enableTime: true,
            mode: 'single',
            noCalendar: false,
            format: DEFAULT_FORMAT,
            dateFormat: ISO_8601_FORMAT,
            useLocaleSettings: false,
            language: 'us-en',
            hourIncrement: 1,
            minuteIncrement: 5,
            time_24hr: false,
            saveAs: 'date',
            displayInTimezone: '',
            timezone: '',
            disable: [],
            minDate: '',
            maxDate: ''
        };
    }
    /* eslint-enable camelcase */
    constructor(settings, component, instance, index) {
        super(settings, component, instance, index);
        // Change the format to map to the settings.
        if (this.settings.noCalendar) {
            this.settings.format = this.settings.format.replace(/yyyy-MM-dd /g, '');
        }
        if (!this.settings.enableTime) {
            this.settings.format = this.settings.format.replace(/ hh:mm a$/g, '');
        }
        else if (this.settings.time_24hr) {
            this.settings.format = this.settings.format.replace(/hh:mm a$/g, 'HH:mm');
        }
        this.zoneLoading = false;
        this.timezonesUrl = `${Formio_1.Formio.cdn['moment-timezone']}/data/packed/latest.json`;
    }
    /**
     * Load the timezones.
     * @returns {boolean} TRUE if the zones are loading, FALSE otherwise.
     */
    loadZones() {
        const timezone = this.timezone;
        if (this.zoneLoading) {
            return true;
        }
        if (!(0, utils_1.zonesLoaded)() && (0, utils_1.shouldLoadZones)(timezone)) {
            this.zoneLoading = true;
            (0, utils_1.loadZones)(this.timezonesUrl, timezone).then(() => {
                this.zoneLoading = false;
                this.emit('redraw');
            });
            // Return zones are loading.
            return true;
        }
        // Zones are already loaded.
        return false;
    }
    attach(input) {
        var _a;
        const superAttach = super.attach(input);
        const dateFormatInfo = (0, utils_1.getLocaleDateFormatInfo)(this.settings.language);
        this.defaultFormat = {
            date: dateFormatInfo.dayFirst ? 'd/m/Y ' : 'm/d/Y ',
            time: 'G:i K'
        };
        this.closedOn = 0;
        this.valueFormat = (this.settings.saveAs === 'date') ? ISO_8601_FORMAT : this.settings.dateFormat || ISO_8601_FORMAT;
        this.valueMomentFormat = (0, utils_1.convertFormatToMoment)(this.valueFormat);
        const isReadOnly = this.settings.readOnly;
        this.settings.minDate = isReadOnly ? null : (0, utils_1.getDateSetting)(this.settings.minDate);
        this.settings.maxDate = isReadOnly ? null : (0, utils_1.getDateSetting)(this.settings.maxDate);
        this.settings.disable = this.disabledDates;
        this.settings.disableWeekends ? this.settings.disable.push(this.disableWeekends) : '';
        this.settings.disableWeekdays ? this.settings.disable.push(this.disableWeekdays) : '';
        this.settings.disableFunction ? this.settings.disable.push(this.disableFunction) : '';
        this.settings.manualInputValue = '';
        this.settings.isManuallyOverriddenValue = false;
        this.settings.currentValue = '';
        this.settings.altFormat = (0, utils_1.convertFormatToFlatpickr)(this.settings.format);
        this.settings.dateFormat = (0, utils_1.convertFormatToFlatpickr)(this.settings.dateFormat);
        this.settings.position = 'auto center';
        this.settings.onChange = () => {
            if (this.settings.allowInput && this.settings.enableTime) {
                this.calendar._input.value = this.settings.isManuallyOverriddenValue ? this.settings.manualInputValue : this.calendar.altInput.value;
            }
            this.emit('update');
        };
        this.settings.onOpen = () => this.hook('onCalendarOpen');
        this.settings.onClose = () => {
            this.hook('onCalendarClose');
            this.closedOn = Date.now();
            if (this.settings.allowInput && this.settings.enableTime) {
                this.calendar._input.value = this.settings.isManuallyOverriddenValue ? this.settings.manualInputValue : this.calendar.altInput.value;
                this.emit('update');
            }
            if (this.calendar) {
                this.emit('blur');
            }
        };
        Formio_1.Formio.requireLibrary('flatpickr-css', 'flatpickr', [
            { type: 'styles', src: `${Formio_1.Formio.cdn['flatpickr']}/flatpickr.min.css` }
        ], true);
        if (this.component.shortcutButtons) {
            this.component.shortcutButtons = this.component.shortcutButtons.filter((btn) => btn.label && btn.onClick);
        }
        if ((_a = this.component.shortcutButtons) === null || _a === void 0 ? void 0 : _a.length) {
            Formio_1.Formio.requireLibrary('shortcut-buttons-flatpickr-css', 'ShortcutButtonsPlugin', [
                { type: 'styles', src: `${Formio_1.Formio.cdn['shortcut-buttons-flatpickr']}/themes/light.min.css` }
            ], true);
        }
        return superAttach
            .then(() => {
            var _a;
            if ((_a = this.component.shortcutButtons) === null || _a === void 0 ? void 0 : _a.length) {
                return Formio_1.Formio.requireLibrary('shortcut-buttons-flatpickr', 'ShortcutButtonsPlugin', `${Formio_1.Formio.cdn['shortcut-buttons-flatpickr']}/shortcut-buttons-flatpickr.min.js`, true);
            }
        })
            .then((ShortcutButtonsPlugin) => {
            return Formio_1.Formio.requireLibrary('flatpickr', 'flatpickr', `${Formio_1.Formio.cdn['flatpickr']}/flatpickr.min.js`, true)
                .then((Flatpickr) => {
                var _a;
                if (((_a = this.component.shortcutButtons) === null || _a === void 0 ? void 0 : _a.length) && ShortcutButtonsPlugin) {
                    this.initShortcutButtonsPlugin(ShortcutButtonsPlugin);
                }
                this.settings.formatDate = this.getFlatpickrFormatDate(Flatpickr);
                if (this._input) {
                    const { locale } = this.settings;
                    if (locale && locale.length >= 2 && locale !== 'en') {
                        return Formio_1.Formio.requireLibrary(`flatpickr-${locale}`, `flatpickr.l10ns.${locale}`, `${Formio_1.Formio.cdn['flatpickr']}/l10n/${locale}.js`, true).then(() => this.initFlatpickr(Flatpickr));
                    }
                    else {
                        this.initFlatpickr(Flatpickr);
                    }
                }
            });
        })
            .catch((err) => {
            console.warn(err);
        });
    }
    get disableWeekends() {
        return function (date) {
            return (date.getDay() === 0 || date.getDay() === 6);
        };
    }
    get disableWeekdays() {
        return (date) => !this.disableWeekends(date);
    }
    get disableFunction() {
        return (date) => this.evaluate(`return ${this.settings.disableFunction}`, {
            date
        });
    }
    get timezone() {
        return this.componentInstance.getTimezone(this.settings);
    }
    get defaultSettings() {
        return CalendarWidget.defaultSettings;
    }
    addSuffix(suffix) {
        this.addEventListener(suffix, 'click', () => {
            setTimeout(() => {
                if (this.calendar) {
                    if (!this.calendar.isOpen && ((Date.now() - this.closedOn) > 200)) {
                        this.calendar.open();
                    }
                    else if (this.calendar.isOpen) {
                        this.calendar.close();
                    }
                }
            }, 0);
        });
        return suffix;
    }
    set disabled(disabled) {
        super.disabled = disabled;
        if (this.calendar) {
            if (disabled) {
                this.calendar._input.setAttribute('disabled', 'disabled');
            }
            else {
                this.calendar._input.removeAttribute('disabled');
            }
            this.calendar.close();
            this.calendar.redraw();
        }
    }
    get input() {
        return this.calendar ? this.calendar.altInput : null;
    }
    get disabledDates() {
        if (this.settings.disabledDates) {
            const disabledDates = this.settings.disabledDates.split(',');
            return disabledDates.map((item) => {
                const dateMask = /\d{4}-\d{2}-\d{2}/g;
                const dates = item.match(dateMask);
                if (dates && dates.length) {
                    return dates.length === 1 ? item.match(dateMask)[0] : {
                        from: item.match(dateMask)[0],
                        to: item.match(dateMask)[1],
                    };
                }
            });
        }
        return [];
    }
    get localeFormat() {
        let format = '';
        if (this.settings.enableDate) {
            format += this.defaultFormat.date;
        }
        if (this.settings.enableTime) {
            format += this.defaultFormat.time;
        }
        return format;
    }
    get dateTimeFormat() {
        return this.settings.useLocaleSettings ? this.localeFormat : (0, utils_1.convertFormatToFlatpickr)(this.dateFormat);
    }
    get dateFormat() {
        return lodash_1.default.get(this.settings, 'format', DEFAULT_FORMAT);
    }
    /**
     * Return the date value as a string.
     * @param {string|Date} date - The date object or a date string that is momentjs compatible.
     * @param {string} format - The DateParser code format.
     * @param {boolean} [useTimezone] - If the timezone should be used.
     * @returns {string} - Returns the formatted date string.
     */
    getDateValue(date, format, useTimezone) {
        if (useTimezone) {
            return (0, utils_1.momentDate)(date, this.valueFormat, this.timezone).format((0, utils_1.convertFormatToMoment)(format));
        }
        return (0, moment_1.default)(date).format((0, utils_1.convertFormatToMoment)(format));
    }
    /**
     * Return the value of the selected date.
     * @returns {*} - The value of the selected date.
     */
    getValue() {
        // Standard output format.
        if (!this.calendar) {
            return super.getValue();
        }
        // Get the selected dates from the calendar widget.
        const dates = this.calendar.selectedDates;
        if (!dates || !dates.length) {
            return super.getValue();
        }
        if (!(dates[0] instanceof Date)) {
            return 'Invalid Date';
        }
        return this.getDateValue(dates[0], this.valueFormat, (this.settings.saveAs === 'date'));
    }
    isValueISO8601(value) {
        return value && (typeof value === 'string') && value.match(/-[0-9]{2}T[0-9]{2}:/);
    }
    /**
     * Set the selected date value.
     * @param {*} value - The value to set.
     * @returns {void}
     */
    setValue(value) {
        const saveAsText = (this.settings.saveAs === 'text');
        if (!this.calendar) {
            value = value ? (0, utils_1.formatDate)(this.timezonesUrl, value, (0, utils_1.convertFormatToMoment)(this.settings.format), this.timezone, (0, utils_1.convertFormatToMoment)(this.valueMomentFormat)) : value;
            return super.setValue(value);
        }
        const zonesLoading = this.loadZones();
        if (value) {
            if (!saveAsText && this.settings.readOnly && !zonesLoading) {
                this.calendar.setDate((0, utils_1.momentDate)(value, this.valueFormat, this.timezone).format(), false);
            }
            else if (this.isValueISO8601(value)) {
                this.calendar.setDate(value, false);
            }
            else {
                this.calendar.setDate((0, moment_1.default)(value, this.valueMomentFormat).toDate(), false);
            }
        }
        else {
            this.calendar.clear(false);
        }
    }
    getValueAsString(value, format) {
        const inputFormat = format || this.dateFormat;
        const valueFormat = this.calendar ? this.valueFormat : this.settings.dateFormat;
        if (this.settings.saveAs === 'text' && this.componentInstance.parent && !this.settings.readOnly) {
            return (0, moment_1.default)(value, (0, utils_1.convertFormatToMoment)(valueFormat)).format((0, utils_1.convertFormatToMoment)(valueFormat));
        }
        return (0, utils_1.formatDate)(this.timezonesUrl, value, inputFormat, this.timezone, (0, utils_1.convertFormatToMoment)(valueFormat));
    }
    setErrorClasses(hasErrors) {
        if (!this.input) {
            return;
        }
        if (hasErrors) {
            this.addClass(this.input, 'is-invalid');
            this.input.setAttribute('aria-invalid', 'true');
        }
        else {
            this.removeClass(this.input, 'is-invalid');
            this.input.setAttribute('aria-invalid', 'false');
        }
    }
    get validationValue() {
        const value = this.dataValue;
        if (typeof value === 'string') {
            return new Date(value);
        }
        return value.map(val => new Date(val));
    }
    isCalendarElement(element) {
        var _a, _b, _c, _d, _e;
        if (!element) {
            return true;
        }
        if ((_c = (_b = (_a = this.calendar) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.appendTo) === null || _c === void 0 ? void 0 : _c.contains(element)) {
            return true;
        }
        return (_e = (_d = this.calendar) === null || _d === void 0 ? void 0 : _d.calendarContainer) === null || _e === void 0 ? void 0 : _e.contains(element);
    }
    initFlatpickr(Flatpickr) {
        // Create a new flatpickr.
        this.calendar = new Flatpickr(this._input, Object.assign(Object.assign({}, this.settings), { disableMobile: true }));
        this.addEventListener(this.calendar.altInput, 'input', (event) => {
            if (this.settings.allowInput && this.settings.currentValue !== event.target.value) {
                if (event.target.mask) {
                    event.target.mask.textMaskInputElement.update();
                }
                this.settings.manualInputValue = event.target.value;
                this._input.value = this.settings.manualInputValue;
                this.settings.isManuallyOverriddenValue = true;
                this.settings.currentValue = event.target.value;
                this.emit('update');
            }
        });
        if (this.calendar.daysContainer) {
            this.calendar.daysContainer.addEventListener('click', () => {
                this.settings.isManuallyOverriddenValue = false;
                this.calendar.updateValue(false);
            });
        }
        if (this.calendar.timeContainer) {
            this.calendar.timeContainer.addEventListener('click', () => {
                this.settings.isManuallyOverriddenValue = false;
                this.calendar.updateValue(false);
            });
        }
        const excludedFromMaskFormats = ['MMMM'];
        if (!this.settings.readOnly && !lodash_1.default.some(excludedFromMaskFormats, format => lodash_1.default.includes(this.settings.format, format))) {
            // Enforce the input mask of the format.
            this.setInputMask(this.calendar._input, (0, utils_1.convertFormatToMask)(this.settings.format));
        }
        // Fixes an issue with IE11 where value is set only after the second click
        // TODO: Remove when the issue is solved in the flatpickr library
        if (isIEBrowser) {
            // Remove the original blur listener, because value will be set to empty since relatedTarget is null in IE11
            const originalBlurListener = this.calendar._handlers.find(({ event, element }) => event === 'blur' && element === this.calendar._input);
            this.calendar._input.removeEventListener('blur', originalBlurListener.handler);
            // Add the same event listener as in the original library, but with workaround for IE11 issue
            this.addEventListener(this.calendar._input, 'blur', (event) => {
                const activeElement = this.settings.shadowRoot ? this.settings.shadowRoot.activeElement : document.activeElement;
                const relatedTarget = event.relatedTarget ? event.relatedTarget : activeElement;
                const isInput = event.target === this.calendar._input;
                if (isInput && !this.isCalendarElement(relatedTarget)) {
                    this.calendar.setDate(this.calendar._input.value, true, event.target === this.calendar.altInput
                        ? this.calendar.config.altFormat
                        : this.calendar.config.dateFormat);
                }
            });
        }
        // Make sure we commit the value after a blur event occurs.
        this.addEventListener(this.calendar._input, 'blur', (event) => {
            var _a, _b, _c, _d;
            // If we have manually overridden the value then we shouldn't call setDate because this will fill the input mask
            if (this.settings.isManuallyOverriddenValue) {
                return;
            }
            const activeElement = this.settings.shadowRoot ? this.settings.shadowRoot.activeElement : document.activeElement;
            const relatedTarget = event.relatedTarget ? event.relatedTarget : activeElement;
            if (!(isIEBrowser && !relatedTarget) && !this.isCalendarElement(relatedTarget)) {
                const inputValue = this.calendar.input.value;
                const dateValue = inputValue ? (0, moment_1.default)(this.calendar.input.value, (0, utils_1.convertFormatToMoment)(this.valueFormat)).toDate() : inputValue;
                this.calendar.setDate(dateValue, true, this.settings.altFormat);
            }
            else if (!this.calendar.input.value && this.calendar.config.noCalendar) {
                const value = (0, moment_1.default)({ hour: (_b = (_a = this.calendar) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.defaultHour, minute: (_d = (_c = this.calendar) === null || _c === void 0 ? void 0 : _c.config) === null || _d === void 0 ? void 0 : _d.defaultMinute }).toDate();
                this.calendar.setDate(value, true, this.settings.format);
            }
        });
        // FJS-1103: When hit the enter button, the field not saving the year correctly
        this.addEventListener(this.calendar.altInput, 'keydown', (event) => {
            if (event.keyCode === 13) {
                if (this.calendar.isOpen) {
                    this.calendar.close();
                    event.stopPropagation();
                }
            }
        });
        // If other fields are used to calculate disabled dates, we need to redraw calendar to refresh disabled dates
        if (this.settings.disableFunction && this.componentInstance && this.componentInstance.root) {
            this.componentInstance.root.on('change', (e) => {
                if (e.changed && this.calendar) {
                    this.calendar.redraw();
                }
            });
        }
        // Restore the calendar value from the component value.
        this.setValue(this.componentValue);
    }
    initShortcutButtonsPlugin(ShortcutButtonsPlugin) {
        this.settings.plugins = [
            // eslint-disable-next-line new-cap
            ShortcutButtonsPlugin({
                button: this.component.shortcutButtons.map((btn) => ({ label: btn.label, attributes: btn.attribute })),
                onClick: (index) => {
                    const getValue = this.component.shortcutButtons[index].onClick;
                    const date = this.evaluate(getValue, { date: new Date() }, 'date');
                    this.calendar.setDate(date, true);
                }
            })
        ];
    }
    get componentValue() {
        let compValue = this.componentInstance.dataValue;
        if (Array.isArray(compValue)) {
            compValue = compValue[this.valueIndex];
        }
        return compValue;
    }
    getFlatpickrFormatDate(Flatpickr) {
        return (date, format) => {
            // Only format this if this is the altFormat and the form is readOnly.
            if (this.settings.readOnly && (format === this.settings.altFormat)) {
                if (!this.settings.enableTime || this.loadZones()) {
                    return Flatpickr.formatDate(date, format);
                }
                const currentValue = new Date(this.getValue());
                if (currentValue.toString() === date.toString()) {
                    return (0, utils_1.formatOffset)(this.timezonesUrl, Flatpickr.formatDate.bind(Flatpickr), new Date(this.componentValue), format, this.timezone);
                }
                return (0, utils_1.formatOffset)(this.timezonesUrl, Flatpickr.formatDate.bind(Flatpickr), date, format, this.timezone);
            }
            return Flatpickr.formatDate(date, format);
        };
    }
    destroy(all = false) {
        if (this.calendar) {
            this.calendar.destroy();
        }
        super.destroy(all);
    }
}
exports.default = CalendarWidget;
