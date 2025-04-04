"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const FormioAddon_1 = __importDefault(require("../FormioAddon"));
const PasswordStrengthAddon_form_1 = __importDefault(require("./PasswordStrengthAddon.form"));
class PasswordStrengthAddon extends FormioAddon_1.default {
    static get info() {
        return {
            supportedComponents: ['password'],
            name: 'passwordStrength',
            components: PasswordStrengthAddon_form_1.default,
            label: 'Password Strength',
            defaultSettings: {
                rulesSettings: [
                    { name: 'length', required: false, message: 'Value should be longer' },
                    { name: 'upperCase', required: false, message: 'Value should have uppercase letters' },
                    { name: 'numeric', required: false, message: 'Value should have numeric symbols' },
                    { name: 'lowerCase', required: false, message: 'Value should be have lowercase letters' },
                    { name: 'symbols', required: false, message: 'Value should have symbols' }
                ],
                updateOn: 'levelChange',
                required: true,
                levels: [
                    { name: 'Low', maxEntropy: 28, style: 'danger' },
                    { name: 'Medium', maxEntropy: 45, style: 'warning' },
                    { name: 'High', maxEntropy: 59, style: 'info' },
                    { name: 'Very High', maxEntropy: 85, style: 'success' },
                ],
                blackList: [],
                template: `
          <div class="formio-security-indicator">
            {% if (!ctx.readOnly && !ctx.pristine) { %}
              <div
                title="{{ctx.t(ctx.tooltip)}}"
                class="security-{{ctx.levelName}} {{ ctx.level.style ? 'bg-' + ctx.level.style : ''}}"
                style="{{ctx.level.color ? 'background-color: ' + ctx.level.color + ';' : ''}}"
              ></div>
            {% } %}
          </div>
        `,
                location: {
                    insert: 'after',
                    selector: '[ref="element"]'
                }
            }
        };
    }
    get defaultSettings() {
        return PasswordStrengthAddon.info.defaultSettings;
    }
    get rules() {
        return {
            length: {
                check: (value, options) => {
                    const minLength = options.minLength || this.component.component.validate.minLength || 6;
                    if (value.length < minLength) {
                        return `Value must be longer than ${minLength} characters`;
                    }
                    return true;
                }
            },
            upperCase: {
                check: (value) => {
                    if (/[A-Z]/g.test(value)) {
                        return true;
                    }
                    return 'Value must contain uppercased alphabetical characters';
                },
                increaseCharactersPoolSize: 26
            },
            numeric: {
                check: (value) => {
                    if (/[0-9]/g.test(value)) {
                        return true;
                    }
                    return 'Value must contain numeric characters';
                },
                increaseCharactersPoolSize: 10,
            },
            lowerCase: {
                check: (value) => {
                    if (/[a-z]/g.test(value)) {
                        return true;
                    }
                    return 'Value must contain lowercased alphabetical characters';
                },
                increaseCharactersPoolSize: 26,
            },
            symbols: {
                check: (value) => {
                    if (/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(value)) {
                        return true;
                    }
                    return 'Value must contain symbols';
                },
                increaseCharactersPoolSize: 32,
            },
        };
    }
    get charactersPoolLength() {
        return this._charactersPoolLength;
    }
    set charactersPoolLength(value) {
        this._charactersPoolLength = value;
    }
    get level() {
        return this._level || this.getLevel();
    }
    set level(level) {
        this._level = level;
    }
    get entropy() {
        return this._entropy;
    }
    get dictionarySize() {
        return this.settings.dictionarySize || 171476;
    }
    set entropy(value) {
        const oldLevel = this.getLevel();
        const updateOnEntropyChange = this.settings.updateOn === 'entropyChange' && this._entropy !== value;
        this._entropy = value;
        this.level = this.getLevel();
        const updateOnLevelChange = this.settings.updateOn === 'levelChange' && oldLevel.name !== this.level.name;
        if (updateOnLevelChange || updateOnEntropyChange) {
            this.updateView();
        }
    }
    get template() {
        return this.settings.template;
    }
    get tooltip() {
        var _a, _b;
        return ((_a = this.level) === null || _a === void 0 ? void 0 : _a.tooltip) || `${(_b = this.level) === null || _b === void 0 ? void 0 : _b.name} strongness`;
    }
    get rulesSettings() {
        return this.settings.rulesSettings || [];
    }
    get customRules() {
        return this.settings.customRules || [];
    }
    log2(value) {
        if (typeof Math.log2 === 'function') {
            return Math.log2(value);
        }
        return Math.log(value) * Math.LOG2E;
    }
    calculatePasswordEntropy(passwordLength, charactersPoolSize) {
        return !passwordLength || !charactersPoolSize ? 0 : this.log2(Math.pow(charactersPoolSize, passwordLength));
    }
    calculatePasswordEntropyWords(wordsCount) {
        return !this.dictionarySize ? 0 : this.log2(this.dictionarySize) * wordsCount;
    }
    render() {
        const view = this.component.interpolate(this.template, {
            entropy: this.entropy,
            maxEntropy: this.maxEntropy,
            level: this.level,
            levelName: this.level.name.replace(' ', '-').toLowerCase(),
            levels: this.levels,
            readOnly: this.component.options.readOnly,
            pristine: this.component.pristine,
            t: this.t.bind(this),
            tooltip: this.tooltip,
        });
        return this.component.sanitize(view);
    }
    checkBlackList(value) {
        const blackList = [...this.settings.blackList];
        let customBlacklistedWords = this.settings.customBlacklistedWords;
        if (customBlacklistedWords && typeof customBlacklistedWords === 'string') {
            customBlacklistedWords = this.evaluate(customBlacklistedWords, this.component.evalContext({ value }), 'values');
            if (customBlacklistedWords && customBlacklistedWords.length) {
                blackList.push(...customBlacklistedWords);
            }
        }
        let restValue = value;
        const blacklistedWords = [];
        for (let i = 0; i < blackList.length; i++) {
            const word = blackList[i];
            const regExp = new RegExp(`${word}`, 'gi');
            if (regExp.test(value)) {
                blacklistedWords.push(word);
                restValue = restValue.replace(regExp, '');
            }
            // If less the 3 symboles left, just stop iterating
            if (restValue.length < 3) {
                break;
            }
        }
        if (blacklistedWords.length) {
            // If there are some random characters except of blacklisted words in the password,
            // calculate the entropy for them
            const { charactersPoolSize } = restValue.length ? this.performChecks(restValue) : 0;
            const entropyOfNonblacklistedValue = this.calculatePasswordEntropy(restValue.length, charactersPoolSize);
            // Calculate the entropy if the biggest part of the password could be picked up from dictionary words
            const dictionaryCheckEntropy = this.calculatePasswordEntropyWords(blacklistedWords.length);
            const entropy = dictionaryCheckEntropy + entropyOfNonblacklistedValue;
            return { entropy, blacklistedWords };
        }
        return true;
    }
    /**
     * Determines is a password is secure enough to submit
     * @returns {boolean} - returns TRUE if password is valid, FALSE if it is not.
     */
    isValid() {
        const isValidCheck = this.settings.isValid;
        if (isValidCheck && typeof isValidCheck === 'string') {
            const valid = this.evaluate(isValidCheck, this.component.evalContext({
                entropy: this.entropy,
                level: this.level
            }), 'valid');
            return valid;
        }
        return this.entropy >= Math.round(this.maxEntropy / 2);
    }
    /**
     * Handles the result of check and constructs a new error object or returns an amount of points to add to the current entropy
     * @param {boolean|number} valid - Determines if the validation was failed or an amount of points if it was passed
     * @param {*} validation - Validation configuration
     * @param {string} message - Message which should be shown if validation was not passed
     * @param {any[]} errors - The errors array (will be mutated)
     * @returns {number} - Returns an amount of points to add to the current entropy
     */
    handleRuleCheckResult(valid, validation, message, errors) {
        if (valid !== true) {
            errors.push({
                validation: validation.name,
                message,
                level: validation.required ? 'error' : 'warning'
            });
        }
        else if (validation.increaseCharactersPoolSize) {
            return validation.increaseCharactersPoolSize;
        }
        return 0;
    }
    performChecks(value) {
        const errors = [];
        let charactersPoolSize = 0;
        this.rulesSettings.forEach((settings) => {
            if (this.rules[settings.name]) {
                const rule = lodash_1.default.merge({}, this.rules[settings.name], settings);
                const valid = rule.check(value, settings.options || {});
                const message = settings.message || valid;
                charactersPoolSize += this.handleRuleCheckResult(valid, rule, message, errors);
            }
        });
        this.customRules.forEach((rule) => {
            if (rule.check && typeof rule.check === 'string') {
                const valid = this.evaluate(rule.check, this.component.evalContext({ value }), 'valid');
                const message = typeof valid === 'string' ? valid : `Password does not meet ${rule.name} validation`;
                charactersPoolSize += this.handleRuleCheckResult(valid, rule, message, errors);
            }
        });
        return {
            charactersPoolSize,
            errors
        };
    }
    /**
     * Performs checks to validate password security
     * @param {string} value - The password value to be checked.
     * @returns {boolean} - Returns TRUE if password is strong enough, FALSE if it is not.
     */
    checkValidity(value) {
        var _a;
        const passwordLength = value.length;
        const { charactersPoolSize, errors } = this.performChecks(value);
        const entropy = this.calculatePasswordEntropy(passwordLength, charactersPoolSize);
        const blackListCheck = ((_a = this.settings.blackList) === null || _a === void 0 ? void 0 : _a.length) || this.settings.customBlacklistedWords ?
            this.checkBlackList(value)
            : null;
        const isValid = this.isValid();
        if (!isValid) {
            errors.push({
                message: 'Password is not strong enough',
                level: this.settings.required ? 'error' : 'warning'
            });
        }
        // If there were found some words from the black list
        if (blackListCheck && blackListCheck !== true) {
            this.handleBlackListCheckResult(blackListCheck, errors);
            // Select the mininal entropy based on the dictionary check or symbolic check
            this.entropy = Math.min(entropy, blackListCheck.entropy);
        }
        else {
            this.entropy = entropy;
        }
        return !errors.length;
    }
    handleBlackListCheckResult(result, errors) {
        const blacklistedWords = result.blacklistedWords;
        const isRequired = this.settings.disableBlacklistedWords;
        const message = `Password ${isRequired ? 'must' : 'should'} not include common words: ${blacklistedWords.join(', ')}`;
        const validation = {
            name: 'blacklist',
            required: isRequired,
        };
        this.handleRuleCheckResult(false, validation, message, errors);
    }
    constructor(settings, componentInstance) {
        super(settings, componentInstance);
        this._entropy = 0; // Set initial value of entropy
        this.levels = [...(this.settings.levels || this.defaultSettings.levels)];
        this.levels.sort((a, b) => a.maxEntropy - b.maxEntropy); // Sort levels from the lowest one to the highest
        this.level = this.levels[0]; // Set currnt level to the lowest one
        this.maxEntropy = this.levels[this.levels.length - 1].maxEntropy; // Set maximal amount of security points based on the highest level
    }
    attach(element) {
        super.attach(element);
        const container = this.component.ce('div', { ref: 'passwordStrengthIndicator' });
        const inserted = this.insertContainer(element, container);
        if (!inserted) {
            this.component.append(container);
        }
        this._element = container;
        this.component.on('redraw', () => this.updateView());
        this.component.on('componentError', () => this.updateView());
        this.updateView();
    }
    insertContainer(element, container) {
        var _a, _b;
        if (!element || !container) {
            return false;
        }
        const insert = (_a = this.settings.location) === null || _a === void 0 ? void 0 : _a.insert;
        const selector = (_b = this.settings.location) === null || _b === void 0 ? void 0 : _b.selector;
        let reference;
        if (selector) {
            reference = element.querySelector(selector);
        }
        if (reference) {
            const parent = reference.parentNode;
            switch (insert) {
                case 'after':
                    if (parent) {
                        parent.insertBefore(container, reference.nextSibling || null);
                        return true;
                    }
                    return false;
                case 'before':
                    if (parent) {
                        parent.insertBefore(container, reference);
                        return true;
                    }
                    return false;
                default:
                    console.warn(`Unknown insert option: ${insert}`);
                    return false;
            }
        }
        else {
            console.warn(`No elements found using selector: ${selector}`);
            return false;
        }
    }
    destroy() {
        super.destroy();
    }
    /**
     * Finds the level which one the passed entropy suits
     * @param {number} entropy - Points of password's security
     * @returns {object} - Returns the level object
     */
    getLevel(entropy = this.entropy) {
        const lowestLevel = this.levels[0];
        let prevMaxEntropy = lowestLevel.maxEntropy;
        if (entropy <= lowestLevel.maxEntropy) {
            return lowestLevel;
        }
        if (entropy >= this.maxEntropy) {
            return this.levels[this.levels.length - 1];
        }
        // Iterate through levels and find the one which the passed entropy belongs to
        for (let i = 1; i < this.levels.length; i++) {
            const level = this.levels[i];
            if (entropy > prevMaxEntropy && entropy <= level.maxEntropy) {
                return level;
            }
            prevMaxEntropy = level.maxEntropy;
        }
        return lowestLevel;
    }
    /**
     * Update the current view of the password's security indicator
     */
    updateView() {
        if (!this.element) {
            return;
        }
        const view = this.render();
        this.element.innerHTML = view;
    }
}
exports.default = PasswordStrengthAddon;
