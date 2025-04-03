export default class DataGridComponent extends NestedArrayComponent {
    static get builderInfo(): {
        title: string;
        icon: string;
        group: string;
        documentation: string;
        showPreview: boolean;
        weight: number;
        schema: any;
    };
    constructor(...args: any[]);
    tabIndex: number;
    rows: any[] | undefined;
    columns: any[] | undefined;
    dragulaReady: Promise<any> | undefined;
    visibleColumns: {} | undefined;
    set dataValue(value: any[]);
    get dataValue(): any[];
    get initEmpty(): any;
    get initRows(): boolean;
    get emptyValue(): {}[];
    get addAnotherPosition(): any;
    get minLength(): any;
    get defaultValue(): any[];
    get datagridKey(): string;
    get allowReorder(): any;
    get iteratableRows(): {
        components: any;
        data: any;
    }[];
    isEmpty(value?: any[]): any;
    /**
     * Split rows into chunks.
     * @param {number[]} groups - array of numbers where each item is size of group
     * @param {Array<T>} rows - rows collection
     * @returns {Array<T[]>} - The chunked rows
     */
    getRowChunks(groups: number[], rows: Array<T>): Array<T[]>;
    /**
     * Create groups object.
     * Each key in object represents index of first row in group.
     * @returns {object} - The groups object.
     */
    getGroups(): object;
    /**
     * Get group sizes.
     * @returns {number[]} - The array of group sizes.
     */
    getGroupSizes(): number[];
    hasRowGroups(): any;
    totalRowsNumber(groups: any): any;
    setStaticValue(n: any): void;
    hasExtraColumn(): boolean;
    hasRemoveButtons(): boolean;
    hasTopSubmit(): any;
    hasBottomSubmit(): any;
    get canAddColumn(): boolean;
    render(): string;
    getRows(): {}[];
    getColumns(): any[];
    hasHeader(): any;
    dragula: any;
    getComponentsContainer(): any;
    /**
     * Reorder values in array based on the old and new position
     * @param {any} valuesArr - An array of values.
     * @param {number} oldPosition - The index of the value in array before reordering.
     * @param {number} newPosition - The index of the value in array after reordering.
     * @param {boolean|any} movedBelow - Whether or not the value is moved below.
     * @returns {void}
     */
    reorderValues(valuesArr: any, oldPosition: number, newPosition: number, movedBelow: boolean | any): void;
    onReorder(element: any, _target: any, _source: any, sibling: any): void;
    onCloned(el: any, original: any): void;
    focusOnNewRowElement(row: any): void;
    addRow(): void;
    updateComponentsRowIndex(components: any, rowIndex: any): void;
    updateRowsComponents(rowIndex: any): void;
    removeRow(index: any): void;
    removeRowComponents(row: any): void;
    getRowValues(): any[];
    setRowComponentsData(rowIndex: any, rowData: any): void;
    createRows(init: any, rebuild: any): boolean;
    createRowComponents(row: any, rowIndex: any): {};
    checkColumns(data: any, flags?: {}): {
        rebuild: boolean;
        show: boolean;
    };
    checkComponentConditions(data: any, flags: any, row: any): boolean;
    toggleGroup(element: any, index: any): void;
}
import NestedArrayComponent from '../_classes/nestedarray/NestedArrayComponent';
