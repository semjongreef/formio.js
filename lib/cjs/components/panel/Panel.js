"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NestedComponent_1 = __importDefault(require("../_classes/nested/NestedComponent"));
const utils_1 = require("../../utils/utils");
class PanelComponent extends NestedComponent_1.default {
    static schema(...extend) {
        return NestedComponent_1.default.schema({
            label: 'Panel',
            type: 'panel',
            key: 'panel',
            title: 'Panel',
            theme: 'default',
            breadcrumb: 'default',
            components: [],
            clearOnHide: false,
            input: false,
            tableView: false,
            persistent: false
        }, ...extend);
    }
    static get builderInfo() {
        return {
            title: 'Panel',
            icon: 'list-alt',
            group: 'layout',
            documentation: '/userguide/form-building/layout-components#panel',
            showPreview: false,
            weight: 30,
            schema: PanelComponent.schema()
        };
    }
    get defaultSchema() {
        return PanelComponent.schema();
    }
    get templateName() {
        return 'panel';
    }
    static savedValueTypes() {
        return [];
    }
    constructor(...args) {
        super(...args);
        this.noField = true;
        this.on('componentError', (err) => {
            //change collapsed value only when the panel is collapsed to avoid additional redrawing that prevents validation messages
            if ((0, utils_1.isChildOf)(err.instance, this) && this.collapsed) {
                this.collapsed = false;
            }
        });
    }
}
exports.default = PanelComponent;
