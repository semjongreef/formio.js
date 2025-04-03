"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = __importDefault(require("./_classes/component/Component"));
const utils_1 = __importDefault(require("./_classes/component/editForm/utils"));
const Component_form_1 = __importDefault(require("./_classes/component/Component.form"));
const lodash_1 = __importDefault(require("lodash"));
class Components {
    static set EditFormUtils(value) {
        Components._editFormUtils = value;
    }
    static get EditFormUtils() {
        return Components._editFormUtils;
    }
    static set baseEditForm(value) {
        Components._baseEditForm = value;
    }
    static get baseEditForm() {
        return Components._baseEditForm;
    }
    static recalculateComponents() {
        if (window && window.Formio && window.Formio.AllComponents) {
            Components.setComponents(window.Formio.AllComponents);
        }
    }
    static get components() {
        if (!Components._components) {
            Components._components = {};
        }
        return Components._components;
    }
    static setComponents(comps) {
        // Set the tableView method on BaseComponent.
        if (comps.base) {
            // Implement the tableView method.
            comps.base.tableView = function (value, options) {
                const comp = Components.create(options.component, options.options || {}, options.data || {}, true);
                return comp.getView(value);
            };
        }
        lodash_1.default.assign(Components.components, comps);
    }
    static addComponent(name, comp) {
        return Components.setComponent(name, comp);
    }
    static setComponent(name, comp) {
        Components.components[name] = comp;
    }
    static create(component, options, data) {
        let comp = null;
        if (component.type && Components.components.hasOwnProperty(component.type)) {
            comp = new Components.components[component.type](component, options, data);
        }
        else if (component.arrayTree) {
            // eslint-disable-next-line new-cap
            comp = new Components.components['datagrid'](component, options, data);
        }
        else if (component.tree) {
            // eslint-disable-next-line new-cap
            comp = new Components.components['nesteddata'](component, options, data);
        }
        else if (Array.isArray(component.components)) {
            // eslint-disable-next-line new-cap
            comp = new Components.components['nested'](component, options, data);
        }
        else if (options && options.server) {
            // eslint-disable-next-line new-cap
            comp = new Components.components['hidden'](component, options, data);
        }
        else {
            comp = new Component_1.default(component, options, data);
        }
        if (comp.path) {
            comp.componentsMap[comp.path] = comp;
        }
        return comp;
    }
}
Components._editFormUtils = utils_1.default;
Components._baseEditForm = Component_form_1.default;
exports.default = Components;
