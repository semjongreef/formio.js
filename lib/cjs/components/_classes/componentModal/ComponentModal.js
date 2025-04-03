"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const utils_1 = require("../../../utils/utils");
class ComponentModal {
    static render(component, data, topLevel) {
        const children = component.renderTemplate('component', data, topLevel);
        return component.renderTemplate('componentModal', Object.assign(Object.assign({}, data), { children }));
    }
    constructor(component, element, isOpened, currentValue, referenceAttributeName = 'ref') {
        this._referenceAttributeName = referenceAttributeName;
        this.isOpened = isOpened;
        this.component = component;
        this.element = element;
        this.currentValue = (0, utils_1.fastCloneDeep)(currentValue !== null && currentValue !== void 0 ? currentValue : this.component.getValue());
        this.dataLoaded = false;
        this.init();
    }
    get refs() {
        return this.component.refs;
    }
    init() {
        this.openModalListener = this.openModalHandler.bind(this);
        this.showDialogListener = (event) => {
            if (this.isValueChanged() && !this.component.disabled) {
                this.showDialog();
            }
            else {
                this.closeModalHandler(event);
            }
        };
        this.closeModalListener = this.closeModalHandler.bind(this);
        this.saveModalListener = this.saveModalValueHandler.bind(this);
        this.closeDialogListener = this.closeDialog.bind(this);
        this.saveDialogListener = this.saveDialog.bind(this);
        this.loadRefs();
    }
    setValue(value) {
        if (this.dataLoaded && this.currentValue === value) {
            return;
        }
        this.currentValue = (0, utils_1.fastCloneDeep)(value);
        this.dataLoaded = true;
        this.updateView();
    }
    setOpenModalElement(template) {
        var _a;
        if ((_a = this.component) === null || _a === void 0 ? void 0 : _a.visible) {
            this.openModalTemplate = template;
            this.component.setContent(this.refs.openModalWrapper, template);
            this.loadRefs();
            this.setEventListeners();
            if (this.isOpened) {
                this.refs.modalWrapper.classList.add('formio-dialog-disabled-animation');
                this.openModal();
            }
        }
    }
    get templateRefs() {
        return {
            modalOverlay: 'single',
            modalContents: 'single',
            modalClose: 'single',
            componentContent: 'single',
            openModalWrapper: 'single',
            openModal: 'single',
            modalSave: 'single',
            modalWrapper: 'single',
        };
    }
    loadRefs() {
        this.component.loadRefs(this.element, this.templateRefs);
    }
    removeEventListeners() {
        this.component.removeEventListener(this.refs.openModal, 'click', this.openModalListener);
        this.component.removeEventListener(this.refs.modalOverlay, 'click', this.refs.modalSave ? this.showDialogListener : this.saveModalListener);
        this.component.removeEventListener(this.refs.modalClose, 'click', this.showDialogListener);
        this.component.removeEventListener(this.refs.modalSave, 'click', this.saveModalListener);
    }
    setEventListeners() {
        this.removeEventListeners();
        this.component.addEventListener(this.refs.openModal, 'click', this.openModalListener);
        this.component.addEventListener(this.refs.modalOverlay, 'click', this.refs.modalSave ? this.showDialogListener : this.saveModalListener);
        this.component.addEventListener(this.refs.modalClose, 'click', this.showDialogListener);
        this.component.addEventListener(this.refs.modalSave, 'click', this.saveModalListener);
    }
    isValueChanged() {
        let componentValue = this.component.getValue();
        let currentValue = this.currentValue;
        //excluding metadata comparison for components that have it in dataValue (for ex. nested forms)
        if (componentValue && componentValue.data && componentValue.metadata) {
            componentValue = this.component.getValue().data;
            currentValue = this.currentValue.data;
        }
        return !lodash_1.default.isEqual((0, utils_1.fastCloneDeep)(componentValue), currentValue);
    }
    setOpenEventListener() {
        var _a;
        this.component.removeEventListener(this.refs.openModal, 'click', this.openModalListener);
        this.component.loadRefs((_a = this.refs.openModalWrapper) !== null && _a !== void 0 ? _a : this.element, {
            'openModal': 'single',
        });
        this.component.addEventListener(this.refs.openModal, 'click', this.openModalListener);
    }
    openModalHandler(event) {
        event.preventDefault();
        this.openModal();
    }
    positionOverElement() {
        // Position the modal just over the element on the page.
        const elementOffset = this.element.getBoundingClientRect().top;
        const modalHeight = this.refs.modalContents.getBoundingClientRect().height;
        let modalTop = elementOffset - modalHeight - 10;
        modalTop = modalTop > 0 ? modalTop : 10;
        this.refs.modalWrapper.style.paddingTop = `${modalTop}px`;
    }
    openModal() {
        this.isOpened = true;
        this.refs.modalWrapper.classList.remove('component-rendering-hidden');
        if (this.component.component.type === 'signature') {
            // Position signature modals just above the signature button.
            this.positionOverElement();
        }
    }
    updateView() {
        const template = lodash_1.default.isEqual(this.currentValue, this.component.defaultValue)
            ? this.openModalTemplate
            : this.component.getModalPreviewTemplate();
        this.component.setContent(this.refs.openModalWrapper, template);
        this.setOpenEventListener();
    }
    closeModal() {
        this.refs.modalWrapper.classList.remove('formio-dialog-disabled-animation');
        this.refs.modalWrapper.classList.add('component-rendering-hidden');
        this.isOpened = false;
        this.updateView();
    }
    closeModalHandler(event) {
        event.preventDefault();
        if (!this.component.disabled) {
            this.component.setValue(lodash_1.default.cloneDeep(this.currentValue), { resetValue: true });
        }
        this.closeModal();
    }
    showDialog() {
        this.dialogElement = this.component.ce('div');
        const dialogContent = `
      <h3 ${this._referenceAttributeName}="dialogHeader">${this.component.t('Do you want to clear changes?')}</h3>
      <div style="display:flex; justify-content: flex-end;">
        <button ${this._referenceAttributeName}="dialogCancelButton" class="btn btn-secondary">${this.component.t('Cancel')}</button>
        <button ${this._referenceAttributeName}="dialogYesButton" class="btn btn-danger">${this.component.t('Yes, delete it')}</button>
      </div>
    `;
        this.dialogElement.innerHTML = dialogContent;
        this.dialogElement.refs = {};
        this.component.loadRefs.call(this.dialogElement, this.dialogElement, {
            dialogHeader: 'single',
            dialogCancelButton: 'single',
            dialogYesButton: 'single',
        });
        this.dialog = this.component.createModal(this.dialogElement);
        this.component.addEventListener(this.dialogElement.refs.dialogYesButton, 'click', this.saveDialogListener);
        this.component.addEventListener(this.dialogElement.refs.dialogCancelButton, 'click', this.closeDialogListener);
    }
    closeDialog(event) {
        event.preventDefault();
        this.dialog.close();
        this.component.removeEventListener(this.dialogElement.refs.dialogYesButton, 'click', this.saveDialogListener);
        this.component.removeEventListener(this.dialogElement.refs.dialogCancelButton, 'click', this.closeDialogListener);
    }
    saveDialog(event) {
        this.closeDialog(event);
        this.closeModalHandler(event);
    }
    saveModalValueHandler(event) {
        var _a;
        event.preventDefault();
        this.currentValue = (0, utils_1.fastCloneDeep)((_a = this.component.dataValue) !== null && _a !== void 0 ? _a : this.component.getValue());
        this.closeModal();
    }
}
exports.default = ComponentModal;
