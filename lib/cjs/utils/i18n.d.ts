/**
 * This file is used to mimic the i18n library interface.
 */
export class I18n {
    static languages: {};
    static setDefaultTranslations(languages: any): void;
    static init(languages?: {}): I18n;
    static createInstance(): I18n;
    constructor(languages?: {});
    languages: any;
    defaultKeys: any;
    language: string;
    currentLanguage: any;
    setLanguages(languages: any, noDefaultOverride: any): void;
    dir(lang?: string): "rtl" | "ltr";
    changeLanguage(language: any, ready?: null): void;
    addResourceBundle(language: any, type: any, strings: any): void;
    t(text: any, ...args: any[]): any;
}
