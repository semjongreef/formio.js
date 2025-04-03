export default class WebformBuilder extends Component {
    constructor(...args: any[]);
    dragulaLib: any;
    builderHeight: number;
    schemas: {};
    repeatablePaths: any[];
    sideBarScroll: any;
    sideBarScrollOffset: any;
    dragDropEnabled: boolean;
    builder: any;
    groups: {};
    groupOrder: any[];
    webform: any;
    pathComponentsMapping: {};
    arrayDataComponentPaths: any[];
    nestedDataComponents: any[];
    arrayDataComponents: any[];
    allowDrop(): boolean;
    addExistingResourceFields(resources: any): void;
    attachTooltip(component: any, title: any): import("tippy.js").Instance<import("tippy.js").Props>[];
    attachComponent(element: any, component: any): any;
    createForm(options: any): any;
    /**
     * Called when everything is ready.
     * @returns {Promise} - Wait for webform to be ready.
     */
    get ready(): Promise<any>;
    get defaultGroups(): {
        basic: {
            title: string;
            weight: number;
            default: boolean;
        };
        advanced: {
            title: string;
            weight: number;
        };
        layout: {
            title: string;
            weight: number;
        };
        data: {
            title: string;
            weight: number;
        };
        premium: {
            title: string;
            weight: number;
        };
    };
    redraw(): Promise<void> | Promise<boolean>;
    set form(value: any);
    get form(): any;
    get schema(): any;
    get container(): any;
    /**
     * When a component sets its api key, we need to check if it is unique within its namespace. Find the namespace root
     * so we can calculate this correctly.
     * @param {import('@formio/core').Component} component - The component to find the namespace root for.
     * @returns {import('@formio/core').Component[]} - The components root for this namespace.
     */
    findNamespaceRoot(component: import('@formio/core').Component): import('@formio/core').Component[];
    recurseNamespace(component: any): any;
    render(): any;
    attach(element: any): Promise<any>;
    searchFields(searchString?: string): void;
    orderComponents(groupInfo: any, foundComponents: any): void;
    updateDragAndDrop(): any;
    initDragula(): void;
    dragula: any;
    getComponentInfo(key: any, group: any): any;
    getComponentsPath(component: any, parent: any): string;
    onDrop(element: any, target: any, source: any, sibling: any): any;
    setForm(form: any): any;
    keyboardActionsEnabled: any;
    populateCaptchaSettings(form: any): void;
    removeComponent(component: any, parent: any, original: any, componentInstance: any): boolean | undefined;
    replaceDoubleQuotes(data: any, fieldsToRemoveDoubleQuotes?: any[]): any;
    updateComponent(component: any, changed: any): void;
    findRepeatablePaths(): any[];
    highlightInvalidComponents(): void;
    /**
     * Called when a new component is saved.
     * @param {Component} component - The component instance to save.
     * @param {Component} parent - The parent component.
     * @param {boolean} isNew - If this is a new component.
     * @param {Component} original - The original component.
     * @returns {boolean} - If the component was saved.
     */
    saveComponent(component: Component, parent: Component, isNew: boolean, original: Component): boolean;
    isComponentCreated: boolean | undefined;
    emitSaveComponentEvent(schema: any, originalComp: any, parentComponentSchema: any, path: any, index: any, isNew: any, originalComponentSchema: any): void;
    attachEditComponentControls(component: any, parent: any, isNew: any, original: any, ComponentClass: any): void;
    saved: boolean | undefined;
    showPreview: any;
    editComponent(component: any, parent: any, isNew: any, isJsonEdit: any, original: any, flags?: {}): void;
    editForm: Webform | undefined;
    preview: Webform | null | undefined;
    componentEdit: any;
    dialog: any;
    updateComponentKey(data: any): any;
    moveComponent(component: any): void;
    selectedComponent: any;
    moveHandler: (e: any) => void;
    updateComponentPlacement(direction: any): void;
    stopMoving(comp: any): void;
    addNewComponent(element: any): void;
    /**
     * Creates copy of component schema and stores it under sessionStorage.
     * @param {Component} component - The component to copy.
     * @returns {void}
     */
    copyComponent(component: Component): void;
    /**
     * Paste copied component after the current component.
     * @param {Component} component - The component to paste after.
     * @returns {void}
     */
    pasteComponent(component: Component): void;
    isParentSaveChildMethod(parentComp: any): boolean;
    getParentElement(element: any): any;
    addBuilderComponentInfo(component: any): any;
    addBuilderGroup(name: any, group: any): void;
    updateBuilderGroup(name: any, group: any): void;
    generateKey(info: any): any;
    hasEditTabs(type: any): boolean;
}
import Component from './components/_classes/component/Component';
import Webform from './Webform';
