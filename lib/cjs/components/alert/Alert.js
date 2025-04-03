"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const utils_1 = require("../../utils/utils");
class Alert {
    constructor(container, component) {
        this.container = container;
        this.alert = null;
        this.parentComponent = component;
        this.refs = {};
        this.loadRefs = this.parentComponent.loadRefs.bind(this);
    }
    get refsNames() {
        return {
            messageRef: 'multiple'
        };
    }
    get alertTypes() {
        return {
            error: 'danger',
            success: 'success',
            info: 'info',
            warning: 'warning'
        };
    }
    showErrors(errors = [], triggerEvent = false, options = {}) {
        errors = lodash_1.default.isArray(errors) ? errors : [errors];
        const messagesList = this.createMessagesList('error', errors);
        this.showAlert('error', messagesList, options);
        if (triggerEvent) {
            this.parentComponent.emit('error', errors);
        }
        return errors;
    }
    showMessage(message, type, options = {}) {
        let messageElement = message;
        if (messageElement instanceof HTMLElement) {
            messageElement.setAttribute('ref', 'messageRef');
        }
        else {
            messageElement = this.parentComponent.ce('p', {
                ref: 'messageRef'
            });
        }
        this.showAlert(type, messageElement, options);
    }
    createMessagesList(type, ...args) {
        switch (type) {
            case 'error':
                return this.createErrorList(...args);
        }
    }
    createErrorList(errors) {
        const p = this.parentComponent.ce('p');
        this.parentComponent.setContent(p, this.parentComponent.t('error'));
        const ul = this.parentComponent.ce('ul');
        const messagesList = document.createDocumentFragment();
        errors.forEach(err => this.appendErrorToList(err, ul));
        p.appendChild(ul);
        messagesList.appendChild(p);
        return messagesList;
    }
    showAlert(type, messagesList, options = {}) {
        const { customClasses, customEvents } = options;
        this.setAlert(type, messagesList, { customClasses });
        if (!this.alert) {
            return;
        }
        this.attach({ customEvents });
        this.parentComponent.prependTo(this.alert, this.container);
    }
    setAlert(type, messagesList, options = {}) {
        const alertType = this.alertTypes[type];
        if (this.alert) {
            this.clear();
        }
        if (messagesList) {
            const { id = `${type}-list-${this.parentComponent.id}`, customClasses = `alert alert-${alertType}` } = options;
            this.alert = this.parentComponent.ce('div', { id, class: customClasses });
            if (messagesList instanceof HTMLElement) {
                this.parentComponent.appendTo(messagesList, this.alert);
            }
            else {
                this.parentComponent.setContent(this.alert, messagesList);
            }
        }
    }
    attach(options) {
        var _a, _b, _c;
        let { customEvents = {} } = options;
        this.eventListenersKeys = [];
        this.loadRefs(this.alert, this.refsNames);
        const clickListeners = ((_a = customEvents.click) === null || _a === void 0 ? void 0 : _a.listeners) || [];
        const keyPressListeners = ((_b = customEvents.keypress) === null || _b === void 0 ? void 0 : _b.listeners) || [];
        customEvents = Object.assign(Object.assign({}, customEvents), { click: [
                ...clickListeners,
                (e) => {
                    const key = e.currentTarget.dataset.componentKey;
                    this.focusOnComponent(key);
                }
            ], keypress: [
                ...keyPressListeners,
                (e) => {
                    const key = e.currentTarget.dataset.componentKey;
                    this.focusOnComponent(key);
                }
            ] });
        if ((_c = this.refs.messageRef) === null || _c === void 0 ? void 0 : _c.length) {
            this.refs.messageRef.forEach(el => {
                Object.entries(customEvents).forEach(([event, listeners]) => {
                    listeners.forEach((listener) => this.parentComponent.addEventListener(el, event, listener));
                    this.eventListenersKeys.push(event);
                });
            });
        }
    }
    clear() {
        var _a;
        try {
            if ((_a = this.refs.messageRef) === null || _a === void 0 ? void 0 : _a.length) {
                this.refs.messageRef.forEach(el => {
                    this.eventListenersKeys.forEach(event => this.parentComponent.removeEventListener(el, event));
                });
            }
            this.refs = {};
            this.parentComponent.removeChildFrom(this.alert, this.container);
            this.alert = null;
        }
        catch (err) {
            // ignore
        }
    }
    focusOnComponent(keyOrPath) {
        var _a;
        if (keyOrPath) {
            const path = this.parentComponent._parentPath ? keyOrPath.replace(this.parentComponent._parentPath, '') : keyOrPath;
            const component = (_a = this.parentComponent.root) === null || _a === void 0 ? void 0 : _a.getComponent(path, null, keyOrPath);
            if (component && lodash_1.default.isFunction(component.focus)) {
                component.focus();
            }
        }
    }
    createMessage(type, element, message, index, err) {
        switch (type) {
            case 'error':
                return this.createErrorMessage(element, message, index, err);
        }
    }
    createErrorMessage(element, message, index, err) {
        var _a, _b;
        const params = {
            style: 'cursor: pointer',
            ref: 'messageRef',
            tabIndex: 0,
            'aria-label': `${message}. Click to navigate to the field with following error.`
        };
        const li = this.parentComponent.ce('li', params);
        this.parentComponent.setContent(li, message);
        const messageFromIndex = !lodash_1.default.isUndefined(index) && ((_a = err === null || err === void 0 ? void 0 : err.messages) === null || _a === void 0 ? void 0 : _a[index]);
        const keyOrPath = (messageFromIndex === null || messageFromIndex === void 0 ? void 0 : messageFromIndex.path) || ((_b = err === null || err === void 0 ? void 0 : err.component) === null || _b === void 0 ? void 0 : _b.key);
        if (keyOrPath) {
            const formattedKeyOrPath = (0, utils_1.getStringFromComponentPath)(keyOrPath);
            li.dataset.componentKey = formattedKeyOrPath;
        }
        this.parentComponent.appendTo(li, element);
    }
    appendErrorToList(err, ul) {
        var _a;
        if ((_a = err === null || err === void 0 ? void 0 : err.messages) === null || _a === void 0 ? void 0 : _a.length) {
            err.messages.forEach(({ message }, index) => {
                this.createMessage('error', ul, message, index, err);
            });
        }
        else if (err) {
            const message = lodash_1.default.isObject(err) ? err.message || '' : err;
            this.createMessage('error', ul, message);
        }
    }
}
exports.default = Alert;
