export default class NestedArrayComponent extends NestedDataComponent {
    static savedValueTypes(): string[];
    componentContext(component: any): any;
    get iteratableRows(): void;
    set rowIndex(value: number | undefined);
    get rowIndex(): number | undefined;
    prevHasAddButton: any;
    checkAddButtonChanged(): void;
    checkData(data: any, flags: any, row: any): any;
    processRows(method: any, data: any, opts: any, defaultValue: any, silentCheck: any): any;
    validate(data: any, flags?: {}): any[] | Promise<any[]>;
    checkRow(...args: any[]): any;
    processRow(method: any, data: any, opts: any, row: any, components: any, silentCheck: any): any;
    hasAddButton(): any;
    everyComponent(fn: any, rowIndex: any, options?: {}): void;
    _getEmailTableHeader(options: any): string;
    _getEmailTableBody(options: any): string;
    getComponents(rowIndex: any): any;
    removeSubmissionMetadataRow(index: any): void;
}
import NestedDataComponent from '../nesteddata/NestedDataComponent';
