/**
 * Represents a JSON value.
 * @typedef {(string | number | boolean | null | JSONArray | JSONObject)} JSON
 */
/**
 * Represents a JSON array.
 * @typedef {Array<JSON>} JSONArray
 */
/**
 * Represents a JSON object.
 * @typedef {{[key: string]: JSON}} JSONObject
 */
/**
 * @typedef {object} FormioHooks
 * @property {Function} [beforeSubmit] - A function that is called before the form is submitted.
 * @property {Function} [beforeCancel] - A function that is called before the form is canceled.
 * @property {Function} [beforeNext] - A function that is called before moving to the next page in a multi-page form.
 * @property {Function} [beforePrev] - A function that is called before moving to the previous page in a multi-page form.
 * @property {Function} [attachComponent] - A function that is called when a component is attached to the form.
 * @property {Function} [setDataValue] - A function that is called when setting the value of a data component.
 * @property {Function} [addComponents] - A function that is called when adding multiple components to the form.
 * @property {Function} [addComponent] - A function that is called when adding a single component to the form.
 * @property {Function} [customValidation] - A function that is called for custom validation of the form.
 * @property {Function} [attachWebform] - A function that is called when attaching a webform to the form.
 */
/**
 * @typedef {object} SanitizeConfig
 * @property {string[]} [addAttr] - The attributes to add.
 * @property {string[]} [addTags] - The tags to add.
 * @property {string[]} [allowedAttrs] - The allowed attributes.
 * @property {string[]} [allowedTags] - The allowed tags.
 * @property {string[]} [allowedUriRegex] - The allowed URI regex.
 * @property {string[]} [addUriSafeAttr] - The URI safe attributes.
 */
/**
 * @typedef {object} ButtonSettings
 * @property {boolean} [showPrevious] - Show the 'Previous' button.
 * @property {boolean} [showNext] - Show the 'Next' button.
 * @property {boolean} [showCancel] - Show the 'Cancel' button.
 * @property {boolean} [showSubmit] - Show the 'Submit' button.
 */
/**
 * @typedef {object} FormOptions
 * @property {boolean} [saveDraft] - Enable the save draft feature.
 * @property {number} [saveDraftThrottle] - The throttle for the save draft feature.
 * @property {boolean} [readOnly] - Set this form to readOnly.
 * @property {boolean} [noAlerts] - Disable the alerts dialog.
 * @property {{[key: string]: string}} [i18n] - The translation file for this rendering.
 * @property {string} [template] - Custom logic for creation of elements.
 * @property {boolean} [noDefaults] - Exclude default values from the settings.
 * @property {any} [fileService] - The file service for this form.
 * @property {EventEmitter} [events] - The EventEmitter for this form.
 * @property {string} [language] - The language to render this form in.
 * @property {{[key: string]: string}} [i18next] - The i18next configuration for this form.
 * @property {boolean} [viewAsHtml] - View the form as raw HTML.
 * @property {'form' | 'html' | 'flat' | 'builder' | 'pdf'} [renderMode] - The render mode for this form.
 * @property {boolean} [highlightErrors] - Highlight any errors on the form.
 * @property {string} [componentErrorClass] - The error class for components.
 * @property {any} [templates] - The templates for this form.
 * @property {string} [iconset] - The iconset for this form.
 * @property {import('@formio/core').Component[]} [components] - The components for this form.
 * @property {{[key: string]: boolean}} [disabled] - Disabled components for this form.
 * @property {boolean} [showHiddenFields] - Show hidden fields.
 * @property {{[key: string]: boolean}} [hide] - Hidden components for this form.
 * @property {{[key: string]: boolean}} [show] - Components to show for this form.
 * @property {Formio} [formio] - The Formio instance for this form.
 * @property {string} [decimalSeparator] - The decimal separator for this form.
 * @property {string} [thousandsSeparator] - The thousands separator for this form.
 * @property {FormioHooks} [hooks] - The hooks for this form.
 * @property {boolean} [alwaysDirty] - Always be dirty.
 * @property {boolean} [skipDraftRestore] - Skip restoring a draft.
 * @property {'form' | 'wizard' | 'pdf'} [display] - The display for this form.
 * @property {string} [cdnUrl] - The CDN url for this form.
 * @property {boolean} [flatten] - Flatten the form.
 * @property {boolean} [sanitize] - Sanitize the form.
 * @property {SanitizeConfig} [sanitizeConfig] - The sanitize configuration for this form.
 * @property {ButtonSettings} [buttonSettings] - The button settings for this form.
 * @property {object} [breadcrumbSettings] - The breadcrumb settings for this form.
 * @property {boolean} [allowPrevious] - Allow the previous button (for Wizard forms).
 * @property {string[]} [wizardButtonOrder] - The order of the buttons (for Wizard forms).
 * @property {boolean} [showCheckboxBackground] - Show the checkbox background.
 * @property {boolean} [inputsOnly] - Only show inputs in the form and no labels.
 * @property {boolean} [building] - If we are in the process of building the form.
 * @property {number} [zoom] - The zoom for PDF forms.
 */
declare class Webform extends NestedDataComponent {
    /**
     * Creates a new Form instance.
     * @param {HTMLElement | object | import('Form').FormOptions} [elementOrOptions] - The DOM element to render this form within or the options to create this form instance.
     * @param {import('Form').FormOptions} [options] - The options to create a new form instance.
     */
    constructor(elementOrOptions?: HTMLElement | object | import('Form').FormOptions, options?: any);
    /**
     * @type {import('Form').FormOptions} - the options for this Webform.
     */
    options: any;
    _src: string;
    _loading: boolean;
    _form: {};
    draftEnabled: boolean;
    savingDraft: boolean;
    triggerSaveDraft: any;
    set nosubmit(value: any);
    get nosubmit(): any;
    /**
     * Determines if the form has tried to be submitted, error or not.
     * @type {boolean}
     */
    submitted: boolean;
    /**
     * Determines if the form is being submitted at the moment.
     * @type {boolean}
     */
    submitting: boolean;
    /**
     * The Formio instance for this form.
     * @type {Formio}
     */
    formio: Formio;
    /**
     * The loader HTML element.
     * @type {HTMLElement}
     */
    loader: HTMLElement;
    /**
     * The alert HTML element
     * @type {HTMLElement}
     */
    alert: HTMLElement;
    /**
     * Promise that is triggered when the submission is done loading.
     * @type {Promise}
     */
    onSubmission: Promise<any>;
    /**
     * Determines if this submission is explicitly set.
     * @type {boolean}
     */
    submissionSet: boolean;
    /**
     * Promise that executes when the form is ready and rendered.
     * @type {Promise}
     * @example
     * import Webform from '@formio/js/Webform';
     * let form = new Webform(document.getElementById('formio'));
     * form.formReady.then(() => {
     *   console.log('The form is ready!');
     * });
     * form.src = 'https://examples.form.io/example';
     */
    formReady: Promise<any>;
    /**
     * Called when the formReady state of this form has been resolved.
     * @type {Function}
     */
    formReadyResolve: Function;
    /**
     * Called when this form could not load and is rejected.
     * @type {Function}
     */
    formReadyReject: Function;
    /**
     * Promise that executes when the submission is ready and rendered.
     * @type {Promise}
     * @example
     * import Webform from '@formio/js/Webform';
     * let form = new Webform(document.getElementById('formio'));
     * form.submissionReady.then(() => {
     *   console.log('The submission is ready!');
     * });
     * form.src = 'https://examples.form.io/example/submission/234234234234234243';
     */
    submissionReady: Promise<any>;
    /**
     * Called when the formReady state of this form has been resolved.
     * @type {Function}
     */
    submissionReadyResolve: Function;
    /**
     * Called when this form could not load and is rejected.
     * @type {Function}
     */
    submissionReadyReject: Function;
    shortcuts: any[];
    /**
     * Sets the language for this form.
     * @param {string} lang - The language to use (e.g. 'en', 'sp', etc.)
     */
    set language(lang: string);
    get language(): string;
    root: this;
    localRoot: this;
    beforeInit(): void;
    executeFormController: any;
    get emptyValue(): null;
    get shouldCallFormController(): any;
    get shadowRoot(): any;
    /**
     * Add a language for translations
     * @param {string} code - The language code for the language being added.
     * @param {object} lang - The language translations.
     * @param {boolean} [active] - If this language should be set as the active language.
     */
    addLanguage(code: string, lang: object, active?: boolean | undefined): void;
    keyboardCatchableElement(element: any): boolean;
    executeShortcuts: (event: any) => void;
    addShortcut(element: any, shortcut: any): void;
    removeShortcut(element: any, shortcut: any): void;
    /**
     * Set the Form source, which is typically the Form.io embed URL.
     * @param {string} value - The value of the form embed url.
     * @example
     * import Webform from '@formio/js/Webform';
     * let form = new Webform(document.getElementById('formio'));
     * form.formReady.then(() => {
     *   console.log('The form is formReady!');
     * });
     * form.src = 'https://examples.form.io/example';
     */
    set src(value: string);
    /**
     * Get the embed source of the form.
     * @returns {string} - The source of the form.
     */
    get src(): string;
    /**
     * Loads the submission if applicable.
     * @returns {Promise} - The promise that is triggered when the submission is loaded.
     */
    loadSubmission(): Promise<any>;
    loadingSubmission: boolean | undefined;
    /**
     * Set the src of the form renderer.
     * @param {string} value - The source value to set.
     * @param {any} options - The options to set.
     * @returns {Promise} - The promise that is triggered when the form is set.
     */
    setSrc(value: string, options: any): Promise<any>;
    /**
     * Set the form source but don't initialize the form and submission from the url.
     * @param {string} value - The value of the form embed url.
     */
    set url(value: string);
    /**
     * Get the embed source of the form.
     * @returns {string} - returns the source of the form.
     */
    get url(): string;
    /**
     * Sets the url of the form renderer.
     * @param {string} value - The value to set the url to.
     * @param {any} options - The options to set.
     * @returns {boolean} - TRUE means the url was set, FALSE otherwise.
     */
    setUrl(value: string, options: any): boolean;
    /**
     * Called when both the form and submission have been loaded.
     * @returns {Promise} - The promise to trigger when both form and submission have loaded.
     */
    get ready(): Promise<any>;
    /**
     * Set the loading state for this form, and also show the loader spinner.
     * @param {boolean} loading - If this form should be 'loading' or not.
     */
    set loading(loading: boolean);
    /**
     * Returns if this form is loading.
     * @returns {boolean} - TRUE means the form is loading, FALSE otherwise.
     */
    get loading(): boolean;
    /**
     * Sets the JSON schema for the form to be rendered.
     * @example
     * import Webform from '@formio/js/Webform';
     * let form = new Webform(document.getElementById('formio'));
     * form.setForm({
     *   components: [
     *     {
     *       type: 'textfield',
     *       key: 'firstName',
     *       label: 'First Name',
     *       placeholder: 'Enter your first name.',
     *       input: true
     *     },
     *     {
     *       type: 'textfield',
     *       key: 'lastName',
     *       label: 'Last Name',
     *       placeholder: 'Enter your last name',
     *       input: true
     *     },
     *     {
     *       type: 'button',
     *       action: 'submit',
     *       label: 'Submit',
     *       theme: 'primary'
     *     }
     *   ]
     * });
     * @param {object} form - The JSON schema of the form @see https://examples.form.io/example for an example JSON schema.
     * @param {any} flags - Any flags to apply when setting the form.
     * @returns {Promise} - The promise that is triggered when the form is set.
     */
    setForm(form: object, flags?: any): Promise<any>;
    initialized: boolean | undefined;
    /**
     * Sets the form value.
     * @alias setForm
     * @param {object} form - The form schema object.
     */
    set form(form: object);
    /**
     * Gets the form object.
     * @returns {object} - The form JSON schema.
     */
    get form(): object;
    /**
     * Sets the submission of a form.
     * @example
     * import Webform from '@formio/js/Webform';
     * let form = new Webform(document.getElementById('formio'));
     * form.src = 'https://examples.form.io/example';
     * form.submission = {data: {
     *   firstName: 'Joe',
     *   lastName: 'Smith',
     *   email: 'joe@example.com'
     * }};
     * @param {object} submission - The Form.io submission object.
     */
    set submission(submission: object);
    /**
     * Returns the submission object that was set within this form.
     * @returns {object} - The submission object.
     */
    get submission(): object;
    /**
     * Sets the submission value
     * @param {object|null|undefined} submission - The submission to set.
     * @param {object|null|undefined} flags - Any flags to apply when setting the submission.
     * @returns {void}
     */
    onSetSubmission(submission: object | null | undefined, flags?: object | null | undefined): void;
    /**
     * Sets a submission and returns the promise when it is ready.
     * @param {any} submission - The submission to set.
     * @param {any} flags - Any flags to apply when setting the submission.
     * @returns {Promise} - The promise that is triggered when the submission is set.
     */
    setSubmission(submission: any, flags?: any): Promise<any>;
    handleDraftError(errName: any, errDetails: any, restoreDraft: any): void;
    saveDraft(): void;
    /**
     * Restores a draft submission based on the user who is authenticated.
     * @param {string} userId - The user id where we need to restore the draft from.
     */
    restoreDraft(userId: string): void;
    get schema(): any;
    mergeData(_this: any, _that: any): void;
    editing: boolean | undefined;
    _submission: any;
    /**
     * Build the form.
     * @returns {Promise} - The promise that is triggered when the form is built.
     */
    init(): Promise<any>;
    _executeFormController(): void;
    build(element: any): Promise<any>;
    getClassName(): string;
    render(): string;
    redraw(): Promise<void> | Promise<boolean>;
    attach(element: any): Promise<boolean>;
    hasRequiredFields(): boolean;
    /**
     * Sets a new alert to display in the error dialog of the form.
     * @param {string} type - The type of alert to display. 'danger', 'success', 'warning', etc.
     * @param {string} message - The message to show in the alert.
     * @param {object} options - The options for the alert.
     */
    setAlert(type: string, message: string, options: object): void;
    /**
     * Focus on selected component.
     * @param {string} key - The key of selected component.
     */
    focusOnComponent(key: string): void;
    /**
     * Show the errors of this form within the alert dialog.
     * @param {object} error - An optional additional error to display along with the component errors.
     * @returns {*}
     */
    /**
     *
     * @param {Array} errors - An array of errors to display.
     * @param {boolean} triggerEvent - Whether or not to trigger the error event.
     * @returns {void|Array} - The errors that were set.
     */
    showErrors(errors: any[], triggerEvent: boolean): void | any[];
    /**
     * Called when the submission has completed, or if the submission needs to be sent to an external library.
     * @param {object} submission - The submission object.
     * @param {boolean} saved - Whether or not this submission was saved to the server.
     * @returns {object} - The submission object.
     */
    onSubmit(submission: object, saved: boolean): object;
    normalizeError(error: any): any;
    /**
     * Called when an error occurs during the submission.
     * @param {object} error - The error that occured.
     * @returns {Array} errors - All errors.
     */
    onSubmissionError(error: object): any[];
    /**
     * Trigger the change event for this form.
     * @param {any} flags - The flags to set on this change event.
     * @param {any} changed - The changed object which reflects the changes in the form.
     * @param {boolean} modified - Whether or not the form has been modified.
     * @param {any} changes - The changes that have occured in the form.
     */
    onChange(flags: any, changed: any, modified: boolean, changes: any): void;
    /**
     * Send a delete request to the server.
     * @returns {Promise} - The promise that is triggered when the delete is complete.
     */
    deleteSubmission(): Promise<any>;
    /**
     * Cancels the submission.
     * @param {boolean} noconfirm - Whether or not to confirm the cancellation.
     * @alias reset
     * @returns {boolean} - TRUE means the submission was cancelled, FALSE otherwise.
     */
    cancel(noconfirm: boolean): boolean;
    setMetadata(submission: any): void;
    submitForm(options?: {}, local?: boolean): Promise<any>;
    setServerErrors(error: any): void;
    serverErrors: any;
    executeSubmit(options: any): Promise<object>;
    submissionInProcess: boolean | undefined;
    clearServerErrors(): void;
    /**
     * Submits the form.
     * @example
     * import Webform from '@formio/js/Webform';
     * let form = new Webform(document.getElementById('formio'));
     * form.src = 'https://examples.form.io/example';
     * form.submission = {data: {
     *   firstName: 'Joe',
     *   lastName: 'Smith',
     *   email: 'joe@example.com'
     * }};
     * form.submit().then((submission) => {
     *   console.log(submission);
     * });
     * @param {boolean} before - If this submission occured from the before handlers.
     * @param {any} options - The options to use when submitting this form.
     * @returns {Promise} - A promise when the form is done submitting.
     */
    submit(before?: boolean, options?: any): Promise<any>;
    submitUrl(URL: any, headers: any): void;
    triggerCaptcha(components?: null): void;
    _nosubmit: any;
    get conditions(): any;
    get variables(): any;
}
declare namespace Webform {
    let setBaseUrl: any;
    let setApiUrl: any;
    let setAppUrl: any;
}
export default Webform;
/**
 * Represents a JSON value.
 */
export type JSON = (string | number | boolean | null | JSON[] | JSONObject);
/**
 * Represents a JSON array.
 */
export type JSONArray = Array<JSON>;
/**
 * Represents a JSON object.
 */
export type JSONObject = {
    [key: string]: JSON;
};
export type FormioHooks = {
    /**
     * - A function that is called before the form is submitted.
     */
    beforeSubmit?: Function | undefined;
    /**
     * - A function that is called before the form is canceled.
     */
    beforeCancel?: Function | undefined;
    /**
     * - A function that is called before moving to the next page in a multi-page form.
     */
    beforeNext?: Function | undefined;
    /**
     * - A function that is called before moving to the previous page in a multi-page form.
     */
    beforePrev?: Function | undefined;
    /**
     * - A function that is called when a component is attached to the form.
     */
    attachComponent?: Function | undefined;
    /**
     * - A function that is called when setting the value of a data component.
     */
    setDataValue?: Function | undefined;
    /**
     * - A function that is called when adding multiple components to the form.
     */
    addComponents?: Function | undefined;
    /**
     * - A function that is called when adding a single component to the form.
     */
    addComponent?: Function | undefined;
    /**
     * - A function that is called for custom validation of the form.
     */
    customValidation?: Function | undefined;
    /**
     * - A function that is called when attaching a webform to the form.
     */
    attachWebform?: Function | undefined;
};
export type SanitizeConfig = {
    /**
     * - The attributes to add.
     */
    addAttr?: string[] | undefined;
    /**
     * - The tags to add.
     */
    addTags?: string[] | undefined;
    /**
     * - The allowed attributes.
     */
    allowedAttrs?: string[] | undefined;
    /**
     * - The allowed tags.
     */
    allowedTags?: string[] | undefined;
    /**
     * - The allowed URI regex.
     */
    allowedUriRegex?: string[] | undefined;
    /**
     * - The URI safe attributes.
     */
    addUriSafeAttr?: string[] | undefined;
};
export type ButtonSettings = {
    /**
     * - Show the 'Previous' button.
     */
    showPrevious?: boolean | undefined;
    /**
     * - Show the 'Next' button.
     */
    showNext?: boolean | undefined;
    /**
     * - Show the 'Cancel' button.
     */
    showCancel?: boolean | undefined;
    /**
     * - Show the 'Submit' button.
     */
    showSubmit?: boolean | undefined;
};
export type FormOptions = {
    /**
     * - Enable the save draft feature.
     */
    saveDraft?: boolean | undefined;
    /**
     * - The throttle for the save draft feature.
     */
    saveDraftThrottle?: number | undefined;
    /**
     * - Set this form to readOnly.
     */
    readOnly?: boolean | undefined;
    /**
     * - Disable the alerts dialog.
     */
    noAlerts?: boolean | undefined;
    /**
     * - The translation file for this rendering.
     */
    i18n?: {
        [key: string]: string;
    } | undefined;
    /**
     * - Custom logic for creation of elements.
     */
    template?: string | undefined;
    /**
     * - Exclude default values from the settings.
     */
    noDefaults?: boolean | undefined;
    /**
     * - The file service for this form.
     */
    fileService?: any;
    /**
     * - The EventEmitter for this form.
     */
    events?: EventEmitter | undefined;
    /**
     * - The language to render this form in.
     */
    language?: string | undefined;
    /**
     * - The i18next configuration for this form.
     */
    i18next?: {
        [key: string]: string;
    } | undefined;
    /**
     * - View the form as raw HTML.
     */
    viewAsHtml?: boolean | undefined;
    /**
     * - The render mode for this form.
     */
    renderMode?: "builder" | "form" | "html" | "flat" | "pdf" | undefined;
    /**
     * - Highlight any errors on the form.
     */
    highlightErrors?: boolean | undefined;
    /**
     * - The error class for components.
     */
    componentErrorClass?: string | undefined;
    /**
     * - The templates for this form.
     */
    templates?: any;
    /**
     * - The iconset for this form.
     */
    iconset?: string | undefined;
    /**
     * - The components for this form.
     */
    components?: import("@formio/core").Component[] | undefined;
    /**
     * - Disabled components for this form.
     */
    disabled?: {
        [key: string]: boolean;
    } | undefined;
    /**
     * - Show hidden fields.
     */
    showHiddenFields?: boolean | undefined;
    /**
     * - Hidden components for this form.
     */
    hide?: {
        [key: string]: boolean;
    } | undefined;
    /**
     * - Components to show for this form.
     */
    show?: {
        [key: string]: boolean;
    } | undefined;
    /**
     * - The Formio instance for this form.
     */
    formio?: any;
    /**
     * - The decimal separator for this form.
     */
    decimalSeparator?: string | undefined;
    /**
     * - The thousands separator for this form.
     */
    thousandsSeparator?: string | undefined;
    /**
     * - The hooks for this form.
     */
    hooks?: FormioHooks | undefined;
    /**
     * - Always be dirty.
     */
    alwaysDirty?: boolean | undefined;
    /**
     * - Skip restoring a draft.
     */
    skipDraftRestore?: boolean | undefined;
    /**
     * - The display for this form.
     */
    display?: "form" | "pdf" | "wizard" | undefined;
    /**
     * - The CDN url for this form.
     */
    cdnUrl?: string | undefined;
    /**
     * - Flatten the form.
     */
    flatten?: boolean | undefined;
    /**
     * - Sanitize the form.
     */
    sanitize?: boolean | undefined;
    /**
     * - The sanitize configuration for this form.
     */
    sanitizeConfig?: SanitizeConfig | undefined;
    /**
     * - The button settings for this form.
     */
    buttonSettings?: ButtonSettings | undefined;
    /**
     * - The breadcrumb settings for this form.
     */
    breadcrumbSettings?: object | undefined;
    /**
     * - Allow the previous button (for Wizard forms).
     */
    allowPrevious?: boolean | undefined;
    /**
     * - The order of the buttons (for Wizard forms).
     */
    wizardButtonOrder?: string[] | undefined;
    /**
     * - Show the checkbox background.
     */
    showCheckboxBackground?: boolean | undefined;
    /**
     * - Only show inputs in the form and no labels.
     */
    inputsOnly?: boolean | undefined;
    /**
     * - If we are in the process of building the form.
     */
    building?: boolean | undefined;
    /**
     * - The zoom for PDF forms.
     */
    zoom?: number | undefined;
};
import NestedDataComponent from './components/_classes/nesteddata/NestedDataComponent';
import EventEmitter from './EventEmitter';
