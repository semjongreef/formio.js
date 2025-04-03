"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Element_1 = __importDefault(require("./Element"));
const Formio_1 = require("./Formio");
const displays_1 = __importDefault(require("./displays"));
const templates_1 = __importDefault(require("./templates"));
const FormioUtils = __importStar(require("./utils/utils"));
class Form extends Element_1.default {
    constructor(elementOrForm, formOrOptions, options = {}) {
        let element, form, formOptions;
        if (elementOrForm instanceof HTMLElement) {
            element = elementOrForm;
            form = formOrOptions;
            formOptions = options;
        }
        else {
            element = null;
            form = elementOrForm;
            formOptions = formOrOptions || {};
        }
        if (Formio_1.Formio.options && Formio_1.Formio.options.form) {
            formOptions = Object.assign(formOptions, Formio_1.Formio.options.form);
        }
        super(formOptions);
        if (this.options.useSessionToken) {
            Formio_1.Formio.useSessionToken(this.options);
        }
        this.ready = new Promise((resolve, reject) => {
            this.readyResolve = resolve;
            this.readyReject = reject;
        });
        this.instance = null;
        if (element) {
            if (this.element) {
                delete this.element.component;
            }
            this.element = element;
        }
        else {
            this.element = null;
        }
        this.options = formOptions;
        this.options.events = this.events;
        if (form) {
            this.setForm(form)
                .then(() => this.readyResolve(this.instance))
                .catch(this.readyReject);
        }
        this.display = '';
    }
    createElement(tag, attrs, children) {
        const element = document.createElement(tag);
        for (const attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                element.setAttribute(attr, attrs[attr]);
            }
        }
        (children || []).forEach(child => {
            element.appendChild(this.createElement(child.tag, child.attrs, child.children));
        });
        return element;
    }
    set loading(load) {
        if (!this.element || this.options.noLoader) {
            return;
        }
        if (load) {
            if (this.loader) {
                return;
            }
            this.loader = this.createElement('div', {
                'class': 'formio-loader'
            }, [{
                    tag: 'div',
                    attrs: {
                        class: 'loader-wrapper'
                    },
                    children: [{
                            tag: 'div',
                            attrs: {
                                class: 'loader text-center'
                            }
                        }]
                }]);
            this.element.appendChild(this.loader);
        }
        else if (this.loader) {
            if (this.element.contains(this.loader)) {
                this.element.removeChild(this.loader);
            }
            this.loader = null;
        }
    }
    /**
     * Create a new form instance provided the display of the form.
     * @param {string} display - The display of the form, either "wizard", "form", or "pdf"
     * @returns {Webform|Wizard|PDF} - The new form instance for the display.
     */
    create(display) {
        if (this.options && (this.options.flatten || this.options.renderMode === 'flat')) {
            display = 'form';
        }
        this.display = display;
        if (displays_1.default.displays[display]) {
            return new displays_1.default.displays[display](this.element, this.options);
        }
        else {
            // eslint-disable-next-line new-cap
            return new displays_1.default.displays['webform'](this.element, this.options);
        }
    }
    /**
     * Sets the form. Either as JSON or a URL to a form JSON schema.
     * @param {string|object} formParam - Either the form JSON or the URL of the form json.
     * @returns {void}
     */
    set form(formParam) {
        this.setForm(formParam);
    }
    errorForm(err) {
        return {
            components: [
                {
                    'label': 'HTML',
                    'tag': 'div',
                    'className': 'error error-message alert alert-danger ui red message',
                    'attrs': [
                        {
                            'attr': 'role',
                            'value': 'alert'
                        }
                    ],
                    'key': 'errorMessage',
                    'type': 'htmlelement',
                    'input': false,
                    'content': typeof err === 'string' ? err : err.message,
                }
            ]
        };
    }
    /**
     * Check Subdirectories path and provide correct options
     * @param {string} url - The the URL of the form json.
     * @param {import('@formio/core').Form} form - The form json.
     * @returns {object} The initial options with base and project.
     */
    getFormInitOptions(url, form) {
        const options = {};
        const index = url.indexOf(form === null || form === void 0 ? void 0 : form.path);
        // form url doesn't include form path
        if (index === -1) {
            return options;
        }
        const projectUrl = url.substring(0, index - 1);
        const urlParts = Formio_1.Formio.getUrlParts(projectUrl);
        // project url doesn't include subdirectories path
        if (!urlParts || urlParts.filter(part => !!part).length < 4) {
            return options;
        }
        const baseUrl = `${urlParts[1]}${urlParts[2]}`;
        // Skip if baseUrl has already been set
        if (baseUrl !== Formio_1.Formio.baseUrl) {
            return {
                base: baseUrl,
                project: projectUrl,
            };
        }
        return {};
    }
    /**
     * Sets the form to the JSON schema of a form.
     * @param {import('@formio/core').Form | string} formParam - The form JSON to set this form to.
     * @returns {Promise<Webform|Wizard|PDF>} - The webform instance that was created.
     */
    setForm(formParam) {
        let result;
        formParam = formParam || this.form;
        if (typeof formParam === 'string') {
            const formio = new Formio_1.Formio(formParam);
            let error;
            this.loading = true;
            result = this.getSubmission(formio, this.options)
                .catch((err) => {
                error = err;
            })
                .then((submission) => {
                return formio.loadForm()
                    // If the form returned an error, show it instead of the form.
                    .catch(err => {
                    error = err;
                })
                    .then((form) => {
                    // If the submission returned an error, show it instead of the form.
                    if (error) {
                        form = this.errorForm(error);
                    }
                    this.loading = false;
                    this.instance = this.instance || this.create(form.display);
                    // If we're in builder mode, instance.setUrl is not a function, so just manually set the URL.
                    if (this.instance.setUrl) {
                        const options = this.getFormInitOptions(formParam, form);
                        this.instance.setUrl(formParam, options);
                    }
                    else {
                        this.instance.url = formParam;
                    }
                    this.instance.nosubmit = false;
                    this._form = this.instance.form = form;
                    if (submission) {
                        this.instance.submission = submission;
                    }
                    if (error) {
                        throw error;
                    }
                    return this.instance;
                });
            });
        }
        else {
            this.instance = this.instance || this.create(formParam.display);
            this._form = this.instance.form = formParam;
            result = this.instance.ready;
        }
        // A redraw has occurred so save off the new element in case of a setDisplay causing a rebuild.
        return result.then(() => {
            if (this.element) {
                delete this.element.component;
            }
            this.element = this.instance.element;
            return this.instance;
        });
    }
    getSubmission(formio, opts) {
        if (formio.submissionId) {
            return formio.loadSubmission(null, opts);
        }
        return Promise.resolve();
    }
    /**
     * Returns the loaded forms JSON.
     * @returns {object} - The loaded form's JSON
     */
    get form() {
        return this._form;
    }
    /**
     * Changes the display of the form.
     * @param {string} display - The display to set this form. Either "wizard", "form", or "pdf"
     * @returns {Promise<Webform|Wizard|PDF>} - The form instance that was created after changing the display.
     */
    setDisplay(display) {
        if ((this.display === display) && this.instance) {
            return Promise.resolve(this.instance);
        }
        this.form.display = display;
        this.instance.destroy();
        this.instance = this.create(display);
        return this.setForm(this.form).then(() => {
            this.instance.emit('setDisplay', this.form.display);
        });
    }
    empty() {
        if (this.element) {
            while (this.element.firstChild) {
                this.element.removeChild(this.element.firstChild);
            }
        }
    }
    static embed(embed) {
        return new Promise((resolve) => {
            if (!embed || !embed.src) {
                resolve();
            }
            const id = this.id || `formio-${Math.random().toString(36).substring(7)}`;
            const className = embed.class || 'formio-form-wrapper';
            let code = embed.styles ? `<link rel="stylesheet" href="${embed.styles}">` : '';
            code += `<div id="${id}" class="${className}"></div>`;
            document.write(code);
            let attempts = 0;
            const wait = setInterval(() => {
                attempts++;
                const formElement = document.getElementById(id);
                if (formElement || attempts > 10) {
                    resolve(new Form(formElement, embed.src).ready);
                    clearInterval(wait);
                }
            }, 10);
        });
    }
    /**
     * Sanitize an html string.
     * @param {string} dirty - The dirty html string to sanitize.
     * @param {boolean} forceSanitize - If the string should be force sanitized.
     * @returns {string} - The sanitized html string.
     */
    sanitize(dirty, forceSanitize) {
        // If Sanitize is turned off
        if (this.options.sanitize === false && !forceSanitize) {
            return dirty;
        }
        return FormioUtils.sanitize(dirty, this.options);
    }
    setContent(element, content, forceSanitize) {
        if (element instanceof HTMLElement) {
            element.innerHTML = this.sanitize(content, forceSanitize);
            return true;
        }
        return false;
    }
    /**
     * Build a new form.
     * @returns {Promise<Webform|Wizard|PDF>} - The form instance that was created.
     */
    build() {
        if (!this.instance) {
            return Promise.reject(this.t('formNotReady'));
        }
        if (!this.element) {
            return Promise.reject(this.t('noFormElement'));
        }
        // Add temporary loader.
        const template = (this.options && this.options.template) ? this.options.template : 'bootstrap';
        const loader = templates_1.default[template].loader || templates_1.default.bootstrap.loader;
        this.setContent(this.element, loader.form);
        return this.render().then(html => {
            this.setContent(this.element, html);
            return this.attach(this.element).then(() => this.instance);
        })
            .then((param) => {
            this.emit('build', param);
            return param;
        });
    }
    render() {
        if (!this.instance) {
            return Promise.reject(this.t('formNotReady'));
        }
        return Promise.resolve(this.instance.render())
            .then((param) => {
            this.emit('render', param);
            return param;
        });
    }
    attach(element) {
        if (!this.instance) {
            return Promise.reject(this.t('formNotReady'));
        }
        if (this.element) {
            delete this.element.component;
        }
        this.element = element;
        return this.instance.attach(this.element)
            .then((param) => {
            this.emit('attach', param);
            return param;
        });
    }
    teardown() {
        super.teardown();
        delete this.instance;
        delete this.ready;
    }
}
exports.default = Form;
// Allow simple embedding.
Formio_1.Formio.embedForm = (embed) => Form.embed(embed);
/**
 * Creates an easy to use interface for embedding webforms, pdfs, and wizards into your application.
 * @param {object} elementOrForm - The DOM element you wish to render this form within, or the form definition.
 * @param {object | string | FormOptions} formOrOptions - A Form JSON schema, the URL of a hosted form, or the form options.
 * @param {FormOptions} [options] - The options to create a new form instance.
 * @returns {Promise<Webform|Wizard|PDF>} - The form instance that was created.
 * @example
 * import { Formio } from '@formio/js';
 * Formio.createForm(document.getElementById('formio'), 'https://examples.form.io/example');
 */
Formio_1.Formio.createForm = (elementOrForm, formOrOptions, options) => {
    return (new Form(elementOrForm, formOrOptions, options)).ready;
};
Formio_1.Formio.Form = Form;
