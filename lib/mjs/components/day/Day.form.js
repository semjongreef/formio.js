import Components from '../Components';
import DayEditData from './editForm/Day.edit.data';
import DayEditDisplay from './editForm/Day.edit.display';
import DayEditValidation from './editForm/Day.edit.validation';
import DayEditDay from './editForm/Day.edit.day';
import DayEditMonth from './editForm/Day.edit.month';
import DayEditYear from './editForm/Day.edit.year';
/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
export default function (...extend) {
    return Components.baseEditForm([
        {
            key: 'display',
            components: DayEditDisplay
        },
        {
            key: 'data',
            components: DayEditData,
        },
        {
            key: 'validation',
            components: DayEditValidation
        },
        {
            key: 'day',
            label: 'Day',
            weight: 3,
            components: DayEditDay
        },
        {
            key: 'month',
            label: 'Month',
            weight: 3,
            components: DayEditMonth
        },
        {
            key: 'year',
            label: 'Year',
            weight: 3,
            components: DayEditYear
        },
    ], ...extend);
}
