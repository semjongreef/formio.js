"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const utils_1 = require("./utils");
exports.default = {
    /**
     * Appends a number to a component.key to keep it unique
     * @param {import('@formio/core').Component[]} container - The container of components to uniquify against
     * @param {import('@formio/core').Component} component - The Component to uniqify.
     * @returns {boolean} - If the component was changed.
     */
    uniquify(container, component) {
        let changed = false;
        const formKeys = {};
        (0, utils_1.eachComponent)(container, (comp) => {
            formKeys[comp.key] = true;
            if (['address', 'container', 'datagrid', 'editgrid', 'dynamicWizard', 'tree'].includes(comp.type) || comp.tree || comp.arrayTree) {
                return true;
            }
        }, true);
        // Recurse into all child components.
        (0, utils_1.eachComponent)([component], (component) => {
            // Skip key uniquification if this component doesn't have a key.
            if (!component.key) {
                return;
            }
            const newKey = (0, utils_1.uniqueKey)(formKeys, component.key);
            if (newKey !== component.key) {
                component.key = newKey;
                changed = true;
            }
            formKeys[newKey] = true;
            if (['address', 'container', 'datagrid', 'editgrid', 'dynamicWizard', 'tree'].includes(component.type) || component.tree || component.arrayTree) {
                return true;
            }
        }, true);
        return changed;
    },
    /**
     * Additional shortcuts for the builder.
     */
    additionalShortcuts: {
        button: [
            'Enter',
            'Esc'
        ]
    },
    /**
     * Returns the alpha character shortcuts.
     * @returns {string[]} - An array of shortcuts of alpha characters.
     */
    getAlphaShortcuts() {
        return lodash_1.default.range('A'.charCodeAt(), 'Z'.charCodeAt() + 1).map((charCode) => String.fromCharCode(charCode));
    },
    getAdditionalShortcuts(type) {
        return this.additionalShortcuts[type] || [];
    },
    getBindedShortcuts(components, input) {
        const result = [];
        (0, utils_1.eachComponent)(components, (component) => {
            if (component === input) {
                return;
            }
            if (component.shortcut) {
                result.push(component.shortcut);
            }
            if (component.values) {
                component.values.forEach((value) => {
                    if (value.shortcut) {
                        result.push(value.shortcut);
                    }
                });
            }
        }, true);
        return result;
    },
    getAvailableShortcuts(form, component) {
        if (!component) {
            return [];
        }
        return [''].concat(lodash_1.default.difference(this.getAlphaShortcuts().concat(this.getAdditionalShortcuts(component.type)), this.getBindedShortcuts(form.components, component))).map((shortcut) => ({
            label: shortcut,
            value: shortcut,
        }));
    }
};
