"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("./utils"));
const Evaluator_1 = require("../../../../utils/Evaluator");
/* eslint-disable quotes, max-len */
exports.default = [
    {
        weight: 10,
        type: 'checkbox',
        label: 'Required',
        tooltip: 'A required field must be filled in before the form can be submitted.',
        key: 'validate.required',
        input: true
    },
    {
        weight: 100,
        type: 'checkbox',
        label: 'Unique',
        tooltip: 'Makes sure the data submitted for this field is unique, and has not been submitted before.',
        key: 'unique',
        input: true
    },
    {
        weight: 100,
        type: 'checkbox',
        label: 'Validate When Hidden',
        tooltip: 'Validates the component when it is hidden/conditionally hidden. Vaildation errors are displayed in the error alert on the form submission. Use caution when enabling this setting, as it can cause a hidden component to be invalid with no way for the form user to correct it.',
        key: 'validateWhenHidden',
        input: true
    },
    {
        weight: 0,
        type: 'select',
        key: 'validateOn',
        defaultValue: 'change',
        input: true,
        label: 'Validate On',
        tooltip: 'Determines when this component should trigger front-end validation.',
        dataSrc: 'values',
        data: {
            values: [
                { label: 'Change', value: 'change' },
                { label: 'Blur', value: 'blur' }
            ]
        }
    },
    {
        weight: 190,
        type: 'textfield',
        input: true,
        key: 'errorLabel',
        label: 'Error Label',
        placeholder: 'Error Label',
        tooltip: 'The label for this field when an error occurs.'
    },
    {
        weight: 200,
        key: 'validate.customMessage',
        label: 'Custom Error Message',
        placeholder: 'Custom Error Message',
        type: 'textfield',
        tooltip: 'Error message displayed if any error occurred.',
        input: true
    },
    {
        type: 'panel',
        title: 'Custom Validation',
        collapsible: true,
        collapsed: true,
        style: { 'margin-bottom': '10px' },
        key: 'custom-validation-js',
        weight: 300,
        customConditional() {
            return !Evaluator_1.Evaluator.noeval || Evaluator_1.Evaluator.protectedEval;
        },
        components: [
            utils_1.default.logicVariablesTable('<tr><th>input</th><td>The value that was input into this component</td></tr>'),
            {
                type: 'textarea',
                key: 'validate.custom',
                rows: 5,
                editor: 'ace',
                hideLabel: true,
                as: 'javascript',
                input: true
            },
            {
                type: 'htmlelement',
                tag: 'div',
                content: `
          <small>
            <p>Enter custom validation code.</p>
            <p>You must assign the <strong>valid</strong> variable as either <strong>true</strong> or an error message if validation fails.</p>
            <h5>Example:</h5>
            <pre>valid = (input === 'Joe') ? true : 'Your name must be "Joe"';</pre>
          </small>`
            },
            {
                type: 'well',
                components: [
                    {
                        weight: 100,
                        type: 'checkbox',
                        label: 'Secret Validation',
                        tooltip: 'Check this if you wish to perform the validation ONLY on the server side. This keeps your validation logic private and secret.',
                        description: 'Check this if you wish to perform the validation ONLY on the server side. This keeps your validation logic private and secret.',
                        key: 'validate.customPrivate',
                        input: true
                    }
                ]
            }
        ]
    },
    {
        type: 'panel',
        title: 'JSONLogic Validation',
        collapsible: true,
        collapsed: true,
        key: 'json-validation-json',
        weight: 400,
        components: [
            {
                type: 'htmlelement',
                tag: 'div',
                /* eslint-disable prefer-template */
                content: '<p>Execute custom logic using <a href="http://jsonlogic.com/" target="_blank" rel="noopener noreferrer">JSONLogic</a>.</p>' +
                    '<h5>Example:</h5>' +
                    '<pre>' + JSON.stringify({
                    "if": [
                        { "===": [{ "var": "input" }, "Bob"] },
                        true,
                        "Your name must be 'Bob'!"
                    ]
                }, null, 2) + '</pre>'
                /* eslint-enable prefer-template */
            },
            {
                type: 'textarea',
                key: 'validate.json',
                hideLabel: true,
                rows: 5,
                editor: 'ace',
                as: 'json',
                input: true
            }
        ]
    },
    {
        type: 'panel',
        title: 'Custom Errors',
        collapsible: true,
        collapsed: true,
        key: 'errors',
        weight: 400,
        components: [
            {
                type: 'textarea',
                key: 'errors',
                hideLabel: true,
                rows: 5,
                editor: 'ace',
                as: 'json',
                input: true
            },
            {
                type: 'htmlelement',
                tag: 'div',
                content: `
          <p>This allows you to set different custom error messages for different errors
          (in contrast to “Custom Error Message”, which only allows you to set one
          error message for all errors). E.g.</p>

<pre>{
  "required": "{<span/>{ field }} is required. Try again.",
  "maxLength": "{<span/>{ field }} is too long. Try again."
}</pre>

          <p>You can set the following keys (among others):</p>
          <ul>
            <li>r<span/>equired</li>
            <li>m<span/>in</li>
            <li>m<span/>ax</li>
            <li>m<span/>inLength</li>
            <li>m<span/>axLength</li>
            <li>m<span/>inWords</li>
            <li>m<span/>axWords</li>
            <li>i<span/>nvalid_email</li>
            <li>i<span/>nvalid_date</li>
            <li>i<span/>nvalid_day</li>
            <li>i<span/>nvalid_regex</li>
            <li>m<span/>ask</li>
            <li>p<span/>attern</li>
            <li>c<span/>ustom</li>
          </ul>

          <p>Depending on the error message some of the following template variables can be used in the script:</p>
          <ul>
           <li><code>{<span/>{ f<span/>ield }}</code> is replaced with the label of the field.</li>
           <li><code>{<span/>{ m<span/>in }}</code></li>
           <li><code>{<span/>{ m<span/>ax }}</code></li>
           <li><code>{<span/>{ l<span/>ength }}</code></li>
           <li><code>{<span/>{ p<span/>attern }}</code></li>
           <li><code>{<span/>{ m<span/>inDate }}</code></li>
           <li><code>{<span/>{ m<span/>axDate }}</code></li>
           <li><code>{<span/>{ m<span/>inYear }}</code></li>
           <li><code>{<span/>{ m<span/>axYear }}</code></li>
           <li><code>{<span/>{ r<span/>egex }}</code></li>
          </ul>
        `
            }
        ]
    }
];
/* eslint-enable quotes, max-len */
