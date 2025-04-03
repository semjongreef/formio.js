"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("./utils"));
const utils_2 = require("../../../../utils/utils");
/* eslint-disable quotes, max-len */
exports.default = [
    {
        type: 'panel',
        title: 'Simple',
        key: 'simple-conditional',
        theme: 'default',
        weight: 105,
        components: [
            {
                type: 'select',
                input: true,
                label: 'This component should Display:',
                key: 'conditional.show',
                dataSrc: 'values',
                data: {
                    values: [
                        { label: 'True', value: 'true' },
                        { label: 'False', value: 'false' }
                    ]
                }
            },
            {
                type: 'select',
                input: true,
                label: 'When the form component:',
                key: 'conditional.when',
                dataSrc: 'custom',
                valueProperty: 'value',
                data: {
                    custom(context) {
                        return (0, utils_2.getContextComponents)(context);
                    }
                }
            },
            {
                type: 'textfield',
                input: true,
                label: 'Has the value:',
                key: 'conditional.eq'
            }
        ]
    },
    utils_1.default.javaScriptValue('Advanced Conditions', 'customConditional', 'conditional.json', 110, '<p>You must assign the <strong>show</strong> variable a boolean result.</p>' +
        '<p><strong>Note: Advanced Conditional logic will override the results of the Simple Conditional logic.</strong></p>' +
        '<h5>Example</h5><pre>show = !!data.showMe;</pre>', '<p><a href="https://help.form.io/userguide/form-building/logic-and-conditions" target="_blank" rel="noopener noreferrer">Click here for an example</a></p>', utils_1.default.tokenVariableDescription())
];
/* eslint-enable quotes, max-len */
