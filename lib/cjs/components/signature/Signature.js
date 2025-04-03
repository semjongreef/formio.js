"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const signature_pad_1 = __importDefault(require("signature_pad"));
const Input_1 = __importDefault(require("../_classes/input/Input"));
const lodash_1 = __importDefault(require("lodash"));
const utils_1 = require("../../utils/utils");
class SignatureComponent extends Input_1.default {
    static schema(...extend) {
        return Input_1.default.schema({
            type: 'signature',
            label: 'Signature',
            key: 'signature',
            footer: 'Sign above',
            width: '100%',
            height: '150px',
            penColor: 'black',
            backgroundColor: 'rgb(245,245,235)',
            minWidth: '0.5',
            maxWidth: '2.5',
            keepOverlayRatio: true,
        }, ...extend);
    }
    static get builderInfo() {
        return {
            title: 'Signature',
            group: 'advanced',
            icon: 'pencil',
            weight: 120,
            documentation: '/developers/integrations/esign/esign-integrations#signature-component',
            schema: SignatureComponent.schema()
        };
    }
    static get serverConditionSettings() {
        return SignatureComponent.conditionOperatorsSettings;
    }
    static get conditionOperatorsSettings() {
        return Object.assign(Object.assign({}, super.conditionOperatorsSettings), { operators: ['isEmpty', 'isNotEmpty'] });
    }
    static savedValueTypes(schema) {
        schema = schema || {};
        return (0, utils_1.getComponentSavedTypes)(schema) || [utils_1.componentValueTypes.string];
    }
    init() {
        var _a, _b, _c, _d, _e;
        super.init();
        this.currentWidth = 0;
        this.scale = 1;
        if (!this.component.width) {
            this.component.width = '100%';
        }
        if (!this.component.height) {
            this.component.height = '200px';
        }
        if (this.component.keepOverlayRatio
            && ((_a = this.options) === null || _a === void 0 ? void 0 : _a.display) === 'pdf'
            && ((_b = this.component.overlay) === null || _b === void 0 ? void 0 : _b.width)
            && ((_c = this.component.overlay) === null || _c === void 0 ? void 0 : _c.height)) {
            this.ratio = ((_d = this.component.overlay) === null || _d === void 0 ? void 0 : _d.width) / ((_e = this.component.overlay) === null || _e === void 0 ? void 0 : _e.height);
            this.component.width = '100%';
            this.component.height = 'auto';
        }
    }
    get emptyValue() {
        return '';
    }
    get defaultSchema() {
        return SignatureComponent.schema();
    }
    get inputInfo() {
        const info = super.inputInfo;
        info.type = 'input';
        info.attr.type = 'hidden';
        return info;
    }
    get className() {
        return `${super.className} signature-pad`;
    }
    labelIsHidden() {
        return this.component.hideLabel;
    }
    setValue(value, flags = {}) {
        const changed = super.setValue(value, flags);
        if (this.refs.signatureImage && (this.options.readOnly || this.disabled)) {
            this.refs.signatureImage.setAttribute('src', value);
            this.showCanvas(false);
        }
        if (this.signaturePad) {
            if (!value) {
                this.signaturePad.clear();
            }
            else if (changed) {
                this.triggerChange();
            }
        }
        if (this.signaturePad && this.dataValue && this.signaturePad.isEmpty()) {
            this.setDataToSigaturePad();
        }
        return changed;
    }
    showCanvas(show) {
        if (show) {
            if (this.refs.canvas) {
                this.refs.canvas.style.display = 'inherit';
            }
            if (this.refs.signatureImage) {
                this.refs.signatureImage.style.display = 'none';
            }
        }
        else {
            if (this.refs.canvas) {
                this.refs.canvas.style.display = 'none';
            }
            if (this.refs.signatureImage) {
                this.refs.signatureImage.style.display = 'inherit';
                this.refs.signatureImage.style.maxHeight = '100%';
            }
        }
    }
    onDisabled() {
        this.showCanvas(!super.disabled);
        if (this.signaturePad) {
            if (super.disabled) {
                this.signaturePad.off();
                if (this.refs.refresh) {
                    this.refs.refresh.classList.add('disabled');
                }
                if (this.refs.signatureImage && this.dataValue) {
                    this.refs.signatureImage.setAttribute('src', this.dataValue);
                }
            }
            else {
                this.signaturePad.on();
                if (this.refs.refresh) {
                    this.refs.refresh.classList.remove('disabled');
                }
            }
        }
    }
    checkSize(force, scale) {
        if (this.refs.padBody && (force || this.refs.padBody && this.refs.padBody.offsetWidth !== this.currentWidth)) {
            this.scale = force ? scale : this.scale;
            this.currentWidth = this.refs.padBody.offsetWidth;
            const width = this.currentWidth * this.scale;
            const height = this.ratio ? width / this.ratio : this.refs.padBody.offsetHeight * this.scale;
            const maxHeight = this.ratio ? height : this.refs.padBody.offsetHeight * this.scale;
            this.refs.canvas.width = width;
            this.refs.canvas.height = height > maxHeight ? maxHeight : height;
            this.refs.canvas.style.maxWidth = `${this.currentWidth * this.scale}px`;
            this.refs.canvas.style.maxHeight = `${maxHeight}px`;
            const ctx = this.refs.canvas.getContext('2d');
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale((1 / this.scale), (1 / this.scale));
            ctx.fillStyle = this.signaturePad.backgroundColor;
            ctx.fillRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
            this.signaturePad.clear();
            if (this.dataValue) {
                this.setDataToSigaturePad();
            }
            if (!this.disabled) {
                this.showCanvas(true);
            }
        }
    }
    renderElement(value, index) {
        return this.renderTemplate('signature', {
            element: super.renderElement(value, index),
            required: lodash_1.default.get(this.component, 'validate.required', false),
        });
    }
    get hasModalSaveButton() {
        return false;
    }
    getModalPreviewTemplate() {
        return this.renderModalPreview({
            previewText: this.dataValue ?
                `<img src=${this.dataValue} ${this._referenceAttributeName}='openModal' style="width: 100%;height: 100%;" />` :
                this.t('clickToSign')
        });
    }
    attach(element) {
        this.loadRefs(element, { canvas: 'single', refresh: 'single', padBody: 'single', signatureImage: 'single' });
        const superAttach = super.attach(element);
        if (this.refs.refresh && this.options.readOnly) {
            this.refs.refresh.classList.add('disabled');
        }
        // Create the signature pad.
        if (this.refs.canvas) {
            this.signaturePad = new signature_pad_1.default(this.refs.canvas, {
                minWidth: this.component.minWidth,
                maxWidth: this.component.maxWidth,
                penColor: this.component.penColor,
                backgroundColor: this.component.backgroundColor
            });
            this.signaturePad.addEventListener('endStroke', () => this.setValue(this.signaturePad.toDataURL()));
            this.refs.signatureImage.setAttribute('src', this.signaturePad.toDataURL());
            this.onDisabled();
            // Ensure the signature is always the size of its container.
            if (this.refs.padBody) {
                if (!this.refs.padBody.style.maxWidth) {
                    this.refs.padBody.style.maxWidth = '100%';
                }
                if (!this.builderMode && !this.options.preview) {
                    this.observer = new ResizeObserver(() => {
                        this.checkSize();
                    });
                    this.observer.observe(this.refs.padBody);
                }
                this.addEventListener(window, 'resize', lodash_1.default.debounce(() => this.checkSize(), 10));
                setTimeout(function checkWidth() {
                    if (this.refs.padBody && this.refs.padBody.offsetWidth) {
                        this.checkSize();
                    }
                    else {
                        setTimeout(checkWidth.bind(this), 20);
                    }
                }.bind(this), 20);
            }
        }
        this.addEventListener(this.refs.refresh, 'click', (event) => {
            event.preventDefault();
            this.showCanvas(true);
            this.signaturePad.clear();
            this.setValue(this.defaultValue);
        });
        this.setValue(this.dataValue);
        return superAttach;
    }
    /* eslint-enable max-statements */
    detach() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        if (this.signaturePad) {
            this.signaturePad.off();
        }
        this.signaturePad = null;
        this.currentWidth = 0;
        super.detach();
    }
    getValueAsString(value) {
        if (lodash_1.default.isUndefined(value) && this.inDataTable) {
            return '';
        }
        return this.t(value ? 'yes' : 'no');
    }
    focus() {
        this.refs.padBody.focus();
    }
    setDataToSigaturePad() {
        this.signaturePad.fromDataURL(this.dataValue, {
            ratio: 1,
            width: this.refs.canvas.width,
            height: this.refs.canvas.height,
        });
    }
}
exports.default = SignatureComponent;
