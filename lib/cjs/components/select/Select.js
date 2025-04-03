"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const Formio_1 = require("../../Formio");
const ListComponent_1 = __importDefault(require("../_classes/list/ListComponent"));
const Form_1 = __importDefault(require("../../Form"));
const utils_1 = require("../../utils/utils");
const ChoicesWrapper_1 = __importDefault(require("../../utils/ChoicesWrapper"));
class SelectComponent extends ListComponent_1.default {
    static schema(...extend) {
        return ListComponent_1.default.schema({
            type: 'select',
            label: 'Select',
            key: 'select',
            idPath: 'id',
            data: {
                values: [{ label: '', value: '' }],
                json: '',
                url: '',
                resource: '',
                custom: ''
            },
            clearOnRefresh: false,
            limit: 100,
            valueProperty: '',
            lazyLoad: true,
            filter: '',
            searchEnabled: true,
            searchDebounce: 0.3,
            searchField: '',
            minSearch: 0,
            readOnlyValue: false,
            selectFields: '',
            selectThreshold: 0.3,
            uniqueOptions: false,
            tableView: true,
            fuseOptions: {
                include: 'score',
                threshold: 0.3,
            },
            indexeddb: {
                filter: {}
            },
            customOptions: {},
            useExactSearch: false,
        }, ...extend);
    }
    static get builderInfo() {
        return {
            title: 'Select',
            group: 'basic',
            icon: 'th-list',
            weight: 70,
            documentation: '/userguide/form-building/form-components#select',
            schema: SelectComponent.schema()
        };
    }
    static get serverConditionSettings() {
        return SelectComponent.conditionOperatorsSettings;
    }
    static get conditionOperatorsSettings() {
        const numberType = () => ({ type: 'number' });
        return Object.assign(Object.assign({}, super.conditionOperatorsSettings), { valueComponent(classComp) {
                const valueComp = Object.assign(Object.assign({}, classComp), { type: 'select' });
                if ((0, utils_1.isSelectResourceWithObjectValue)(classComp)) {
                    valueComp.reference = false;
                    valueComp.onSetItems = `
            var templateKeys = utils.getItemTemplateKeys(component.template) || [];
            items = _.map(items || [], i => {
              var item = {};
              _.each(templateKeys, k =>  _.set(item, k, _.get(i, k)));
              return item;
            })
          `;
                }
                return valueComp;
            }, dataTypeOperators: {
                number: ['lessThan', 'greaterThan', 'lessThanOrEqual', 'greaterThanOrEqual'],
            }, dataTypeValueComponents: {
                number: {
                    lessThan: numberType,
                    greaterThan: numberType,
                    lessThanOrEqual: numberType,
                    greaterThanOrEqual: numberType,
                },
            } });
    }
    static savedValueTypes(schema) {
        const { boolean, string, number, object, array } = utils_1.componentValueTypes;
        const { dataType, reference } = schema;
        const types = (0, utils_1.getComponentSavedTypes)(schema);
        if (types) {
            return types;
        }
        if (reference) {
            return [object];
        }
        if (dataType === 'object') {
            return [object, array];
        }
        if (utils_1.componentValueTypes[dataType]) {
            return [utils_1.componentValueTypes[dataType]];
        }
        return [boolean, string, number, object, array];
    }
    init() {
        super.init();
        this.templateData = {};
        // Trigger an update.
        let updateArgs = [];
        const triggerUpdate = lodash_1.default.debounce((...args) => {
            updateArgs = [];
            return this.updateItems.apply(this, args);
        }, 100);
        this.triggerUpdate = (...args) => {
            // Make sure we always resolve the previous promise before reassign it
            if (typeof this.itemsLoadedResolve === 'function') {
                this.itemsLoadedResolve();
            }
            this.itemsLoaded = new Promise((resolve) => {
                this.itemsLoadedResolve = resolve;
            });
            if (args.length) {
                updateArgs = args;
            }
            return triggerUpdate(...updateArgs);
        };
        // Keep track of the select options.
        this.selectOptions = [];
        if (this.itemsFromUrl) {
            this.isFromSearch = false;
            this.searchServerCount = null;
            this.defaultServerCount = null;
            this.isScrollLoading = false;
            this.searchDownloadedResources = [];
            this.defaultDownloadedResources = [];
        }
        // If this component has been activated.//
        this.activated = false;
        this.itemsLoaded = new Promise((resolve) => {
            this.itemsLoadedResolve = resolve;
        });
        this.shouldPositionDropdown = this.hasDataGridAncestor();
        if (this.isHtmlRenderMode()) {
            this.activate();
        }
        // Get the template keys for this select component.
        this.getTemplateKeys();
    }
    get defaultSchema() {
        return SelectComponent.schema();
    }
    get emptyValue() {
        if (this.component.multiple) {
            return [];
        }
        // if select has JSON data source type, we are defining if empty value would be an object or a string by checking JSON's first item
        if (this.component.dataSrc === 'json' && this.component.data.json) {
            const firstItem = this.component.data.json[0];
            let firstValue;
            if (this.valueProperty) {
                firstValue = lodash_1.default.get(firstItem, this.valueProperty);
            }
            else {
                firstValue = firstItem;
            }
            if (firstValue && typeof firstValue === 'string') {
                return '';
            }
            else {
                return {};
            }
        }
        if (this.valueProperty) {
            return '';
        }
        return {};
    }
    get valueProperty() {
        if (this.component.valueProperty) {
            return this.component.valueProperty;
        }
        // Force values datasource to use values without actually setting it on the component settings.
        if (this.component.dataSrc === 'values') {
            return 'value';
        }
        return '';
    }
    get inputInfo() {
        const info = super.elementInfo();
        info.type = 'select';
        info.changeEvent = 'change';
        return info;
    }
    get isSelectResource() {
        return this.component.dataSrc === 'resource';
    }
    get itemsFromUrl() {
        return this.isSelectResource || this.isSelectURL;
    }
    get isInfiniteScrollProvided() {
        return this.itemsFromUrl;
    }
    get shouldDisabled() {
        return super.shouldDisabled || this.parentDisabled;
    }
    get shouldInitialLoad() {
        if (this.component.widget === 'html5' &&
            this.isEntireObjectDisplay() &&
            this.component.searchField &&
            this.dataValue) {
            return false;
        }
        return super.shouldLoad;
    }
    get selectMetadata() {
        return super.selectData;
    }
    get selectData() {
        return this.selectMetadata || this.component.selectData;
    }
    isEntireObjectDisplay() {
        return this.component.dataSrc === 'resource' && this.valueProperty === 'data';
    }
    selectValueAndLabel(data) {
        const value = this.getOptionValue((this.isEntireObjectDisplay() && !this.itemValue(data)) ? data : this.itemValue(data));
        return {
            value,
            label: this.itemTemplate((this.isEntireObjectDisplay() && !lodash_1.default.isObject(data.data)) ? { data: data } : data, value)
        };
    }
    itemTemplate(data, value) {
        if (!lodash_1.default.isNumber(data) && lodash_1.default.isEmpty(data)) {
            return '';
        }
        // If they wish to show the value in read only mode, then just return the itemValue here.
        if (this.options.readOnly && this.component.readOnlyValue) {
            return this.itemValue(data);
        }
        // Perform a fast interpretation if we should not use the template.
        if (data && !this.component.template) {
            const itemLabel = data.label || data;
            const value = (typeof itemLabel === 'string') ? this.t(itemLabel, { _userInput: true }) : itemLabel;
            return this.sanitize(value, this.shouldSanitizeValue);
        }
        // Inside DataTable component won't have dataValue set
        const shouldUseSelectData = (this.component.multiple && lodash_1.default.isArray(this.dataValue)
            ? this.dataValue.find((val) => this.normalizeSingleValue(value) === val)
            : (this.dataValue === this.normalizeSingleValue(value))) || this.inDataTable;
        if (shouldUseSelectData) {
            const selectData = this.selectData;
            if (selectData) {
                const templateValue = this.component.reference && (value === null || value === void 0 ? void 0 : value._id) ? value._id.toString() : value;
                if (!this.templateData || !this.templateData[templateValue]) {
                    this.getOptionTemplate(data, value);
                }
                if (this.component.multiple) {
                    if (selectData[templateValue]) {
                        data = selectData[templateValue];
                    }
                }
                else {
                    data = selectData;
                }
            }
        }
        if (typeof data === 'string' || typeof data === 'number') {
            return this.sanitize(this.t(data, { _userInput: true }), this.shouldSanitizeValue);
        }
        if (Array.isArray(data)) {
            return data.map((val) => {
                if (typeof val === 'string' || typeof val === 'number') {
                    return this.sanitize(this.t(val, { _userInput: true }), this.shouldSanitizeValue);
                }
                return val;
            });
        }
        if (data.data) {
            // checking additional fields in the template for the selected Entire Object option
            const hasNestedFields = /item\.data\.\w*/g.test(this.component.template);
            data.data = this.isEntireObjectDisplay() && lodash_1.default.isObject(data.data) && !hasNestedFields
                ? JSON.stringify(data.data)
                : data.data;
        }
        return super.itemTemplate(data, value);
    }
    /**
     * Adds an option to the select dropdown.
     * @param {*} value - The value of the new option.
     * @param {string} label - The label of the new option.
     * @param {object} [attrs] - Additional value attributes. Defaults to {}.
     * @param {string} [id] - An id. Defaults to a random string.
     */
    addOption(value, label, attrs = {}, id = (0, utils_1.getRandomComponentId)()) {
        if (lodash_1.default.isNil(label))
            return;
        const idPath = this.component.idPath
            ? this.component.idPath.split('.').reduceRight((obj, key) => ({ [key]: obj }), id)
            : {};
        const option = Object.assign({ value: this.getOptionValue(value), label }, idPath);
        const skipOption = this.component.uniqueOptions
            ? !!this.selectOptions.find((selectOption) => lodash_1.default.isEqual(selectOption.value, option.value))
            : false;
        if (skipOption) {
            return;
        }
        if (value) {
            this.selectOptions.push(option);
        }
        if (this.refs.selectContainer && (this.component.widget === 'html5')) {
            // Replace an empty Object value to an empty String.
            if (option.value && lodash_1.default.isObject(option.value) && lodash_1.default.isEmpty(option.value)) {
                option.value = '';
            }
            // Add element to option so we can reference it later.
            const div = document.createElement('div');
            div.innerHTML = this.sanitize(this.renderTemplate('selectOption', {
                selected: lodash_1.default.isEqual(this.getOptionValue(this.dataValue), option.value),
                option,
                attrs,
                id,
                useId: (this.valueProperty === '' || this.isEntireObjectDisplay()) && lodash_1.default.isObject(value) && id,
            }), this.shouldSanitizeValue).trim();
            option.element = div.firstChild;
            this.refs.selectContainer.appendChild(option.element);
        }
    }
    addValueOptions(items) {
        items = items || [];
        let added = false;
        let data = this.dataValue;
        // preset submission value with value property before request.
        if (this.options.pdf && !items.length && this.component.dataSrc === 'url' && this.valueProperty) {
            data = Array.isArray(data)
                ? data.map(item => lodash_1.default.set({}, this.valueProperty, item))
                : lodash_1.default.set({}, this.valueProperty, data);
        }
        if (!this.selectOptions.length) {
            // Add the currently selected choices if they don't already exist.
            const currentChoices = Array.isArray(data) && this.component.multiple ? data : [data];
            added = this.addCurrentChoices(currentChoices, items);
            if (!added && !this.component.multiple) {
                this.addPlaceholder();
            }
        }
        return added;
    }
    disableInfiniteScroll() {
        if (!this.downloadedResources) {
            return;
        }
        this.downloadedResources.serverCount = this.downloadedResources.length;
        this.serverCount = this.downloadedResources.length;
    }
    /* eslint-disable max-statements */
    setItems(items, fromSearch) {
        var _a, _b;
        this.selectItems = items;
        // If the items is a string, then parse as JSON.
        if (typeof items == 'string') {
            try {
                items = JSON.parse(items);
            }
            catch (err) {
                console.warn(err.message);
                items = [];
            }
        }
        // Allow js processing (needed for form builder)
        if (this.component.onSetItems) {
            const newItems = typeof this.component.onSetItems === 'function'
                ? this.component.onSetItems(this, items)
                : this.evaluate(this.component.onSetItems, { items: items }, 'items');
            if (newItems) {
                items = newItems;
            }
        }
        if (!this.choices && this.refs.selectContainer) {
            this.empty(this.refs.selectContainer);
        }
        // If they provided select values, then we need to get them instead.
        if (this.component.selectValues) {
            items = lodash_1.default.get(items, this.component.selectValues, items) || [];
        }
        let areItemsEqual;
        if (this.itemsFromUrl) {
            areItemsEqual = this.isSelectURL ? lodash_1.default.isEqual(items, this.downloadedResources) : false;
            const areItemsEnded = this.component.limit > items.length;
            const areItemsDownloaded = areItemsEqual
                && this.downloadedResources
                && this.downloadedResources.length === items.length;
            if (areItemsEnded) {
                this.disableInfiniteScroll();
            }
            else if (areItemsDownloaded) {
                this.selectOptions = [];
            }
            else {
                this.serverCount = items.serverCount;
            }
        }
        if (this.isScrollLoading && items) {
            if (!areItemsEqual) {
                this.downloadedResources = this.downloadedResources
                    ? this.downloadedResources.concat(items)
                    : items;
            }
            this.downloadedResources.serverCount = items.serverCount || this.downloadedResources.serverCount;
        }
        else {
            this.downloadedResources = items || [];
            this.selectOptions = [];
            // If there is new select option with same id as already selected, set the new one
            if (!lodash_1.default.isEmpty(this.dataValue) && this.component.idPath) {
                const selectedOptionId = lodash_1.default.get(this.dataValue, this.component.idPath, null);
                const newOptionWithSameId = !lodash_1.default.isNil(selectedOptionId) && items.find(item => {
                    const itemId = lodash_1.default.get(item, this.component.idPath);
                    return itemId === selectedOptionId;
                });
                if (newOptionWithSameId) {
                    this.setValue(newOptionWithSameId);
                }
            }
        }
        // Add the value options.
        if (!fromSearch) {
            this.addValueOptions(items);
        }
        if (this.component.widget === 'html5' && !this.component.placeholder) {
            this.addOption(null, '');
        }
        // Iterate through each of the items.
        lodash_1.default.each(items, (item, index) => {
            // preventing references of the components inside the form to the parent form when building forms
            if (this.root && this.root.options.editForm && this.root.options.editForm._id && this.root.options.editForm._id === item._id)
                return;
            const itemValueAndLabel = this.selectValueAndLabel(item);
            this.addOption(itemValueAndLabel.value, itemValueAndLabel.label, {}, lodash_1.default.get(item, this.component.idPath, String(index)));
        });
        if (this.choices) {
            this.choices.setChoices(this.selectOptions, 'value', 'label', true);
        }
        else if (this.loading) {
            // Re-attach select input.
            // this.appendTo(this.refs.input[0], this.selectContainer);
        }
        // We are no longer loading.
        this.isScrollLoading = false;
        this.loading = false;
        const searching = fromSearch && ((_b = (_a = this.choices) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.isFocussed);
        if (!searching) {
            // If a value is provided, then select it.
            if (!this.isEmpty() || this.isRemoveButtonPressed) {
                this.setValue(this.dataValue, {
                    noUpdateEvent: true
                });
            }
            else if (this.shouldAddDefaultValue && !this.options.readOnly) {
                // If a default value is provided then select it.
                const defaultValue = this.defaultValue;
                if (!this.isEmpty(defaultValue)) {
                    this.setValue(defaultValue);
                }
            }
        }
        // Say we are done loading the items.
        this.itemsLoadedResolve();
    }
    getSingleItemValueForHTMLMode(data) {
        var _a;
        const option = (_a = this.selectOptions) === null || _a === void 0 ? void 0 : _a.find(({ value }) => lodash_1.default.isEqual(value, data));
        if (option) {
            return option.label || data;
        }
        return data;
    }
    itemValueForHTMLMode(value) {
        if (!this.isHtmlRenderMode()) {
            return super.itemValueForHTMLMode(value);
        }
        if (Array.isArray(value)) {
            const values = value.map(item => Array.isArray(item)
                ? this.itemValueForHTMLMode(item)
                : this.getSingleItemValueForHTMLMode(item));
            return values.join(', ');
        }
        return this.getSingleItemValueForHTMLMode(value);
    }
    /* eslint-enable max-statements */
    get defaultValue() {
        let defaultValue = super.defaultValue;
        if (!defaultValue && (this.component.defaultValue === false || this.component.defaultValue === 0)) {
            defaultValue = this.component.defaultValue;
        }
        return defaultValue;
    }
    get loadingError() {
        return !this.component.refreshOn && !this.component.refreshOnBlur && this.networkError;
    }
    loadItems(url, search, headers, options, method, body) {
        options = options || {};
        // See if we should load items or not.
        if (!this.shouldLoad || (!this.itemsFromUrl && this.options.readOnly)) {
            this.isScrollLoading = false;
            this.loading = false;
            this.itemsLoadedResolve();
            return;
        }
        // See if they have not met the minimum search requirements.
        const minSearch = parseInt(this.component.minSearch, 10);
        if (this.component.searchField &&
            (minSearch > 0) &&
            (!search || (search.length < minSearch))) {
            // Set empty items.
            return this.setItems([]);
        }
        // Ensure we have a method and remove any body if method is get
        method = method || 'GET';
        if (method.toUpperCase() === 'GET') {
            body = null;
        }
        const limit = this.component.limit || 100;
        const skip = this.isScrollLoading ? this.selectOptions.length : 0;
        const query = this.component.disableLimit ? {} : {
            limit,
            skip,
        };
        // Allow for url interpolation.
        url = this.sanitize(this.interpolate(url, {
            formioBase: Formio_1.Formio.getBaseUrl(),
            search,
            limit,
            skip,
            page: Math.abs(Math.floor(skip / limit))
        }), this.shouldSanitizeValue);
        // Add search capability.
        if (this.component.searchField && search) {
            const searchValue = Array.isArray(search)
                ? search.join(',')
                : typeof search === 'object'
                    ? JSON.stringify(search)
                    : search;
            query[this.component.searchField] = this.component.searchField.endsWith('__regex')
                ? lodash_1.default.escapeRegExp(searchValue)
                : searchValue;
        }
        // If they wish to return only some fields.
        if (this.component.selectFields) {
            query.select = this.component.selectFields;
        }
        // Add sort capability
        if (this.component.sort) {
            query.sort = this.component.sort;
        }
        if (!lodash_1.default.isEmpty(query)) {
            // Add the query string.
            url += (!url.includes('?') ? '?' : '&') + Formio_1.Formio.serialize(query, (item) => this.interpolate(item));
        }
        // Add filter capability
        if (this.component.filter) {
            url += (!url.includes('?') ? '?' : '&') + this.interpolate(this.component.filter);
        }
        // Set ignoreCache if it is
        options.ignoreCache = this.component.ignoreCache;
        // Make the request.
        options.header = headers;
        this.loading = true;
        Formio_1.Formio.makeRequest(this.options.formio, 'select', url, method, body, options)
            .then((response) => {
            this.loading = false;
            this.setItems(response, !!search);
        })
            .catch((err) => {
            if (this.itemsFromUrl) {
                this.setItems([]);
                this.disableInfiniteScroll();
            }
            this.isScrollLoading = false;
            this.handleLoadingError(err);
        });
    }
    handleLoadingError(err) {
        this.loading = false;
        if (err.networkError) {
            this.networkError = true;
        }
        this.itemsLoadedResolve();
        this.emit('componentError', {
            component: this.component,
            message: err.toString(),
        });
        console.warn(this.t('loadResourcesError', { componentKey: this.key }));
    }
    /**
     * Get the request headers for this select dropdown.
     * @returns {*} - Returns the request headers for this select dropdown.
     */
    get requestHeaders() {
        // Create the headers object.
        const headers = new Formio_1.Formio.Headers();
        // Add custom headers to the url.
        if (this.component.data && this.component.data.headers) {
            try {
                lodash_1.default.each(this.component.data.headers, (header) => {
                    if (header.key) {
                        headers.set(header.key, this.interpolate(header.value));
                    }
                });
            }
            catch (err) {
                console.warn(err.message);
            }
        }
        return headers;
    }
    getCustomItems() {
        const customItems = this.evaluate(this.component.data.custom, {
            values: []
        }, 'values');
        this.asyncValues = (0, utils_1.isPromise)(customItems);
        return customItems;
    }
    asyncCustomValues() {
        if (!lodash_1.default.isBoolean(this.asyncValues)) {
            this.getCustomItems();
        }
        return this.asyncValues;
    }
    updateCustomItems(forceUpdate) {
        if (this.asyncCustomValues()) {
            if (!forceUpdate && !this.active) {
                this.itemsLoadedResolve();
                return;
            }
            this.loading = true;
            this.getCustomItems()
                .then(items => {
                this.loading = false;
                this.setItems(items || []);
            })
                .catch(err => {
                this.handleLoadingError(err);
            });
        }
        else {
            this.setItems(this.getCustomItems() || []);
        }
    }
    isEmpty(value = this.dataValue) {
        return super.isEmpty(value) || value === undefined;
    }
    refresh(value, { instance }) {
        if (this.component.clearOnRefresh && (instance && !instance.pristine)) {
            this.setValue(this.emptyValue);
        }
        this.updateItems(null, true);
    }
    get additionalResourcesAvailable() {
        return lodash_1.default.isNil(this.serverCount) || (this.serverCount > this.downloadedResources.length);
    }
    get serverCount() {
        if (this.isFromSearch) {
            return this.searchServerCount;
        }
        return this.defaultServerCount;
    }
    set serverCount(value) {
        if (this.isFromSearch) {
            this.searchServerCount = value;
        }
        else {
            this.defaultServerCount = value;
        }
    }
    get downloadedResources() {
        if (this.isFromSearch) {
            return this.searchDownloadedResources;
        }
        return this.defaultDownloadedResources;
    }
    set downloadedResources(value) {
        if (this.isFromSearch) {
            this.searchDownloadedResources = value;
        }
        else {
            this.defaultDownloadedResources = value;
        }
    }
    addPlaceholder() {
        if (!this.component.placeholder) {
            return;
        }
        this.addOption('', this.component.placeholder, { placeholder: true });
    }
    /**
     * Activate this select control.
     */
    activate() {
        if (this.loading || !this.active) {
            this.setLoadingItem();
        }
        if (this.active) {
            return;
        }
        this.activated = true;
        this.triggerUpdate();
    }
    setLoadingItem(addToCurrentList = false) {
        if (this.choices) {
            if (addToCurrentList) {
                this.choices.setChoices([{
                        value: `${this.id}-loading`,
                        label: 'Loading...',
                        disabled: true,
                    }], 'value', 'label');
            }
            else {
                this.choices.setChoices([{
                        value: '',
                        label: `<i class="${this.iconClass('refresh')}" style="font-size:1.3em;"></i>`,
                        disabled: true,
                    }], 'value', 'label', true);
            }
        }
        else if (this.component.dataSrc === 'url' || this.component.dataSrc === 'resource') {
            this.addOption('', `${this.t('loading')}...`);
        }
    }
    get active() {
        return !this.component.lazyLoad || this.activated;
    }
    render() {
        const info = this.inputInfo;
        info.attr = info.attr || {};
        info.multiple = this.component.multiple;
        return super.render(this.wrapElement(this.renderTemplate('select', {
            input: info,
            selectOptions: '',
            index: null,
        })));
    }
    wrapElement(element) {
        return this.component.addResource && !this.options.readOnly
            ? (this.renderTemplate('resourceAdd', {
                element
            }))
            : element;
    }
    choicesOptions() {
        const useSearch = this.component.hasOwnProperty('searchEnabled') ? this.component.searchEnabled : true;
        const placeholderValue = this.t(this.component.placeholder, { _userInput: true });
        let customOptions = this.component.customOptions || {};
        if (typeof customOptions == 'string') {
            try {
                customOptions = JSON.parse(customOptions);
            }
            catch (err) {
                console.warn(err.message);
                customOptions = {};
            }
        }
        const commonFuseOptions = {
            maxPatternLength: 1000,
            distance: 1000,
        };
        return Object.assign({ removeItemButton: this.component.disabled ? false : lodash_1.default.get(this.component, 'removeItemButton', true), itemSelectText: '', classNames: {
                containerOuter: ['choices', 'form-group', 'formio-choices'],
                containerInner: this.transform('class', 'form-control ui fluid selection dropdown').split(' '),
            }, addItemText: false, allowHTML: true, placeholder: !!this.component.placeholder, placeholderValue: placeholderValue, noResultsText: this.t('noResultsFound'), noChoicesText: this.t('noChoices'), searchPlaceholderValue: this.t('typeToSearch'), shouldSort: false, position: (this.component.dropdown || 'auto'), searchEnabled: useSearch, searchChoices: !this.component.searchField, searchFields: lodash_1.default.get(this, 'component.searchFields', ['label']), shadowRoot: this.root ? this.root.shadowRoot : null, fuseOptions: this.component.useExactSearch
                ? Object.assign({ tokenize: true, matchAllTokens: true }, commonFuseOptions) : Object.assign({}, lodash_1.default.get(this, 'component.fuseOptions', {}), Object.assign({ include: 'score', threshold: lodash_1.default.get(this, 'component.selectThreshold', 0.3) }, commonFuseOptions)), valueComparer: lodash_1.default.isEqual, resetScrollPosition: false, duplicateItemsAllowed: false }, customOptions);
    }
    /* eslint-disable max-statements */
    attach(element) {
        var _a, _b, _c;
        const superAttach = super.attach(element);
        this.loadRefs(element, {
            selectContainer: 'single',
            addResource: 'single',
            autocompleteInput: 'single'
        });
        //enable autocomplete for select
        const autocompleteInput = this.refs.autocompleteInput;
        if (autocompleteInput) {
            this.addEventListener(autocompleteInput, 'change', (event) => {
                this.setValue(event.target.value);
            });
        }
        const input = this.refs.selectContainer;
        if (!input) {
            return;
        }
        this.addEventListener(input, this.inputInfo.changeEvent, () => this.updateValue(null, {
            modified: true
        }));
        this.attachRefreshOnBlur();
        if (this.component.widget === 'html5') {
            this.addFocusBlurEvents(input);
            this.triggerUpdate(null, true);
            if (this.visible) {
                this.setItems(this.selectItems || []);
            }
            this.focusableElement = input;
            if (this.component.dataSrc === 'custom') {
                this.addEventListener(input, 'focus', () => this.updateCustomItems());
            }
            this.addEventListener(input, 'keydown', (event) => {
                const { key } = event;
                if (['Backspace', 'Delete'].includes(key)) {
                    this.setValue(this.emptyValue);
                }
            });
            return;
        }
        const tabIndex = input.tabIndex;
        this.addPlaceholder();
        if (this.i18next) {
            input.setAttribute('dir', this.i18next.dir());
        }
        if ((_c = (_b = (_a = this.choices) === null || _a === void 0 ? void 0 : _a.containerOuter) === null || _b === void 0 ? void 0 : _b.element) === null || _c === void 0 ? void 0 : _c.parentNode) {
            this.choices.destroy();
        }
        const choicesOptions = this.choicesOptions();
        if (ChoicesWrapper_1.default) {
            this.choices = new ChoicesWrapper_1.default(input, choicesOptions);
            if (this.selectOptions && this.selectOptions.length) {
                this.choices.setChoices(this.selectOptions, 'value', 'label', true);
            }
            if (this.component.multiple) {
                this.focusableElement = this.choices.input.element;
            }
            else {
                this.focusableElement = this.choices.containerInner.element;
                this.choices.containerOuter.element.setAttribute('tabIndex', '-1');
                this.addEventListener(this.choices.containerOuter.element, 'focus', () => this.focusableElement.focus());
            }
            this.addFocusBlurEvents(this.choices.input.element);
            if (this.itemsFromUrl && !this.component.noRefreshOnScroll) {
                this.scrollList = this.choices.choiceList.element;
                this.addEventListener(this.scrollList, 'scroll', () => this.onScroll());
            }
            if (choicesOptions.removeItemButton) {
                this.addEventListener(input, 'removeItem', () => {
                    this.isRemoveButtonPressed = true;
                });
            }
        }
        if (window && this.choices && this.shouldPositionDropdown) {
            this.addEventListener(window.document, 'scroll', () => {
                this.positionDropdown(true);
            }, false, true);
        }
        this.focusableElement.setAttribute('tabIndex', tabIndex);
        // If a search field is provided, then add an event listener to update items on search.
        if (this.component.searchField) {
            // Make sure to clear the search when no value is provided.
            if (this.choices && this.choices.input && this.choices.input.element) {
                this.addEventListener(this.choices.input.element, 'input', (event) => {
                    this.isFromSearch = !!event.target.value;
                    if (!event.target.value) {
                        this.triggerUpdate();
                    }
                    else {
                        this.serverCount = null;
                        this.downloadedResources = [];
                    }
                });
            }
            this.addEventListener(input, 'choice', () => {
                if (this.component.multiple && this.component.dataSrc === 'resource' && this.isFromSearch) {
                    this.triggerUpdate();
                }
                this.isFromSearch = false;
            });
            // avoid spamming the resource/url endpoint when we have server side filtering enabled.
            const debounceTimeout = this.component.searchField && (this.isSelectResource || this.isSelectURL) ?
                (this.component.searchDebounce === 0 ? 0 : this.component.searchDebounce || this.defaultSchema.searchDebounce) * 1000
                : 0;
            const updateComponent = (evt) => {
                this.triggerUpdate(evt.detail.value);
            };
            this.addEventListener(input, 'search', lodash_1.default.debounce((e) => {
                updateComponent(e);
                this.positionDropdown();
            }, debounceTimeout));
            this.addEventListener(input, 'stopSearch', () => this.triggerUpdate());
            this.addEventListener(input, 'hideDropdown', () => {
                if (this.choices && this.choices.input && this.choices.input.element) {
                    this.choices.input.element.value = '';
                }
                this.updateItems(null, true);
            });
        }
        this.addEventListener(input, 'showDropdown', () => {
            this.update();
            this.positionDropdown();
        });
        if (this.shouldPositionDropdown) {
            this.addEventListener(input, 'highlightChoice', () => {
                this.positionDropdown();
            });
        }
        // Add value options.
        this.addValueOptions();
        this.setChoicesValue(this.dataValue);
        if (this.isSelectResource && this.refs.addResource) {
            this.addEventListener(this.refs.addResource, 'click', (event) => {
                event.preventDefault();
                const formioForm = this.ce('div');
                const dialog = this.createModal(formioForm);
                const projectUrl = lodash_1.default.get(this.root, 'formio.projectUrl', Formio_1.Formio.getProjectUrl());
                const formUrl = `${projectUrl}/form/${this.component.data.resource}`;
                new Form_1.default(formioForm, formUrl, {}).ready
                    .then((form) => {
                    form.on('submit', (submission) => {
                        // If valueProperty is set, replace the submission with the corresponding value
                        let value = this.valueProperty ? lodash_1.default.get(submission, this.valueProperty) : submission;
                        if (this.component.multiple) {
                            value = [...this.dataValue, value];
                        }
                        this.setValue(value);
                        this.triggerUpdate();
                        dialog.close();
                    });
                });
            });
        }
        // Force the disabled state with getters and setters.
        this.disabled = this.shouldDisabled;
        this.triggerUpdate();
        return superAttach;
    }
    setDropdownPosition() {
        var _a, _b, _c, _d;
        const dropdown = (_b = (_a = this.choices) === null || _a === void 0 ? void 0 : _a.dropdown) === null || _b === void 0 ? void 0 : _b.element;
        const container = (_d = (_c = this.choices) === null || _c === void 0 ? void 0 : _c.containerOuter) === null || _d === void 0 ? void 0 : _d.element;
        if (!dropdown || !container) {
            return;
        }
        const containerPosition = container.getBoundingClientRect();
        const isFlipped = container.classList.contains('is-flipped');
        lodash_1.default.assign(dropdown.style, {
            top: `${isFlipped ? containerPosition.top - dropdown.offsetHeight : containerPosition.top + containerPosition.height}px`,
            left: `${containerPosition.left}px`,
            width: `${containerPosition.width}px`,
            position: 'fixed',
            bottom: 'unset',
            right: 'unset',
        });
    }
    hasDataGridAncestor(comp) {
        comp = comp || this;
        if (comp.inDataGrid || comp.type === 'datagrid') {
            return true;
        }
        else if (comp.parent) {
            return this.hasDataGridAncestor(comp.parent);
        }
        else {
            return false;
        }
    }
    positionDropdown(scroll) {
        var _a;
        if (!this.shouldPositionDropdown || !this.choices || (!((_a = this.choices.dropdown) === null || _a === void 0 ? void 0 : _a.isActive) && scroll)) {
            return;
        }
        this.setDropdownPosition();
        this.itemsLoaded.then(() => {
            this.setDropdownPosition();
        });
    }
    get isLoadingAvailable() {
        return !this.isScrollLoading && this.additionalResourcesAvailable;
    }
    onScroll() {
        if (this.isLoadingAvailable) {
            this.isScrollLoading = true;
            this.setLoadingItem(true);
            this.triggerUpdate(this.choices.input.element.value);
        }
    }
    attachRefreshOnBlur() {
        if (this.component.refreshOnBlur) {
            this.on('blur', (instance) => {
                this.checkRefreshOn([{ instance, value: instance.dataValue }], { fromBlur: true });
            });
        }
    }
    /* eslint-enable max-statements */
    update() {
        if (this.component.dataSrc === 'custom') {
            this.updateCustomItems();
        }
        // Activate the control.
        this.activate();
    }
    set disabled(disabled) {
        super.disabled = disabled;
        if (!this.choices) {
            return;
        }
        if (disabled) {
            this.setDisabled(this.choices.containerInner.element, true);
            this.focusableElement.removeAttribute('tabIndex');
            this.choices.disable();
        }
        else {
            this.setDisabled(this.choices.containerInner.element, false);
            this.focusableElement.setAttribute('tabIndex', this.component.tabindex || 0);
            this.choices.enable();
        }
    }
    get disabled() {
        return super.disabled;
    }
    set visible(value) {
        // If we go from hidden to visible, trigger a refresh.
        if (value && (!this._visible !== !value)) {
            this.triggerUpdate();
        }
        super.visible = value;
    }
    get visible() {
        return super.visible;
    }
    addCurrentChoices(values, items, keyValue) {
        if (!values) {
            return false;
        }
        const notFoundValuesToAdd = [];
        const added = values.reduce((defaultAdded, value) => {
            if (!value || lodash_1.default.isEmpty(value)) {
                return defaultAdded;
            }
            let found = false;
            // Make sure that `items` and `this.selectOptions` points
            // to the same reference. Because `this.selectOptions` is
            // internal property and all items are populated by
            // `this.addOption` method, we assume that items has
            // 'label' and 'value' properties. This assumption allows
            // us to read correct value from the item.
            const isSelectOptions = items === this.selectOptions;
            if (items && items.length) {
                lodash_1.default.each(items, (choice) => {
                    if (choice._id && value._id && (choice._id === value._id)) {
                        found = true;
                        return false;
                    }
                    const itemValue = keyValue ? choice.value : this.itemValue(choice, isSelectOptions);
                    found |= lodash_1.default.isEqual(itemValue, value);
                    return found ? false : true;
                });
            }
            // Add the default option if no item is found.
            if (!found) {
                notFoundValuesToAdd.push(this.selectValueAndLabel(value));
                return true;
            }
            return found || defaultAdded;
        }, false);
        if (notFoundValuesToAdd.length) {
            if (this.choices) {
                this.choices.setChoices(notFoundValuesToAdd, 'value', 'label');
            }
            notFoundValuesToAdd.map(notFoundValue => {
                this.addOption(notFoundValue.value, notFoundValue.label);
            });
        }
        return added;
    }
    getValueAsString(data, options) {
        return (this.component.multiple && Array.isArray(data))
            ? data.map((v) => this.asString(v, options)).join(', ')
            : this.asString(data, options);
    }
    getValue() {
        // If the widget isn't active.
        if (this.viewOnly || this.loading
            || (!this.component.lazyLoad && !this.selectOptions.length)
            || !this.element) {
            return this.dataValue;
        }
        let value = this.emptyValue;
        if (this.choices) {
            value = this.choices.getValue(true);
            // Make sure we don't get the placeholder
            if (!this.component.multiple &&
                this.component.placeholder &&
                (value === this.t(this.component.placeholder, { _userInput: true }))) {
                value = this.emptyValue;
            }
        }
        else if (this.refs.selectContainer) {
            value = this.refs.selectContainer.value;
            if (this.valueProperty === '' || this.isEntireObjectDisplay()) {
                if (value === '') {
                    return {};
                }
                const option = this.selectOptions[value] ||
                    this.selectOptions.find(option => option.id === value);
                if (option && lodash_1.default.isObject(option.value)) {
                    value = option.value;
                }
            }
        }
        else {
            value = this.dataValue;
        }
        // Choices will return undefined if nothing is selected. We really want '' to be empty.
        if (value === undefined || value === null) {
            value = '';
        }
        return value;
    }
    redraw() {
        const done = super.redraw();
        this.triggerUpdate();
        return done;
    }
    normalizeSingleValue(value) {
        if (lodash_1.default.isNil(value)) {
            return;
        }
        const valueIsObject = lodash_1.default.isObject(value);
        //check if value equals to default emptyValue
        if (valueIsObject && Object.keys(value).length === 0) {
            return value;
        }
        const dataType = this.component.dataType || 'auto';
        const normalize = {
            value,
            number() {
                const numberValue = Number(this.value);
                const isEquivalent = value.toString() === numberValue.toString();
                if (!Number.isNaN(numberValue) && Number.isFinite(numberValue) && value !== '' && isEquivalent) {
                    this.value = numberValue;
                }
                return this;
            },
            boolean() {
                if (lodash_1.default.isString(this.value)
                    && (this.value.toLowerCase() === 'true'
                        || this.value.toLowerCase() === 'false')) {
                    this.value = (this.value.toLowerCase() === 'true');
                }
                return this;
            },
            string() {
                this.value = String(this.value);
                return this;
            },
            object() {
                return this;
            },
            auto() {
                if (lodash_1.default.isObject(this.value)) {
                    this.value = this.object().value;
                }
                else {
                    this.value = this.string().number().boolean().value;
                }
                return this;
            }
        };
        try {
            return normalize[dataType]().value;
        }
        catch (err) {
            console.warn(this.t('failedToNormalize'), err);
            return value;
        }
    }
    /**
     * Normalize values coming into updateValue. For example, depending on the configuration, string value `"true"` will be normalized to boolean `true`.
     * @param {*} value - The value to normalize
     * @returns {*} - Returns the normalized value
     */
    normalizeValue(value) {
        if (this.component.multiple && Array.isArray(value)) {
            return value.map((singleValue) => this.normalizeSingleValue(singleValue));
        }
        return super.normalizeValue(this.normalizeSingleValue(value));
    }
    setMetadata(value, flags = {}) {
        var _a, _b;
        if (lodash_1.default.isNil(value)) {
            return;
        }
        const valueIsObject = lodash_1.default.isObject(value);
        //check if value equals to default emptyValue
        if (valueIsObject && Object.keys(value).length === 0) {
            return value;
        }
        // Check to see if we need to save off the template data into our metadata.
        const templateValue = this.component.reference && (value === null || value === void 0 ? void 0 : value._id) ? value._id.toString() : value;
        const shouldSaveData = (!valueIsObject || this.component.reference) && !this.inDataTable;
        if (!lodash_1.default.isNil(templateValue) && shouldSaveData && this.templateData && this.templateData[templateValue] && ((_a = this.root) === null || _a === void 0 ? void 0 : _a.submission)) {
            const submission = this.root.submission;
            if (!submission.metadata) {
                submission.metadata = {};
            }
            if (!submission.metadata.selectData) {
                submission.metadata.selectData = {};
            }
            let templateData = this.templateData[templateValue];
            if (this.component.multiple) {
                templateData = {};
                const dataValue = this.dataValue;
                if (dataValue && lodash_1.default.isArray(dataValue) && dataValue.length) {
                    dataValue.forEach((dataValueItem) => {
                        const dataValueItemValue = this.component.reference ? dataValueItem._id.toString() : dataValueItem;
                        templateData[dataValueItemValue] = this.templateData[dataValueItemValue];
                    });
                }
                templateData[value] = this.templateData[value];
            }
            lodash_1.default.set(submission.metadata.selectData, this.path, templateData);
        }
        if (flags.resetValue && ((_b = this.root) === null || _b === void 0 ? void 0 : _b.submission) && !this.options.readOnly) {
            const submission = this.root.submission;
            if (!submission.metadata) {
                submission.metadata = {};
            }
            submission.metadata.selectData = {};
        }
    }
    updateValue(value, flags) {
        const changed = super.updateValue(value, flags);
        if (changed || !this.selectMetadata || flags.resetValue) {
            if (this.component.multiple && Array.isArray(this.dataValue)) {
                this.dataValue.forEach(singleValue => this.setMetadata(singleValue, flags));
            }
            else {
                this.setMetadata(this.dataValue, flags);
            }
        }
        return changed;
    }
    undoValueTyping(value) {
        let untypedValue = value;
        if (this.component.multiple && Array.isArray(value)) {
            untypedValue = value.map(v => {
                if (typeof v === 'boolean' || typeof v === 'number') {
                    return v.toString();
                }
                return v;
            });
        }
        else {
            if (typeof value === 'boolean' || typeof value === 'number') {
                untypedValue = value.toString();
            }
        }
        return untypedValue;
    }
    setValue(value, flags = {}) {
        const previousValue = this.dataValue;
        const changed = this.updateValue(value, flags);
        if (this.component.widget === 'html5' && (lodash_1.default.isEqual(value, previousValue) || lodash_1.default.isEqual(previousValue, {}) && lodash_1.default.isEqual(flags, {})) && !flags.fromSubmission) {
            return false;
        }
        value = this.dataValue;
        const hasPreviousValue = !this.isEmpty(previousValue);
        const hasValue = !this.isEmpty(value);
        // Undo typing when searching to set the value.
        value = this.undoValueTyping(value);
        if (this.isHtmlRenderMode() && flags && flags.fromSubmission && changed) {
            this.itemsLoaded.then(() => {
                this.redraw();
            });
            return changed;
        }
        // Do not set the value if we are loading... that will happen after it is done.
        if (this.loading) {
            return changed;
        }
        // Determine if we need to perform an initial lazyLoad api call if searchField is provided.
        if (this.isInitApiCallNeeded(hasValue)) {
            this.loading = true;
            this.lazyLoadInit = true;
            const searchProperty = this.component.searchField || this.component.valueProperty;
            this.triggerUpdate(lodash_1.default.get(value.data || value, searchProperty, value), true);
            return changed;
        }
        // Add the value options.
        this.itemsLoaded.then(() => {
            this.addValueOptions();
            this.setChoicesValue(value, hasPreviousValue, flags);
        });
        return changed;
    }
    isInitApiCallNeeded(hasValue) {
        return this.component.lazyLoad &&
            !this.lazyLoadInit &&
            !this.active &&
            !this.selectOptions.length &&
            hasValue &&
            this.shouldInitialLoad &&
            this.visible && (this.component.searchField || this.component.valueProperty);
    }
    setChoicesValue(value, hasPreviousValue, flags = {}) {
        const hasValue = !this.isEmpty(value) || flags.fromSubmission;
        hasPreviousValue = (hasPreviousValue === undefined) ? true : hasPreviousValue;
        if (this.choices) {
            // Now set the value.
            if (hasValue) {
                this.choices.removeActiveItems();
                // Add the currently selected choices if they don't already exist.
                const currentChoices = Array.isArray(value) && this.component.multiple ? value : [value];
                if (!this.addCurrentChoices(currentChoices, this.selectOptions, true)) {
                    this.choices.setChoices(this.selectOptions, 'value', 'label', true);
                }
                this.choices.setChoiceByValue(currentChoices);
            }
            else if (hasPreviousValue || flags.resetValue) {
                this.choices.removeActiveItems();
            }
        }
        else {
            if (hasValue) {
                const values = Array.isArray(value) ? value : [value];
                if (!lodash_1.default.isEqual(this.dataValue, this.defaultValue) && this.selectOptions.length < 2
                    || (this.selectData && flags.fromSubmission)) {
                    const { value, label } = this.selectValueAndLabel(this.dataValue);
                    this.addOption(value, label);
                }
                lodash_1.default.each(this.selectOptions, (selectOption) => {
                    lodash_1.default.each(values, (val) => {
                        if (selectOption.value === '') {
                            selectOption.value = {};
                        }
                        if (lodash_1.default.isEqual(val, selectOption.value) && selectOption.element) {
                            selectOption.element.selected = true;
                            selectOption.element.setAttribute('selected', 'selected');
                            return false;
                        }
                    });
                });
            }
            else {
                lodash_1.default.each(this.selectOptions, (selectOption) => {
                    if (selectOption.element) {
                        selectOption.element.selected = false;
                        selectOption.element.removeAttribute('selected');
                    }
                });
            }
        }
    }
    validateValueAvailability(setting, value) {
        if (!(0, utils_1.boolValue)(setting) || !value) {
            return true;
        }
        const values = this.getOptionsValues();
        if (values) {
            if (lodash_1.default.isObject(value)) {
                const compareComplexValues = (optionValue) => {
                    const normalizedOptionValue = this.normalizeSingleValue(optionValue);
                    if (!lodash_1.default.isObject(normalizedOptionValue)) {
                        return false;
                    }
                    try {
                        return (JSON.stringify(normalizedOptionValue) === JSON.stringify(value));
                    }
                    catch (err) {
                        console.warn.error(this.t('failedToCompareItems'), err);
                        return false;
                    }
                };
                return values.findIndex((optionValue) => compareComplexValues(optionValue)) !== -1;
            }
            return values.findIndex((optionValue) => this.normalizeSingleValue(optionValue) === value) !== -1;
        }
        return false;
    }
    /**
     * Performs required transformations on the initial value to use in selectOptions
     * @param {*} value - The value to transform.
     * @returns {*} - Returns the options value.
     */
    getOptionValue(value) {
        return lodash_1.default.isObject(value) && this.isEntireObjectDisplay()
            ? this.normalizeSingleValue(value)
            : lodash_1.default.isObject(value) && (this.valueProperty || this.component.key !== 'resource')
                ? value
                : lodash_1.default.isObject(value) && !this.valueProperty
                    ? this.interpolate(this.component.template, { item: value }).replace(/<\/?[^>]+(>|$)/g, '')
                    : lodash_1.default.isNull(value)
                        ? this.emptyValue
                        : String(this.normalizeSingleValue(value));
    }
    /**
     * If component has static values (values, json) or custom values, returns an array of them
     * @returns {Array<*>|undefined} - Returns an array of the static or custom values.
     */
    getOptionsValues() {
        let rawItems = [];
        switch (this.component.dataSrc) {
            case 'values':
                rawItems = this.component.data.values;
                break;
            case 'json':
                rawItems = this.component.data.json;
                break;
            case 'custom':
                rawItems = this.getCustomItems();
                break;
            case 'url':
                rawItems = this.selectItems;
                break;
        }
        if (typeof rawItems === 'string') {
            try {
                rawItems = JSON.parse(rawItems);
            }
            catch (err) {
                console.warn(err.message);
                rawItems = [];
            }
        }
        if (!Array.isArray(rawItems)) {
            return;
        }
        return rawItems.map((item) => this.getOptionValue(this.itemValue(item)));
    }
    /**
     * Deletes the value of the component.
     */
    deleteValue() {
        this.setValue('', {
            noUpdateEvent: true
        });
        this.unset();
    }
    /**
     * Check if a component is eligible for multiple validation
     * @returns {boolean} - Returns FALSE for select components.
     */
    validateMultiple() {
        // Select component will contain one input when flagged as multiple.
        return false;
    }
    /**
     * Output this select dropdown as a string value.
     * @returns {*}
     */
    isBooleanOrNumber(value) {
        return typeof value === 'number' || typeof value === 'boolean';
    }
    getNormalizedValues() {
        if (!this.component || !this.component.data || !this.component.data.values) {
            return;
        }
        return this.component.data.values.map(value => ({ label: value.label, value: String(this.normalizeSingleValue(value.value)) }));
    }
    asString(value, options = {}) {
        var _a;
        value = value !== null && value !== void 0 ? value : this.getValue();
        if (options.modalPreview || this.inDataTable || options.email) {
            if (this.inDataTable) {
                value = this.undoValueTyping(value);
            }
            const templateValue = (this.isEntireObjectDisplay() && !lodash_1.default.isObject(value.data)) ? { data: value } : value;
            const template = this.itemTemplate(templateValue, value, options);
            return template;
        }
        //need to convert values to strings to be able to compare values with available options that are strings
        const convertToString = (data, valueProperty) => {
            if (valueProperty) {
                if (Array.isArray(data)) {
                    data.forEach((item) => item[valueProperty] = item[valueProperty].toString());
                }
                else if (lodash_1.default.isObject(data)) {
                    data[valueProperty] = data[valueProperty].toString();
                }
                return data;
            }
            if (this.isBooleanOrNumber(data)) {
                data = data.toString();
            }
            if (Array.isArray(data) && data.some(item => this.isBooleanOrNumber(item))) {
                data = data.map(item => this.isBooleanOrNumber(item) ? item.toString() : item);
            }
            return data;
        };
        value = convertToString(value);
        if (['values', 'custom'].includes(this.component.dataSrc) && !this.asyncCustomValues()) {
            const { items, valueProperty, } = this.component.dataSrc === 'values'
                ? {
                    items: convertToString(this.getNormalizedValues(), 'value'),
                    valueProperty: 'value',
                }
                : {
                    items: convertToString(this.getCustomItems(), this.valueProperty),
                    valueProperty: this.valueProperty,
                };
            const getFromValues = () => {
                const initialValue = lodash_1.default.find(items, [valueProperty, value]);
                const values = this.defaultSchema.data.values || [];
                return lodash_1.default.isEqual(initialValue, values[0]) ? '-' : initialValue;
            };
            value = (this.component.multiple && Array.isArray(value))
                ? lodash_1.default.filter(items, (item) => value.includes(item.value))
                : (valueProperty && items)
                    ? (_a = getFromValues()) !== null && _a !== void 0 ? _a : { value, label: value }
                    : value;
        }
        if (lodash_1.default.isString(value)) {
            return value;
        }
        const getTemplateValue = (v) => {
            const itemTemplate = this.itemTemplate(v);
            return options.csv && itemTemplate
                ? (0, utils_1.removeHTML)(itemTemplate)
                : itemTemplate;
        };
        if (Array.isArray(value)) {
            const items = [];
            value.forEach(item => items.push(getTemplateValue(item)));
            if (this.component.dataSrc === 'resource' && items.length > 0) {
                return items.join(', ');
            }
            else if (items.length > 0) {
                return items.join('<br />');
            }
            else {
                return '-';
            }
        }
        if (this.isEntireObjectDisplay() && lodash_1.default.isObject(value)) {
            return JSON.stringify(value);
        }
        return !lodash_1.default.isNil(value)
            ? getTemplateValue(value)
            : '-';
    }
    detach() {
        var _a, _b;
        this.off('blur');
        if (this.choices) {
            if ((_b = (_a = this.choices.containerOuter) === null || _a === void 0 ? void 0 : _a.element) === null || _b === void 0 ? void 0 : _b.parentNode) {
                this.choices.destroy();
            }
            this.choices = null;
        }
        super.detach();
    }
    focus() {
        super.focus.call(this);
        if (this.focusableElement) {
            this.focusableElement.focus();
        }
    }
    setErrorClasses(elements, dirty, hasError, hasMessages, element = this.element) {
        super.setErrorClasses(elements, dirty, hasError, hasMessages, element);
        if (this.choices) {
            super.setErrorClasses([this.choices.containerInner.element], dirty, hasError, hasMessages, element);
        }
        else {
            super.setErrorClasses([this.refs.selectContainer], dirty, hasError, hasMessages, element);
        }
    }
}
exports.default = SelectComponent;
