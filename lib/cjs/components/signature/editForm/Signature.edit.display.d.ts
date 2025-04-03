declare const _default: ({
    type: string;
    input: boolean;
    key: string;
    label: string;
    tooltip: string;
    placeholder: string;
    weight: number;
    conditional?: undefined;
    ignore?: undefined;
} | {
    type: string;
    input: boolean;
    key: string;
    label: string;
    tooltip: string;
    placeholder: string;
    conditional: {
        json: {
            '!': {
                var: string;
            }[];
        };
    };
    weight: number;
    ignore?: undefined;
} | {
    weight: number;
    type: string;
    label: string;
    tooltip: string;
    key: string;
    input: boolean;
    placeholder?: undefined;
    conditional?: undefined;
    ignore?: undefined;
} | {
    key: string;
    ignore: boolean;
    type?: undefined;
    input?: undefined;
    label?: undefined;
    tooltip?: undefined;
    placeholder?: undefined;
    weight?: undefined;
    conditional?: undefined;
})[];
export default _default;
