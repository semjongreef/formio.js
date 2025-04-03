"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*globals grecaptcha*/
const Component_1 = __importDefault(require("../_classes/component/Component"));
const Formio_1 = require("../../Formio");
const get_1 = __importDefault(require("lodash/get"));
const debounce_1 = __importDefault(require("lodash/debounce"));
class ReCaptchaComponent extends Component_1.default {
    static schema(...extend) {
        return Component_1.default.schema({
            type: 'recaptcha',
            key: 'recaptcha',
            label: 'reCAPTCHA'
        }, ...extend);
    }
    static get builderInfo() {
        return {};
    }
    static savedValueTypes() {
        return [];
    }
    static get conditionOperatorsSettings() {
        return Object.assign(Object.assign({}, super.conditionOperatorsSettings), { operators: ['isEmpty', 'isNotEmpty'] });
    }
    static get serverConditionSettings() {
        return ReCaptchaComponent.conditionOperatorsSettings;
    }
    render() {
        this.recaptchaResult = null;
        if (this.builderMode) {
            return super.render('reCAPTCHA');
        }
        else {
            return super.render('', true);
        }
    }
    createInput() {
        if (this.builderMode) {
            // We need to see it in builder mode.
            this.append(this.text(this.name));
        }
        else {
            const siteKey = (0, get_1.default)(this.root.form, 'settings.recaptcha.siteKey');
            if (siteKey) {
                const recaptchaApiScriptUrl = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
                this.recaptchaApiReady = Formio_1.Formio.requireLibrary('googleRecaptcha', 'grecaptcha', recaptchaApiScriptUrl, true);
            }
            else {
                console.warn(this.t('noSiteKey'));
            }
        }
    }
    createLabel() {
        return;
    }
    get skipInEmail() {
        return true;
    }
    verify(actionName) {
        return __awaiter(this, void 0, void 0, function* () {
            const siteKey = (0, get_1.default)(this.root.form, 'settings.recaptcha.siteKey');
            if (!siteKey) {
                console.warn(this.t('noSiteKey'));
                return;
            }
            if (!this.recaptchaApiReady) {
                const recaptchaApiScriptUrl = `https://www.google.com/recaptcha/api.js?render=${(0, get_1.default)(this.root.form, 'settings.recaptcha.siteKey')}`;
                this.recaptchaApiReady = Formio_1.Formio.requireLibrary('googleRecaptcha', 'grecaptcha', recaptchaApiScriptUrl, true);
            }
            try {
                yield this.recaptchaApiReady;
                this.recaptchaVerifiedPromise = new Promise((resolve, reject) => {
                    if (!this.isLoading) {
                        this.isLoading = true;
                        grecaptcha.ready((0, debounce_1.default)(() => __awaiter(this, void 0, void 0, function* () {
                            try {
                                const token = yield grecaptcha.execute(siteKey, { action: actionName });
                                const verificationResult = yield this.sendVerificationRequest(token);
                                this.recaptchaResult = Object.assign(Object.assign({}, verificationResult), { token });
                                this.updateValue(this.recaptchaResult);
                                this.isLoading = false;
                                return resolve(verificationResult);
                            }
                            catch (err) {
                                this.isLoading = false;
                                reject(err);
                            }
                        }), 1000));
                    }
                });
            }
            catch (err) {
                this.loading = false;
            }
        });
    }
    beforeSubmit() {
        if (this.recaptchaVerifiedPromise) {
            return this.recaptchaVerifiedPromise
                .then(() => super.beforeSubmit());
        }
        return super.beforeSubmit();
    }
    sendVerificationRequest(token) {
        return Formio_1.Formio.makeStaticRequest(`${Formio_1.Formio.projectUrl}/recaptcha?recaptchaToken=${token}`);
    }
    checkComponentValidity(data, dirty, row, options = {}, errors = []) {
        data = data || this.rootValue;
        row = row || this.data;
        const { async = false } = options;
        // Verification could be async only (which for now is only the case for server-side validation)
        if (!async) {
            return super.checkComponentValidity(data, dirty, row, options, errors);
        }
        const componentData = row[this.component.key];
        if (!componentData || !componentData.token) {
            this.setCustomValidity(this.t('reCaptchaTokenNotSpecifiedError'));
            return Promise.resolve(false);
        }
        if (!componentData.success) {
            this.setCustomValidity(this.t('reCaptchaTokenValidationError'));
            return Promise.resolve(false);
        }
        // Any further validation will 100% not run on the client
        return Promise.resolve(true);
    }
    normalizeValue(newValue) {
        // If a recaptcha result has already been established, then do not allow it to be reset.
        return this.recaptchaResult ? this.recaptchaResult : newValue;
    }
}
exports.default = ReCaptchaComponent;
