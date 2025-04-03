'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const utils_1 = require("@formio/core/utils");
const { getComponentPaths } = utils_1.Utils;
const utils_2 = require("../../../utils/utils");
const Component_1 = __importDefault(require("../component/Component"));
const NestedDataComponent_1 = __importDefault(require("../nesteddata/NestedDataComponent"));
class NestedArrayComponent extends NestedDataComponent_1.default {
    static schema(...extend) {
        return NestedDataComponent_1.default.schema({
            disableAddingRemovingRows: false
        }, ...extend);
    }
    static savedValueTypes() {
        return [utils_2.componentValueTypes.array];
    }
    componentContext(component) {
        return this.iteratableRows[component.rowIndex].data;
    }
    get iteratableRows() {
        throw new Error(this.t('iteratableRowsError'));
    }
    get rowIndex() {
        return this._rowIndex;
    }
    set rowIndex(value) {
        var _a, _b;
        this.paths = getComponentPaths(this.component, (_a = this.parent) === null || _a === void 0 ? void 0 : _a.component, Object.assign(Object.assign({}, (((_b = this.parent) === null || _b === void 0 ? void 0 : _b.paths) || {})), { dataIndex: value }));
        this._rowIndex = value;
    }
    init() {
        super.init();
        this.prevHasAddButton = this.hasAddButton();
    }
    checkAddButtonChanged() {
        const isAddButton = this.hasAddButton();
        if (isAddButton !== this.prevHasAddButton) {
            this.prevHasAddButton = isAddButton;
            this.redraw();
        }
    }
    checkData(data, flags, row) {
        data = data || this.rootValue;
        flags = flags || {};
        row = row || this.data;
        this.checkAddButtonChanged();
        return this.processRows('checkData', data, flags, Component_1.default.prototype.checkData.call(this, data, flags, row));
    }
    processRows(method, data, opts, defaultValue, silentCheck) {
        return this.iteratableRows.reduce((valid, row, rowIndex) => {
            if (!(opts === null || opts === void 0 ? void 0 : opts.rowIndex) || (opts === null || opts === void 0 ? void 0 : opts.rowIndex) === rowIndex) {
                return this.processRow(method, data, opts, row.data, row.components, silentCheck) && valid;
            }
            else {
                return valid;
            }
        }, defaultValue);
    }
    validate(data, flags = {}) {
        data = data || this.data;
        return this.validateComponents([this.component], data, flags);
    }
    checkRow(...args) {
        console.log(this.t('checkRowDeprecation'));
        return this.processRow.call(this, ...args);
    }
    processRow(method, data, opts, row, components, silentCheck) {
        if (opts === null || opts === void 0 ? void 0 : opts.isolateRow) {
            silentCheck = true;
            opts.noRefresh = true;
        }
        const valid = lodash_1.default.reduce(components, (valid, component) => component[method](data, opts, row, silentCheck) && valid, true);
        if (opts === null || opts === void 0 ? void 0 : opts.noRefresh) {
            delete opts.noRefresh;
        }
        return valid;
    }
    hasAddButton() {
        const maxLength = lodash_1.default.get(this.component, 'validate.maxLength');
        const conditionalAddButton = lodash_1.default.get(this.component, 'conditionalAddButton');
        return !this.component.disableAddingRemovingRows &&
            !this.options.readOnly &&
            !this.disabled &&
            this.fullMode &&
            !this.options.preview &&
            (!maxLength || (this.iteratableRows.length < maxLength)) &&
            (!conditionalAddButton || this.evaluate(conditionalAddButton, {
                value: this.dataValue,
            }, 'show'));
    }
    everyComponent(fn, rowIndex, options = {}) {
        if (lodash_1.default.isObject(rowIndex)) {
            options = rowIndex;
            rowIndex = null;
        }
        if (options === null || options === void 0 ? void 0 : options.email) {
            return;
        }
        const components = this.getComponents(rowIndex);
        lodash_1.default.each(components, (component, index) => {
            if (fn(component, components, index) === false) {
                return false;
            }
            if (typeof component.everyComponent === 'function') {
                if (component.everyComponent(fn, options) === false) {
                    return false;
                }
            }
        });
    }
    _getEmailTableHeader(options) {
        let row = '';
        const getHeaderCell = (component) => {
            if (!component.isInputComponent || !component.visible || component.skipInEmail) {
                return '';
            }
            const label = component.label || component.key;
            return `<th style="padding: 5px 10px;">${this.t(label, { _userInput: true })}</th>`;
        };
        const components = this.getComponents(0);
        for (const component of components) {
            if (component.isInputComponent) {
                row += getHeaderCell(component);
            }
            else if ((0, utils_2.isLayoutComponent)(component) && typeof component.everyComponent === 'function') {
                component.everyComponent((comp) => {
                    row += getHeaderCell(comp);
                }, options);
            }
        }
        return `<thead><tr>${row}</tr></thead>`;
    }
    _getEmailTableBody(options) {
        const getBodyCell = (component) => {
            if (!component.isInputComponent || !component.visible || component.skipInEmail) {
                return '';
            }
            return `<td style="padding: 5px 10px;">${component.getView(component.dataValue, options)}</td>`;
        };
        const rows = [];
        for (const { components } of this.iteratableRows) {
            let row = '';
            for (const component of components) {
                if (component.isInputComponent) {
                    row += getBodyCell(component);
                }
                else if ((0, utils_2.isLayoutComponent)(component) && typeof component.everyComponent === 'function') {
                    component.everyComponent((comp) => {
                        row += getBodyCell(comp);
                    }, options);
                }
            }
            rows.push(`<tr>${row}</tr>`);
        }
        return `<tbody>${rows.join('')}</tbody>`;
    }
    getValueAsString(value, options) {
        if (options === null || options === void 0 ? void 0 : options.email) {
            return `
        <table border="1" style="width:100%">
          ${this._getEmailTableHeader(options)}
          ${this._getEmailTableBody(options)}
        </table>
      `;
        }
        if (!value || !value.length) {
            return '';
        }
        return super.getValueAsString(value, options);
    }
    getComponents(rowIndex) {
        if (rowIndex !== undefined && rowIndex !== null) {
            if (!this.iteratableRows[rowIndex]) {
                return [];
            }
            return this.iteratableRows[rowIndex].components;
        }
        return super.getComponents();
    }
    removeSubmissionMetadataRow(index) {
        const componentMetadata = lodash_1.default.get(this.root, `submission.metadata.selectData.${this.path}`, null);
        if (lodash_1.default.isArray(componentMetadata)) {
            componentMetadata.splice(index, 1);
        }
    }
}
exports.default = NestedArrayComponent;
