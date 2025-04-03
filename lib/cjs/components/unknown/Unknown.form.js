"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const Unknown_edit_display_1 = __importDefault(require("./editForm/Unknown.edit.display"));
const utils_1 = __importDefault(require("../../components/_classes/component/editForm/utils"));
/**
 * Unknown Component schema.
 * @param {...any} extend
 * @returns {object} - The Unknown Component edit form.
 */
function default_1(...extend) {
    const components = [
        {
            label: 'Custom',
            key: 'display',
            weight: 0,
            components: Unknown_edit_display_1.default
        }
    ].concat(...extend);
    return {
        components: [
            {
                type: 'tabs',
                key: 'tabs',
                components: (0, lodash_1.unionWith)(components, utils_1.default.unifyComponents)
            }
        ]
    };
}
exports.default = default_1;
