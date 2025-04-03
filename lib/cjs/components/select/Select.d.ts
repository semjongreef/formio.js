export default class SelectComponent extends ListComponent {
    static get builderInfo(): {
        title: string;
        group: string;
        icon: string;
        weight: number;
        documentation: string;
        schema: any;
    };
    static get serverConditionSettings(): {
        valueComponent(classComp: any): any;
        dataTypeOperators: {
            number: string[];
        };
        dataTypeValueComponents: {
            number: {
                lessThan: () => {
                    type: string;
                };
                greaterThan: () => {
                    type: string;
                };
                lessThanOrEqual: () => {
                    type: string;
                };
                greaterThanOrEqual: () => {
                    type: string;
                };
            };
        };
    };
    static get conditionOperatorsSettings(): {
        valueComponent(classComp: any): any;
        dataTypeOperators: {
            number: string[];
        };
        dataTypeValueComponents: {
            number: {
                lessThan: () => {
                    type: string;
                };
                greaterThan: () => {
                    type: string;
                };
                lessThanOrEqual: () => {
                    type: string;
                };
                greaterThanOrEqual: () => {
                    type: string;
                };
            };
        };
    };
    static savedValueTypes(schema: any): any[];
    templateData: {} | undefined;
    triggerUpdate: ((...args: any[]) => any) | undefined;
    itemsLoadedResolve: ((value: any) => void) | undefined;
    isFromSearch: boolean | undefined;
    searchServerCount: any;
    defaultServerCount: any;
    isScrollLoading: boolean | undefined;
    searchDownloadedResources: any;
    defaultDownloadedResources: any;
    activated: boolean | undefined;
    shouldPositionDropdown: any;
    get emptyValue(): {};
    get valueProperty(): any;
    get inputInfo(): any;
    get isSelectResource(): boolean;
    get itemsFromUrl(): boolean;
    get isInfiniteScrollProvided(): boolean;
    get shouldInitialLoad(): boolean;
    get selectMetadata(): any;
    isEntireObjectDisplay(): boolean;
    selectValueAndLabel(data: any): {
        value: any;
        label: any;
    };
    itemTemplate(data: any, value: any): any;
    /**
     * Adds an option to the select dropdown.
     * @param {*} value - The value of the new option.
     * @param {string} label - The label of the new option.
     * @param {object} [attrs] - Additional value attributes. Defaults to {}.
     * @param {string} [id] - An id. Defaults to a random string.
     */
    addOption(value: any, label: string, attrs?: object | undefined, id?: string | undefined): void;
    addValueOptions(items: any): boolean;
    disableInfiniteScroll(): void;
    set serverCount(value: any);
    get serverCount(): any;
    setItems(items: any, fromSearch: any): void;
    selectItems: any;
    set downloadedResources(value: any);
    get downloadedResources(): any;
    getSingleItemValueForHTMLMode(data: any): any;
    itemValueForHTMLMode(value: any): any;
    get loadingError(): boolean | undefined;
    loadItems(url: any, search: any, headers: any, options: any, method: any, body: any): void;
    getCustomItems(): any;
    asyncValues: boolean | undefined;
    asyncCustomValues(): boolean | undefined;
    updateCustomItems(forceUpdate: any): void;
    refresh(value: any, { instance }: {
        instance: any;
    }): void;
    get additionalResourcesAvailable(): any;
    addPlaceholder(): void;
    /**
     * Activate this select control.
     */
    activate(): void;
    setLoadingItem(addToCurrentList?: boolean): void;
    get active(): boolean | undefined;
    render(): string;
    wrapElement(element: any): any;
    choicesOptions(): any;
    attach(element: any): Promise<void> | undefined;
    focusableElement: any;
    choices: Choices | null | undefined;
    scrollList: any;
    isRemoveButtonPressed: boolean | undefined;
    setDropdownPosition(): void;
    hasDataGridAncestor(comp: any): any;
    positionDropdown(scroll: any): void;
    get isLoadingAvailable(): any;
    onScroll(): void;
    attachRefreshOnBlur(): void;
    update(): void;
    addCurrentChoices(values: any, items: any, keyValue: any): any;
    getValueAsString(data: any, options: any): any;
    normalizeSingleValue(value: any): any;
    setMetadata(value: any, flags?: {}): any;
    updateValue(value: any, flags: any): boolean;
    undoValueTyping(value: any): any;
    setValue(value: any, flags?: {}): boolean;
    lazyLoadInit: boolean | undefined;
    isInitApiCallNeeded(hasValue: any): any;
    setChoicesValue(value: any, hasPreviousValue: any, flags?: {}): void;
    validateValueAvailability(setting: any, value: any): boolean;
    /**
     * Performs required transformations on the initial value to use in selectOptions
     * @param {*} value - The value to transform.
     * @returns {*} - Returns the options value.
     */
    getOptionValue(value: any): any;
    /**
     * If component has static values (values, json) or custom values, returns an array of them
     * @returns {Array<*>|undefined} - Returns an array of the static or custom values.
     */
    getOptionsValues(): Array<any> | undefined;
    /**
     * Output this select dropdown as a string value.
     * @returns {*}
     */
    isBooleanOrNumber(value: any): any;
    getNormalizedValues(): any;
    asString(value: any, options?: {}): any;
    focus(): void;
    setErrorClasses(elements: any, dirty: any, hasError: any, hasMessages: any, element?: any): void;
}
import ListComponent from '../_classes/list/ListComponent';
import Choices from '../../utils/ChoicesWrapper';
