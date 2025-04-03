export default class CheckBoxComponent extends Field {
    static get builderInfo(): {
        title: string;
        group: string;
        icon: string;
        documentation: string;
        weight: number;
        schema: any;
    };
    static get serverConditionSettings(): {
        operators: string[];
        valueComponent(): {
            valueType: string;
            data: {
                values: {
                    label: string;
                    value: string;
                }[];
            };
            type: string;
        };
    };
    static get conditionOperatorsSettings(): {
        operators: string[];
        valueComponent(): {
            valueType: string;
            data: {
                values: {
                    label: string;
                    value: string;
                }[];
            };
            type: string;
        };
    };
    static savedValueTypes(schema: any): string[] | null;
    get labelClass(): string;
    get inputInfo(): any;
    get labelInfo(): {
        hidden: boolean;
    };
    render(): string;
    attach(element: any): Promise<void>;
    input: any;
    detach(element: any): void;
    get emptyValue(): false | "";
    getValueAt(index: any): any;
    get checked(): boolean;
    setCheckedState(value: any): any;
    setValue(value: any, flags?: {}): boolean;
    getValueAsString(value: any): string;
    updateValue(value: any, flags: any): boolean;
}
import Field from '../_classes/field/Field';
