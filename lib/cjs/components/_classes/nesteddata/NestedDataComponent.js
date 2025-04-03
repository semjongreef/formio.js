'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = __importDefault(require("../component/Component"));
const NestedComponent_1 = __importDefault(require("../nested/NestedComponent"));
const lodash_1 = __importDefault(require("lodash"));
const utils_1 = require("../../../utils/utils");
class NestedDataComponent extends NestedComponent_1.default {
    hasChanged(newValue, oldValue) {
        // If we do not have a value and are getting set to anything other than undefined or null, then we changed.
        if (newValue !== undefined &&
            newValue !== null &&
            !this.hasValue()) {
            return true;
        }
        return !lodash_1.default.isEqual(newValue, oldValue);
    }
    static savedValueTypes(schema) {
        return (0, utils_1.getComponentSavedTypes)(schema) || [utils_1.componentValueTypes.object];
    }
    get allowData() {
        return true;
    }
    get emptyValue() {
        return {};
    }
    get shouldAddDefaultValue() {
        return !this.options.noDefaults || !this.options.server;
    }
    componentContext() {
        return this.dataValue;
    }
    getValueAsString(value, options) {
        if (options === null || options === void 0 ? void 0 : options.email) {
            let result = (`
        <table border="1" style="width:100%">
          <tbody>
      `);
            this.everyComponent((component) => {
                if (component.isInputComponent && component.visible && !component.skipInEmail) {
                    result += (`
            <tr>
              <th style="padding: 5px 10px;">${component.label}</th>
              <td style="width:100%;padding:5px 10px;">${component.getView(component.dataValue, options)}</td>
            </tr>
          `);
                }
            }, Object.assign(Object.assign({}, options), { fromRoot: true }));
            result += (`
          </tbody>
        </table>
      `);
            return result;
        }
        if (lodash_1.default.isEmpty(value)) {
            return '';
        }
        if (options === null || options === void 0 ? void 0 : options.modalPreview) {
            delete options.modalPreview;
            return this.getDataValueAsTable(value, options);
        }
        return '[Complex Data]';
    }
    getDataValueAsTable(value, options) {
        let result = (`
      <table border="1" style="width:100%">
        <tbody>
    `);
        const htmlTagRegExp = new RegExp('<(.*?)>');
        this.everyComponent((component) => {
            if (component.isInputComponent && component.visible && !component.skipInEmail) {
                const componentValue = component.getView(component.dataValue, options);
                result += (`
          <tr>
            <th style="padding: 5px 10px;">${component.label}</th>
            <td style="width:100%;padding:5px 10px;">${component.component && component.component.inputFormat === 'html' && htmlTagRegExp.test(componentValue)
                    ? componentValue
                    : `<input type="text" value="${componentValue.replace(/"/g, '&quot;')}" readonly/>`}</td>
          </tr>
        `);
            }
        }, Object.assign(Object.assign({}, options), { fromRoot: true }));
        result += (`
        </tbody>
      </table>
    `);
        return result;
    }
    /**
     * Get the value of this component.
     * @returns {any} - Return the value of this component.
     */
    getValue() {
        return this.dataValue;
    }
    updateValue(value, flags = {}) {
        // Intentionally skip over nested component updateValue method to keep
        // recursive update from occurring with sub components.
        return Component_1.default.prototype.updateValue.call(this, value, flags);
    }
    setValue(value, flags = {}) {
        let changed = false;
        const hasValue = this.hasValue();
        if (hasValue && lodash_1.default.isEmpty(this.dataValue)) {
            flags.noValidate = true;
        }
        if (!value || !lodash_1.default.isObject(value) || !hasValue) {
            changed = true;
            this.dataValue = this.defaultValue;
        }
        changed = super.setValue(value, flags) || changed;
        this.updateOnChange(flags, changed);
        return changed;
    }
}
exports.default = NestedDataComponent;
