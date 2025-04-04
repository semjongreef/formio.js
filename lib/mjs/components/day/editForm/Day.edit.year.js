import _ from 'lodash';
export default [
    {
        wieght: 200,
        type: 'select',
        datasrc: 'values',
        key: 'fields.year.type',
        label: 'Type of input',
        data: {
            values: [
                {
                    label: 'Number',
                    value: 'number'
                },
                {
                    label: 'Select',
                    value: 'select'
                },
            ]
        }
    },
    {
        weight: 203,
        type: 'number',
        input: true,
        key: 'fields.year.minYear',
        label: 'Minimum Year',
        placeholder: '1900',
        tooltip: 'The minimum year that can be entered.'
    },
    {
        weight: 204,
        type: 'number',
        input: true,
        key: 'fields.year.maxYear',
        label: 'Maximum Year',
        placeholder: '2030',
        tooltip: 'The maximum year that can be entered.'
    },
    {
        weight: 210,
        type: 'textfield',
        input: true,
        key: 'fields.year.placeholder',
        label: 'Placeholder',
        placeholder: 'Year Placeholder',
        tooltip: 'The placeholder text that will appear when Year field is empty.'
    },
    {
        weight: 215,
        type: 'checkbox',
        label: 'Hidden',
        tooltip: 'Hide the Year part of the component.',
        key: 'fields.year.hide',
        onChange: ({ data }) => {
            if (data.defaultValue) {
                const defaultValueParts = data.defaultValue.split('/');
                if (!data.fields.month.hide && defaultValueParts.length !== 3) {
                    defaultValueParts.push('0000');
                    _.set(data, 'defaultValue', defaultValueParts.join('/'));
                }
            }
        },
        input: true
    },
];
