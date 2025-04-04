import Components from '../Components';
import DateTimeEditData from './editForm/DateTime.edit.data';
import DateTimeEditDate from './editForm/DateTime.edit.date';
import DateTimeEditDisplay from './editForm/DateTime.edit.display';
import DateTimeEditTime from './editForm/DateTime.edit.time';
import DateTimeEditValidation from './editForm/DateTime.edit.validation';
/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
export default function (...extend) {
    return Components.baseEditForm([
        {
            key: 'display',
            components: DateTimeEditDisplay
        },
        {
            label: 'Date',
            key: 'date',
            weight: 1,
            components: DateTimeEditDate
        },
        {
            label: 'Time',
            key: 'time',
            weight: 2,
            components: DateTimeEditTime
        },
        {
            key: 'data',
            components: DateTimeEditData
        },
        {
            key: 'validation',
            components: DateTimeEditValidation
        },
    ], ...extend);
}
