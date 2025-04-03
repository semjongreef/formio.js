export default class ButtonComponent extends Field {
    static get builderInfo(): {
        title: string;
        group: string;
        icon: string;
        documentation: string;
        weight: number;
        schema: any;
    };
    static savedValueTypes(schema: any): string[];
    constructor(component: any, options: any, data: any);
    filesUploading: any[];
    get inputInfo(): any;
    get labelInfo(): {
        hidden: boolean;
    };
    set loading(loading: any);
    createLabel(): void;
    createInput(container: any): any;
    get emptyValue(): boolean;
    get clicked(): any;
    get defaultValue(): boolean;
    get oauthConfig(): any;
    render(): string;
    attachButton(): void;
    hasError: boolean | undefined;
    isDisabledOnInvalid: any;
    attach(element: any): Promise<void>;
    detach(element: any): void;
    onClick(event: any): void;
    openOauth(settings: any): void;
    get oauthComponentPath(): any;
    focus(): void;
    triggerCaptcha(): void;
}
import Field from '../_classes/field/Field';
