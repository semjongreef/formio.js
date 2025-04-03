/**
 * NestedComponent class.
 * @augments Field
 */
export default class NestedComponent extends Field {
    constructor(component: any, options: any, data: any);
    type: string;
    /**
     * The collapsed state of this NestedComponent.
     * @type {boolean}
     * @default false
     * @private
     */
    private _collapsed;
    /**
     * Set collapsed state.
     * @param {boolean} value - The collapsed state.
     * @returns {void}
     */
    set collapsed(value: boolean);
    /**
     * Get collapsed state.
     * @returns {boolean} The collapsed state.
     */
    get collapsed(): boolean;
    /**
     * Set collapsed state.
     * @param {boolean} value - The collapsed state.
     * @returns {void}
     */
    collapse(value: boolean): void;
    /**
     * Set parent visibility.
     * @param {boolean} value - The parent visibility.
     * @returns {void}
     */
    set parentVisible(value: boolean);
    /**
     * Get parent visibility.
     * @returns {boolean} The parent visibility.
     */
    get parentVisible(): boolean;
    /**
     * Get ready state from all components.
     * @returns {Promise<Array>} - The promise that resolves when all components are ready.
     */
    get ready(): Promise<any[]>;
    /**
     * Set currentForm object.
     * @param {object} instance - The current form object.
     * @returns {void}
     */
    set currentForm(instance: object);
    /**
     * Get currentForm object.
     * @returns {object} - The current form object.
     */
    get currentForm(): object;
    /**
     * Get Contextual data of the component.
     * @returns {object} - The contextual data of the component.
     * @override
     */
    override componentContext(): object;
    /**
     * Set the data of the component.
     * @param {object} value - The data of the component.
     * @returns {void}
     */
    override set data(value: object);
    /**
     * Get the data of the component.
     * @returns {object} - The data of the component.
     * @override
     */
    override get data(): object;
    /**
     * Get components array.
     * @returns {Array} - The components array.
     */
    getComponents(): any[];
    /**
     * Perform a deep iteration over every component, including those
     * within other container based components.
     * @param {Function} fn - Called for every component.
     * @param {any} options - The options to include with this everyComponent call.
     */
    everyComponent(fn: Function, options?: any): void;
    /**
     * Check if the component has a component.
     * @param {import('@formio/core').Component} component - The component to check.
     * @returns {boolean} - TRUE if the component has a component, FALSE otherwise.
     */
    hasComponent(component: import('@formio/core').Component): boolean;
    /**
     * Get the flattened components of this NestedComponent.
     * @returns {object} - The flattened components of this NestedComponent.
     */
    flattenComponents(): object;
    /**
     * Perform an iteration over each component within this container component.
     * @param {Function} fn - Called for each component
     */
    eachComponent(fn: Function): void;
    /**
     * Returns a component provided a key. This performs a deep search within the component tree.
     * @param {string} path - The path to the component.
     * @returns {any} - The component that is located.
     */
    getComponent(path: string): any;
    /**
     * Return a component provided the Id of the component.
     * @param {string} id - The Id of the component.
     * @param {Function} fn - Called with the component once it is retrieved.
     * @returns {object} - The component retrieved.
     */
    getComponentById(id: string, fn?: Function): object;
    /**
     * Create a new component and add it to the components array.
     * @param {import('@formio/core').Component} component - The component JSON schema to create.
     * @param {object} options - The options to create the component with.
     * @param {import('@formio/core').DataObject} data - The submission data object to house the data for this component.
     * @param {import('@formio/core').Component} [before] - The component before which to add this component.
     * @param {import('@formio/core').Component} [replacedComp] - The component to replace with this component.
     * @returns {any} - The created component instance.
     */
    createComponent(component: import('@formio/core').Component, options: object, data: import('@formio/core').DataObject, before?: import("@formio/core").Component | undefined, replacedComp?: import("@formio/core").Component | undefined): any;
    getContainer(): any;
    get componentComponents(): any;
    get nestedKey(): string;
    get templateName(): string;
    components: any;
    /**
     * Add a new component instance to the components array.
     * @param {import('@formio/core').DataObject} [data] - The Submission data for this component.
     * @param {object} [options] - The options for this component.
     */
    addComponents(data?: import("@formio/core").DataObject | undefined, options?: object | undefined): void;
    /**
     * Add a new component to the components array.
     * @param {import('@formio/core').Component} component - The component JSON schema to add.
     * @param {object} data - The submission data object to house the data for this component.
     * @param {HTMLElement} before - A DOM element to insert this element before.
     * @param {boolean} [noAdd] - A possibly extraneous boolean flag.
     * @returns {any} - The created component instance.
     */
    addComponent(component: import('@formio/core').Component, data?: object, before?: HTMLElement, noAdd?: boolean | undefined): any;
    beforeFocus(): void;
    render(children: any): string;
    renderComponents(components: any): any;
    attach(element: any): Promise<[void, void]>;
    /**
     * Attach the logic to the components.
     * @param {import('@formio/core').Component[]} components - The components to attach logic to.
     */
    attachComponentsLogic(components: import('@formio/core').Component[]): void;
    attachComponents(element: any, components: any, container: any): Promise<any>;
    /**
     * Remove a component from the components array and from the children object
     * @param {import('@formio/core').Component} component - The component to remove from the components.
     * @param {import('@formio/core').Component[]} components - An array of components to remove this component from.
     * @param {boolean} [all] - If set to TRUE will cascade remove all components.
     */
    removeComponent(component: import('@formio/core').Component, components: import('@formio/core').Component[], all?: boolean | undefined): void;
    /**
     * Removes a component provided the API key of that component.
     * @param {string} key - The API key of the component to remove.
     * @param {Function} fn - Called once the component is removed.
     * @returns {null|void} - Returns nothing if the component is not found.
     */
    removeComponentByKey(key: string, fn?: Function): null | void;
    /**
     * Removes a component provided the Id of the component.
     * @param {string} id - The Id of the component to remove.
     * @param {Function} fn - Called when the component is removed.
     * @returns {null|void} - Returns nothing if the component is not found.
     */
    removeComponentById(id: string, fn?: Function): null | void;
    updateValue(value: any, flags?: {}): any;
    shouldSkipValidation(data: any, row: any, flags: any): boolean;
    checkData(data: any, flags: any, row: any, components: any): true | undefined;
    checkConditions(data: any, flags: any, row: any): boolean;
    clearOnHide(show: any): void;
    /**
     * Allow components to hook into the next page trigger to perform their own logic.
     * @param {Function} next - The callback to continue to the next page.
     * @returns {Promise} - A promise when the page has been processed.
     */
    beforePage(next: Function): Promise<any>;
    /**
     * Allow components to hook into the submission to provide their own async data.
     * @returns {Promise} - Returns a promise when the constituent beforeSubmit functions are complete.
     */
    beforeSubmit(): Promise<any>;
    calculateValue(data: any, flags: any, row: any): any;
    isLastPage(): boolean;
    isValid(data: any, dirty: any): any;
    validationProcessor({ scope, data, row, instance, paths }: {
        scope: any;
        data: any;
        row: any;
        instance: any;
        paths: any;
    }, flags: any): void;
    /**
     * Perform a validation on all child components of this nested component.
     * @param {import('@formio/core').Component[]} components - The components to validate.
     * @param {import('@formio/core').DataObject} data - The data to validate.
     * @param {object} flags - The flags to use when validating.
     * @returns {Promise<Array>|Array} - The errors if any exist.
     */
    validateComponents(components?: import('@formio/core').Component[], data?: import('@formio/core').DataObject, flags?: object): Promise<any[]> | any[];
    /**
     * Validate a nested component with data, or its own internal data.
     * @param {import('@formio/core').DataObject} data - The data to validate.
     * @param {object} flags - The flags to use when validating.
     * @returns {Array} - The errors if any exist.
     */
    validate(data?: import('@formio/core').DataObject, flags?: object): any[];
    checkComponentValidity(data?: null, dirty?: boolean, row?: null, flags?: {}, allErrors?: any[]): boolean;
    checkAsyncValidity(data?: null, dirty?: boolean, row?: null, silentCheck?: boolean): Promise<any>;
    setPristine(pristine: any): void;
    get isDirty(): boolean | undefined;
    destroyComponents(all?: boolean): void;
    get visibleErrors(): any;
    get errors(): any;
    getValue(): object;
    get dataReady(): Promise<any[]>;
    setNestedValue(component: any, value: any, flags?: {}): any;
    setValue(value: any, flags?: {}): any;
    get lazyLoad(): any;
}
import Field from '../field/Field';
