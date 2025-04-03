export default class PDFBuilder extends WebformBuilder {
    get defaultGroups(): {
        pdf: {
            title: string;
            weight: number;
            default: boolean;
            components: {
                textfield: boolean;
                number: boolean;
                password: boolean;
                email: boolean;
                phoneNumber: boolean;
                currency: boolean;
                checkbox: boolean;
                signature: boolean;
                select: boolean;
                textarea: boolean;
                datetime: boolean;
                file: boolean;
                htmlelement: boolean;
                signrequestsignature: boolean;
            };
        };
        basic: boolean;
        advanced: boolean;
        layout: boolean;
        data: boolean;
        premium: boolean;
        resource: boolean;
    };
    get hasPDF(): any;
    get projectUrl(): any;
    afterAttach(): void;
    pdfLoaded: boolean | undefined;
    upload(file: any): void;
    setUploadError(message: any): void;
    getParentContainer(component: any): {
        formioComponent: any;
        formioContainer: any[];
        originalComponent: null;
    };
    initIframeEvents(): void;
    initDropzoneEvents(): void;
    updateDragAndDrop(): void;
    prepSidebarComponentsForDrag(): void;
    updateDropzoneDimensions(): void;
    onDragStart(e: any): void;
    itemOffsetX: any;
    itemOffsetY: any;
    dropEmitted: boolean | undefined;
    onDropzoneDrop(e: any): boolean;
    dropEvent: any;
    onDragEnd(e: any): void;
}
import WebformBuilder from './WebformBuilder';
