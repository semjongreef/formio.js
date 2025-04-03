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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormBuilder = exports.Form = exports.Formio = void 0;
const CDN_js_1 = __importDefault(require("./CDN.js"));
class Formio {
    static setLicense(license, norecurse = false) {
        _a.license = license;
        if (!norecurse && _a.FormioClass) {
            _a.FormioClass.setLicense(license);
        }
    }
    static setBaseUrl(url, norecurse = false) {
        _a.baseUrl = url;
        if (!norecurse && _a.FormioClass) {
            _a.FormioClass.setBaseUrl(url);
        }
    }
    static setApiUrl(url, norecurse = false) {
        _a.baseUrl = url;
        if (!norecurse && _a.FormioClass) {
            _a.FormioClass.setApiUrl(url);
        }
    }
    static setProjectUrl(url, norecurse = false) {
        _a.projectUrl = url;
        if (!norecurse && _a.FormioClass) {
            _a.FormioClass.setProjectUrl(url);
        }
    }
    static setAppUrl(url, norecurse = false) {
        _a.projectUrl = url;
        if (!norecurse && _a.FormioClass) {
            _a.FormioClass.setAppUrl(url);
        }
    }
    static setPathType(type, norecurse = false) {
        _a.pathType = type;
        if (!norecurse && _a.FormioClass) {
            _a.FormioClass.setPathType(type);
        }
    }
    static debug(...args) {
        if (_a.config.debug) {
            console.log(...args);
        }
    }
    static clearCache() {
        if (_a.FormioClass) {
            _a.FormioClass.clearCache();
        }
    }
    static global(prop, flag = '') {
        const globalValue = window[prop];
        if (flag && globalValue && !globalValue[flag]) {
            return null;
        }
        _a.debug(`Getting global ${prop}`, globalValue);
        return globalValue;
    }
    static use(module) {
        if (_a.FormioClass && _a.FormioClass.isRenderer) {
            _a.FormioClass.use(module);
        }
        else {
            _a.modules.push(module);
        }
    }
    static createElement(type, attrs, children) {
        const element = document.createElement(type);
        if (!attrs) {
            return element;
        }
        Object.keys(attrs).forEach(key => {
            element.setAttribute(key, attrs[key]);
        });
        (children || []).forEach(child => {
            element.appendChild(_a.createElement(child.tag, child.attrs, child.children));
        });
        return element;
    }
    static addScript(wrapper, src, name, flag = '') {
        return __awaiter(this, void 0, void 0, function* () {
            if (!src) {
                return Promise.resolve();
            }
            if (typeof src !== 'string' && src.length) {
                return Promise.all(src.map(ref => _a.addScript(wrapper, ref)));
            }
            if (name && _a.global(name, flag)) {
                _a.debug(`${name} already loaded.`);
                return Promise.resolve(_a.global(name));
            }
            _a.debug('Adding Script', src);
            try {
                wrapper.appendChild(_a.createElement('script', {
                    src
                }));
            }
            catch (err) {
                _a.debug(err);
                return Promise.resolve();
            }
            if (!name) {
                return Promise.resolve();
            }
            return new Promise((resolve) => {
                _a.debug(`Waiting to load ${name}`);
                const wait = setInterval(() => {
                    if (_a.global(name, flag)) {
                        clearInterval(wait);
                        _a.debug(`${name} loaded.`);
                        resolve(_a.global(name));
                    }
                }, 100);
            });
        });
    }
    static addStyles(wrapper, href) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!href) {
                return;
            }
            if (typeof href !== 'string' && href.length) {
                href.forEach(ref => _a.addStyles(wrapper, ref));
                return;
            }
            _a.debug('Adding Styles', href);
            wrapper.appendChild(_a.createElement('link', {
                rel: 'stylesheet',
                href
            }));
        });
    }
    static submitDone(instance, submission) {
        return __awaiter(this, void 0, void 0, function* () {
            _a.debug('Submision Complete', submission);
            if (_a.config.submitDone) {
                _a.config.submitDone(submission, instance);
            }
            const successMessage = (_a.config.success || '').toString();
            if (successMessage && successMessage.toLowerCase() !== 'false' && instance.element) {
                instance.element.innerHTML = `<div class="alert-success" role="alert">${successMessage}</div>`;
            }
            let returnUrl = _a.config.redirect;
            // Allow form based configuration for return url.
            if (!returnUrl &&
                (instance._form &&
                    instance._form.settings &&
                    (instance._form.settings.returnUrl ||
                        instance._form.settings.redirect))) {
                _a.debug('Return url found in form configuration');
                returnUrl = instance._form.settings.returnUrl || instance._form.settings.redirect;
            }
            if (returnUrl) {
                const formSrc = instance.formio ? instance.formio.formUrl : '';
                const hasQuery = !!returnUrl.match(/\?/);
                const isOrigin = returnUrl.indexOf(location.origin) === 0;
                returnUrl += hasQuery ? '&' : '?';
                returnUrl += `sub=${submission._id}`;
                if (!isOrigin && formSrc) {
                    returnUrl += `&form=${encodeURIComponent(formSrc)}`;
                }
                _a.debug('Return URL', returnUrl);
                window.location.href = returnUrl;
                if (isOrigin) {
                    window.location.reload();
                }
            }
        });
    }
    // Return the full script if the builder is being used.
    static formioScript(script, builder) {
        builder = builder || _a.config.includeBuilder;
        if (_a.fullAdded || builder) {
            _a.fullAdded = true;
            return script.replace('formio.form', 'formio.full');
        }
        return script;
    }
    static addLibrary(libWrapper, lib, name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!lib) {
                return;
            }
            if (lib.dependencies) {
                for (let i = 0; i < lib.dependencies.length; i++) {
                    const libName = lib.dependencies[i];
                    yield _a.addLibrary(libWrapper, _a.config.libs[libName], libName);
                }
            }
            if (lib.css) {
                yield _a.addStyles((lib.global ? document.body : libWrapper), lib.css);
            }
            if (lib.js) {
                const module = yield _a.addScript((lib.global ? document.body : libWrapper), lib.js, lib.use ? name : false);
                if (lib.use) {
                    _a.debug(`Using ${name}`);
                    const options = lib.options || {};
                    if (!options.license && _a.license) {
                        options.license = _a.license;
                    }
                    _a.use((typeof lib.use === 'function' ? lib.use(module) : module), options);
                }
            }
            if (lib.globalStyle) {
                const style = _a.createElement('style');
                style.type = 'text/css';
                style.innerHTML = lib.globalStyle;
                document.body.appendChild(style);
            }
        });
    }
    static addLoader(wrapper) {
        return __awaiter(this, void 0, void 0, function* () {
            wrapper.appendChild(_a.createElement('div', {
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
                }]));
        });
    }
    // eslint-disable-next-line max-statements
    static init(element, options = {}, builder = false) {
        return __awaiter(this, void 0, void 0, function* () {
            _a.cdn = new CDN_js_1.default(_a.config.cdn, _a.config.cdnUrls || {});
            _a.config.libs = _a.config.libs || {
                uswds: {
                    dependencies: ['fontawesome'],
                    js: `${_a.cdn.uswds}/uswds.min.js`,
                    css: `${_a.cdn.uswds}/uswds.min.css`,
                    use: true
                },
                fontawesome: {
                    // Due to an issue with font-face not loading in the shadowdom (https://issues.chromium.org/issues/41085401), we need
                    // to do 2 things. 1.) Load the fonts from the global cdn, and 2.) add the font-face to the global styles on the page.
                    css: `https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css`,
                    globalStyle: `@font-face {
                    font-family: 'FontAwesome';
                    src: url('https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/fonts/fontawesome-webfont.eot?v=4.7.0');
                    src: url('https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/fonts/fontawesome-webfont.eot?#iefix&v=4.7.0') format('embedded-opentype'), url('https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0') format('woff2'), url('https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/fonts/fontawesome-webfont.woff?v=4.7.0') format('woff'), url('https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/fonts/fontawesome-webfont.ttf?v=4.7.0') format('truetype'), url('https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular') format('svg');
                    font-weight: normal;
                    font-style: normal;
                  }`
                },
                bootstrap4: {
                    dependencies: ['fontawesome'],
                    css: `${_a.cdn.bootstrap4}/css/bootstrap.min.css`
                },
                bootstrap: {
                    dependencies: ['bootstrap-icons'],
                    css: `${_a.cdn.bootstrap}/css/bootstrap.min.css`
                },
                'bootstrap-icons': {
                    // Due to an issue with font-face not loading in the shadowdom (https://issues.chromium.org/issues/41085401), we need
                    // to do 2 things. 1.) Load the fonts from the global cdn, and 2.) add the font-face to the global styles on the page.
                    css: 'https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.min.css',
                    globalStyle: `@font-face {
                    font-display: block;
                    font-family: "bootstrap-icons";
                    src: url("https://cdn.jsdelivr.net/npm/bootstrap-icons/font/fonts/bootstrap-icons.woff2?dd67030699838ea613ee6dbda90effa6") format("woff2"),
                         url("https://cdn.jsdelivr.net/npm/bootstrap-icons/font/fonts/bootstrap-icons.woff?dd67030699838ea613ee6dbda90effa6") format("woff");
                }`
                }
            };
            // Add all bootswatch templates.
            ['cerulean', 'cosmo', 'cyborg', 'darkly', 'flatly', 'journal', 'litera', 'lumen', 'lux', 'materia', 'minty', 'pulse', 'sandstone', 'simplex', 'sketchy', 'slate', 'solar', 'spacelab', 'superhero', 'united', 'yeti'].forEach((template) => {
                _a.config.libs[template] = {
                    dependencies: ['bootstrap-icons'],
                    css: `${_a.cdn.bootswatch}/dist/${template}/bootstrap.min.css`
                };
            });
            const id = _a.config.id || `formio-${Math.random().toString(36).substring(7)}`;
            // Create a new wrapper and add the element inside of a new wrapper.
            let wrapper = _a.createElement('div', {
                'id': `${id}-wrapper`
            });
            element.parentNode.insertBefore(wrapper, element);
            // If we include the libraries, then we will attempt to run this in shadow dom.
            const useShadowDom = _a.config.includeLibs && !_a.config.noshadow && (typeof wrapper.attachShadow === 'function');
            if (useShadowDom) {
                wrapper = wrapper.attachShadow({
                    mode: 'open'
                });
                options.shadowRoot = wrapper;
            }
            element.parentNode.removeChild(element);
            wrapper.appendChild(element);
            // If this is inside of shadow dom, then we need to add the styles and scripts to the shadow dom.
            const libWrapper = useShadowDom ? wrapper : document.body;
            // Load the renderer styles.
            yield _a.addStyles(libWrapper, _a.config.embedCSS || `${_a.cdn.js}/formio.embed.css`);
            // Add a loader.
            _a.addLoader(wrapper);
            const formioSrc = _a.config.full ? 'formio.full' : 'formio.form';
            const renderer = _a.config.debug ? formioSrc : `${formioSrc}.min`;
            _a.FormioClass = yield _a.addScript(libWrapper, _a.formioScript(_a.config.script || `${_a.cdn.js}/${renderer}.js`, builder), 'Formio', builder ? 'isBuilder' : 'isRenderer');
            _a.FormioClass.cdn = _a.cdn;
            _a.FormioClass.setBaseUrl(options.baseUrl || _a.baseUrl || _a.config.base);
            _a.FormioClass.setProjectUrl(options.projectUrl || _a.projectUrl || _a.config.project);
            _a.FormioClass.language = _a.language;
            _a.setLicense(_a.license || _a.config.license || false);
            _a.modules.forEach((module) => {
                _a.FormioClass.use(module);
            });
            if (_a.icons) {
                _a.FormioClass.icons = _a.icons;
            }
            if (_a.pathType) {
                _a.FormioClass.setPathType(_a.pathType);
            }
            // Add libraries if they wish to include the libs.
            if (_a.config.template && _a.config.includeLibs) {
                yield _a.addLibrary(libWrapper, _a.config.libs[_a.config.template], _a.config.template);
            }
            if (!_a.config.libraries) {
                _a.config.libraries = _a.config.modules || {};
            }
            // Adding premium if it is provided via the config.
            if (_a.config.premium) {
                _a.config.libraries.premium = _a.config.premium;
            }
            // Allow adding dynamic modules.
            if (_a.config.libraries) {
                for (const name in _a.config.libraries) {
                    const lib = _a.config.libraries[name];
                    lib.use = lib.use || true;
                    yield _a.addLibrary(libWrapper, lib, name);
                }
            }
            yield _a.addStyles(libWrapper, _a.formioScript(_a.config.style || `${_a.cdn.js}/${renderer}.css`, builder));
            if (_a.config.before) {
                yield _a.config.before(_a.FormioClass, element, _a.config);
            }
            _a.FormioClass.license = true;
            _a._formioReady(_a.FormioClass);
            return wrapper;
        });
    }
    // Called after an instance has been created.
    static afterCreate(instance, wrapper, readyEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            const loader = wrapper.querySelector('.formio-loader');
            if (loader) {
                wrapper.removeChild(loader);
            }
            _a.FormioClass.events.emit(readyEvent, instance);
            if (_a.config.after) {
                _a.debug('Calling ready callback');
                _a.config.after(instance, _a.config);
            }
            return instance;
        });
    }
    // Create a new form.
    static createForm(element, form, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (_a.FormioClass) {
                return _a.FormioClass.createForm(element, form, Object.assign(Object.assign({}, options), { noLoader: true }));
            }
            const wrapper = yield _a.init(element, options);
            return _a.FormioClass.createForm(element, form, Object.assign(Object.assign({}, options), { noLoader: true })).then((instance) => {
                // Set the default submission data.
                if (_a.config.submission) {
                    _a.debug('Setting submission', _a.config.submission);
                    instance.submission = _a.config.submission;
                }
                // Call the after create method.
                _a.afterCreate(instance, wrapper, 'formEmbedded');
                return instance;
            });
        });
    }
    // Create a form builder.
    static builder(element, form, options = {}) {
        var _b;
        return __awaiter(this, void 0, void 0, function* () {
            if ((_b = _a.FormioClass) === null || _b === void 0 ? void 0 : _b.builder) {
                return _a.FormioClass.builder(element, form, options);
            }
            const wrapper = yield _a.init(element, options, true);
            return _a.FormioClass.builder(element, form, options).then((instance) => {
                _a.afterCreate(instance, wrapper, 'builderEmbedded');
                return instance;
            });
        });
    }
}
exports.Formio = Formio;
_a = Formio;
Formio.FormioClass = null;
Formio.config = {};
Formio.modules = [];
Formio.icons = '';
Formio.license = '';
Formio.formioReady = new Promise((ready, reject) => {
    _a._formioReady = ready;
    _a._formioReadyReject = reject;
});
Formio.version = '5.1.0-dev.2';
// Create a report.
Formio.Report = {
    create: (element, submission, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        if ((_b = _a.FormioClass) === null || _b === void 0 ? void 0 : _b.Report) {
            return _a.FormioClass.Report.create(element, submission, options);
        }
        const wrapper = yield _a.init(element, options, true);
        return _a.FormioClass.Report.create(element, submission, options).then((instance) => {
            _a.afterCreate(instance, wrapper, 'reportEmbedded');
            return instance;
        });
    })
};
CDN_js_1.default.defaultCDN = Formio.version.includes('rc') ? 'https://cdn.test-form.io' : 'https://cdn.form.io';
class Form {
    constructor(element, form, options) {
        this.form = form;
        this.element = element;
        this.options = options || {};
        this.init();
        this.instance = {
            proxy: true,
            ready: this.ready,
            destroy: () => { }
        };
    }
    init() {
        if (this.instance && !this.instance.proxy) {
            this.instance.destroy();
        }
        this.element.innerHTML = '';
        this.ready = this.create().then((instance) => {
            this.instance = instance;
            this.form = instance.form;
            return instance;
        });
    }
    create() {
        return Formio.createForm(this.element, this.form, this.options);
    }
    setForm(form) {
        this.form = form;
        if (this.instance) {
            this.instance.setForm(form);
        }
    }
    setDisplay(display) {
        if (this.instance.proxy) {
            return this.ready;
        }
        this.form.display = display;
        this.instance.destroy();
        this.ready = this.create().then((instance) => {
            this.instance = instance;
            this.setForm(this.form);
        });
        return this.ready;
    }
}
exports.Form = Form;
class FormBuilder extends Form {
    create() {
        return Formio.builder(this.element, this.form, this.options);
    }
}
exports.FormBuilder = FormBuilder;
Formio.Form = Form;
Formio.FormBuilder = FormBuilder;
