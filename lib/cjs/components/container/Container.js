"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const utils_1 = require("../../utils/utils");
const Component_1 = __importDefault(require("../_classes/component/Component"));
const Field_1 = __importDefault(require("../_classes/field/Field"));
const NestedDataComponent_1 = __importDefault(require("../_classes/nesteddata/NestedDataComponent"));
class ContainerComponent extends NestedDataComponent_1.default {
    static schema(...extend) {
        return NestedDataComponent_1.default.schema({
            label: 'Container',
            type: 'container',
            key: 'container',
            clearOnHide: true,
            input: true,
            tree: true,
            hideLabel: true,
            components: []
        }, ...extend);
    }
    static get builderInfo() {
        return {
            title: 'Container',
            icon: 'folder-open',
            group: 'data',
            documentation: '/userguide/form-building/data-components#container',
            showPreview: false,
            weight: 10,
            schema: ContainerComponent.schema()
        };
    }
    constructor(...args) {
        super(...args);
        this.type = 'container';
    }
    static savedValueTypes(schema) {
        return (0, utils_1.getComponentSavedTypes)(schema) || [utils_1.componentValueTypes.object];
    }
    addComponents(data, options) {
        return super.addComponents(this.dataValue, options);
    }
    get defaultSchema() {
        return ContainerComponent.schema();
    }
    get emptyValue() {
        return {};
    }
    get templateName() {
        return 'container';
    }
    componentContext() {
        return this.dataValue;
    }
    checkData(data, flags, row, components) {
        data = data || this.rootValue;
        flags = flags || {};
        row = row || this.data;
        components = components && lodash_1.default.isArray(components) ? components : this.getComponents();
        Component_1.default.prototype.checkData.call(this, data, flags, row);
        components.forEach((comp) => comp.checkData(data, flags, this.dataValue));
    }
    focus() {
        const focusableElements = (0, utils_1.getFocusableElements)(this.element);
        if (focusableElements && focusableElements[0]) {
            focusableElements[0].focus();
        }
    }
    checkConditions(data, flags, row) {
        // check conditions of parent component first, because it may influence on visibility of it's children
        const check = Field_1.default.prototype.checkConditions.call(this, data, flags, row);
        this.getComponents().forEach(comp => comp.checkConditions(data, flags, this.dataValue));
        return check;
    }
}
exports.default = ContainerComponent;
