import listComponentForm from '../_classes/list/ListComponent.form';
import RadioEditData from './editForm/Radio.edit.data';
import RadioEditDisplay from './editForm/Radio.edit.display';
import RadioEditValidation from './editForm/Radio.edit.validation';
/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
export default function (...extend) {
    return listComponentForm([
        {
            key: 'display',
            components: RadioEditDisplay
        },
        {
            key: 'data',
            components: RadioEditData
        },
        {
            key: 'validation',
            components: RadioEditValidation
        },
    ], ...extend);
}
