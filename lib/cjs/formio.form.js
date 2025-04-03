"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Webform = exports.EventEmitter = exports.Licenses = exports.Formio = exports.Form = exports.Utils = exports.Templates = exports.Widgets = exports.Providers = exports.Displays = exports.Components = exports.FormioCore = exports.useModule = exports.registerModule = void 0;
const lodash_1 = __importDefault(require("lodash"));
const Formio_1 = require("./Formio");
Object.defineProperty(exports, "Formio", { enumerable: true, get: function () { return Formio_1.Formio; } });
const components_1 = __importDefault(require("./components"));
const Components_1 = __importDefault(require("./components/Components"));
exports.Components = Components_1.default;
const Displays_1 = __importDefault(require("./displays/Displays"));
exports.Displays = Displays_1.default;
const Templates_1 = __importDefault(require("./templates/Templates"));
exports.Templates = Templates_1.default;
const providers_1 = __importDefault(require("./providers"));
exports.Providers = providers_1.default;
const widgets_1 = __importDefault(require("./widgets"));
exports.Widgets = widgets_1.default;
const Form_1 = __importDefault(require("./Form"));
exports.Form = Form_1.default;
const utils_1 = __importDefault(require("./utils"));
exports.Utils = utils_1.default;
const Evaluator_1 = require("./utils/Evaluator");
const licenses_1 = __importDefault(require("./licenses"));
exports.Licenses = licenses_1.default;
const EventEmitter_1 = __importDefault(require("./EventEmitter"));
exports.EventEmitter = EventEmitter_1.default;
const Webform_1 = __importDefault(require("./Webform"));
exports.Webform = Webform_1.default;
const i18n_1 = require("./utils/i18n");
Formio_1.Formio.loadModules = (path = `${Formio_1.Formio.getApiUrl()}/externalModules.js`, name = 'externalModules') => {
    Formio_1.Formio.requireLibrary(name, name, path, true)
        .then((modules) => {
        Formio_1.Formio.use(modules);
    });
};
// This is needed to maintain correct imports using the "dist" file.
Formio_1.Formio.isRenderer = true;
Formio_1.Formio.Components = Components_1.default;
Formio_1.Formio.Templates = Templates_1.default;
Formio_1.Formio.Utils = utils_1.default;
Formio_1.Formio.Form = Form_1.default;
Formio_1.Formio.Displays = Displays_1.default;
Formio_1.Formio.Providers = providers_1.default;
Formio_1.Formio.Widgets = widgets_1.default;
Formio_1.Formio.Evaluator = Evaluator_1.Evaluator;
Formio_1.Formio.AllComponents = components_1.default;
Formio_1.Formio.Licenses = licenses_1.default;
// This is strange, but is needed for "premium" components to import correctly.
Formio_1.Formio.Formio = Formio_1.Formio;
Formio_1.Formio.Components.setComponents(components_1.default);
/**
 * Register a module
 * @param {any} mod - The module object to register. This can also be a function which accepts Formio as an argument.
 * @param {Function|null} [defaultFn] - The default function to call if the module does not have a known key.
 * @param {any} options - Options for the module.
 * @returns {void}
 */
function registerModule(mod, defaultFn = null, options = {}) {
    if (typeof mod === 'function') {
        return registerModule(mod(Formio_1.Formio), defaultFn, options);
    }
    if (typeof mod !== 'object') {
        return;
    }
    for (const key of Object.keys(mod)) {
        const current = mod.framework || Formio_1.Formio.Templates.framework || 'bootstrap';
        switch (key) {
            case 'options':
                Formio_1.Formio.options = lodash_1.default.merge(Formio_1.Formio.options, mod.options);
                break;
            case 'templates':
                for (const framework of Object.keys(mod.templates)) {
                    Formio_1.Formio.Templates.extendTemplate(framework, mod.templates[framework]);
                    Formio_1.Formio.Templates.defaultTemplates = lodash_1.default.defaults(mod.templates[framework], Formio_1.Formio.Templates.defaultTemplates);
                }
                if (mod.templates[current]) {
                    Formio_1.Formio.Templates.current = mod.templates[current];
                }
                break;
            case 'components':
                Formio_1.Formio.Components.setComponents(mod.components);
                break;
            case 'framework':
                Formio_1.Formio.Templates.framework = mod.framework;
                break;
            case 'fetch':
                for (const name of Object.keys(mod.fetch)) {
                    Formio_1.Formio.registerPlugin(mod.fetch[name], name);
                }
                break;
            case 'providers':
                for (const type of Object.keys(mod.providers)) {
                    Formio_1.Formio.Providers.addProviders(type, mod.providers[type]);
                }
                break;
            case 'displays':
                Formio_1.Formio.Displays.addDisplays(mod.displays);
                break;
            case 'evaluator':
                Formio_1.Formio.Evaluator.registerEvaluator(mod.evaluator);
                break;
            case 'translations':
                i18n_1.I18n.setDefaultTranslations(mod.translations);
                break;
            case 'library':
                options.license
                    ? Formio_1.Formio.Licenses.addLicense(mod.library, options.license)
                    : Formio_1.Formio.Licenses.removeLicense(mod.library);
                break;
            default:
                if (defaultFn) {
                    if (!defaultFn(key, mod)) {
                        console.warn('Unknown module option', key);
                    }
                    break;
                }
                console.log('Unknown module option', key);
        }
    }
}
exports.registerModule = registerModule;
/**
 * @param {Function|null} defaultFn - The default function to call if the module does not have a known key.
 * @returns {void}
 */
function useModule(defaultFn = null) {
    return (plugins, options = {}) => {
        plugins = lodash_1.default.isArray(plugins) ? plugins : [plugins];
        plugins.forEach((plugin) => {
            if (Array.isArray(plugin)) {
                plugin.forEach(p => registerModule(p, defaultFn, options));
            }
            else {
                registerModule(plugin, defaultFn, options);
            }
        });
    };
}
exports.useModule = useModule;
/**
 * Allows passing in plugins as an array of plugins or a single plugin.
 *
 * Formio.plugins(plugin1, options);
 * Formio.plugins([plugin1, plugin2, etc], options);
 */
Formio_1.Formio.use = useModule();
var Formio_2 = require("./Formio");
Object.defineProperty(exports, "FormioCore", { enumerable: true, get: function () { return Formio_2.Formio; } });
