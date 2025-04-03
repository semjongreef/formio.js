"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18n = void 0;
const utils_1 = require("@formio/core/utils");
const i18n_1 = __importDefault(require("../i18n"));
const lodash_1 = require("lodash");
const core_1 = require("@formio/core");
const i18Defaults = {};
for (const lang in i18n_1.default.resources) {
    if (i18n_1.default.resources.hasOwnProperty(lang)) {
        i18Defaults[lang] = i18n_1.default.resources[lang].translation;
    }
}
/**
 * This file is used to mimic the i18n library interface.
 */
class I18n {
    constructor(languages = {}) {
        var _a;
        this.languages = (0, core_1.fastCloneDeep)(I18n.languages || {});
        this.defaultKeys = ((_a = I18n.languages) === null || _a === void 0 ? void 0 : _a.en) || {};
        this.language = 'en';
        this.currentLanguage = i18Defaults.en;
        this.setLanguages(languages);
        this.changeLanguage(this.language);
    }
    static setDefaultTranslations(languages) {
        if ((0, lodash_1.isEmpty)(languages)) {
            return;
        }
        for (const lang in languages) {
            if (lang !== 'language' && languages.hasOwnProperty(lang)) {
                if (!this.languages[lang]) {
                    this.languages[lang] = {};
                }
                this.languages[lang] = Object.assign(Object.assign({}, languages[lang]), this.languages[lang]);
            }
        }
    }
    setLanguages(languages, noDefaultOverride) {
        if (languages.resources) {
            for (const lang in languages.resources) {
                if (languages.resources.hasOwnProperty(lang)) {
                    languages[lang] = languages.resources[lang].translation;
                }
            }
            delete languages.resources;
        }
        if (languages.lng) {
            languages.language = languages.lng;
            delete languages.lng;
        }
        // Do not use these configurations.
        delete languages.nsSeparator;
        delete languages.keySeparator;
        delete languages.pluralSeparator;
        delete languages.contextSeparator;
        // Now establish the languages default.
        if (languages.language) {
            this.language = languages.language;
        }
        for (const lang in languages) {
            if (lang !== 'language' && languages.hasOwnProperty(lang)) {
                if (!this.languages[lang]) {
                    this.languages[lang] = {};
                }
                this.languages[lang] = noDefaultOverride
                    ? Object.assign(Object.assign({}, languages[lang]), this.languages[lang]) : Object.assign(Object.assign({}, this.languages[lang]), languages[lang]);
            }
        }
    }
    static init(languages = {}) {
        return new I18n(languages);
    }
    dir(lang = '') {
        lang = lang || this.language;
        const rtls = ['ar', 'he', 'fa', 'ps', 'ur'];
        return rtls.includes(lang) ? 'rtl' : 'ltr';
    }
    static createInstance() {
        return new I18n();
    }
    changeLanguage(language, ready = null) {
        if (!this.languages[language]) {
            language = 'en';
        }
        this.language = language;
        this.currentLanguage = this.languages[language] ? this.languages[language] : {};
        if (ready) {
            ready();
        }
    }
    addResourceBundle(language, type, strings) {
        this.languages[language] = strings;
    }
    t(text, ...args) {
        var _a;
        let currentTranslation = this.currentLanguage[text];
        // provide compatibility with cases where the entire phrase is used as a key
        // get the phrase that is possibly being used as a key
        const defaultKey = this.defaultKeys[text];
        if (defaultKey && this.currentLanguage[defaultKey]) {
            // get translation using the phrase as a key
            currentTranslation = this.currentLanguage[defaultKey];
        }
        if (currentTranslation) {
            const customTranslationFieldName = (_a = args[0]) === null || _a === void 0 ? void 0 : _a.field;
            if (customTranslationFieldName && this.currentLanguage[customTranslationFieldName]) {
                args[0].field = this.currentLanguage[customTranslationFieldName];
            }
            return utils_1.Evaluator.interpolateString(currentTranslation, ...args);
        }
        return utils_1.Evaluator.interpolateString(text, ...args);
    }
}
exports.I18n = I18n;
I18n.languages = i18Defaults;
