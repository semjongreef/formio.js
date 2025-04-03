/**
 * This is the Component class
 which all elements within the FormioForm derive from.
 */
declare class Component extends Element {
    static schema(...sources: any[]): any;
    /**
     * Return the simple condition settings as part of the component.
     * @returns {object} - The simple conditional settings.
     */
    static get conditionOperatorsSettings(): object;
    /**
     * Return the array of possible types of component value absed on its schema.
     * @param schema
     * @returns {Array}
     */
    static savedValueTypes(schema: any): any[];
    /**
     * Provides a table view for this component. Override if you wish to do something different than using getView
     * method of your instance.
     * @param value
     * @param options
     */
    static tableView(value: any, options: any): void;
    /**
     * Returns the component condition operator settings if available.
     * @returns {object} - The component condition operator settings.
     */
    static get serverConditionSettings(): object;
    /**
     * Initialize a new Component.
     * @param {object} component - The component JSON you wish to initialize.
     * @param {object} options - The options for this component.
     * @param {object} data - The global data submission object this component will belong.
     */
    constructor(component: object, options: object, data: object);
    id: any;
    /**
     * Determines if this component has a condition assigned to it.
     * @type {null}
     * @private
     */
    private _hasCondition;
    /**
     * The row index for this component.
     */
    _rowIndex: number | undefined;
    /**
     * References to dom elements
     */
    refs: {};
    /**
     * An array of all the children components errors.
     */
    childErrors: any[];
    /**
     * Last validation errors that have occured.
     */
    _errors: any[];
    _visibleErrors: any[];
    /**
     * The Form.io component JSON schema.
     * @type {*}
     */
    component: any;
    originalComponent: any;
    /**
     * If the component has been attached
     */
    attached: boolean;
    /**
     * If the component has been rendered
     */
    rendered: boolean;
    /**
     * The data object in which this component resides.
     * @type {*}
     */
    _data: any;
    /**
     * Tool tip text after processing
     * @type {string}
     */
    tooltip: string;
    /**
     * The row path of this component.
     * @type {number}
     */
    row: number;
    /**
     * Points to a flat map of child components (if applicable).
     * @type {object}
     */
    childComponentsMap: object;
    /**
     * Determines if this component is disabled, or not.
     * @type {boolean}
     */
    _disabled: boolean;
    /**
     * Points to the root component, usually the FormComponent.
     * @type {Component}
     */
    root: Component;
    localRoot: any;
    /**
     * If this input has been input and provided value.
     * @type {boolean}
     */
    pristine: boolean;
    /**
     * Points to the parent component.
     * @type {Component}
     */
    parent: Component;
    /**
     * The component paths for this component.
     * @type {import('@formio/core').ComponentPaths} - The component paths.
     */
    paths: import('@formio/core').ComponentPaths;
    _path: string;
    /**
     * Determines if this component is visible, or not.
     */
    _parentVisible: any;
    _visible: any;
    _parentDisabled: boolean;
    /**
     * The reference attribute name for this component
     */
    _referenceAttributeName: string;
    triggerChange: (...args: any[]) => any;
    /**
     * Used to trigger a redraw event within this component.
     * @type {Function}
     */
    triggerRedraw: Function;
    /**
     * list of attached tooltips
     * @type {Array}
     */
    tooltips: any[];
    /**
     * List of attached addons
     * @type {Array}
     */
    addons: any[];
    invalid: boolean;
    type: any;
    /**
     * Sets the static value of this component.
     * @param {*} value - The value to set for this component.
     */
    set dataValue(value: any);
    /**
     * Get the static value of this component.
     * @returns {*} - The value for this component.
     */
    get dataValue(): any;
    /**
     * The element information for creating the input element.
     * @type {*}
     */
    info: any;
    get componentsMap(): object;
    parentShouldConditionallyClear(): boolean;
    parentConditionallyHidden(): boolean;
    set data(value: any);
    get data(): any;
    mergeSchema(component?: {}): any;
    get ready(): Promise<Awaited<this>>;
    get isPDFReadOnlyMode(): any;
    get labelInfo(): {
        hidden: any;
        className: string;
        labelPosition: any;
        tooltipClass: string;
        for: any;
    };
    init(): void;
    /**
     * Disable this component.
     * @param {boolean} disabled - TRUE to disable the component.
     */
    set disabled(disabled: boolean);
    /**
     * Return if the component is disabled.
     * @returns {boolean} - TRUE if the component is disabled.
     */
    get disabled(): boolean;
    /**
     * Set Row Index to row and update each component.
     * @param {number} value - The row index.
     * @returns {void}
     */
    set rowIndex(value: number);
    /**
     * Get Row Index.
     * @returns {number} - The row index.
     */
    get rowIndex(): number;
    afterComponentAssign(): void;
    createAddon(addonConfiguration: any): any;
    get shouldDisabled(): any;
    get isInputComponent(): any;
    get allowData(): any;
    get hasInput(): any;
    get defaultSchema(): any;
    get key(): any;
    set path(path: string | undefined);
    get path(): string | undefined;
    set parentVisible(value: any);
    get parentVisible(): any;
    set parentDisabled(value: boolean);
    get parentDisabled(): boolean;
    shouldForceVisibility(component: any, visibility: any): any;
    shouldForceHide(component: any): any;
    shouldForceShow(component: any): any;
    /**
     * Sets the component visibility.
     * @param {boolean} value - Whether the component should be visible or not.
     */
    set visible(value: boolean);
    /**
     * Returns the component visibility
     * @returns {boolean} - Whether the component is visible or not.
     */
    get visible(): boolean;
    get logicallyHidden(): any;
    _logicallyHidden: any;
    shouldConditionallyClear(skipParent?: boolean): boolean;
    conditionallyHidden(skipParent?: boolean): boolean;
    set currentForm(instance: any);
    get currentForm(): any;
    _currentForm: any;
    get fullMode(): boolean;
    get builderMode(): boolean;
    get calculatedPath(): string | undefined;
    get labelPosition(): any;
    get labelWidth(): any;
    get labelMargin(): any;
    get isAdvancedLabel(): boolean;
    get labelPositions(): any;
    get skipInEmail(): boolean;
    rightDirection(direction: any): boolean;
    getLabelInfo(isCondensed?: boolean): {
        isRightPosition: boolean;
        isRightAlign: boolean;
        labelStyles: string;
        contentStyles: string;
    };
    /**
     * Returns only the schema that is different from the default.
     * @param {object} schema - The "full" json schema for the component.
     * @param {object} defaultSchema - The "default" json schema for the component.
     * @param {boolean} recursion - If we are currently in a recursive loop.
     * @returns {object} - The minified json schema for this component.
     */
    getModifiedSchema(schema: object, defaultSchema: object, recursion: boolean): object;
    /**
     * Returns the JSON schema for this component.
     * @returns {object} - The JSON schema for this component.
     */
    get schema(): object;
    /**
     * Returns true if component is inside DataGrid
     * @returns {boolean} - True if component is inside DataGrid
     */
    get isInDataGrid(): boolean;
    /**
     * Translate a text using the i18n system.
     * @param {string} text - The i18n identifier.
     * @param {object} params - The i18n parameters to use for translation.
     * @param {...any} args - Additional arguments to pass to the translation library.
     * @returns {string} - The translated text.
     */
    t(text: string, params?: object, ...args: any[]): string;
    labelIsHidden(): any;
    transform(type: any, value: any): any;
    getTemplate(names: any, modes: any): {
        template: any;
        referenceAttributeName: any;
    } | {
        template: any;
    };
    checkTemplate(templates: any, names: any, modes: any): {
        template: any;
        referenceAttributeName: any;
    } | null;
    checkTemplateMode(templatesByName: any, modes: any): any;
    getFormattedAttribute(attr: any): string;
    getFormattedTooltip(tooltipValue: any): string;
    isHtmlRenderMode(): boolean;
    renderTemplate(name: any, data?: {}, modeOption?: string): any;
    /**
     * Sanitize an html string.
     * @param {string} dirty - The dirty html string to sanitize.
     * @param {boolean} forceSanitize - If we should force the sanitize to occur.
     * @param {object} options - The options for the sanitize.
     * @returns {*} - The sanitized html string.
     */
    sanitize(dirty: string, forceSanitize?: boolean, options?: object): any;
    /**
     * Render a template string into html.
     * @param {string} template - The template to render.
     * @param {object} data - The data to provide to the template.
     * @returns {HTMLElement | string} - The created element or an empty string if template is not specified.
     */
    renderString(template: string, data: object): HTMLElement | string;
    /**
     * Allows for modification of the component value prior to submission.
     * @param {*} input - The input to be modified.
     * @returns {*} - The modified input mapping for the extended component.
     */
    performInputMapping(input: any): any;
    /**
     * Returns the component "widget" if one is available.
     * @returns {Widget|null} - The widget instance. null if not available.
     */
    get widget(): any;
    /**
     * Returns the native supported browser language.
     * @returns {string|null} - The native browser language that is supported.
     */
    getBrowserLanguage(): string | null;
    /**
     * Called before a next and previous page is triggered allowing the components to perform special functions.
     * @returns {Promise<boolean>} - A promise to resolve when the component is no longer blocking the next/previous page navigation.
     */
    beforePage(): Promise<boolean>;
    /**
     * Called before the next page is triggered allowing the components to hook into the page navigation and perform tasks.
     * @returns {Promise<boolean>} - A promise to resolve when the component is no longer blocking the next page navigation.
     */
    beforeNext(): Promise<boolean>;
    /**
     * Called before a submission is triggered allowing the components to perform special async functions.
     * @returns {Promise<boolean>} - A promise to resolve when the component is no longer blocking the submission.
     */
    beforeSubmit(): Promise<boolean>;
    /**
     * Return the submission timezone.
     * @returns {string} - The submission timezone.
     */
    get submissionTimezone(): string;
    /**
     * Return the current timezone.
     * @returns {string} - The current timezone.
     */
    get timezone(): string;
    /**
     * Return the current timezone.
     * @param {object} settings - Settings to control how the timezone should be returned.
     * @returns {string} - The current timezone.
     */
    getTimezone(settings: object): string;
    /**
     *
     * @param {HTMLElement} element - The containing DOM element to query for the ref value.
     * @param {object} refs - The references to load.
     * @param {string} [referenceAttributeName] - The attribute name to use for the reference.
     */
    loadRefs(element: HTMLElement, refs: object, referenceAttributeName?: string | undefined): void;
    /**
     * Opens the modal element.
     * @param {string} template - The template to use for the modal dialog.
     */
    setOpenModalElement(template?: string): void;
    /**
     * Renders a modal preview template and returns the markup as a string
     * @param {object|null|undefined} ctx - The rendering context
     * @returns {string} - The modal preview markup
     */
    renderModalPreview(ctx: object | null | undefined): string;
    /**
     * Returns the modal preview template.
     * @returns {string} - The modal preview template.
     */
    getModalPreviewTemplate(): string;
    /**
     * Performs a complete build of a component, which empties, renders, sets the content in the DOM, and then finally attaches events.
     * @param {HTMLElement} element - The element to attach this component to.
     * @returns {Promise<void>} - A promise that resolves when the component has been built.
     */
    build(element: HTMLElement): Promise<void>;
    get hasModalSaveButton(): boolean;
    /**
     * Renders a component as an HTML string.
     * @param {string} children - The contents of all the children HTML as a string.
     * @param {boolean} topLevel - If this is the topmost component that is being rendered.
     * @returns {string} - The rendered HTML string of a component.
     */
    render(children?: string, topLevel?: boolean): string;
    /**
     * Creates the tooltip instance using tippy.js and returns it
     * @param {HTMLElement} tooltipEl - HTML element to attach the tooltip
     * @param {object|null|undefined} settings - tippy.js options
     * @returns {import('tippy.js').Tippy} - tippy.js instance
     */
    createTooltip(tooltipEl: HTMLElement, settings?: object | null | undefined): import('tippy.js').Tippy;
    /**
     * Attaches all the tooltips provided the refs object.
     * @param {object} toolTipsRefs - The refs for the tooltips within your template.
     * @returns {void}
     */
    attachTooltips(toolTipsRefs: object): void;
    /**
     * Create a new component modal for this component.
     * @param {HTMLElement} element - The element to attach the modal to.
     * @param {boolean} modalShouldBeOpened - TRUE if the modal should open immediately.
     * @param {any} currentValue - The current value of the component.
     * @returns {ComponentModal} - The created component modal.
     */
    createComponentModal(element: HTMLElement, modalShouldBeOpened: boolean, currentValue: any): ComponentModal;
    /**
     * Attaches all event listensers for this component to the DOM elements that were rendered.
     * @param {HTMLElement} element - The element to attach the listeners to.
     * @returns {Promise<void>} - Resolves when the component is done attaching to the DOM.
     */
    attach(element: HTMLElement): Promise<void>;
    componentModal: any;
    /**
     * Restors the "focus" on a component after a redraw event has occured.
     */
    restoreFocus(): void;
    /**
     * Adds a keyboard shortcut to this component.
     * @param {HTMLElement} element - The element to attach the keyboard shortcut to.
     * @param {string} shortcut - The keyboard shortcut to add.
     * @returns {void}
     */
    addShortcut(element: HTMLElement, shortcut: string): void;
    /**
     * Removes a keyboard shortcut from this component.
     * @param {HTMLElement} element - The element to remove the keyboard shortcut from.
     * @param {string} shortcut - The keyboard shortcut to remove.
     * @returns {void}
     */
    removeShortcut(element: HTMLElement, shortcut: string): void;
    /**
     * Remove all event handlers.
     */
    detach(): void;
    /**
     * Determines if the component should be refreshed based on the path of another component that changed.
     * @param {string} refreshData - The path of the data that needs to trigger a refresh.
     * @param {boolean} changed - Flag that is true if the data has been changed.
     * @param {any} flags - The flags for the checkData procedure.
     * @returns {void}
     */
    checkRefresh(refreshData: string, changed: boolean, flags: any): void;
    /**
     * Iterates over a list of changes, and determines if the component should be refreshed if it is configured to refresh on any of those components.
     * @param {Array<any>} changes - The list of components that have changed.
     * @param {any} flags - The checkData flags.
     * @returns {void}
     */
    checkRefreshOn(changes: Array<any>, flags?: any): void;
    /**
     * Refreshes the component with a new value.
     * @param {any} value - The latest value of the component to check if it needs to be refreshed.
     * @returns {void}
     */
    refresh(value: any): void;
    refreshOnChanged: boolean | undefined;
    refreshOnValue: any;
    /**
     * Checks to see if a separate component is in the "context" of this component. This is determined by first checking
     * if they share the same "data" object. It will then walk up the parent tree and compare its parents data objects
     * with the components data and returns true if they are in the same context.
     *
     * Different rows of the same EditGrid, for example, are in different contexts.
     * @param {any} component - The component to check if it is in the same context as this component.
     * @returns {boolean} - TRUE if the component is in the same context as this component.
     */
    inContext(component: any): boolean;
    /**
     * Determines if we are in "view" only mode.
     * @returns {boolean} - TRUE if we are in "view" only mode.
     */
    get viewOnly(): boolean;
    /**
     * Sets the HTMLElement for this component.
     * @param {HTMLElement} element - The element that is attached to this component.
     * @returns {void}
     */
    setElement(element: HTMLElement): void;
    element: any;
    /**
     * Creates an element to hold the "view only" version of this component.
     * @returns {HTMLElement} - The element for this component.
     */
    createViewOnlyElement(): HTMLElement;
    /**
     * The default value for the "view only" mode of a component if the value is not provided.
     * @returns {string} - The default value for this component.
     */
    get defaultViewOnlyValue(): string;
    /**
     * Uses the widget to determine the output string.
     * @param {any} value - The current value of the component.
     * @param {any} options - The options for getValueAsString.
     * @returns {any|Array<any>} - The value as a string.
     */
    getWidgetValueAsString(value: any, options: any): any | Array<any>;
    /**
     * Returns the value of the component as a string.
     * @param {any} value - The value for this component.
     * @param {any} options - The options for this component.
     * @returns {string} - The string representation of the value of this component.
     */
    getValueAsString(value: any, options: any): string;
    /**
     * Returns the string representation "view" of the component value.
     * @param {any} value - The value of the component.
     * @param {any} options - The options for this component.
     * @returns {string} - The string representation of the value of this component.
     */
    getView(value: any, options: any): string;
    /**
     * Updates the items list for this component. Useful for Select and other List component types.
     * @param {...any} args - The arguments to pass to the onChange event.
     * @returns {void}
     */
    updateItems(...args: any[]): void;
    /**
     * Returns the value for a specific item in a List type component.
     * @param {any} data - The data for this component.
     * @param {boolean} [forceUseValue] - if true, return 'value' property of the data
     * @returns {any} - The value of the item.
     */
    itemValue(data: any, forceUseValue?: boolean | undefined): any;
    /**
     * Returns the item value for html mode.
     * @param {any} value - The value for this component.
     * @returns {any} - The value of the item for html mode.
     */
    itemValueForHTMLMode(value: any): any;
    /**
     * Creates a modal to input the value of this component.
     * @param {HTMLElement} element - The element to attach the modal to.
     * @param {any} attr - A list of attributes to add to the modal.
     * @param {boolean} confirm - If we should add a confirmation to the modal that keeps it from closing unless confirmed.
     * @returns {HTMLElement} - The created modal element.
     */
    createModal(element: HTMLElement, attr: any, confirm: boolean): HTMLElement;
    /**
     * Uses CSS classes to show or hide an element.
     * @returns {boolean} - TRUE if the element has been css removed.
     */
    get optimizeRedraw(): boolean;
    /**
     * Retrieves the CSS class name of this component.
     * @returns {string} - The class name of this component.
     */
    get className(): string;
    /**
     * Build the custom style from the layout values
     * @returns {string} - The custom style
     */
    get customStyle(): string;
    /**
     * Returns if the application is on a mobile device.
     * @returns {boolean} - TRUE if the application is on a mobile device.
     */
    get isMobile(): boolean;
    /**
     * Returns the outside wrapping element of this component.
     * @returns {HTMLElement} - The wrapping element of this component.
     */
    getElement(): HTMLElement;
    /**
     * Create an evaluation context for all script executions and interpolations.
     * @param {any} additional - Additional context to provide.
     * @returns {any} - The evaluation context.
     */
    evalContext(additional: any): any;
    /**
     * Sets the pristine flag for this component.
     * @param {boolean} pristine - TRUE to make pristine, FALSE not pristine.
     */
    setPristine(pristine: boolean): void;
    /**
     * Returns if the component is pristine.
     * @returns {boolean} - TRUE if the component is pristine.
     */
    get isPristine(): boolean;
    /**
     * Sets the dirty flag for this component.
     * @param {boolean} dirty - TRUE to make dirty, FALSE not dirty.
     */
    setDirty(dirty: boolean): void;
    dirty: boolean | undefined;
    /**
     * Returns if the component is dirty.
     * @returns {boolean} - TRUE if the component is dirty.
     */
    get isDirty(): boolean;
    /**
     * Removes a value out of the data array and rebuild the rows.
     * @param {number} index - The index of the data element to remove.
     */
    removeValue(index: number): void;
    /**
     * Returns the icon class for a given icon name.
     * @param {string} name - The name of the icon you wish to fetch provided the icon class. This is the "font awesome" version of the name of the icon.
     * @param {boolean} spinning - If the component should be spinning.
     * @returns {string} - The icon class for the equivalent icon in the iconset we are using.
     */
    iconClass(name: string, spinning: boolean): string;
    /**
     * Returns the size css class names for our current template.
     * @param {string} size - The size class name for the default iconset.
     * @returns {string} - The size class for our component.
     */
    size(size: string): string;
    /**
     * The readible name for this component.
     * @returns {string} - The name of the component.
     */
    get name(): string;
    /**
     * Returns the visible errors for this component.
     * @returns {Array<object>} - The visible errors for this component.
     */
    get visibleErrors(): object[];
    /**
     * Returns all the errors for this component, visible or not.
     * @returns {Array<object>} - All the errors for this component.
     */
    get errors(): object[];
    /**
     * Returns the error label for this component.
     * @returns {string} - The error label for this component.
     */
    get errorLabel(): string;
    /**
     * Get the error message provided a certain type of error.
     * @param {string} type - The type of error to fetch the message for.
     * @returns {string} - The error message configured for this component.
     */
    errorMessage(type: string): string;
    /**
     * Sets the content, innerHTML, of an element to the sanitized content.
     * @param {HTMLElement} element - The element to set the innerHTML to.
     * @param {string} content - The HTML string content that we wish to set.
     * @param {boolean} forceSanitize - If we should force the content to be sanitized.
     * @param {any} sanitizeOptions - The options for the sanitize function.
     * @returns {boolean} - TRUE if the content was sanitized and set.
     */
    setContent(element: HTMLElement, content: string, forceSanitize: boolean, sanitizeOptions: any): boolean;
    /**
     * Restores the caret position in the input element after a refresh occurs.
     */
    restoreCaretPosition(): void;
    /**
     * Redraw the component.
     * @returns {Promise<void>} - A promise that resolves when the component is done redrawing.
     */
    redraw(): Promise<void>;
    /**
     * Rebuild and redraw a component.
     * @returns {Promise<void>} - A promise that resolves when the component is done rebuilding and redrawing.
     */
    rebuild(): Promise<void>;
    /**
     * Returns if the dom node has the classes provided.
     * @param {HTMLElement} element - The element to check for the class.
     * @param {string} className - The name of the class to check.
     * @returns {boolean|void} - TRUE if the element has the class.
     */
    hasClass(element: HTMLElement, className: string): boolean | void;
    /**
     * Adds a class to an HTML element.
     * @param {HTMLElement} element - The dom element to add the class to.
     * @param {string} className - The class name you wish to add.
     * @returns {this|void} - The component instance.
     */
    addClass(element: HTMLElement, className: string): this | void;
    /**
     * Removes a class from an element.
     * @param {HTMLElement} element - The element to remove the class from.
     * @param {string} className - The class name to remove.
     * @returns {this|void} - The component instance.
     */
    removeClass(element: HTMLElement, className: string): this | void;
    /**
     * Determines if this component has a condition defined.
     * @returns {boolean} - TRUE if the component has a condition defined.
     */
    hasCondition(): boolean;
    /**
     * Check if this component is conditionally visible.
     * @param {any} data - The data to check against.
     * @param {any} row - The row data to check against.
     * @returns {boolean} - TRUE if the component is conditionally visible.
     */
    conditionallyVisible(data: any, row: any): boolean;
    /**
     * Checks the condition of this component.
     *
     * TODO: Switch row and data parameters to be consistent with other methods.
     * @param {any} row - The row contextual data.
     * @param {any} data - The global data object.
     * @returns {boolean} - True if the condition applies to this component.
     */
    checkCondition(row: any, data: any): boolean;
    /**
     * Check for conditionals and hide/show the element based on those conditions.
     * @param {any} data - The data to check against.
     * @param {any} flags - The flags passed to checkData function.
     * @param {any} row - The row data to check against.
     * @returns {boolean} - TRUE if the component is visible.
     */
    checkComponentConditions(data: any, flags: any, row: any): boolean;
    /**
     * Checks conditions for this component and any sub components.
     * @param {any} data - The data to check against.
     * @param {any} flags - The flags passed to checkData function.
     * @param {any} row - The row data to check against.
     * @returns {boolean} - TRUE if the component is visible.
     */
    checkConditions(data: any, flags: any, row: any): boolean;
    /**
     * Returns the component logic if applicable.
     * @returns {Array<object>} - The component logic.
     */
    get logic(): object[];
    /**
     * Check all triggers and apply necessary actions.
     * @param {any} data - The data to check against.
     * @param {any} row - The row data to check against.
     * @returns {boolean|void} - TRUE if the component was altered.
     */
    fieldLogic(data?: any, row?: any): boolean | void;
    /**
     * Retuns if the browser is Internet Explorer.
     * @returns {boolean} - TRUE if the browser is IE.
     */
    isIE(): boolean;
    /**
     * Defines the logic action value through evaluation.
     * @param {object} action - The action within the Logic system to perform.
     * @param {object} argsObject - The arguments to pass to the evaluation.
     * @returns {any} - The result of the evaluation.
     */
    defineActionValue(action: object, argsObject: object): any;
    /**
     * Apply the actions of Logic for a component once the conditions have been met.
     * @param {object} newComponent - The new component to apply the actions to.
     * @param {Array<object>} actions - An array of actions
     * @param {any} result - The result of the conditional check in order to evaluate the actions.
     * @param {any} row - The contextual row data for this component.
     * @param {any} data - The global data object for the submission.
     * @returns {boolean} - TRUE if the component was altered.
     */
    applyActions(newComponent: object, actions: Array<object>, result: any, row: any, data: any): boolean;
    addInputError(message: any, dirty: any, elements: any): void;
    removeInputError(elements: any): void;
    /**
     * Add a new input error to this element.
     * @param {Array<object>|string} messages - An array of messages to add to the element.
     * @returns {void}
     */
    addMessages(messages: Array<object> | string): void;
    /**
     * Sets the form input widget error classes.
     * @param {Array<HTMLElement>} elements - An array of DOM elements to set the error classes on.
     * @param {boolean} dirty - If the input is dirty.
     * @param {boolean} hasErrors - If the input has errors.
     * @param {boolean} hasMessages - If the input has messages.
     * @param {HTMLElement} element - The wrapper element for all the other elements passed in first argument.
     * @returns {void}
     */
    setErrorClasses(elements: Array<HTMLElement>, dirty: boolean, hasErrors: boolean, hasMessages: boolean, element?: HTMLElement): void;
    /**
     * Adds the classes necessary to mark an element as invalid.
     * @param {HTMLElement} element - The element you wish to add the invalid classes to.
     * @param {boolean} invalid - TRUE if the component is invalid, FALSE otherwise.
     * @returns {void}
     */
    setElementInvalid(element: HTMLElement, invalid: boolean): void;
    /**
     * Clear any conditionally hidden components for this component only.
     */
    clearComponentOnHide(): void;
    /**
     * Clears the components data if it is conditionally hidden AND clearOnHide is set to true for this component.
     */
    clearOnHide(): void;
    /**
     * Triggers a debounced onChange event for the root component (usually Webform).
     * @param {...any} args - The arguments to pass to the onChange event.
     */
    triggerRootChange(...args: any[]): void;
    /**
     * Called when the component value has been changed. This will then trigger the root level onChange handler which
     * propagates the checkData methods for the full component tree.
     * @param {any} flags - The flags for the change event propagation.
     * @param {boolean} fromRoot - If the change event is from the root component.
     * @returns {boolean} - TRUE if the component has changed.
     */
    onChange(flags: any, fromRoot: boolean): boolean;
    get wysiwygDefault(): {
        quill: {
            theme: string;
            placeholder: string;
            modules: {
                toolbar: ({
                    size: (string | boolean)[];
                }[] | {
                    header: (number | boolean)[];
                }[] | {
                    font: never[];
                }[] | (string | {
                    script: string;
                })[] | ({
                    color: never[];
                    background?: undefined;
                } | {
                    background: never[];
                    color?: undefined;
                })[] | ({
                    list: string;
                    indent?: undefined;
                    align?: undefined;
                } | {
                    indent: string;
                    list?: undefined;
                    align?: undefined;
                } | {
                    align: never[];
                    list?: undefined;
                    indent?: undefined;
                })[])[];
            };
        };
        ace: {
            theme: string;
            maxLines: number;
            minLines: number;
            tabSize: number;
            mode: string;
            placeholder: string;
        };
        ckeditor: {
            image: {
                toolbar: string[];
                styles: string[];
            };
            extraPlugins: never[];
        };
        default: {};
    };
    addCKE(element: any, settings: any, onChange: any): any;
    addQuill(element: any, settings: any, onChange: any): any;
    quill: any;
    get shouldSanitizeValue(): boolean;
    addAce(element: any, settings: any, onChange: any): any;
    getDragula(): Promise<any>;
    get tree(): any;
    /**
     * The empty value for this component.
     * @returns {null} - The empty value for this component.
     */
    get emptyValue(): null;
    /**
     * Returns if this component has a value set.
     * @param {any} data - The global data object.
     * @returns {boolean} - TRUE if a value is set.
     */
    hasValue(data: any): boolean;
    /**
     * Get the data value at the root level.
     * @returns {*} - The root value for the component, typically the Webform data object.
     */
    get rootValue(): any;
    get rootPristine(): any;
    /**
     * Splice a value from the dataValue.
     * @param {number} index - The index to splice for an array component values.
     * @param {*} flags - The flags to use when splicing the value.
     */
    splice(index: number, flags?: any): void;
    unset(): void;
    /**
     * Deletes the value of the component.
     */
    deleteValue(): void;
    getCustomDefaultValue(defaultValue: any): any;
    /**
     * Returns if a component has a default value set.
     * @returns {boolean} - TRUE if a default value is set.
     */
    get hasDefaultValue(): boolean;
    /**
     * Determine if we should add a default value for this component.
     * @returns {boolean} - TRUE if a default value should be set
     */
    get shouldAddDefaultValue(): boolean;
    /**
     * Get the default value of this component.
     * @returns {*} - The default value for this component.
     */
    get defaultValue(): any;
    /**
     * Get the input value of this component.
     * @returns {*} - The value for the component.
     */
    getValue(): any;
    /**
     * Get the value at a specific index.
     * @param {number} index - For an array component or multiple values, this returns the value at a specific index.
     * @returns {*} - The value at the specified index.
     */
    getValueAt(index: number): any;
    /**
     * Set the value of this component.
     * @param {*} value - The value to set for this component.
     * @param {*} flags - The flags to use when setting the value.
     * @returns {boolean} - If the value changed.
     */
    setValue(value: any, flags?: any): boolean;
    /**
     * Returns if the value (e.g. array) should be divided between several inputs
     * @returns {boolean}
     */
    isSingleInputValue(): boolean;
    /**
     * Set the value at a specific index.
     * @param {number} index - The index to set the value at.
     * @param {*} value - The value to set at the specified index.
     * @param {*} flags - The flags to use when setting the value.
     */
    setValueAt(index: number, value: any, flags?: any): void;
    get hasSetValue(): boolean;
    setDefaultValue(): void;
    /**
     * Restore the value of a control.
     */
    restoreValue(): void;
    /**
     * Normalize values coming into updateValue.
     * @param {*} value - The value to normalize before setting.
     * @returns {*} - The normalized value.
     */
    normalizeValue(value: any): any;
    /**
     * Update a value of this component.
     * @param {*} value - The value to update.
     * @param {*} flags - The flags to use when updating the value.
     * @returns {boolean} - If the value changed.
     */
    updateComponentValue(value: any, flags?: any): boolean;
    /**
     * Updates the value of this component plus all sub-components.
     * @param {...any} args - The arguments to pass to updateValue.
     * @returns {boolean} - If the value changed.
     */
    updateValue(...args: any[]): boolean;
    getIcon(name: any, content: any, styles: any, ref?: string): any;
    /**
     * Resets the value of this component.
     */
    resetValue(): void;
    /**
     * Determine if the value of this component has changed.
     * @param {*} newValue - The new value to check.
     * @param {*} oldValue - The existing value of the component.
     * @returns {boolean} - TRUE if the value has changed.
     */
    hasChanged(newValue: any, oldValue: any): boolean;
    /**
     * Update the value on change.
     * @param {*} flags - The flags to use when triggering the on change event.
     * @param {boolean} changed - If the value has changed.
     * @returns {boolean} - If the value changed.
     */
    updateOnChange(flags?: any, changed?: boolean): boolean;
    convertNumberOrBoolToString(value: any): any;
    doValueCalculation(dataValue: any, data: any, row: any): any;
    calculateComponentValue(data: any, flags: any, row: any): boolean;
    calculationLocked: boolean | undefined;
    calculatedValue: any;
    /**
     * Performs calculations in this component plus any child components.
     * @param {*} data - The data to perform the calculation with.
     * @param {*} flags - The flags to use when calculating the value.
     * @param {*} row - The contextual row data to use when performing the calculation.
     * @returns {boolean} - TRUE if the value changed.
     */
    calculateValue(data: any, flags: any, row: any): boolean;
    /**
     * Set this component's label text and render it.
     * @param {string} value - The new label text.
     */
    set label(value: string);
    /**
     * Get this component's label text.
     * @returns {string} - The label text for this component.
     */
    get label(): string;
    /**
     * Get FormioForm element at the root of this component tree.
     * @returns {*} root - The root component to search from.
     */
    getRoot(): any;
    /**
     * Returns the invalid message, or empty string if the component is valid.
     * @param {*} data - The data to check if the component is valid.
     * @param {boolean} dirty - If the component is dirty.
     * @param {boolean} ignoreCondition - If conditions for the component should be ignored when checking validity.
     * @param {*} row - Contextual row data for this component.
     * @param {*} options - Additional options for validation.
     * @returns {string} - The message to show when the component is invalid.
     */
    invalidMessage(data: any, dirty: boolean, ignoreCondition: boolean, row: any, options?: any): string;
    /**
     * Returns if the component is valid or not.
     * @param {*} data - The data to check if the component is valid.
     * @param {boolean} dirty - If the component is dirty.
     * @returns {boolean} - TRUE if the component is valid.
     */
    isValid(data: any, dirty: boolean): boolean;
    setComponentValidity(errors: any, dirty: any, silentCheck: any): any;
    /**
     * Interpolate errors from the validation methods.
     * @param {Array<any>} errors - An array of errors to interpolate.
     * @returns {Array<any>} - The interpolated errors.
     */
    interpolateErrors(errors: Array<any>): Array<any>;
    /**
     * Show component validation errors.
     * @param {*} errors - An array of errors that have occured.
     * @param {*} data - The root submission data.
     * @param {*} row - The contextual row data.
     * @param {*} flags - The flags to perform validation.
     * @returns {boolean} - TRUE if the component is valid.
     */
    showValidationErrors(errors: any, data: any, row: any, flags: any): boolean;
    /**
     * Perform a component validation.
     * @param {*} data - The root data you wish to use for this component.
     * @param {*} row - The contextual row data you wish to use for this component.
     * @param {*} flags - The flags to control the behavior of the validation.
     * @returns {Array<any>} - An array of errors if the component is invalid.
     */
    validateComponent(data?: any, row?: any, flags?: any): Array<any>;
    /**
     * Checks the validity of this component and sets the error message if it is invalid.
     * @param {*} data - The data to check if the component is valid.
     * @param {boolean} dirty - If the component is dirty.
     * @param {*} row - The contextual row data for this component.
     * @param {*} flags - The flags to use when checking the validity.
     * @param {Array<any>} allErrors - An array of all errors that have occured so that it can be appended when another one occurs here.
     * @returns {boolean} - TRUE if the component is valid.
     */
    checkComponentValidity(data?: any, dirty?: boolean, row?: any, flags?: any, allErrors?: Array<any>): boolean;
    /**
     * Checks the validity of the component.
     * @param {*} data - The data to check if the component is valid.
     * @param {boolean} dirty - If the component is dirty.
     * @param {*} row - The contextual row data for this component.
     * @param {boolean} silentCheck - If the check should be silent and not set the error messages.
     * @param {Array<any>} errors - An array of all errors that have occured so that it can be appended when another one occurs here.
     * @returns {boolean} - TRUE if the component is valid.
     */
    checkValidity(data?: any, dirty?: boolean, row?: any, silentCheck?: boolean, errors?: Array<any>): boolean;
    checkAsyncValidity(data?: null, dirty?: boolean, row?: null, silentCheck?: boolean, errors?: any[]): boolean;
    /**
     * Check the conditions, calculations, and validity of a single component and triggers an update if
     * something changed.
     * @param {*} data - The root data of the change event.
     * @param {*} flags - The flags from this change event.
     * @param {*} row - The contextual row data for this component.
     * @returns {void|boolean} - TRUE if no check should be performed on the component.
     */
    checkData(data?: any, flags?: any, row?: any): void | boolean;
    checkingData: boolean | undefined;
    checkModal(errors?: any[], dirty?: boolean): void;
    get validationValue(): any;
    isEmpty(value?: any): any;
    isEqual(valueA: any, valueB?: any): any;
    /**
     * Check if a component is eligible for multiple validation
     * @returns {boolean} - TRUE if the component is eligible for multiple validation.
     */
    validateMultiple(): boolean;
    clearErrorClasses(element?: any): void;
    setInputWidgetErrorClasses(inputRefs: any, hasErrors: any): void;
    addFocusBlurEvents(element: any): void;
    setCustomValidity(messages: any, dirty: any, external: any): any;
    /**
     * Determines if the value of this component is hidden from the user as if it is coming from the server, but is
     * protected.
     * @returns {boolean|*} - TRUE if the value is hidden.
     */
    isValueHidden(): boolean | any;
    shouldSkipValidation(data: any, row: any, flags?: {}): boolean;
    whenReady(): Promise<void>;
    get dataReady(): Promise<void>;
    /**
     * Prints out the value of this component as a string value.
     * @param {*} value - The value to print out.
     * @returns {string} - The string representation of the value.
     */
    asString(value: any): string;
    setDisabled(element: any, disabled: any): void;
    setLoading(element: any, loading: any): void;
    selectOptions(select: any, tag: any, options: any, defaultValue: any): void;
    setSelectValue(select: any, value: any): void;
    getRelativePath(path: any): any;
    clear(): void;
    append(element: any): void;
    prepend(element: any): void;
    removeChild(element: any): void;
    detachLogic(): void;
    attachLogic(): void;
    /**
     * Get the element information.
     * @returns {*} - The components "input" DOM element information.
     */
    elementInfo(): any;
    autofocus(): void;
    scrollIntoView(element: any, verticalOnly: any): void;
    focus(index: any): void;
    /**
     * Get `Formio` instance for working with files
     * @returns {import('@formio/core').Formio} - The Formio instance file service.
     */
    get fileService(): import("@formio/core").Formio;
    resetCaches(): void;
    get previewMode(): boolean;
}
declare namespace Component {
    let externalLibraries: {};
    function requireLibrary(name: any, property: any, src: any, polling: any): any;
    function libraryReady(name: any): any;
}
export default Component;
import Element from '../../../Element';
import ComponentModal from '../componentModal/ComponentModal';
