export default class FormComponent extends Component {
    static get builderInfo(): {
        title: string;
        icon: string;
        group: string;
        documentation: string;
        weight: number;
        schema: any;
    };
    static savedValueTypes(): string[];
    init(): any;
    formObj: any;
    valueChanged: boolean | undefined;
    subForm: any;
    formSrc: any;
    get dataReady(): any;
    get emptyValue(): {
        data: {};
    };
    get ready(): Promise<any>;
    get useOriginalRevision(): any;
    setFormRevision(rev: any): void;
    subFormRevision: any;
    getComponent(path: any): any;
    getSubOptions(options?: {}): {};
    render(): string;
    asString(value: any): any;
    /**
     * Prints out the value of form components as a datagrid value.
     */
    getValueAsString(value: any, options: any): any;
    attach(element: any): Promise<void>;
    get hasLoadedForm(): any;
    get isRevisionChanged(): any;
    get subFormData(): any;
    subFormReady: Promise<any> | null | undefined;
    /**
     * Pass everyComponent to subform.
     * @param {any[]} args - Arguments to pass through to the subform's everyComponent method.
     * @returns {*} - The result of the subform's everyComponent method.
     */
    everyComponent(...args: any[]): any;
    setSubFormDisabled(subForm: any): void;
    updateSubWizards(subForm: any): void;
    /**
     * Create a subform instance.
     * @param {boolean} [fromAttach] - This function is being called from an `attach` method.
     * @param {boolean} [beforeSubmit] - This function is being called from a `beforeSubmit` method.
     * @returns {*} - The subform instance.
     */
    createSubForm(fromAttach?: boolean | undefined, beforeSubmit?: boolean | undefined): any;
    hideSubmitButton(component: any): void;
    /**
     * Load the subform.
     * @param {boolean} fromAttach - This function is being called from an `attach` method.
     * @param {boolean} beforeSubmit - This function is being called from a `beforeSubmit` method.
     * @returns {Promise} - The promise that resolves when the subform is loaded.
     */
    loadSubForm(fromAttach: boolean, beforeSubmit: boolean): Promise<any>;
    subFormLoading: boolean | undefined;
    checkComponentConditions(data: any, flags: any, row: any): any;
    calculateValue(data: any, flags: any, row: any): any;
    setPristine(pristine: any): void;
    /**
     * Determine if the subform should be submitted.
     * @returns {*|boolean} - TRUE if the subform should be submitted, FALSE if it should not.
     */
    get shouldSubmit(): any;
    /**
     * Returns the data for the subform.
     * @returns {*} - the data for the subform.
     */
    getSubFormData(): any;
    /**
     * Submit the subform if configured to do so.
     * @returns {Promise} - The promise that resolves when the subform is submitted.
     */
    submitSubForm(): Promise<any>;
    /**
     * Submit the form before the next page is triggered.
     * @param {Function} next - The function to trigger the next page.
     * @returns {Promise} - The promise that resolves when the subform submission is complete (if necessary) and the next page is triggered.
     */
    beforePage(next: Function): Promise<any>;
    /**
     * Submit the form before the whole form is triggered.
     * @returns {Promise} - The promise that resolves when the subform submission is complete (if necessary) and the form is submitted.
     */
    beforeSubmit(): Promise<any>;
    isSubFormLazyLoad(): any;
    isHidden(): boolean;
    setValue(submission: any, flags?: {}): boolean;
    setSubFormValue(submission: any, flags: any): void;
    /**
     * Sets the subform value
     * @param {object|null|undefined} submission - The submission to set.
     * @param {object|null|undefined} flags - Any flags to apply when setting the submission.
     * @returns {void}
     */
    onSetSubFormValue(submission: object | null | undefined, flags: object | null | undefined): void;
    areAllComponentsEmpty(data: any): boolean;
    updateSubFormVisibility(): void;
    /**
     * Determines if this form is a Nested Wizard
     * which means it should be a Wizard itself and should be a direct child of a Wizard's page
     * @returns {boolean} - TRUE if this form is a Nested Wizard, FALSE otherwise
     */
    get isNestedWizard(): boolean;
    isInternalEvent(event: any): boolean;
    createEmitter(): EventEmitter<string | symbol, any>;
}
import Component from '../_classes/component/Component';
import EventEmitter from 'eventemitter3';
