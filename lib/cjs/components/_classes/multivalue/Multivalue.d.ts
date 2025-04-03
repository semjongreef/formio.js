export default class Multivalue extends Field {
    /**
     * Normalize values coming into updateValue.
     * @param {*} value - The value to normalize before setting.
     * @param {object} flags - Flags to use when normalizing the value.
     * @param {*} emptyValue - The empty value for the field.
     * @returns {*} - The normalized value.
     */
    normalizeValue(value: any, flags?: object, emptyValue?: any): any;
    get addAnother(): string;
    /**
     * @returns {Field} - The created field.
     */
    render(): Field;
    renderElement(): string;
    /**
     * Renders a single row for multi-value components.
     * @param {any} value - The value associated with the row to render.
     * @param {number} index - The index of the row in the multi-value list.
     * @returns {any} Returns the HTML string representation of the row.
     */
    renderRow(value: any, index: number): any;
    /**
     * @param {HTMLElement} dom - The DOM element to which the component will attach.
     * @returns {Promise} - Promise that resolves when all asynchronous tasks that have finished.
     */
    attach(dom: HTMLElement): Promise<any>;
    /**
     * Attach inputs to the element.
     * @param {HTMLElement} element - The element to attach.
     * @param {number} index - The index of the element to attach.
     */
    attachElement(element: HTMLElement, index: number): void;
    /**
     * Event handler for selecting a mask from a dropdown.
     * @param {Event} event - Event triggered by changing the selected option in mask.
     */
    onSelectMaskHandler(event: Event): void;
    /**
     * Retrieves the mask pattern for a given mask name
     * @param {string} maskName - The name of the mask to retrieve.
     * @returns {any} The mask pattern associated with the given mask name.
     */
    getMaskPattern(maskName: string): any;
    multiMasks: {} | undefined;
    /**
     * Attaches a selectable mask to an input field based on its configuration.
     * @param {number} index - The index of the select or input in component array.
     * @returns {boolean} - Returns true if the mask was successfully attached
     */
    attachMultiMask(index: number): boolean;
    /**
     * @param {any} input - The input element on which the mask is to be applied.
     * @param {string} mask - The mask pattern to apply to the input element. Exit early and remove previous mask if no mask.
     */
    updateMask(input: any, mask: string): void;
    /**
     * Adds a new empty value to the data array.
     * @param {any} value -A value to be added to the data array.
     */
    addNewValue(value: any): void;
    /**
     * Adds a new empty value to the data array, and add a new row to contain it.
     */
    addValue(): void;
}
import Field from '../field/Field';
