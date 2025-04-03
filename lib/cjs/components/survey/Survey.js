"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const Field_1 = __importDefault(require("../_classes/field/Field"));
const utils_1 = require("../../utils/utils");
class SurveyComponent extends Field_1.default {
    static schema(...extend) {
        return Field_1.default.schema({
            type: 'survey',
            label: 'Survey',
            key: 'survey',
            questions: [],
            values: []
        }, ...extend);
    }
    static get builderInfo() {
        return {
            title: 'Survey',
            group: 'advanced',
            icon: 'list',
            weight: 110,
            documentation: '/userguide/form-building/advanced-components#survey',
            schema: SurveyComponent.schema()
        };
    }
    static get serverConditionSettings() {
        return SurveyComponent.conditionOperatorsSettings;
    }
    static get conditionOperatorsSettings() {
        return Object.assign(Object.assign({}, super.conditionOperatorsSettings), { operators: ['isEmpty', 'isNotEmpty'] });
    }
    static savedValueTypes(schema) {
        return (0, utils_1.getComponentSavedTypes)(schema) || [utils_1.componentValueTypes.object];
    }
    get defaultSchema() {
        return SurveyComponent.schema();
    }
    render() {
        return super.render(this.renderTemplate('survey'));
    }
    attach(element) {
        this.loadRefs(element, { input: 'multiple' });
        const superAttach = super.attach(element);
        this.refs.input.forEach((input) => {
            if (this.disabled) {
                input.setAttribute('disabled', 'disabled');
            }
            else {
                this.addEventListener(input, 'change', () => this.updateValue(null, {
                    modified: true
                }));
            }
        });
        this.setValue(this.dataValue);
        return superAttach;
    }
    setValue(value, flags = {}) {
        if (!value) {
            return false;
        }
        lodash_1.default.each(this.component.questions, (question) => {
            lodash_1.default.each(this.refs.input, (input) => {
                if (input.name === this.getInputName(question)) {
                    input.checked = (input.value === value[question.value]);
                }
            });
        });
        const changed = this.updateValue(value, flags);
        if (changed && this.isHtmlRenderMode()) {
            this.redraw();
        }
        return changed;
    }
    get emptyValue() {
        return {};
    }
    get defaultValue() {
        const defaultValue = super.defaultValue;
        //support for default values created in old formio.js versions
        if (defaultValue && !lodash_1.default.isObject(defaultValue) && this.component.values.some(value => value.value === defaultValue)) {
            const adoptedDefaultValue = {};
            this.component.questions.forEach(question => {
                adoptedDefaultValue[question.value] = defaultValue;
            });
            return adoptedDefaultValue;
        }
        return defaultValue;
    }
    getValue() {
        if (this.viewOnly || !this.refs.input || !this.refs.input.length) {
            return this.dataValue;
        }
        const value = {};
        lodash_1.default.each(this.component.questions, (question) => {
            lodash_1.default.each(this.refs.input, (input) => {
                if (input.checked && (input.name === this.getInputName(question))) {
                    value[question.value] = input.value;
                    return false;
                }
            });
        });
        return value;
    }
    set disabled(disabled) {
        super.disabled = disabled;
        lodash_1.default.each(this.refs.input, (input) => {
            input.disabled = true;
        });
    }
    get disabled() {
        return super.disabled;
    }
    validateRequired(setting, value) {
        if (!(0, utils_1.boolValue)(setting)) {
            return true;
        }
        return this.component.questions.reduce((result, question) => result && Boolean(value[question.value]), true);
    }
    getInputName(question) {
        return `${this.options.name}[${question.value}][${this.id}]`;
    }
    getValueAsString(value, options) {
        if (options === null || options === void 0 ? void 0 : options.email) {
            let result = (`
        <table border="1" style="width:100%">
          <thead>
            <tr>
              <th>${this.t('surveyQuestion')}</th>
              <th>${this.t('surveyQuestionValue')}</th>
            </tr>
          </thead>
          <tbody>
      `);
            lodash_1.default.forIn(value, (value, key) => {
                const question = lodash_1.default.find(this.component.questions, ['value', key]);
                const answer = lodash_1.default.find(this.component.values, ['value', value]);
                if (!question || !answer) {
                    return;
                }
                result += (`
            <tr>
              <td style="text-align:center;padding: 5px 10px;">${question.label}</td>
              <td style="text-align:center;padding: 5px 10px;">${answer.label}</td>
            </tr>
          `);
            });
            result += '</tbody></table>';
            return result;
        }
        if (lodash_1.default.isPlainObject(value)) {
            const { values = [], questions = [] } = this.component;
            return lodash_1.default.isEmpty(value)
                ? ''
                : lodash_1.default.map(value, (v, q) => {
                    const valueLabel = lodash_1.default.get(lodash_1.default.find(values, val => lodash_1.default.isEqual(val.value, v)), 'label', v);
                    const questionLabel = lodash_1.default.get(lodash_1.default.find(questions, quest => lodash_1.default.isEqual(quest.value, q)), 'label', q);
                    return `${questionLabel}: ${valueLabel}`;
                }).join('; ');
        }
        return super.getValueAsString(value, options);
    }
}
exports.default = SurveyComponent;
