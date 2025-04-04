"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const Formio_1 = require("../../../Formio");
exports.default = [
    {
        type: 'select',
        input: true,
        key: 'provider',
        label: 'Provider',
        placeholder: 'Select your address search provider',
        weight: 0,
        tooltip: 'Which address search service should be used.',
        valueProperty: 'value',
        dataSrc: 'custom',
        data: {
            custom() {
                return lodash_1.default.values(Formio_1.Formio.Providers.getProviders('address')).sort().map((provider) => ({
                    label: provider.displayName,
                    value: provider.name,
                }));
            },
        },
        validate: {
            required: true,
        },
    },
    {
        type: 'textfield',
        input: true,
        key: "subscriptionKey",
        label: 'Subscription Key',
        placeholder: 'Enter Subscription Key',
        weight: 10,
        tooltip: 'Use your Azure Maps subscription key here.',
        validate: {
            required: true,
        },
        conditional: {
            json: { '===': [{ var: 'data.provider' }, 'azure'] },
        },
    },
    {
        type: 'textfield',
        input: true,
        key: 'url',
        label: 'Url',
        placeholder: 'Enter Url',
        weight: 10,
        tooltip: 'Url to the service which should be used to search addresses for autocomplete.',
        validate: {
            required: true,
        },
        conditional: {
            json: { '===': [{ var: 'data.provider' }, 'custom'] },
        },
    },
    {
        type: 'textfield',
        input: true,
        key: 'queryProperty',
        label: 'Query Property',
        defaultValue: 'query',
        placeholder: 'Enter Query Property',
        weight: 20,
        tooltip: 'Which query param should be used to pass as a search string. Default is `query`.',
        conditional: {
            json: { '===': [{ var: 'data.provider' }, 'custom'] },
        },
    },
    {
        type: 'textfield',
        input: true,
        key: 'responseProperty',
        label: 'Response Property',
        placeholder: 'Enter Response Property',
        weight: 30,
        tooltip: 'The property within the response data, where iterable addresses reside. For example: results.',
        conditional: {
            json: { '===': [{ var: 'data.provider' }, 'custom'] },
        },
    },
    {
        type: 'textfield',
        input: true,
        key: 'displayValueProperty',
        label: 'Display Value Property',
        placeholder: 'Display Value Property',
        weight: 40,
        tooltip: 'The property of each address in the response to use as the display value.',
        conditional: {
            json: { '===': [{ var: 'data.provider' }, 'custom'] },
        },
    },
    {
        type: 'textarea',
        input: true,
        key: 'params',
        label: 'Params',
        placeholder: '{ ... }',
        weight: 50,
        rows: 5,
        editor: 'ace',
        as: 'json',
        tooltip: 'Additional query params can be specified here in a way of JSON object.',
        conditional: {
            json: { '===': [{ var: 'data.provider' }, 'custom'] },
        },
    },
    {
        type: 'textfield',
        input: true,
        key: 'apiKey',
        label: 'API Key',
        placeholder: 'Enter API Key',
        weight: 10,
        tooltip: 'Use your Google API key here.',
        validate: {
            required: true,
        },
        conditional: {
            json: { '===': [{ var: 'data.provider' }, 'google'] },
        },
    },
    {
        type: 'textarea',
        input: true,
        key: 'autocompleteOptions',
        label: 'Provider options',
        placeholder: 'Enter provider options as JSON object',
        defaultValue: {},
        weight: 60,
        rows: 5,
        as: 'json',
        editor: 'ace',
        tooltip: 'Specify Google Maps Autocomplete options used for address searching as JSON object. Follow the <a href =\'https://developers.google.com/maps/documentation/javascript/places-autocomplete\' target=\'_blank\'>link</a> for available options',
        conditional: {
            json: { '===': [{ var: 'data.provider' }, 'google'] },
        },
    },
    {
        type: 'textarea',
        input: true,
        key: 'manualModeViewString',
        label: 'Manual Mode View String',
        placeholder: 'Enter Manual Mode View String',
        description: '"address" variable references component value, "data" - submission data and "component" - address component schema.',
        weight: 60,
        rows: 5,
        editor: 'ace',
        tooltip: 'Specify template which should be when quering view string for the component value entered in manual mode. This string is used in table view, CSV export and email rendering. When left blank combined value of all components joined with comma will be used.',
    },
];
