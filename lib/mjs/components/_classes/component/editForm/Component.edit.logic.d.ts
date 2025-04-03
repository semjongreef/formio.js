declare const _default: {
    weight: number;
    input: boolean;
    label: string;
    key: string;
    templates: {
        header: string;
        row: string;
        footer: string;
    };
    type: string;
    addAnother: string;
    saveRow: string;
    components: ({
        weight: number;
        input: boolean;
        inputType: string;
        label: string;
        key: string;
        validate: {
            required: boolean;
        };
        type: string;
        title?: undefined;
        tableView?: undefined;
        components?: undefined;
        templates?: undefined;
        addAnother?: undefined;
        saveRow?: undefined;
    } | {
        weight: number;
        key: string;
        input: boolean;
        title: string;
        tableView: boolean;
        components: {
            weight: number;
            input: boolean;
            tableView: boolean;
            components: ({
                weight: number;
                input: boolean;
                label: string;
                key: string;
                tableView: boolean;
                data: {
                    values: {
                        value: string;
                        label: string;
                    }[];
                };
                dataSrc: string;
                template: string;
                type: string;
                customConditional?: undefined;
                components?: undefined;
                rows?: undefined;
                editor?: undefined;
                as?: undefined;
                placeholder?: undefined;
                description?: undefined;
            } | {
                weight: number;
                label: string;
                key: string;
                type: string;
                tableView: boolean;
                customConditional({ row }: {
                    row: any;
                }): boolean;
                components: ({
                    input: boolean;
                    key: string;
                    label: string;
                    type: string;
                    tableView: boolean;
                    calculateValue(): boolean;
                    dataSrc?: undefined;
                    valueProperty?: undefined;
                    data?: undefined;
                } | {
                    type: string;
                    input: boolean;
                    label: string;
                    key: string;
                    dataSrc: string;
                    valueProperty: string;
                    tableView: boolean;
                    data: {
                        custom(context: any): any[];
                    };
                    calculateValue?: undefined;
                } | {
                    type: string;
                    input: boolean;
                    label: string;
                    key: string;
                    tableView: boolean;
                    calculateValue?: undefined;
                    dataSrc?: undefined;
                    valueProperty?: undefined;
                    data?: undefined;
                })[];
                input?: undefined;
                data?: undefined;
                dataSrc?: undefined;
                template?: undefined;
                rows?: undefined;
                editor?: undefined;
                as?: undefined;
                placeholder?: undefined;
                description?: undefined;
            } | {
                weight: number;
                type: string;
                key: string;
                rows: number;
                editor: string;
                as: string;
                input: boolean;
                tableView: boolean;
                placeholder: string;
                description: string;
                customConditional({ row }: {
                    row: any;
                }): boolean;
                label?: undefined;
                data?: undefined;
                dataSrc?: undefined;
                template?: undefined;
                components?: undefined;
            } | {
                weight: number;
                type: string;
                key: string;
                rows: number;
                editor: string;
                label: string;
                as: string;
                input: boolean;
                tableView: boolean;
                placeholder: string;
                description: string;
                customConditional({ row }: {
                    row: any;
                }): boolean;
                data?: undefined;
                dataSrc?: undefined;
                template?: undefined;
                components?: undefined;
            } | {
                weight: number;
                type: string;
                key: string;
                label: string;
                placeholder: string;
                description: string;
                tableView: boolean;
                customConditional({ row }: {
                    row: any;
                }): boolean;
                input?: undefined;
                data?: undefined;
                dataSrc?: undefined;
                template?: undefined;
                components?: undefined;
                rows?: undefined;
                editor?: undefined;
                as?: undefined;
            })[];
            key: string;
            type: string;
        }[];
        type: string;
        inputType?: undefined;
        label?: undefined;
        validate?: undefined;
        templates?: undefined;
        addAnother?: undefined;
        saveRow?: undefined;
    } | {
        weight: number;
        input: boolean;
        label: string;
        key: string;
        tableView: boolean;
        templates: {
            header: string;
            row: string;
            footer: string;
        };
        type: string;
        addAnother: string;
        saveRow: string;
        components: {
            weight: number;
            title: string;
            input: boolean;
            key: string;
            type: string;
            components: (({
                type: string;
                tag: string;
                content: string;
            } & {
                customConditional({ row }: {
                    row: any;
                }): boolean;
            }) | {
                weight: number;
                input: boolean;
                inputType: string;
                label: string;
                key: string;
                validate: {
                    required: boolean;
                };
                type: string;
                data?: undefined;
                dataSrc?: undefined;
                template?: undefined;
                tableView?: undefined;
                customConditional?: undefined;
                description?: undefined;
                editor?: undefined;
                as?: undefined;
                rows?: undefined;
                placeholder?: undefined;
            } | {
                weight: number;
                input: boolean;
                label: string;
                key: string;
                data: {
                    values: {
                        value: string;
                        label: string;
                    }[];
                    json?: undefined;
                };
                dataSrc: string;
                template: string;
                type: string;
                inputType?: undefined;
                validate?: undefined;
                tableView?: undefined;
                customConditional?: undefined;
                description?: undefined;
                editor?: undefined;
                as?: undefined;
                rows?: undefined;
                placeholder?: undefined;
            } | {
                weight: number;
                type: string;
                template: string;
                dataSrc: string;
                tableView: boolean;
                data: {
                    json: {
                        label: string;
                        value: string;
                        type: string;
                    }[];
                    values?: undefined;
                };
                key: string;
                label: string;
                input: boolean;
                customConditional({ row }: {
                    row: any;
                }): boolean;
                inputType?: undefined;
                validate?: undefined;
                description?: undefined;
                editor?: undefined;
                as?: undefined;
                rows?: undefined;
                placeholder?: undefined;
            } | {
                weight: number;
                input: boolean;
                label: string;
                key: string;
                tableView: boolean;
                data: {
                    values: {
                        label: string;
                        value: string;
                    }[];
                    json?: undefined;
                };
                dataSrc: string;
                template: string;
                type: string;
                customConditional({ row }: {
                    row: any;
                }): any;
                inputType?: undefined;
                validate?: undefined;
                description?: undefined;
                editor?: undefined;
                as?: undefined;
                rows?: undefined;
                placeholder?: undefined;
            } | {
                weight: number;
                type: string;
                key: string;
                label: string;
                inputType: string;
                input: boolean;
                tableView: boolean;
                description: string;
                customConditional({ row }: {
                    row: any;
                }): any;
                validate?: undefined;
                data?: undefined;
                dataSrc?: undefined;
                template?: undefined;
                editor?: undefined;
                as?: undefined;
                rows?: undefined;
                placeholder?: undefined;
            } | {
                weight: number;
                input: boolean;
                label: string;
                key: string;
                editor: string;
                as: string;
                rows: number;
                placeholder: string;
                type: string;
                tableView: boolean;
                description: string;
                customConditional({ row }: {
                    row: any;
                }): boolean;
                inputType?: undefined;
                validate?: undefined;
                data?: undefined;
                dataSrc?: undefined;
                template?: undefined;
            } | {
                weight: number;
                input: boolean;
                label: string;
                key: string;
                editor: string;
                rows: number;
                placeholder: string;
                type: string;
                tableView: boolean;
                customConditional({ row }: {
                    row: any;
                }): boolean;
                inputType?: undefined;
                validate?: undefined;
                data?: undefined;
                dataSrc?: undefined;
                template?: undefined;
                description?: undefined;
                as?: undefined;
            })[];
        }[];
        inputType?: undefined;
        validate?: undefined;
        title?: undefined;
    })[];
}[];
export default _default;
