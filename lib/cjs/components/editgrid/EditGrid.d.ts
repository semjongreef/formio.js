export default class EditGridComponent extends NestedArrayComponent {
    static get builderInfo(): {
        title: string;
        icon: string;
        group: string;
        documentation: string;
        showPreview: boolean;
        weight: number;
        schema: any;
    };
    static get defaultHeaderTemplate(): string;
    static get defaultTableHeaderTemplate(): string;
    static get defaultRowTemplate(): string;
    static get defaultTableRowTemplate(): string;
    constructor(...args: any[]);
    get defaultDialogTemplate(): string;
    get defaultRowTemplate(): string;
    get defaultHeaderTemplate(): string;
    get rowTemplate(): any;
    get headerTemplate(): any;
    /**
     * @returns {boolean} - Returns true if the component has nested components which don't trigger changes on the root level
     */
    get hasScopedChildren(): boolean;
    get emptyValue(): never[];
    get editgridKey(): string;
    get rowRef(): string;
    get rowElements(): any;
    get rowRefs(): any;
    get addRowRef(): string;
    get addRowElements(): any;
    get saveRowRef(): string;
    get saveRowElements(): any;
    get cancelRowRef(): string;
    get cancelRowElements(): any;
    get inlineEditMode(): any;
    get saveEditMode(): boolean;
    get minLength(): any;
    set data(value: any);
    get data(): any;
    get displayAsTable(): any;
    get iteratableRows(): any;
    get defaultValue(): any[];
    hasRemoveButtons(): boolean;
    editRows: any;
    checkRowVariableTypeComponents(editRow: any, rowIndex: any): boolean;
    setVariableTypeComponents(): void;
    variableTypeComponentsIndexes: any[] | undefined;
    isOpen(editRow: any): boolean;
    isComponentVisibleInSomeRow(component: any): any;
    visibleInHeader: any;
    flattenRowDataValue(dataValue: any): {};
    isComponentVisibleInRow(component: any, flattenedComponents: any): any;
    displayComponentValue(component: any, header: any): boolean;
    renderRow(row: any, rowIndex: any): any;
    eachComponent(fn: any, rowIndex: any): void;
    flattenComponents(rowIndex: any): {};
    destroyComponents(all?: boolean, rowIndex?: number): void;
    createRow(dataObj: any, rowIndex: any): {
        components: any;
        data: any;
        state: string;
        backup: null;
        error: null;
        rowIndex: any;
    };
    addRow(): {
        components: any;
        data: any;
        state: string;
        backup: null;
        error: null;
        rowIndex: any;
    } | undefined;
    emptyRow: any;
    addRowModal(rowIndex: any): Promise<any>;
    alert: Alert | null | undefined;
    showDialog(rowIndex: any): Promise<any>;
    editRow(rowIndex: any): Promise<any>;
    clearErrors(rowIndex: any): void;
    cancelRow(rowIndex: any): void;
    saveRow(rowIndex: any, modified: any): boolean | undefined;
    beforeFocus(component: any): void;
    updateComponentsRowIndex(components: any, rowIndex: any): void;
    updateRowsComponents(rowIndex: any): void;
    baseRemoveRow(rowIndex: any): any;
    removeRow(rowIndex: any, modified: any): void;
    createRowComponents(row: any, rowIndex: any, recreatePartially: any): any;
    hasOpenRows(): any;
    getAttachedData(data?: null): any;
    shouldValidateDraft(editRow: any): any;
    shouldValidateRow(editRow: any, dirty: any, fromSubmission: any): any;
    validateRow(editRow: any, dirty: any, forceSilentCheck: any, fromSubmission: any): any;
    showRowErrorAlerts(editRow: any, errors: any): void;
    /**
     * @returns {boolean} - Return that this component processes its own validation.
     */
    get processOwnValidation(): boolean;
    checkComponentValidity(data: any, dirty: any, row: any, options?: {}, errors?: any[]): boolean;
    setRowInvalid(ref: any, index: any): void;
    changeState(changed: any, flags: any): void;
    openWhenEmpty(): void;
    restoreRowContext(editRow: any, flags?: {}): void;
    emptyRows(): void;
    hasChanged: (newValue: any, oldValue: any) => boolean;
}
import NestedArrayComponent from '../_classes/nestedarray/NestedArrayComponent';
import Alert from '../alert/Alert';
