declare class Wizard extends Webform {
    pages: any[];
    prefixComps: any[];
    suffixComps: any[];
    components: any[];
    originalComponents: any[];
    page: number;
    currentPanel: any;
    currentPanels: any[] | null;
    currentNextPage: number;
    _seenPages: number[];
    subWizards: any[];
    allPages: any[];
    lastPromise: Promise<void>;
    enabledIndex: number;
    editMode: boolean;
    originalOptions: any;
    isLastPage(): any;
    getPages(args?: {}): any[];
    get hasExtraPages(): boolean;
    get localData(): any;
    get wizardKey(): string;
    set wizard(form: object);
    get wizard(): object;
    get buttons(): {};
    get buttonOrder(): any;
    get renderContext(): {
        disableWizardSubmit: any;
        wizardKey: string;
        isBreadcrumbClickable: any;
        isSubForm: boolean;
        panels: any[];
        buttons: {};
        currentPage: number;
        buttonOrder: any;
    };
    prepareNavigationSettings(ctx: any): any;
    prepareHeaderSettings(ctx: any, headerType: any): any;
    render(): any;
    redrawNavigation(): void;
    redrawHeader(): void;
    /**
     * Attaches the wizard to the provided DOM element, initializes component references, sets up navigation,
     * and emits a render event. It will initialize the wizard's index if necessary,
     * attach event hooks, and make sure that the current page is rendered and displayed correctly.
     * @param {HTMLElement} element - The DOM element to which the wizard will be attached.
     * @returns {Promise} A promise that resolves when all components have been successfully attached.
     */
    attach(element: HTMLElement): Promise<any>;
    scrollPageToTop(): void;
    isBreadcrumbClickable(): any;
    isAllowPrevious(): any;
    /**
     * Handles navigate on 'Enter' key event in a wizard form.
     * @param {KeyboardEvent} event - The keyboard event object that triggered the handler.
     */
    handleNaviageteOnEnter(event: KeyboardEvent): void;
    /**
     * Handles save on 'Enter' key event in a wizard form.
     * @param {KeyboardEvent} event - The keyboard event object that triggered the handler.
     */
    handleSaveOnEnter(event: KeyboardEvent): void;
    attachNav(): void;
    /**
     * Emits an event indicating that a wizard page has been selected.
     * @param {number} index - Index of the selected wizard page in the `pages` array.
     * @fires emit - Emits the 'wizardPageSelected' event with the page object and index.
     */
    emitWizardPageSelected(index: number): void;
    attachHeader(): void;
    detachNav(): void;
    detachHeader(): void;
    transformPages(): void;
    getSortedComponents({ components, originalComponents }: {
        components: any;
        originalComponents: any;
    }): any[];
    findRootPanel(component: any): any;
    setRootPanelId(component: any): void;
    establishPages(data?: object): any[];
    updatePages(): void;
    addComponents(): void;
    setPage(num: any): Promise<void>;
    pageFieldLogic(page: any): void;
    get currentPage(): any;
    getNextPage(): number | null;
    getPreviousPage(): number;
    beforeSubmit(): Promise<any[]>;
    beforePage(next: any): Promise<any>;
    emitNextPage(): void;
    nextPage(): Promise<void>;
    validateCurrentPage(flags?: {}): any;
    emitPrevPage(): void;
    prevPage(): Promise<void>;
    cancel(noconfirm: any): Promise<void> | Promise<number>;
    getPageIndexByKey(key: any): number;
    get schema(): object;
    setComponentSchema(): void;
    setForm(form: any, flags?: {}): Promise<any> | undefined;
    onSetForm(clonedForm: any, initialForm: any): void;
    setEditMode(submission: any): void;
    setValue(submission: any, flags: {} | undefined, ignoreEstablishment: any): any;
    isClickable(page: any, index: any): any;
    hasButton(name: any, nextPage?: number | null): any;
    pageId(page: any): any;
    onChange(flags: any, changed: any, modified: any, changes: any): void;
    checkValidity(data: any, dirty: any, row: any, currentPageOnly: any, childErrors?: any[]): any;
    focusOnComponent(key: any): void | Promise<void>;
    triggerButtonCaptcha(page: any): void;
}
declare namespace Wizard {
    let setBaseUrl: any;
    let setApiUrl: any;
    let setAppUrl: any;
}
export default Wizard;
import Webform from './Webform';
