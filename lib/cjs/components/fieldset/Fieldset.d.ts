export default class FieldsetComponent extends NestedComponent {
    static get builderInfo(): {
        title: string;
        icon: string;
        group: string;
        documentation: string;
        showPreview: boolean;
        weight: number;
        schema: any;
    };
    static savedValueTypes(): never[];
    constructor(...args: any[]);
    noField: boolean;
}
import NestedComponent from '../_classes/nested/NestedComponent';
