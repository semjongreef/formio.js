"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Evaluator = void 0;
const lodash_1 = __importDefault(require("lodash"));
const string_hash_1 = __importDefault(require("string-hash"));
const utils_1 = require("@formio/core/utils");
class Evaluator extends utils_1.JSONLogicEvaluator {
    static template(template, hash) {
        hash = hash || (0, string_hash_1.default)(template);
        if (Evaluator.cache[hash]) {
            return Evaluator.cache[hash];
        }
        try {
            // Ensure we handle copied templates from the ejs files.
            template = template.replace(/ctx\./g, '');
            return (Evaluator.cache[hash] = lodash_1.default.template(template, Evaluator.templateSettings));
        }
        catch (err) {
            console.warn('Error while processing template', err, template);
        }
    }
    static interpolate(rawTemplate, data, _options) {
        // Ensure reverse compatability.
        const options = lodash_1.default.isObject(_options) ? _options : { noeval: _options };
        if (typeof rawTemplate === 'function') {
            try {
                return rawTemplate(data);
            }
            catch (err) {
                console.warn('Error interpolating template', err, data);
                return err.message;
            }
        }
        rawTemplate = String(rawTemplate);
        let template;
        if (Evaluator.noeval || options.noeval) {
            return utils_1.JSONLogicEvaluator.interpolateString(rawTemplate, data, _options);
        }
        else {
            template = Evaluator.template(rawTemplate);
        }
        if (typeof template === 'function') {
            try {
                return template(data);
            }
            catch (err) {
                console.warn('Error interpolating template', err, rawTemplate, data);
                return err.message;
            }
        }
        return template;
    }
}
exports.Evaluator = Evaluator;
Evaluator.cache = {};
Evaluator.protectedEval = false;
Evaluator.noeval = false;
