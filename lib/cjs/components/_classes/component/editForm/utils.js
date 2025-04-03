"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const Evaluator_1 = require("../../../../utils/Evaluator");
const EditFormUtils = {
    sortAndFilterComponents(components) {
        return lodash_1.default.filter(lodash_1.default.sortBy(components, 'weight'), (item) => !item.ignore);
    },
    unifyComponents(objValue, srcValue) {
        if (objValue.key && srcValue.key) {
            if ((objValue.skipMerge || srcValue.skipMerge) && !objValue.ignore) {
                return false;
            }
            if (objValue.key === srcValue.key) {
                // Create complete objects by including missing keys.
                lodash_1.default.each(objValue, (value, prop) => {
                    if (objValue.overrideEditForm || !srcValue.hasOwnProperty(prop)) {
                        srcValue[prop] = value;
                    }
                });
                lodash_1.default.each(srcValue, (value, prop) => {
                    if (srcValue.overrideEditForm || !objValue.hasOwnProperty(prop)) {
                        objValue[prop] = value;
                    }
                });
                if (objValue.components) {
                    srcValue.components = EditFormUtils.sortAndFilterComponents(lodash_1.default.unionWith(objValue.components, srcValue.components, EditFormUtils.unifyComponents));
                }
                return true;
            }
            else {
                return false;
            }
        }
        return lodash_1.default.isEqual(objValue, srcValue);
    },
    tokenVariableDescription() {
        return '<tr><th>token</th><td>The decoded JWT token for the authenticated user.</td></tr>';
    },
    logicVariablesTable(additional) {
        additional = additional || '';
        return {
            type: 'htmlelement',
            tag: 'div',
            /* eslint-disable prefer-template */
            content: '<p>The following variables are available in all scripts.</p>' +
                '<table class="table table-bordered table-condensed table-striped">' +
                additional +
                '<tr><th>form</th><td>The complete form JSON object</td></tr>' +
                '<tr><th>submission</th><td>The complete submission object.</td></tr>' +
                '<tr><th>data</th><td>The complete submission data object.</td></tr>' +
                '<tr><th>row</th><td>Contextual "row" data, used within DataGrid, EditGrid, and Container components</td></tr>' +
                '<tr><th>component</th><td>The current component JSON</td></tr>' +
                '<tr><th>instance</th><td>The current component instance.</td></tr>' +
                '<tr><th>value</th><td>The current value of the component.</td></tr>' +
                '<tr><th>moment</th><td>The moment.js library for date manipulation.</td></tr>' +
                '<tr><th>_</th><td>An instance of <a href="https://lodash.com/docs/" target="_blank" rel="noopener noreferrer">Lodash</a>.</td></tr>' +
                '<tr><th>utils</th><td>An instance of the <a href="https://help.form.io/developers/javascript-development/javascript-utilities" target="_blank" rel="noopener noreferrer">FormioUtils</a> object.</td></tr>' +
                '<tr><th>util</th><td>An alias for "utils".</td></tr>' +
                '</table><br/>'
            /* eslint-enable prefer-template */
        };
    },
    javaScriptValue(title, property, propertyJSON, weight, exampleHTML, exampleJSON, additionalParams = '', excludeJSONLogic) {
        const components = [
            this.logicVariablesTable(additionalParams),
            {
                type: 'panel',
                title: 'JavaScript',
                collapsible: true,
                collapsed: false,
                style: { 'margin-bottom': '10px' },
                key: `${property}-js`,
                customConditional() {
                    return !Evaluator_1.Evaluator.noeval || Evaluator_1.Evaluator.protectedEval;
                },
                components: [
                    {
                        type: 'textarea',
                        key: property,
                        rows: 5,
                        editor: 'ace',
                        hideLabel: true,
                        as: 'javascript',
                        input: true
                    },
                    {
                        type: 'htmlelement',
                        tag: 'div',
                        content: `<p>Enter custom javascript code.</p>${exampleHTML}`
                    }
                ]
            },
            {
                type: 'panel',
                title: 'JSONLogic',
                collapsible: true,
                collapsed: true,
                key: `${property}-json`,
                components: [
                    {
                        type: 'htmlelement',
                        tag: 'div',
                        /* eslint-disable prefer-template */
                        content: '<p>Execute custom logic using <a href="http://jsonlogic.com/" target="_blank" rel="noopener noreferrer">JSONLogic</a>.</p>' +
                            '<p>Full <a href="https://lodash.com/docs" target="_blank" rel="noopener noreferrer">Lodash</a> support is provided using an "_" before each operation, such as <code>{"_sum": {var: "data.a"}}</code></p>' +
                            exampleJSON
                        /* eslint-enable prefer-template */
                    },
                    {
                        type: 'textarea',
                        key: propertyJSON,
                        rows: 5,
                        editor: 'ace',
                        hideLabel: true,
                        as: 'json',
                        input: true
                    }
                ]
            }
        ];
        if (excludeJSONLogic) {
            components.splice(2, 1);
        }
        return {
            type: 'panel',
            title: title,
            theme: 'default',
            collapsible: true,
            collapsed: true,
            key: `${property}Panel`,
            weight: weight,
            components
        };
    }
};
exports.default = EditFormUtils;
