import listComponentForm from '../_classes/list/ListComponent.form';
import SelectEditData from './editForm/Select.edit.data';
import SelectEditDisplay from './editForm/Select.edit.display';
import SelectEditValidation from './editForm/Select.edit.validation';
/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
export default function (...extend) {
    return listComponentForm([
        {
            key: 'display',
            components: SelectEditDisplay
        },
        {
            key: 'data',
            components: SelectEditData
        },
        {
            key: 'validation',
            components: SelectEditValidation
        },
    ], ...extend);
}
