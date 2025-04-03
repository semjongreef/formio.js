"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formio = void 0;
const sdk_1 = require("@formio/core/sdk");
Object.defineProperty(exports, "Formio", { enumerable: true, get: function () { return sdk_1.Formio; } });
const Embed_1 = require("./Embed");
const CDN_1 = __importDefault(require("./CDN"));
const providers_1 = __importDefault(require("./providers"));
sdk_1.Formio.cdn = new CDN_1.default();
sdk_1.Formio.Providers = providers_1.default;
sdk_1.Formio.version = '5.1.0-dev.2';
CDN_1.default.defaultCDN = sdk_1.Formio.version.includes('rc') ? 'https://cdn.test-form.io' : 'https://cdn.form.io';
const isNil = (val) => val === null || val === undefined;
sdk_1.Formio.prototype.uploadFile = function (storage, file, fileName, dir, progressCallback, url, options, fileKey, groupPermissions, groupId, uploadStartCallback, abortCallback, multipartOptions) {
    const requestArgs = {
        provider: storage,
        method: 'upload',
        file: file,
        fileName: fileName,
        dir: dir
    };
    fileKey = fileKey || 'file';
    const request = sdk_1.Formio.pluginWait('preRequest', requestArgs)
        .then(() => {
        return sdk_1.Formio.pluginGet('fileRequest', requestArgs)
            .then((result) => {
            if (storage && isNil(result)) {
                const Provider = providers_1.default.getProvider('storage', storage);
                if (Provider) {
                    const provider = new Provider(this);
                    if (uploadStartCallback) {
                        uploadStartCallback();
                    }
                    return provider.uploadFile(file, fileName, dir, progressCallback, url, options, fileKey, groupPermissions, groupId, abortCallback, multipartOptions);
                }
                else {
                    throw ('Storage provider not found');
                }
            }
            return result || { url: '' };
        });
    });
    return sdk_1.Formio.pluginAlter('wrapFileRequestPromise', request, requestArgs);
};
sdk_1.Formio.prototype.downloadFile = function (file, options) {
    const requestArgs = {
        method: 'download',
        file: file
    };
    const request = sdk_1.Formio.pluginWait('preRequest', requestArgs)
        .then(() => {
        return sdk_1.Formio.pluginGet('fileRequest', requestArgs)
            .then((result) => {
            if (file.storage && isNil(result)) {
                const Provider = providers_1.default.getProvider('storage', file.storage);
                if (Provider) {
                    const provider = new Provider(this);
                    return provider.downloadFile(file, options);
                }
                else {
                    throw ('Storage provider not found');
                }
            }
            return result || { url: '' };
        });
    });
    return sdk_1.Formio.pluginAlter('wrapFileRequestPromise', request, requestArgs);
};
sdk_1.Formio.prototype.deleteFile = function (file, options) {
    const requestArgs = {
        method: 'delete',
        file: file
    };
    const request = sdk_1.Formio.pluginWait('preRequest', requestArgs)
        .then(() => {
        return sdk_1.Formio.pluginGet('fileRequest', requestArgs)
            .then((result) => {
            if (file.storage && isNil(result)) {
                const Provider = providers_1.default.getProvider('storage', file.storage);
                if (Provider) {
                    const provider = new Provider(this);
                    return provider.deleteFile(file, options);
                }
                else {
                    throw ('Storage provider not found');
                }
            }
            return result || { url: '' };
        });
    });
    return sdk_1.Formio.pluginAlter('wrapFileRequestPromise', request, requestArgs);
};
// Esnure we proxy the following methods to the FormioEmbed class.
['setBaseUrl', 'setApiUrl', 'setAppUrl', 'setProjectUrl', 'setPathType', 'setLicense'].forEach((fn) => {
    const baseFn = sdk_1.Formio[fn];
    sdk_1.Formio[fn] = function (arg) {
        const retVal = Embed_1.Formio[fn](arg, true);
        return baseFn ? baseFn.call(this, arg) : retVal;
    };
});
// For reverse compatability.
sdk_1.Formio.Promise = Promise;
sdk_1.Formio.formioReady = Embed_1.Formio.formioReady;
sdk_1.Formio.config = Embed_1.Formio.config;
sdk_1.Formio.builder = Embed_1.Formio.builder;
sdk_1.Formio.Report = Embed_1.Formio.Report;
sdk_1.Formio.Form = Embed_1.Formio.Form;
sdk_1.Formio.FormBuilder = Embed_1.Formio.FormBuilder;
sdk_1.Formio.use = Embed_1.Formio.use;
sdk_1.Formio.createForm = Embed_1.Formio.createForm;
sdk_1.Formio.submitDone = Embed_1.Formio.submitDone;
sdk_1.Formio.addLibrary = Embed_1.Formio.addLibrary;
sdk_1.Formio.addLoader = Embed_1.Formio.addLoader;
sdk_1.Formio.addToGlobal = (global) => {
    if (typeof global === 'object' && !global.Formio) {
        global.Formio = sdk_1.Formio;
    }
};
if (typeof global !== 'undefined') {
    sdk_1.Formio.addToGlobal(global);
}
if (typeof window !== 'undefined') {
    sdk_1.Formio.addToGlobal(window);
}
Embed_1.Formio._formioReady(sdk_1.Formio);
