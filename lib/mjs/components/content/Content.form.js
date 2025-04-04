import Components from '../Components';
import ContentEditDisplay from './editForm/Content.edit.display';
import ContentEditLogic from './editForm/Content.edit.logic';
/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
export default function (...extend) {
    const editForm = Components.baseEditForm([
        {
            key: 'display',
            components: ContentEditDisplay,
        },
        {
            key: 'data',
            ignore: true,
        },
        {
            key: 'validation',
            ignore: true,
        },
        {
            key: 'logic',
            components: ContentEditLogic,
        },
    ], ...extend);
    // Add content as full width above the settings.
    editForm.components = [{
            weight: 0,
            type: 'textarea',
            editor: 'ckeditor',
            label: 'Content',
            hideLabel: true,
            input: true,
            key: 'html',
            as: 'html',
            rows: 3,
            tooltip: 'The HTML template for the result data items.',
        }].concat(editForm.components);
    return editForm;
}
