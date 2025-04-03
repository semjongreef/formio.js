/**
 * Register a module
 * @param {any} mod - The module object to register. This can also be a function which accepts Formio as an argument.
 * @param {Function|null} [defaultFn] - The default function to call if the module does not have a known key.
 * @param {any} options - Options for the module.
 * @returns {void}
 */
export function registerModule(mod: any, defaultFn?: Function | null | undefined, options?: any): void;
/**
 * @param {Function|null} defaultFn - The default function to call if the module does not have a known key.
 * @returns {void}
 */
export function useModule(defaultFn?: Function | null): void;
export { Formio as FormioCore } from "./Formio";
import Components from './components/Components';
import Displays from './displays/Displays';
import Providers from './providers';
import Widgets from './widgets';
import Templates from './templates/Templates';
import Utils from './utils';
import Form from './Form';
import { Formio } from './Formio';
import Licenses from './licenses';
import EventEmitter from './EventEmitter';
import Webform from './Webform';
export { Components, Displays, Providers, Widgets, Templates, Utils, Form, Formio, Licenses, EventEmitter, Webform };
