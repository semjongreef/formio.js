"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Field_1 = __importDefault(require("../field/Field"));
const Formio_1 = require("../../../Formio");
const lodash_1 = __importDefault(require("lodash"));
const utils_1 = require("../../../utils/utils");
class ListComponent extends Field_1.default {
    static schema(...extend) {
        return Field_1.default.schema({
            dataSrc: 'values',
            authenticate: false,
            ignoreCache: false,
            template: '<span>{{ item.label }}</span>',
            validate: {
                onlyAvailableItems: false
            },
        }, ...extend);
    }
    get isSelectURL() {
        return this.component.dataSrc === 'url';
    }
    get selectData() {
        const selectData = lodash_1.default.get(this.root, 'submission.metadata.selectData', {});
        return lodash_1.default.get(selectData, this.path);
    }
    get dataReady() {
        // If the root submission has been set, and we are still not attached, then assume
        // that our data is ready.
        if ((this.root &&
            this.root.submissionSet &&
            !this.attached) || !this.visible) {
            return Promise.resolve();
        }
        return this.itemsLoaded;
    }
    get shouldLoad() {
        if (this.loadingError) {
            return false;
        }
        // Live forms should always load.
        if (!this.options.readOnly) {
            return true;
        }
        // If there are template keys, then we need to see if we have the data.
        if (this.templateKeys && this.templateKeys.length) {
            // See if we already have the data we need.
            const dataValue = this.dataValue;
            const selectData = this.selectData;
            return this.templateKeys.reduce((shouldLoad, key) => {
                const hasValue = lodash_1.default.has(dataValue, key) ||
                    (lodash_1.default.isArray(selectData) ? selectData.every((data) => lodash_1.default.has(data, key)) : lodash_1.default.has(selectData, key));
                return shouldLoad || !hasValue;
            }, false);
        }
        // Return that we should load.
        return true;
    }
    getTemplateKeys() {
        const template = this.component.template;
        this.templateKeys = this.options.readOnly && template
            ? (0, utils_1.getItemTemplateKeys)(template)
            : [];
    }
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
    // Must be implemented in child classes.
    setItems() { }
    updateCustomItems() { }
    loadItems() { }
    getOptionTemplate(data, value, index) {
        if (!this.component.template) {
            return data.label;
        }
        const options = {
            noeval: true,
            data: {}
        };
        const template = this.sanitize(this.component.template
            ? this.interpolate(this.component.template, { item: data }, options)
            : data.label, this.shouldSanitizeValue);
        const templateValue = this.component.reference && (value === null || value === void 0 ? void 0 : value._id) ? value._id.toString() : value;
        if (templateValue && !lodash_1.default.isObject(templateValue) && options.data.item) {
            // If the value is not an object, then we need to save the template data off for when it is selected.
            this.templateData[templateValue] = options.data.item;
        }
        if (lodash_1.default.isNumber(index)) {
            this.templateData[index] = options.data.item;
        }
        return template;
    }
    itemTemplate(data, value, index) {
        if (lodash_1.default.isEmpty(data)) {
            return '';
        }
        const template = this.sanitize(this.getOptionTemplate(data, value, index), this.shouldSanitizeValue);
        if (template) {
            const label = template.replace(/<\/?[^>]+(>|$)/g, '');
            if (!label)
                return;
            return template.replace(label, this.t(label, { _userInput: true }));
        }
        else {
            return this.sanitize(JSON.stringify(data), this.shouldSanitizeValue);
        }
    }
    get itemsLoaded() {
        return this._itemsLoaded || Promise.resolve();
    }
    set itemsLoaded(promise) {
        this._itemsLoaded = promise;
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
    /* eslint-disable max-statements */
    updateItems(searchInput, forceUpdate) {
        if (!this.component.data) {
            console.warn(this.t('noSelectDataConfiguration', { componentKey: this.key }));
            this.itemsLoadedResolve();
            return;
        }
        // Only load the data if it is visible.
        if (!this.visible) {
            this.itemsLoadedResolve();
            return;
        }
        switch (this.component.dataSrc) {
            case 'values':
                this.setItems(this.component.data.values);
                break;
            case 'json':
                this.setItems(this.component.data.json);
                break;
            case 'custom':
                this.updateCustomItems(forceUpdate);
                break;
            case 'resource': {
                // If there is no resource, or we are lazyLoading, wait until active.
                if (!this.component.data.resource || (!forceUpdate && !this.active)) {
                    this.itemsLoadedResolve();
                    return;
                }
                let resourceUrl = this.options.formio ? this.options.formio.formsUrl : `${Formio_1.Formio.getProjectUrl()}/form`;
                resourceUrl += (`/${this.component.data.resource}/submission`);
                if (forceUpdate || this.additionalResourcesAvailable || !this.serverCount) {
                    try {
                        this.loadItems(resourceUrl, searchInput, this.requestHeaders);
                    }
                    catch (err) {
                        console.warn(this.t('loadResourcesError', { componentKey: this.key }));
                    }
                }
                else {
                    this.setItems(this.downloadedResources);
                }
                break;
            }
            case 'url': {
                if (!forceUpdate && !this.active && !this.calculatedValue && this.component.type === 'select') {
                    // If we are lazyLoading, wait until activated.
                    this.itemsLoadedResolve();
                    return;
                }
                let { url } = this.component.data;
                url = lodash_1.default.trim(url);
                let method;
                let body;
                if (url.startsWith('/')) {
                    // if URL starts with '/project', we should use base URL to avoid issues with URL formed like <base_url>/<project_name>/project/<project_id>/...
                    const baseUrl = url.startsWith('/project') ? Formio_1.Formio.getBaseUrl() : Formio_1.Formio.getProjectUrl() || Formio_1.Formio.getBaseUrl();
                    url = baseUrl + url;
                }
                if (!this.component.data.method) {
                    method = 'GET';
                }
                else {
                    method = this.component.data.method;
                    if (method.toUpperCase() === 'POST') {
                        body = this.component.data.body;
                    }
                    else {
                        body = null;
                    }
                }
                const options = this.component.authenticate ? {} : { noToken: true };
                this.loadItems(url, searchInput, this.requestHeaders, options, method, body);
                break;
            }
            case 'indexeddb': {
                if (typeof window === 'undefined') {
                    return;
                }
                if (!window.indexedDB) {
                    window.alert(this.t('indexedDBSupportError'));
                }
                if (this.component.indexeddb && this.component.indexeddb.database && this.component.indexeddb.table) {
                    const request = window.indexedDB.open(this.component.indexeddb.database);
                    request.onupgradeneeded = (event) => {
                        if (this.component.customOptions) {
                            const db = event.target.result;
                            const objectStore = db.createObjectStore(this.component.indexeddb.table, { keyPath: 'myKey', autoIncrement: true });
                            objectStore.transaction.oncomplete = () => {
                                const transaction = db.transaction(this.component.indexeddb.table, 'readwrite');
                                this.component.customOptions.forEach((item) => {
                                    transaction.objectStore(this.component.indexeddb.table).put(item);
                                });
                            };
                        }
                    };
                    request.onerror = () => {
                        window.alert(request.errorCode);
                    };
                    request.onsuccess = (event) => {
                        const db = event.target.result;
                        const transaction = db.transaction(this.component.indexeddb.table, 'readwrite');
                        const objectStore = transaction.objectStore(this.component.indexeddb.table);
                        new Promise((resolve) => {
                            const responseItems = [];
                            objectStore.getAll().onsuccess = (event) => {
                                event.target.result.forEach((item) => {
                                    responseItems.push(item);
                                });
                                resolve(responseItems);
                            };
                        }).then((items) => {
                            if (!lodash_1.default.isEmpty(this.component.indexeddb.filter)) {
                                items = lodash_1.default.filter(items, this.component.indexeddb.filter);
                            }
                            this.setItems(items);
                        });
                    };
                }
            }
        }
    }
}
exports.default = ListComponent;
