/**
 * Evaluate a method.
 * @param {Function|string|object} func - The function to evaluate.
 * @param {*} args - A map of arguments to pass to the function.
 * @param {string} ret - The name of the "return" variable in the script.
 * @param {boolean} interpolate - True if the script should be interpolated before being executed.
 * @param {import('@formio/core').EvaluatorOptions} options - The evaluator options.
 * @returns {*} - The result of the evaluation.
 */
export function evaluate(func: Function | string | object, args: any, ret: string, interpolate: boolean, options?: import('@formio/core').EvaluatorOptions): any;
/**
 * Returns a random compoennt ID.
 * @returns {string} - A random component ID.
 */
export function getRandomComponentId(): string;
/**
 * Get a property value of an element.
 * @param {CSSStyleDeclaration} style - The style element to get the property value from.
 * @param {string} prop - The property to get the value for.
 * @returns {number} - The value of the property.
 */
export function getPropertyValue(style: CSSStyleDeclaration, prop: string): number;
/**
 * Get an elements bounding rectagle.
 * @param {HTMLElement} element - A DOM element to get the bounding rectangle for.
 * @returns {{x: number, y: number, width: number, height: number}} - The bounding rectangle.
 */
export function getElementRect(element: HTMLElement): {
    x: number;
    y: number;
    width: number;
    height: number;
};
/**
 * Get non HTMLElement property in the window object
 * @param {string} property - The window property to fetch the script plugin from.
 * @returns {any | undefined} - The HTML Element property on the window object.
 */
export function getScriptPlugin(property: string): any | undefined;
/**
 * Determines the boolean value of a setting.
 * @param {string|boolean} value - A string or boolean value to convert to boolean.
 * @returns {boolean} - The boolean value of the setting.
 */
export function boolValue(value: string | boolean): boolean;
/**
 * Check to see if an ID is a mongoID.
 * @param {string} text - The text to check if it is a mongoID.
 * @returns {boolean} - TRUE if the text is a mongoID; FALSE otherwise.
 */
export function isMongoId(text: string): boolean;
/**
 * Checks the calculated value for a provided component and data.
 * @param {import('@formio/core').Component} component - The component to check for the calculated value.
 * @param {import('@formio/core').Submission} submission - A submission object.
 * @param {*} rowData - The contextual row data for the component.
 */
export function checkCalculated(component: import('@formio/core').Component, submission: import('@formio/core').Submission, rowData: any): void;
/**
 *
 * @param component
 * @param condition
 * @param row
 * @param data
 * @param instance
 */
export function checkSimpleConditional(component: any, condition: any, row: any, data: any, instance: any): boolean;
/**
 * Returns a components normalized value.
 * @param {string} compPath - The full path to the component.
 * @param {*} data - The data object to get the value from.
 * @param {*} row - The contextual row data for the component.
 * @returns {*} - The normalized value of the component.
 */
export function getComponentActualValue(compPath: string, data: any, row: any): any;
/**
 * Check custom javascript conditional.
 * @param {import('@formio/core').Component} component - The component to check for the conditional.
 * @param {string} custom - The custom conditional string to evaluate.
 * @param {*} row - The row data for the component.
 * @param {*} data - The full submission data.
 * @param {import('@formio/core').Form} form - The form object.
 * @param {string} variable - The variable name for the result of the custom conditional.
 * @param {*} onError - A custom return if there is an error or the value is null from the evaluation.
 * @param {import('../../src/components/_classes/component/Component').Component} instance - The component instance.
 * @returns {*} - The result of the evaulation.
 */
export function checkCustomConditional(component: import('@formio/core').Component, custom: string, row: any, data: any, form: import('@formio/core').Form, variable: string, onError: any, instance: any): any;
/**
 * Check a component for JSON conditionals.
 * @param {import('@formio/core').Component} component - The component
 * @param {import('@formio/core').JSONConditional} json - The json conditional to check.
 * @param {*} row - The contextual row data for the component.
 * @param {*} data - The full submission data.
 * @param {import('@formio/core').Form} form - The Form JSON of the form.
 * @param {*} onError - Custom return value if there is an error.
 * @returns {boolean} - TRUE if the condition is true; FALSE otherwise.
 */
export function checkJsonConditional(component: import('@formio/core').Component, json: import('@formio/core').JSONConditional, row: any, data: any, form: import('@formio/core').Form, onError: any): boolean;
/**
 * Checks the conditions for a provided component and data.
 * @param {import('@formio/core').Component} component - The component to check for the condition.
 * @param {*} row - The data within a row
 * @param {*} data - The full submission data.
 * @param {import('@formio/core').Form} form - The form object.
 * @param {import('../../src/components/_classes/component/Component').Component} instance - The component instance.
 * @returns {boolean} - TRUE if the condition is true; FALSE otherwise.
 */
export function checkCondition(component: import('@formio/core').Component, row: any, data: any, form: import('@formio/core').Form, instance: any): boolean;
/**
 * Test a trigger on a component.
 * @param {import('@formio/core').Component} component - The component to test the trigger against.
 * @param {import('@formio/core').LogicTrigger} trigger - The trigger configuration.
 * @param {import('@formio/core').DataObject} row - The contextual row data.
 * @param {import('@formio/core').DataObject} data - The root data object.
 * @param {import('@formio/core').Form} form - The form object.
 * @param {any} instance - The component that is performing the trigger.
 * @returns {boolean} - TRUE if the trigger should fire; FALSE otherwise.
 */
export function checkTrigger(component: import('@formio/core').Component, trigger: any, row: import('@formio/core').DataObject, data: import('@formio/core').DataObject, form: import('@formio/core').Form, instance: any): boolean;
/**
 * Sets a property on a component via an executed Logic action.
 * @param {import('@formio/core').Component} component - The component to set the property on.
 * @param {import('@formio/core').LogicAction} action - The action to perform on the component.
 * @param {string} result - The name of the variable in the evaulation to use as the result.
 * @param {import('@formio/core').DataObject} row - The contextual row data.
 * @param {import('@formio/core').DataObject} data - The full submission data.
 * @param {any} instance - The component instance.
 * @returns {import('@formio/core').Component} - The modified component.
 */
export function setActionProperty(component: import('@formio/core').Component, action: any, result: string, row: import('@formio/core').DataObject, data: import('@formio/core').DataObject, instance: any): import('@formio/core').Component;
/**
 * Removes HTML tags from string e.g. <div>Hello World</div> => Hello World
 * @param {string} str - The string to remove HTML tags from.
 * @returns {string} - The string without HTML tags.
 */
export function removeHTML(str: string): string;
/**
 * Unescape HTML characters like &lt, &gt, &amp and etc.
 * @param {string} str - The string to unescape.
 * @returns {string} - The unescaped string.
 */
export function unescapeHTML(str: string): string;
/**
 * Make HTML element from string
 * @param {string} str - The string to convert to an HTML element.
 * @param {string} selector - The selector to use to get the element once it is created.
 * @returns {HTMLElement} - The HTML element that was created.
 */
export function convertStringToHTMLElement(str: string, selector: string): HTMLElement;
/**
 * Make a filename guaranteed to be unique.
 * @param {string} name - The original name of the file.
 * @param {string} template - The template to use for the unique name.
 * @param {object} evalContext - The context to use for the evaluation.
 * @returns {string} - A unique filename.
 */
export function uniqueName(name: string, template: string, evalContext: object): string;
/**
 * Returns a GUID
 * @returns {string} - A GUID.
 */
export function guid(): string;
/**
 * Return a translated date setting.
 * @param {string|Date} date - The date to translate.
 * @returns {(null|Date)} - The translated date.
 */
export function getDateSetting(date: string | Date): (null | Date);
/**
 * Returns true if the date is a valid date. False otherwise.
 * @param {Date|string} date - The date to check for validity.
 * @returns {boolean} - TRUE if the date is valid; FALSE otherwise.
 */
export function isValidDate(date: Date | string): boolean;
/**
 * Get the current timezone string.
 * @returns {string} - The current timezone.
 */
export function currentTimezone(): string;
/**
 * Get an offset date provided a date object and timezone object.
 * @param {Date} date - The date to offset.
 * @param {string} timezone - The timezone to offset the date to.
 * @returns {Date} - The offset date.
 */
export function offsetDate(date: Date, timezone: string): Date;
/**
 * Returns if the zones are loaded.
 * @returns {boolean} - TRUE if the zones are loaded; FALSE otherwise.
 */
export function zonesLoaded(): boolean;
/**
 * Returns if we should load the zones.
 * @param {string} timezone - The timezone to check if we should load the zones.
 * @returns {boolean} - TRUE if we should load the zones; FALSE otherwise.
 */
export function shouldLoadZones(timezone: string): boolean;
/**
 * Externally load the timezone data.
 * @param {string} url - The URL to load the timezone data from.
 * @param {string} timezone - The timezone to load.
 * @returns {Promise<any> | *} - Resolves when the zones for this timezone are loaded.
 */
export function loadZones(url: string, timezone: string): Promise<any> | any;
/**
 * Get the moment date object for translating dates with timezones.
 * @param {string|Date} value - The value to convert into a moment date.
 * @param {string} format - The format to convert the date to.
 * @param {string} timezone - The timezone to convert the date to.
 * @param {object} options - The options object
 * @returns {Date} - The moment date object.
 */
export function momentDate(value: string | Date, format: string, timezone: string, options: object): Date;
/**
 * Format a date provided a value, format, and timezone object.
 * @param {string} timezonesUrl - The URL to load the timezone data from.
 * @param {string|Date} value - The value to format.
 * @param {string} format - The format to format the date to.
 * @param {string} timezone - The timezone to format the date to.
 * @param {string} flatPickrInputFormat - The format to use for flatpickr input.
 * @returns {string} - The formatted date.
 */
export function formatDate(timezonesUrl: string, value: string | Date, format: string, timezone: string, flatPickrInputFormat: string): string;
/**
 * Pass a format function to format within a timezone.
 * @param {string} timezonesUrl - The URL to load the timezone data from.
 * @param {Function} formatFn - The format function to use.
 * @param {Date|string} date - The date to format.
 * @param {string} format - The format to format the date to.
 * @param {string} timezone - The timezone to format the date to.
 * @returns {string} - The formatted date.
 */
export function formatOffset(timezonesUrl: string, formatFn: Function, date: Date | string, format: string, timezone: string): string;
/**
 * Returns the local date format information.
 * @param {Intl.LocalesArgument} locale - The locale to get the date format for.
 * @returns {object} - The local date format information.
 */
export function getLocaleDateFormatInfo(locale: Intl.LocalesArgument): object;
/**
 * Convert the format from the angular-datepicker module to flatpickr format.
 * @param {string} format - The format to convert.
 * @returns {string} - The converted format.
 */
export function convertFormatToFlatpickr(format: string): string;
/**
 * Convert the format from the angular-datepicker module to moment format.
 * @param {string} format - The format to convert.
 * @returns {string} - The converted format.
 */
export function convertFormatToMoment(format: string): string;
/**
 * Convert the format from the angular-datepicker module to mask format.
 * @param {string} format - The format to convert.
 * @returns {string} - The converted format.
 */
export function convertFormatToMask(format: string): string;
/**
 * Returns an input mask that is compatible with the input mask library.
 * @param {string} mask - The Form.io input mask.
 * @param {string} placeholderChar - Char which is used as a placeholder.
 * @returns {Array} - The input mask for the mask library.
 */
export function getInputMask(mask: string, placeholderChar: string): any[];
/**
 * Unmasks a value using the provided mask and placeholder characters.
 * @param {string} value - The value to unmask.
 * @param {string} mask - The mask to use for unmasking.
 * @param {string} placeholderChar - The placeholder character to use for unmasking.
 * @returns {string} - The unmasked value.
 */
export function unmaskValue(value: string, mask: string, placeholderChar: string): string;
/**
 * Returns true if the value matches the input mask format.
 * @param {string} value - The value to check.
 * @param {string} inputMask - The input mask to check against.
 * @returns {boolean} - TRUE if the value matches the input mask; FALSE otherwise.
 */
export function matchInputMask(value: string, inputMask: string): boolean;
/**
 * Returns the number separators (i.e. 1,000) for the provided language.
 * @param {string} lang - The language code to get the number separators for.
 * @returns {{delimiter: string, decimalSeparator: string}} - The number separators.
 */
export function getNumberSeparators(lang?: string): {
    delimiter: string;
    decimalSeparator: string;
};
/**
 * Returns the number for the maximum amount of decimal places for a number.
 * @param {import('@formio/core').Component} component - The component to check for decimal limits.
 * @param {number} defaultLimit - The default limit to use if none is provided in the component.
 * @returns {number} - The number of decimal places allowed.
 */
export function getNumberDecimalLimit(component: import('@formio/core').Component, defaultLimit: number): number;
/**
 * Returns the currency affixes for a specific language.
 * @param {object} arg0 - The arguments object.
 * @param {string} arg0.currency - The currency code to get the affixes for.
 * @param {number} arg0.decimalLimit - The number of decimal places to use.
 * @param {string} arg0.decimalSeparator - The decimal separator to use.
 * @param {string} arg0.lang - The language code to use.
 * @returns {{prefix: string, suffix: string}} - The currency affixes.
 */
export function getCurrencyAffixes({ currency, decimalLimit, decimalSeparator, lang, }: {
    currency: string;
    decimalLimit: number;
    decimalSeparator: string;
    lang: string;
}): {
    prefix: string;
    suffix: string;
};
/**
 * Fetch the field data provided a component.
 * @param {import('@formio/core').DataObject} data - The data object to fetch the field data from.
 * @param {import('@formio/core').Component} component - The component to fetch the field data for.
 * @returns {*} - The field data.
 */
export function fieldData(data: import('@formio/core').DataObject, component: import('@formio/core').Component): any;
/**
 * Delays function execution with possibility to execute function synchronously or cancel it.
 * @param {Function} fn - Function to delay
 * @param {number} delay - Delay time
 * @param {...any} args - Arguments to pass to the function
 * @returns {*} - Function to cancel the delay
 */
export function delay(fn: Function, delay?: number, ...args: any[]): any;
/**
 * Iterate the given key to make it unique.
 * @param {string} key
 *   Modify the component key to be unique.
 * @returns {string}
 *   The new component key.
 */
export function iterateKey(key: string): string;
/**
 * Determines a unique key within a map provided the base key.
 * @param {Record<string, string>} map - The map to check for uniqueness.
 * @param {string} base - The base path of the key.
 * @returns {string} - The unique key.
 */
export function uniqueKey(map: Record<string, string>, base: string): string;
/**
 * Determines the major version number of bootstrap.
 * @param {object} options - The options to check for bootstrap version.
 * @param {string} options.bootstrap - The bootstrap version to use.
 * @returns {number} - The bootstrap version.
 */
export function bootstrapVersion(options: {
    bootstrap: string;
}): number;
/**
 * Retrun provided argument.
 * If argument is a function, returns the result of a function call.
 * @param {Function|any} e - The argument to check if a function and call if so.
 * @returns {any} - Either the result of the function call (e) or e if it is not a function.
 */
export function unfold(e: Function | any): any;
/**
 * Create enclosed state. Returns functions to getting and cycling between states.
 * @param {*} a - initial state.
 * @param {*} b - next state.
 * @returns {Functions[]} -- [get, toggle];
 */
export function withSwitch(a: any, b: any): Functions[];
/**
 * Create a function that will call the provided function only the provided limit.
 * @param {Function} callback - The callback to call.
 * @param {object} options - The options to use.
 * @param {number} options.limit - The limit to call the callback.
 * @param {number} options.delay - The delay to wait before resetting the call count.
 * @returns {Function} - The function that will call the callback only the provided limit.
 */
export function observeOverload(callback: Function, options?: {
    limit: number;
    delay: number;
}): Function;
/**
 * Returns the components that are provided within an evaluation context.
 * @param {any} context - The evaluation context to get the components from.
 * @param {boolean} excludeNested - Exclude nested components.
 * @param {Array<string>} excludedTypes - The types of components to exclude.
 * @returns {Array} - The components within the evaluation context.
 */
export function getContextComponents(context: any, excludeNested: boolean, excludedTypes?: Array<string>): any[];
/**
 * Returns the button components that are within an evaluation context.
 * @param {any} context - The evaluation context to get the components from.
 * @returns {Array} - The button components within the evaluation context.
 */
export function getContextButtons(context: any): any[];
/**
 * Translates text values in html template.
 * @param {string} template - The template to translate.
 * @param {Function} translate - The translation function.
 * @returns {string} - Html template with translated values.
 */
export function translateHTMLTemplate(template: string, translate: Function): string;
/**
 * Sanitize an html string.
 * @param {string} string - The string to sanitize.
 * @param {any} options - The options to use for sanitization.
 * @returns {string} - The sanitized html string.
 */
export function sanitize(string: string, options: any): string;
/**
 * Fast cloneDeep for JSON objects only.
 * @param {any} obj - The object to perform a fast clone deep against.
 * @returns {any} - The cloned object.
 */
export function fastCloneDeep(obj: any): any;
/**
 * Returns if the component is an input component.
 * @param {import('@formio/core').Component} componentJson - The JSON of a component.
 * @returns {bool} - TRUE if the component is an input component; FALSE otherwise.
 */
export function isInputComponent(componentJson: import('@formio/core').Component): bool;
/**
 * Takes a component path, and returns a component path array.
 * @param {string} pathStr - The path string to convert to an array.
 * @returns {Arryay<number>} - The array of paths.
 */
export function getArrayFromComponentPath(pathStr: string): Arryay<number>;
/**
 * Returns true if the component is a child of the parent.
 * @param {any} child - The child component to check.
 * @param {any} parent - The parent component to check.
 * @returns {boolean} - TRUE if the child is a child of the parent; FALSE otherwise.
 */
export function isChildOf(child: any, parent: any): boolean;
/**
 * Takes an array of component path indexes, and returns a string version of that array.
 * @param {Array<number>} path - The path array to convert to a string.
 * @returns {string} - The string version of the path.
 */
export function getStringFromComponentPath(path: Array<number>): string;
/**
 * Takes a number and rounds it to the provided precision amount.
 * @param {number} number - The number to round.
 * @param {number} precision - The precision to round the number to.
 * @returns {string} - The rounded number.
 */
export function round(number: number, precision: number): string;
/**
 * Check for Internet Explorer browser version
 * @returns {(number|null)} - The IE browser version or null if not IE
 */
export function getIEBrowserVersion(): (number | null);
/**
 * Get browser name and version (modified from 'jquery-browser-plugin')
 * @returns {object} -- {{browser name, version, isWebkit?}}
 * Possible browser names: chrome, safari, ie, edge, opera, mozilla, yabrowser
 */
export function getBrowserInfo(): object;
/**
 * Takes a component path, which may include array indicies (i.e. [0][1]), and returns the compoennt path without the indicies.
 * @param {string} path - The path to remove the indicies from.
 * @returns {string} - The path without the indicies.
 */
export function getComponentPathWithoutIndicies(path?: string): string;
/**
 * Returns a path to the component which based on its schema
 * @param {import('@formio/core').Component} component - Component containing link to its parent's schema in the 'parent' property
 * @returns {string} - Path to the component
 */
export function getComponentPath(component: import('@formio/core').Component): string;
/**
 * Returns a parent component of the passed component instance skipping all the Layout components
 * @param {Component} componentInstance - The component to check for the parent.
 * @returns {Component|undefined} - The parent data component.
 */
export function getDataParentComponent(componentInstance: Component): Component | undefined;
/**
 * Returns whether the value is a promise
 * @param {any} value - The value to check
 * @returns {boolean} - TRUE if the value is a promise; FALSE otherwise
 */
export function isPromise(value: any): boolean;
/**
 * Returns all the focusable elements within the provided dom element.
 * @param {HTMLElement} element - The element to get the focusable elements from.
 * @returns {NodeList<HTMLElement>} - The focusable elements within the provided element.
 */
export function getFocusableElements(element: HTMLElement): NodeList<HTMLElement>;
/**
 * Returns the saved types for the component
 * @param {import('@formio/core').Component} fullSchema - The component schema
 * @returns {Array<string>|null} - The saved types for the component
 */
export function getComponentSavedTypes(fullSchema: import('@formio/core').Component): Array<string> | null;
export * from "./formUtils";
/**
 * Map values through unfold and return first non-nil value.
 * @param {Array<T>} collection - The collection to map through unfold.;
 * @returns {T} - The first non-nil value.
 */
export const firstNonNil: any;
export namespace componentValueTypes {
    let number: string;
    let string: string;
    let boolean: string;
    let array: string;
    let object: string;
    let date: string;
    let any: string;
}
export function interpolateErrors(component: Component, errors: FieldError[], interpolateFn: Function): [];
import ConditionOperators from './conditionOperators';
import { Evaluator } from './Evaluator';
export const interpolate: typeof Evaluator.interpolate;
export { jsonLogic, ConditionOperators, moment, Evaluator, _ };
