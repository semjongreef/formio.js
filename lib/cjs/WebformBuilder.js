"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Webform_1 = __importDefault(require("./Webform"));
const Component_1 = __importDefault(require("./components/_classes/component/Component"));
const tippy_js_1 = __importDefault(require("tippy.js"));
const Components_1 = __importDefault(require("./components/Components"));
const Formio_1 = require("./Formio");
const utils_1 = require("./utils/utils");
const formUtils_1 = require("./utils/formUtils");
const builder_1 = __importDefault(require("./utils/builder"));
const lodash_1 = __importDefault(require("lodash"));
const dom_autoscroller_1 = __importDefault(require("dom-autoscroller"));
const Templates_1 = __importDefault(require("./templates/Templates"));
require("./components/builder");
// We need this here because dragula pulls in CustomEvent class that requires global to exist.
if (typeof window !== 'undefined' && typeof window.global === 'undefined') {
    window.global = window;
}
const dragula_1 = __importDefault(require("dragula"));
class WebformBuilder extends Component_1.default {
    // eslint-disable-next-line max-statements
    constructor() {
        let element, options;
        if (arguments[0] instanceof HTMLElement || arguments[1]) {
            element = arguments[0];
            options = arguments[1];
        }
        else {
            options = arguments[0];
        }
        // Reset skipInit in case PDFBuilder has set it.
        options.skipInit = false;
        options.display = options.display || 'form';
        super(null, options);
        this.moveHandler = (e) => {
            if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13) {
                e.stopPropagation();
                e.preventDefault();
            }
            if (e.keyCode === 38) {
                this.updateComponentPlacement(true);
            }
            if (e.keyCode === 40) {
                this.updateComponentPlacement(false);
            }
            if (e.keyCode === 13) {
                this.stopMoving(this.selectedComponent);
            }
        };
        this.setElement(element);
        this.dragulaLib = dragula_1.default;
        this.builderHeight = 0;
        this.schemas = {};
        this.repeatablePaths = [];
        this.sideBarScroll = lodash_1.default.get(this.options, 'sideBarScroll', true);
        this.sideBarScrollOffset = lodash_1.default.get(this.options, 'sideBarScrollOffset', 0);
        this.dragDropEnabled = true;
        // Setup the builder options.
        this.builder = lodash_1.default.defaultsDeep({}, this.options.builder, this.defaultGroups);
        // Turn off if explicitely said to do so...
        lodash_1.default.each(this.defaultGroups, (config, key) => {
            if (config === false) {
                this.builder[key] = false;
            }
        });
        // Add the groups.////
        this.groups = {};
        this.groupOrder = [];
        for (const group in this.builder) {
            if (this.builder[group]) {
                this.builder[group].key = group;
                this.groups[group] = this.builder[group];
                this.groups[group].components = this.groups[group].components || {};
                this.groups[group].componentOrder = this.groups[group].componentOrder || [];
                this.groups[group].subgroups = Object.keys(this.groups[group].groups || {}).map((groupKey) => {
                    this.groups[group].groups[groupKey].componentOrder = Object.keys(this.groups[group].groups[groupKey].components).map((key) => key);
                    return this.groups[group].groups[groupKey];
                });
                this.groupOrder.push(this.groups[group]);
            }
        }
        this.groupOrder = this.groupOrder
            .filter(group => group && !group.ignore)
            .sort((a, b) => a.weight - b.weight)
            .map(group => group.key);
        for (const type in Components_1.default.components) {
            const component = Components_1.default.components[type];
            if (component.builderInfo && component.builderInfo.schema) {
                this.schemas[type] = component.builderInfo.schema;
                component.type = type;
                const builderInfo = component.builderInfo;
                builderInfo.key = component.type;
                this.addBuilderComponentInfo(builderInfo);
            }
        }
        // Filter out any extra components.
        // Add the components in each group.
        for (const group in this.groups) {
            const info = this.groups[group];
            for (const key in info.components) {
                const compKey = group === 'resource' ? `component-${key}` : key;
                let comp = info.components[compKey];
                if (comp === true &&
                    Components_1.default.components[key] &&
                    Components_1.default.components[key].builderInfo) {
                    comp = Components_1.default.components[key].builderInfo;
                }
                if (comp && comp.schema) {
                    this.schemas[key] = comp.schema;
                    info.components[compKey] = comp;
                    info.components[compKey].key = key;
                }
                else {
                    // Do not include this component in the components array.
                    delete info.components[compKey];
                }
            }
            // Order the components.
            this.orderComponents(info);
        }
        this.options.hooks = this.options.hooks || {};
        this.options.hooks.renderComponent = (html, { component, self }) => {
            var _a, _b, _c;
            if (self.type === 'form' && !self.key) {
                const template = this.hook('renderComponentFormTemplate', html.replace('formio-component-form', ''));
                // The main webform shouldn't have this class as it adds extra styles.
                return template;
            }
            if (this.options.disabled && this.options.disabled.includes(self.key) || self.parent.noDragDrop) {
                return html;
            }
            return this.renderTemplate('builderComponent', {
                html,
                disableBuilderActions: (_a = self === null || self === void 0 ? void 0 : self.component) === null || _a === void 0 ? void 0 : _a.disableBuilderActions,
                childComponent: component,
                design: (_b = self === null || self === void 0 ? void 0 : self.options) === null || _b === void 0 ? void 0 : _b.design,
                editJson: (_c = self === null || self === void 0 ? void 0 : self.options) === null || _c === void 0 ? void 0 : _c.editJson,
                editComponent: this.hasEditTabs(component.type)
            });
        };
        this.options.hooks.renderComponents = (html, { components, self }) => {
            // if Datagrid and already has a component, don't make it droppable.
            if (self.type === 'datagrid' && components.length > 0 || self.noDragDrop) {
                return html;
            }
            if (!components ||
                (!components.length && !components.nodrop) ||
                (self.type === 'form' && components.length <= 1 && (components.length === 0 || components[0].type === 'button'))) {
                html = this.renderTemplate('builderPlaceholder', {
                    position: 0
                }) + html;
            }
            return this.renderTemplate('builderComponents', {
                key: self.key,
                type: self.type,
                html,
            });
        };
        this.options.hooks.renderInput = (html, { self }) => {
            if (self.type === 'hidden') {
                return html + self.name;
            }
            return html;
        };
        this.options.hooks.renderLoading = (html, { self }) => {
            if (self.type === 'form' && self.key) {
                return self.name;
            }
            return html;
        };
        this.options.hooks.attachComponents = (element, components, container, component) => {
            // Don't attach if no element was found or component doesn't participate in drag'n'drop.
            if (!element) {
                return;
            }
            if (component.noDragDrop) {
                return element;
            }
            // Attach container and component to element for later reference.
            const containerElement = element.querySelector(`[${this._referenceAttributeName}="${component.component.key}-container"]`) || element;
            containerElement.formioContainer = container;
            containerElement.formioComponent = component;
            // Add container to draggable list.
            if (this.dragula && this.allowDrop(element)) {
                this.dragula.containers.push(containerElement);
            }
            // If this is an existing datagrid element, don't make it draggable.
            if ((component.type === 'datagrid' || component.type === 'datamap') && components.length > 0) {
                return element;
            }
            // Since we added a wrapper, need to return the original element so that we can find the components inside it.
            return element.children[0];
        };
        this.options.hooks.attachDatagrid = (element, component) => {
            component.loadRefs(element, {
                [`${component.key}-container`]: 'single',
            });
            const dataGridContainer = component.refs[`${component.key}-container`];
            if (dataGridContainer) {
                component.attachComponents(dataGridContainer.parentNode, [], component.component.components);
            }
            // Need to set up horizontal rearrangement of fields.
        };
        this.options.hooks.attachComponent = this.attachComponent.bind(this);
        // Load resources tagged as 'builder'
        const query = {
            params: {
                type: 'resource',
                limit: 1000000,
                select: '_id,title,name,components',
                'tags__ne': 'noBuilderResource'
            }
        };
        if (this.options && this.options.resourceTag) {
            query.params.tags = [this.options.resourceTag];
        }
        else if (!this.options || !this.options.hasOwnProperty('resourceTag')) {
            query.params.tags = ['builder'];
        }
        const formio = new Formio_1.Formio(Formio_1.Formio.projectUrl);
        const isResourcesDisabled = this.options.builder && this.options.builder.resource === false;
        formio.loadProject().then((project) => {
            if (project && (lodash_1.default.get(project, 'settings.addConfigToForms', false) || lodash_1.default.get(project, 'addConfigToForms', false))) {
                const config = project.config || {};
                this.options.formConfig = config;
                const pathToFormConfig = 'webform._form.config';
                const webformConfig = lodash_1.default.get(this, pathToFormConfig);
                if (this.webform && !webformConfig) {
                    lodash_1.default.set(this, pathToFormConfig, config);
                }
            }
        }).catch((err) => {
            console.warn(`${this.t('loadingProjectSettingsError')}: ${err.message || err}`);
        });
        if (!formio.noProject && !isResourcesDisabled && formio.formsUrl) {
            const resourceOptions = this.options.builder && this.options.builder.resource;
            formio.loadForms(query)
                .then((resources) => {
                if (resources.length) {
                    this.builder.resource = {
                        title: resourceOptions ? resourceOptions.title : 'Existing Resource Fields',
                        key: 'resource',
                        weight: resourceOptions ? resourceOptions.weight : 50,
                        subgroups: [],
                        components: [],
                        componentOrder: []
                    };
                    this.groups.resource = {
                        title: resourceOptions ? resourceOptions.title : 'Existing Resource Fields',
                        key: 'resource',
                        weight: resourceOptions ? resourceOptions.weight : 50,
                        subgroups: [],
                        components: [],
                        componentOrder: []
                    };
                    if (!this.groupOrder.includes('resource')) {
                        this.groupOrder.push('resource');
                    }
                    this.addExistingResourceFields(resources);
                }
            });
        }
        // Notify components if they need to modify their render.
        this.options.attachMode = 'builder';
        this.webform = this.webform || this.createForm(this.options);
        this.pathComponentsMapping = {};
        this.arrayDataComponentPaths = [];
        this.nestedDataComponents = [];
        this.arrayDataComponents = [];
    }
    allowDrop() {
        return true;
    }
    addExistingResourceFields(resources) {
        lodash_1.default.each(resources, (resource, index) => {
            const resourceKey = `resource-${resource.name}`;
            const subgroup = {
                key: resourceKey,
                title: resource.title,
                components: [],
                componentOrder: [],
                default: index === 0,
            };
            (0, formUtils_1.eachComponent)(resource.components, (component) => {
                if (component.type === 'button')
                    return;
                if (this.options &&
                    this.options.resourceFilter &&
                    (!component.tags || component.tags.indexOf(this.options.resourceFilter) === -1))
                    return;
                let componentName = component.label;
                if (!componentName && component.key) {
                    componentName = lodash_1.default.upperFirst(component.key);
                }
                subgroup.componentOrder.push(`component-${component.key}`);
                subgroup.components[`component-${component.key}`] = lodash_1.default.merge((0, utils_1.fastCloneDeep)(Components_1.default.components[component.type]
                    ? Components_1.default.components[component.type].builderInfo
                    : Components_1.default.components['unknown'].builderInfo), {
                    key: component.key,
                    title: componentName,
                    group: 'resource',
                    subgroup: resourceKey,
                }, {
                    schema: Object.assign(Object.assign({}, component), { label: component.label, key: component.key, lockKey: true, source: (!this.options.noSource ? resource._id : undefined), isNew: true })
                });
            }, true);
            this.groups.resource.subgroups.push(subgroup);
        });
        this.triggerRedraw();
    }
    attachTooltip(component, title) {
        return (0, tippy_js_1.default)(component, {
            allowHTML: true,
            trigger: 'mouseenter focus',
            placement: 'top',
            delay: [200, 0],
            zIndex: 10000,
            content: title
        });
    }
    attachComponent(element, component) {
        if (component instanceof WebformBuilder) {
            return;
        }
        // Add component to element for later reference.
        element.formioComponent = component;
        component.loadRefs(element, {
            removeComponent: 'single',
            editComponent: 'single',
            moveComponent: 'single',
            copyComponent: 'single',
            pasteComponent: 'single',
            editJson: 'single'
        });
        if (component.refs.copyComponent) {
            this.attachTooltip(component.refs.copyComponent, this.t('copy'));
            component.addEventListener(component.refs.copyComponent, 'click', () => this.copyComponent(component));
        }
        if (component.refs.pasteComponent) {
            const pasteToolTip = this.attachTooltip(component.refs.pasteComponent, this.t('pasteBelow'));
            component.addEventListener(component.refs.pasteComponent, 'click', () => {
                pasteToolTip.hide();
                this.pasteComponent(component);
            });
        }
        if (component.refs.moveComponent) {
            this.attachTooltip(component.refs.moveComponent, this.t('move'));
            if (this.keyboardActionsEnabled) {
                component.addEventListener(component.refs.moveComponent, 'click', () => {
                    this.moveComponent(component);
                });
            }
        }
        const parent = this.getParentElement(element);
        if (component.refs.editComponent) {
            this.attachTooltip(component.refs.editComponent, this.t('edit'));
            component.addEventListener(component.refs.editComponent, 'click', () => this.editComponent(component.schema, parent, false, false, component.component, { inDataGrid: component.isInDataGrid }));
        }
        if (component.refs.editJson) {
            this.attachTooltip(component.refs.editJson, this.t('editJson'));
            component.addEventListener(component.refs.editJson, 'click', () => this.editComponent(component.schema, parent, false, true, component.component));
        }
        if (component.refs.removeComponent) {
            this.attachTooltip(component.refs.removeComponent, this.t('remove'));
            component.addEventListener(component.refs.removeComponent, 'click', () => this.removeComponent(component.schema, parent, component.component, component));
        }
        return element;
    }
    createForm(options) {
        this.webform = new Webform_1.default(this.element, options);
        if (this.element) {
            this.loadRefs(this.element, {
                form: 'single'
            });
            if (this.refs.form) {
                this.webform.element = this.refs.form;
            }
        }
        return this.webform;
    }
    /**
     * Called when everything is ready.
     * @returns {Promise} - Wait for webform to be ready.
     */
    get ready() {
        return this.webform.ready;
    }
    get defaultGroups() {
        return {
            basic: {
                title: 'Basic',
                weight: 0,
                default: true,
            },
            advanced: {
                title: 'Advanced',
                weight: 10
            },
            layout: {
                title: 'Layout',
                weight: 20
            },
            data: {
                title: 'Data',
                weight: 30
            },
            premium: {
                title: 'Premium',
                weight: 40
            }
        };
    }
    redraw() {
        return Webform_1.default.prototype.redraw.call(this);
    }
    get form() {
        return this.webform.form;
    }
    get schema() {
        return this.webform.schema;
    }
    set form(value) {
        this.setForm(value);
    }
    get container() {
        return this.webform.form.components;
    }
    /**
     * When a component sets its api key, we need to check if it is unique within its namespace. Find the namespace root
     * so we can calculate this correctly.
     * @param {import('@formio/core').Component} component - The component to find the namespace root for.
     * @returns {import('@formio/core').Component[]} - The components root for this namespace.
     */
    findNamespaceRoot(component) {
        const path = (0, utils_1.getArrayFromComponentPath)(component.path);
        // First get the component with nested parents.
        let comp = this.webform.getComponent(path);
        comp = Array.isArray(comp) ? comp[0] : comp;
        const namespaceKey = this.recurseNamespace(comp);
        // If there is no key, it is the root form.
        if (!namespaceKey || this.form.key === namespaceKey) {
            return this.form.components;
        }
        const componentSchema = component.component;
        // If the current component is the namespace, we don't need to find it again.
        if (namespaceKey === component.key) {
            return [...componentSchema.components, componentSchema];
        }
        // Get the namespace component so we have the original object.
        const namespaceComponent = (0, formUtils_1.getComponent)(this.form.components, namespaceKey, true);
        return namespaceComponent ? namespaceComponent.components : comp.components;
    }
    recurseNamespace(component) {
        // If there is no parent, we are at the root level.
        if (!component) {
            return null;
        }
        // Some components are their own namespace.
        if (['address', 'container', 'datagrid', 'editgrid', 'dynamicWizard', 'tree'].includes(component.type) || component.tree || component.arrayTree) {
            return component.key;
        }
        // Anything else, keep going up.
        return this.recurseNamespace(component.parent);
    }
    render() {
        return this.renderTemplate('builder', {
            sidebar: this.renderTemplate('builderSidebar', {
                scrollEnabled: this.sideBarScroll,
                groupOrder: this.groupOrder,
                groupId: `builder-sidebar-${this.id}`,
                groups: this.groupOrder.map((groupKey) => this.renderTemplate('builderSidebarGroup', {
                    group: this.groups[groupKey],
                    groupKey,
                    groupId: `builder-sidebar-${this.id}`,
                    subgroups: this.groups[groupKey].subgroups.map((group) => this.renderTemplate('builderSidebarGroup', {
                        group,
                        groupKey: group.key,
                        groupId: `group-container-${groupKey}`,
                        subgroups: []
                    })),
                    keyboardActionsEnabled: this.keyboardActionsEnabled,
                })),
            }),
            form: this.webform.render(),
        });
    }
    attach(element) {
        this.on('change', (form) => {
            this.populateCaptchaSettings(form);
            this.webform.setAlert(false);
        });
        return super.attach(element).then(() => {
            this.loadRefs(element, {
                form: 'single',
                sidebar: 'single',
                'sidebar-search': 'single',
                'sidebar-groups': 'single',
                'container': 'multiple',
                'sidebar-anchor': 'multiple',
                'sidebar-group': 'multiple',
                'sidebar-container': 'multiple',
                'sidebar-component': 'multiple',
            });
            if (this.sideBarScroll && Templates_1.default.current.handleBuilderSidebarScroll) {
                Templates_1.default.current.handleBuilderSidebarScroll.call(this, this);
            }
            // Add the paste status in form
            if (typeof window !== 'undefined' && window.sessionStorage) {
                const data = window.sessionStorage.getItem('formio.clipboard');
                if (data) {
                    this.addClass(this.refs.form, 'builder-paste-mode');
                }
            }
            if (!(0, utils_1.bootstrapVersion)(this.options)) {
                const getAttribute = (anchor, attribute) => {
                    let elem = anchor.getAttribute(`data-${attribute}`);
                    if (!elem) {
                        elem = anchor.getAttribute(`data-bs-${attribute}`);
                    }
                    return elem;
                };
                const hideShow = (group, show) => {
                    if (show) {
                        group.classList.add(['show']);
                        group.style.display = 'inherit';
                    }
                    else {
                        group.classList.remove(['show']);
                        group.style.display = 'none';
                    }
                };
                // Initialize
                this.refs['sidebar-group'].forEach((group) => {
                    hideShow(group, getAttribute(group, 'default') === 'true');
                });
                // Click event
                this.refs['sidebar-anchor'].forEach((anchor, index) => {
                    this.addEventListener(anchor, 'click', () => {
                        const clickedParentId = getAttribute(anchor, 'parent').slice('#builder-sidebar-'.length);
                        const clickedId = getAttribute(anchor, 'target').slice('#group-'.length);
                        this.refs['sidebar-group'].forEach((group, groupIndex) => {
                            const openByDefault = getAttribute(group, 'default') === 'true';
                            const groupId = group.getAttribute('id').slice('group-'.length);
                            const groupParent = getAttribute(group, 'parent').slice('#builder-sidebar-'.length);
                            hideShow(group, ((openByDefault && groupParent === clickedId) || groupId === clickedParentId || groupIndex === index));
                        });
                    }, true);
                });
            }
            if (this.keyboardActionsEnabled) {
                this.refs['sidebar-component'].forEach((component) => {
                    this.addEventListener(component, 'keydown', (event) => {
                        if (event.keyCode === 13) {
                            this.addNewComponent(component);
                        }
                    });
                });
            }
            this.addEventListener(this.refs['sidebar-search'], 'input', lodash_1.default.debounce((e) => {
                const searchString = e.target.value;
                this.searchFields(searchString);
            }, 300));
            if (this.dragDropEnabled) {
                this.initDragula();
            }
            const drake = this.dragula;
            if (this.refs.form) {
                (0, dom_autoscroller_1.default)([window], {
                    margin: 20,
                    maxSpeed: 6,
                    scrollWhenOutside: true,
                    autoScroll: function () {
                        return this.down && (drake === null || drake === void 0 ? void 0 : drake.dragging);
                    }
                });
                return this.webform.attach(this.refs.form);
            }
        });
    }
    searchFields(searchString = '') {
        const searchValue = searchString.toLowerCase();
        const sidebar = this.refs['sidebar'];
        const sidebarGroups = this.refs['sidebar-groups'];
        if (!sidebar || !sidebarGroups) {
            return;
        }
        const filterGroupBy = (group, searchValue = '') => {
            const result = lodash_1.default.toPlainObject(group);
            const { subgroups = [], components } = result;
            const filteredComponents = [];
            for (const key in components) {
                const isMatchedToTitle = this.t(components[key].title).toLowerCase().match(searchValue);
                const isMatchedToKey = components[key].key.toLowerCase().match(searchValue);
                if (isMatchedToTitle || isMatchedToKey) {
                    filteredComponents.push(components[key]);
                }
            }
            this.orderComponents(result, filteredComponents);
            if (searchValue) {
                result.default = true;
            }
            if (result.componentOrder.length || subgroups.length) {
                return result;
            }
            return null;
        };
        const filterGroupOrder = (groupOrder, searchValue) => {
            const result = lodash_1.default.cloneDeep(groupOrder);
            return result.filter(key => filterGroupBy(this.groups[key], searchValue));
        };
        const filterSubgroups = (groups, searchValue) => {
            const result = lodash_1.default.clone(groups);
            return result
                .map(subgroup => filterGroupBy(subgroup, searchValue))
                .filter(subgroup => !lodash_1.default.isNull(subgroup));
        };
        const toTemplate = groupKey => {
            return {
                group: filterGroupBy(this.groups[groupKey], searchValue),
                groupKey,
                groupId: sidebar.id || sidebarGroups.id,
                subgroups: filterSubgroups(this.groups[groupKey].subgroups, searchValue)
                    .map((group) => this.renderTemplate('builderSidebarGroup', {
                    group,
                    groupKey: group.key,
                    groupId: `group-container-${groupKey}`,
                    subgroups: []
                })),
            };
        };
        sidebarGroups.innerHTML = filterGroupOrder(this.groupOrder, searchValue)
            .map(groupKey => this.renderTemplate('builderSidebarGroup', toTemplate(groupKey)))
            .join('');
        this.loadRefs(this.element, {
            'sidebar-groups': 'single',
            'sidebar-anchor': 'multiple',
            'sidebar-group': 'multiple',
            'sidebar-container': 'multiple',
        });
        this.updateDragAndDrop();
        if (searchValue === '') {
            this.triggerRedraw();
        }
    }
    orderComponents(groupInfo, foundComponents) {
        const components = foundComponents || groupInfo.components;
        const isResource = groupInfo.key.indexOf('resource-') === 0;
        if (components) {
            groupInfo.componentOrder = Object.keys(components)
                .map(key => components[key])
                .filter(component => component && !component.ignore && !component.ignoreForForm)
                .sort((a, b) => a.weight - b.weight)
                .map(component => isResource ? `component-${component.key}` : component.key);
        }
    }
    updateDragAndDrop() {
        if (this.dragDropEnabled) {
            this.initDragula();
        }
        if (this.refs.form) {
            return this.webform.attach(this.refs.form);
        }
    }
    initDragula() {
        const options = this.options;
        if (this.dragula) {
            this.dragula.destroy();
        }
        const containersArray = Array.prototype.slice.call(this.refs['sidebar-container']).filter(item => {
            return item.id !== 'group-container-resource';
        });
        if (!dragula_1.default) {
            return;
        }
        this.dragula = (0, dragula_1.default)(containersArray, {
            moves(el) {
                let moves = true;
                const list = Array.from(el.classList).filter(item => item.indexOf('formio-component-') === 0);
                list.forEach(item => {
                    const key = item.slice('formio-component-'.length);
                    if (options.disabled && options.disabled.includes(key)) {
                        moves = false;
                    }
                });
                if (el.classList.contains('no-drag')) {
                    moves = false;
                }
                return moves;
            },
            copy(el) {
                return el.classList.contains('drag-copy');
            },
            accepts(el, target) {
                return !el.contains(target) && !target.classList.contains('no-drop');
            }
        }).on('drop', (element, target, source, sibling) => this.onDrop(element, target, source, sibling));
    }
    detach() {
        if (this.dragula) {
            this.dragula.destroy();
        }
        this.dragula = null;
        if (this.sideBarScroll && Templates_1.default.current.clearBuilderSidebarScroll) {
            Templates_1.default.current.clearBuilderSidebarScroll.call(this, this);
        }
        super.detach();
    }
    getComponentInfo(key, group) {
        let info;
        // Need to check in first order as resource component key can be the same as from webform default components
        if (group && group.slice(0, group.indexOf('-')) === 'resource') {
            // This is an existing resource field.
            const resourceGroups = this.groups.resource.subgroups;
            const resourceGroup = lodash_1.default.find(resourceGroups, { key: group });
            if (resourceGroup && resourceGroup.components.hasOwnProperty(`component-${key}`)) {
                info = (0, utils_1.fastCloneDeep)(resourceGroup.components[`component-${key}`].schema);
            }
        }
        // This is a new component
        else if (this.schemas.hasOwnProperty(key)) {
            info = (0, utils_1.fastCloneDeep)(this.schemas[key]);
        }
        else if (this.groups.hasOwnProperty(group)) {
            const groupComponents = this.groups[group].components;
            if (groupComponents.hasOwnProperty(key)) {
                info = (0, utils_1.fastCloneDeep)(groupComponents[key].schema);
            }
        }
        else if (group === 'searchFields') { //Search components go into this group
            const resourceGroups = this.groups.resource.subgroups;
            for (let ix = 0; ix < resourceGroups.length; ix++) {
                const resourceGroup = resourceGroups[ix];
                if (resourceGroup.components.hasOwnProperty(`component-${key}`)) {
                    info = (0, utils_1.fastCloneDeep)(resourceGroup.components[`component-${key}`].schema);
                    break;
                }
            }
        }
        if (info) {
            //if this is a custom component that was already assigned a key, don't stomp on it
            if (!Components_1.default.components.hasOwnProperty(info.type) && info.key) {
                return info;
            }
            info.key = this.generateKey(info);
        }
        return info;
    }
    getComponentsPath(component, parent) {
        // Get path to the component in the parent component.
        let path = 'components';
        let columnIndex = 0;
        let tableRowIndex = 0;
        let tableColumnIndex = 0;
        let tabIndex = 0;
        switch (parent.type) {
            case 'table':
                tableRowIndex = lodash_1.default.findIndex(parent.rows, row => row.some(column => column.components.some(comp => comp.key === component.key)));
                tableColumnIndex = lodash_1.default.findIndex(parent.rows[tableRowIndex], (column => column.components.some(comp => comp.key === component.key)));
                path = `rows[${tableRowIndex}][${tableColumnIndex}].components`;
                break;
            case 'columns':
                columnIndex = lodash_1.default.findIndex(parent.columns, column => column.components.some(comp => comp.key === component.key));
                path = `columns[${columnIndex}].components`;
                break;
            case 'tabs':
                tabIndex = lodash_1.default.findIndex(parent.components, tab => tab.components.some(comp => comp.key === component.key));
                path = `components[${tabIndex}].components`;
                break;
        }
        return path;
    }
    /* eslint-disable max-statements */
    onDrop(element, target, source, sibling) {
        var _a;
        if (!target) {
            return;
        }
        // If you try to drop within itself.
        if (element.contains(target)) {
            return;
        }
        const key = element.getAttribute('data-key');
        const type = element.getAttribute('data-type');
        const group = element.getAttribute('data-group');
        let info, isNew, path, index;
        if (key && group) {
            // This is a new component.
            info = this.getComponentInfo(key, group);
            if (!info && type) {
                info = this.getComponentInfo(type, group);
            }
            isNew = true;
        }
        else if (source.formioContainer) {
            index = lodash_1.default.findIndex(source.formioContainer, { key: element.formioComponent.component.key });
            if (index !== -1) {
                // Grab and remove the component from the source container.
                info = source.formioContainer.splice(lodash_1.default.findIndex(source.formioContainer, { key: element.formioComponent.component.key }), 1);
                // Since splice returns an array of one object, we need to destructure it.
                info = info[0];
            }
        }
        // If we haven't found the component, stop.
        if (!info) {
            return;
        }
        // Show an error if siblings are disabled for a component and such a component already exists.
        const compKey = (group === 'resource') ? `component-${key}` : key;
        const draggableComponent = ((_a = this.groups[group]) === null || _a === void 0 ? void 0 : _a.components[compKey]) || {};
        if (draggableComponent.disableSiblings || draggableComponent.uniqueComponent) {
            let isCompAlreadyExists = false;
            (0, formUtils_1.eachComponent)(this.webform.components, (component) => {
                if ((draggableComponent.disableSiblings && component.type === draggableComponent.schema.type) ||
                    (draggableComponent.uniqueComponent && component.component.key === draggableComponent.schema.key)) {
                    isCompAlreadyExists = true;
                    return;
                }
            }, true);
            if (isCompAlreadyExists) {
                this.webform.redraw();
                this.webform.setAlert('danger', this.t('builderUniqueError', { componentKeyOrTitle: lodash_1.default.get(draggableComponent, draggableComponent.uniqueComponent ? 'title' : 'key') }));
                return;
            }
        }
        if (target !== source) {
            // Ensure the key remains unique in its new container.
            builder_1.default.uniquify(this.findNamespaceRoot(target.formioComponent), info);
        }
        const parent = target.formioComponent;
        // Insert in the new container.
        if (target.formioContainer) {
            if (sibling) {
                if (!sibling.getAttribute('data-noattach')) {
                    index = lodash_1.default.findIndex(target.formioContainer, { key: lodash_1.default.get(sibling, 'formioComponent.component.key') });
                    index = (index === -1) ? 0 : index;
                }
                else {
                    index = sibling.getAttribute('data-position');
                }
                if (index !== -1) {
                    target.formioContainer.splice(index, 0, info);
                }
            }
            else {
                target.formioContainer.push(info);
            }
            path = this.getComponentsPath(info, parent.component);
            index = lodash_1.default.findIndex(lodash_1.default.get(parent.schema, path), { key: info.key });
            if (index === -1) {
                index = 0;
            }
        }
        if (parent && parent.addChildComponent) {
            parent.addChildComponent(info, element, target, source, sibling);
        }
        const componentInDataGrid = parent.type === 'datagrid';
        if (isNew
            && !this.options.noNewEdit
            && !info.noNewEdit
            && this.hasEditTabs(info.type)
            && !(this.options.design && info.type === 'reviewpage')) {
            this.editComponent(info, target, isNew, null, null, { inDataGrid: componentInDataGrid });
        }
        // Only rebuild the parts needing to be rebuilt.
        let rebuild;
        if (target !== source) {
            if (source.formioContainer && source.contains(target)) {
                rebuild = source.formioComponent.rebuild();
            }
            else if (target.contains(source)) {
                rebuild = target.formioComponent.rebuild();
            }
            else {
                if (source.formioContainer) {
                    rebuild = source.formioComponent.rebuild();
                }
                rebuild = target.formioComponent.rebuild();
            }
        }
        else {
            // If they are the same, only rebuild one.
            rebuild = target.formioComponent.rebuild();
        }
        if (!rebuild) {
            rebuild = Promise.resolve();
        }
        return rebuild.then(() => {
            this.emit('addComponent', info, parent, path, index, isNew && !this.options.noNewEdit && !info.noNewEdit);
            if (!isNew || this.options.noNewEdit || info.noNewEdit) {
                this.emit('change', this.form);
            }
        });
    }
    setForm(form) {
        var _a;
        if (!form.components) {
            form.components = [];
        }
        if (form && form.properties) {
            this.options.properties = form.properties;
        }
        let keyboardActionsEnabled = lodash_1.default.get(this.options, 'keyboardBuilder', false) || ((_a = this.options.properties) === null || _a === void 0 ? void 0 : _a.keyboardBuilder);
        if (typeof keyboardActionsEnabled === 'string') {
            keyboardActionsEnabled = keyboardActionsEnabled === 'true';
        }
        this.keyboardActionsEnabled = keyboardActionsEnabled;
        const { display, noAddSubmitButton, noDefaultSubmitButton } = this.options;
        const { _id, components } = form;
        const isSubmitButton = ({ type, action }) => type === 'button' && (action === 'submit' || !action);
        const hasSubmitButton = components.some(isSubmitButton);
        // Add submit button if form display was switched from wizard
        // Don't add if there is noAddSubmitButton flag passed, or the form has id, or the form has a submit button already
        const shouldAddSubmitButton = (display === 'wizard' && !hasSubmitButton) ||
            (!noAddSubmitButton && !_id && !hasSubmitButton);
        // Ensure there is at least a submit button.
        if (!noDefaultSubmitButton && shouldAddSubmitButton) {
            form.components.push({
                type: 'button',
                label: 'Submit',
                key: 'submit',
                size: 'md',
                block: false,
                action: 'submit',
                disableOnInvalid: true,
                theme: 'primary'
            });
        }
        if (this.webform) {
            const shouldRebuild = !this.webform.form.components ||
                (form.components.length !== this.webform.form.components.length);
            return this.webform.setForm(form, { keepAsReference: true }).then(() => {
                if (this.refs.form) {
                    this.builderHeight = this.refs.form.offsetHeight;
                }
                if (!shouldRebuild) {
                    return this.form;
                }
                return this.rebuild().then(() => this.form);
            });
        }
        return Promise.resolve(form);
    }
    populateCaptchaSettings(form) {
        //populate isEnabled for captcha form settings
        let isCaptchaEnabled = false;
        if (this.form.components) {
            (0, formUtils_1.eachComponent)(form.components, component => {
                if (isCaptchaEnabled) {
                    return;
                }
                if (component.type === 'captcha') {
                    isCaptchaEnabled = true;
                    return false;
                }
            });
            if (isCaptchaEnabled) {
                lodash_1.default.set(form, 'settings.captcha.isEnabled', true);
            }
            else if (lodash_1.default.get(form, 'settings.captcha.isEnabled')) {
                lodash_1.default.set(form, 'settings.captcha.isEnabled', false);
            }
        }
    }
    removeComponent(component, parent, original, componentInstance) {
        if (!parent) {
            return;
        }
        let remove = true;
        const removingComponentsGroup = !component.skipRemoveConfirm &&
            ((Array.isArray(component.components) && component.components.length) ||
                (Array.isArray(component.rows) && component.rows.length) ||
                (Array.isArray(component.columns) && component.columns.length));
        if (this.options.alwaysConfirmComponentRemoval || removingComponentsGroup) {
            const message = removingComponentsGroup ? 'Removing this component will also remove all of its children. Are you sure you want to do this?'
                : 'Are you sure you want to remove this component?';
            remove = window.confirm(this.t(message));
        }
        if (!original) {
            original = parent.formioContainer.find((comp) => comp.id === component.id);
        }
        const index = parent.formioContainer ? parent.formioContainer.indexOf(original) : 0;
        if (remove && index !== -1) {
            const path = this.getComponentsPath(component, parent.formioComponent.component);
            if (parent.formioContainer) {
                parent.formioContainer.splice(index, 1);
            }
            else if (parent.formioComponent && parent.formioComponent.removeChildComponent) {
                parent.formioComponent.removeChildComponent(component);
            }
            if (component.input && componentInstance && parent.formioComponent) {
                const parentDefaultValue = lodash_1.default.get(parent.formioComponent, 'component.defaultValue', null);
                if (Array.isArray(parentDefaultValue)) {
                    parentDefaultValue.forEach(v => lodash_1.default.unset(v, componentInstance.key));
                }
                else if (typeof parentDefaultValue === 'object') {
                    lodash_1.default.unset(parentDefaultValue, componentInstance.key);
                }
            }
            const rebuild = parent.formioComponent.rebuild() || Promise.resolve();
            rebuild.then(() => {
                this.emit('removeComponent', component, parent.formioComponent.schema, path, index);
                this.emit('change', this.form);
            });
        }
        return remove;
    }
    replaceDoubleQuotes(data, fieldsToRemoveDoubleQuotes = []) {
        if (data) {
            fieldsToRemoveDoubleQuotes.forEach((key) => {
                if (data[key]) {
                    data[key] = data[key].replace(/"/g, "'");
                }
            });
            return data;
        }
    }
    updateComponent(component, changed) {
        const sanitizeConfig = lodash_1.default.get(this.webform, 'form.settings.sanitizeConfig') || lodash_1.default.get(this.webform, 'form.globalSettings.sanitizeConfig');
        // Update the preview.
        if (this.preview) {
            this.preview.form = {
                components: [lodash_1.default.omit(Object.assign({}, component), [
                        'hidden',
                        'conditional',
                        'calculateValue',
                        'logic',
                        'autofocus',
                        'customConditional',
                    ])],
                config: this.options.formConfig || {},
                sanitizeConfig,
            };
            const fieldsToRemoveDoubleQuotes = ['label', 'tooltip'];
            this.preview.form.components.forEach(component => this.replaceDoubleQuotes(component, fieldsToRemoveDoubleQuotes));
            const previewElement = this.componentEdit.querySelector(`[${this._referenceAttributeName}="preview"]`);
            if (previewElement) {
                this.setContent(previewElement, this.preview.render(), null, sanitizeConfig);
                this.preview.attach(previewElement);
            }
        }
        // Change the "default value" field to be reflective of this component.
        const defaultValueComponent = (0, formUtils_1.getComponent)(this.editForm.components, 'defaultValue', true);
        if (defaultValueComponent && component.type !== 'hidden') {
            const defaultChanged = changed && ((changed.component && changed.component.key === 'defaultValue')
                || (changed.instance && defaultValueComponent.hasComponent && defaultValueComponent.hasComponent(changed.instance)));
            if (!defaultChanged) {
                lodash_1.default.assign(defaultValueComponent.component, lodash_1.default.omit(Object.assign({}, component), [
                    'key',
                    'label',
                    'labelPosition',
                    'labelMargin',
                    'labelWidth',
                    'placeholder',
                    'tooltip',
                    'hidden',
                    'autofocus',
                    'validate',
                    'disabled',
                    'defaultValue',
                    'customDefaultValue',
                    'calculateValue',
                    'conditional',
                    'customConditional',
                    'id',
                    'logic',
                    'fields.day.required',
                    'fields.month.required',
                    'fields.year.required',
                ]));
                const parentComponent = defaultValueComponent.parent;
                let tabIndex = -1;
                let index = -1;
                parentComponent.tabs.some((tab, tIndex) => {
                    tab.some((comp, compIndex) => {
                        if (comp.id === defaultValueComponent.id) {
                            tabIndex = tIndex;
                            index = compIndex;
                            return true;
                        }
                        return false;
                    });
                });
                if (tabIndex !== -1 && index !== -1 && changed && !lodash_1.default.isNil(changed.value)) {
                    const sibling = parentComponent.tabs[tabIndex][index + 1];
                    parentComponent.removeComponent(defaultValueComponent);
                    const newComp = parentComponent.addComponent(defaultValueComponent.component, defaultValueComponent.data, sibling);
                    lodash_1.default.pull(newComp.validators, 'required');
                    parentComponent.tabs[tabIndex].splice(index, 1, newComp);
                    newComp.checkValidity = () => true;
                    newComp.build(defaultValueComponent.element);
                    if (this.preview && !this.preview.defaultChanged) {
                        const defaultValue = lodash_1.default.get(this.preview._data, this.editForm._data.key);
                        if (lodash_1.default.isObject(defaultValue) && !lodash_1.default.isArray(defaultValue)) {
                            this.editForm._data.defaultValue = defaultValue;
                        }
                    }
                }
            }
            else {
                let dataPath = changed.instance._data.key;
                const path = (0, utils_1.getArrayFromComponentPath)(changed.instance.path);
                path.shift();
                if (path.length) {
                    path.unshift(component.key);
                    dataPath = (0, utils_1.getStringFromComponentPath)(path);
                }
                this.preview.defaultChanged = true;
                lodash_1.default.set(this.preview._data, dataPath, changed.value);
                lodash_1.default.set(this.webform._data, dataPath, changed.value);
            }
        }
        // Called when we update a component.
        this.emit('updateComponent', component);
    }
    findRepeatablePaths() {
        const repeatablePaths = [];
        const keys = new Map();
        (0, formUtils_1.eachComponent)(this.form.components, (comp, path, components, parent, paths) => {
            if (keys.has(paths.dataPath)) {
                repeatablePaths.push(paths.dataPath);
            }
            else {
                keys.set(paths.dataPath, true);
            }
        }, true);
        return repeatablePaths;
    }
    highlightInvalidComponents() {
        const repeatablePaths = this.findRepeatablePaths();
        let hasInvalidComponents = false;
        this.webform.everyComponent((comp) => {
            const path = comp.path;
            if (repeatablePaths.includes(path)) {
                comp.setCustomValidity(this.t('apiKey', { key: comp.key }));
                hasInvalidComponents = true;
            }
        });
        this.emit('builderFormValidityChange', hasInvalidComponents);
    }
    /**
     * Called when a new component is saved.
     * @param {Component} component - The component instance to save.
     * @param {Component} parent - The parent component.
     * @param {boolean} isNew - If this is a new component.
     * @param {Component} original - The original component.
     * @returns {boolean} - If the component was saved.
     */
    saveComponent(component, parent, isNew, original) {
        this.editForm.detach();
        const parentContainer = parent ? parent.formioContainer : this.container;
        const parentComponent = parent ? parent.formioComponent : this;
        this.dialog.close();
        const path = parentContainer ? this.getComponentsPath(component, parentComponent.component) : '';
        if (!original) {
            original = parent.formioContainer.find((comp) => comp.id === component.id);
        }
        const index = parentContainer ? parentContainer.indexOf(original) : 0;
        if (index !== -1) {
            let submissionData = this.editForm.submission.data;
            submissionData = submissionData.componentJson || submissionData;
            const fieldsToRemoveDoubleQuotes = ['label', 'tooltip'];
            this.replaceDoubleQuotes(submissionData, fieldsToRemoveDoubleQuotes);
            this.hook('beforeSaveComponentSettings', submissionData);
            let comp = null;
            parentComponent.getComponents().forEach((component) => {
                if (component.component.key === original.key) {
                    comp = component;
                }
            });
            const originalComp = comp === null || comp === void 0 ? void 0 : comp.component;
            const originalComponentSchema = comp === null || comp === void 0 ? void 0 : comp.schema;
            const isParentSaveChildMethod = this.isParentSaveChildMethod(parent.formioComponent);
            if (parentContainer && !isParentSaveChildMethod) {
                parentContainer[index] = submissionData;
                if (comp) {
                    comp.component = submissionData;
                }
            }
            else if (isParentSaveChildMethod) {
                parent.formioComponent.saveChildComponent(submissionData);
            }
            const rebuild = parentComponent.rebuild() || Promise.resolve();
            return rebuild.then(() => {
                parentComponent.resetValue();
                const schema = parentContainer ? parentContainer[index] : (comp ? comp.schema : []);
                this.emitSaveComponentEvent(schema, originalComp, parentComponent.schema, path, index, isNew, originalComponentSchema);
                this.emit('change', this.form);
                this.highlightInvalidComponents();
                if (this.isComponentCreated) {
                    const component = parent.formioComponent.components[0];
                    this.moveComponent(component);
                    this.isComponentCreated = false;
                }
            });
        }
        this.highlightInvalidComponents();
        return Promise.resolve();
    }
    emitSaveComponentEvent(schema, originalComp, parentComponentSchema, path, index, isNew, originalComponentSchema) {
        this.emit('saveComponent', schema, originalComp, parentComponentSchema, path, index, isNew, originalComponentSchema);
    }
    attachEditComponentControls(component, parent, isNew, original, ComponentClass) {
        const cancelButtons = this.componentEdit.querySelectorAll(`[${this._referenceAttributeName}="cancelButton"]`);
        cancelButtons.forEach((cancelButton) => {
            this.editForm.addEventListener(cancelButton, 'click', (event) => {
                event.preventDefault();
                this.editForm.detach();
                this.emit('cancelComponent', component);
                this.dialog.close();
                this.highlightInvalidComponents();
            });
        });
        const removeButtons = this.componentEdit.querySelectorAll(`[${this._referenceAttributeName}="removeButton"]`);
        removeButtons.forEach((removeButton) => {
            this.editForm.addEventListener(removeButton, 'click', (event) => {
                event.preventDefault();
                // Since we are already removing the component, don't trigger another remove.
                this.saved = true;
                this.editForm.detach();
                this.removeComponent(component, parent, original);
                this.dialog.close();
                this.highlightInvalidComponents();
            });
        });
        const saveButtons = this.componentEdit.querySelectorAll(`[${this._referenceAttributeName}="saveButton"]`);
        saveButtons.forEach((saveButton) => {
            this.editForm.addEventListener(saveButton, 'click', (event) => {
                event.preventDefault();
                const errors = this.editForm.validate(this.editForm.data, {
                    dirty: true
                });
                if (errors.length) {
                    this.editForm.setPristine(false);
                    this.editForm.showErrors(errors);
                    return false;
                }
                this.saved = true;
                this.saveComponent(component, parent, isNew, original);
            });
        });
        const previewButtons = this.componentEdit.querySelectorAll(`[${this._referenceAttributeName}="previewButton"]`);
        previewButtons.forEach((previewButton) => {
            this.editForm.addEventListener(previewButton, 'click', (event) => {
                var _a;
                event.preventDefault();
                this.showPreview = !this.showPreview;
                this.editForm.detach();
                this.setContent(this.componentEdit, this.renderTemplate('builderEditForm', {
                    componentInfo: ComponentClass.builderInfo,
                    editForm: this.editForm.render(),
                    preview: this.preview ? this.preview.render() : false,
                    showPreview: this.showPreview,
                    helplinks: this.helplinks,
                }));
                this.editForm.attach(this.componentEdit.querySelector(`[${this._referenceAttributeName}="editForm"]`));
                const editFormData = (_a = this.editForm.submission) === null || _a === void 0 ? void 0 : _a.data;
                this.updateComponent((editFormData === null || editFormData === void 0 ? void 0 : editFormData.componentJson) || editFormData || component);
                this.attachEditComponentControls(component, parent, isNew, original, ComponentClass);
            });
        });
    }
    editComponent(component, parent, isNew, isJsonEdit, original, flags = {}) {
        var _a, _b;
        if (!component.key) {
            return;
        }
        this.saved = false;
        const componentCopy = (0, utils_1.fastCloneDeep)(component);
        let ComponentClass = Components_1.default.components[componentCopy.type];
        const isCustom = ComponentClass === undefined;
        isJsonEdit = isJsonEdit || isCustom;
        ComponentClass = isCustom ? Components_1.default.components.unknown : ComponentClass;
        // Make sure we only have one dialog open at a time.
        if (this.dialog) {
            this.dialog.close();
            this.highlightInvalidComponents();
        }
        // This is the render step.
        const editFormOptions = lodash_1.default.clone(lodash_1.default.get(this, 'options.editForm', {}));
        if (this.editForm) {
            this.editForm.destroy();
        }
        // Allow editForm overrides per component.
        const overrides = lodash_1.default.get(this.options, `editForm.${componentCopy.type}`, {});
        // Pass along the form being edited.
        editFormOptions.editForm = this.form;
        editFormOptions.editComponent = component;
        editFormOptions.flags = flags;
        this.hook('editComponentParentInstance', editFormOptions, parent);
        this.editForm = new Webform_1.default(Object.assign(Object.assign(Object.assign(Object.assign({}, lodash_1.default.omit(this.options, ['hooks', 'builder', 'events', 'attachMode', 'skipInit'])), { language: this.options.language }), editFormOptions), { evalContext: Object.assign(Object.assign({}, ((editFormOptions === null || editFormOptions === void 0 ? void 0 : editFormOptions.evalContext) || ((_a = this.options) === null || _a === void 0 ? void 0 : _a.evalContext) || {})), { buildingForm: this.form }) }));
        this.hook('editFormProperties', parent);
        this.editForm.form = (isJsonEdit && !isCustom) ? {
            components: [
                {
                    type: 'textarea',
                    as: 'json',
                    editor: 'ace',
                    weight: 10,
                    input: true,
                    key: 'componentJson',
                    label: 'Component JSON',
                    tooltip: 'Edit the JSON for this component.'
                },
                {
                    type: 'checkbox',
                    key: 'showFullSchema',
                    label: 'Full Schema'
                }
            ]
        } : ComponentClass.editForm(lodash_1.default.cloneDeep(overrides));
        const instanceOptions = {
            inFormBuilder: true,
        };
        this.hook('instanceOptionsPreview', instanceOptions);
        const instance = new ComponentClass(componentCopy, instanceOptions);
        const schema = this.hook('builderComponentSchema', component, instance);
        this.editForm.submission = isJsonEdit ? {
            data: {
                componentJson: schema,
                showFullSchema: this.options.showFullJsonSchema
            },
        } : {
            data: instance.component,
        };
        if (this.preview) {
            this.preview.destroy();
        }
        if (!ComponentClass.builderInfo.hasOwnProperty('preview') || ComponentClass.builderInfo.preview) {
            this.preview = new Webform_1.default(lodash_1.default.omit(Object.assign(Object.assign({}, this.options), { preview: true }), [
                'hooks',
                'builder',
                'events',
                'attachMode',
                'calculateValue'
            ]));
            this.hook('previewFormSettitngs', schema, isJsonEdit);
        }
        this.showPreview = (_b = ComponentClass.builderInfo.showPreview) !== null && _b !== void 0 ? _b : true;
        this.componentEdit = this.ce('div', { 'class': 'component-edit-container' });
        this.setContent(this.componentEdit, this.renderTemplate('builderEditForm', {
            componentInfo: ComponentClass.builderInfo,
            editForm: this.editForm.render(),
            preview: this.preview ? this.preview.render() : false,
            showPreview: this.showPreview,
            helplinks: this.helplinks
        }));
        this.dialog = this.createModal(this.componentEdit, lodash_1.default.get(this.options, 'dialogAttr', {}));
        // This is the attach step.
        this.editForm.attach(this.componentEdit.querySelector(`[${this._referenceAttributeName}="editForm"]`));
        this.hook('editFormWrapper');
        this.updateComponent(componentCopy);
        this.editForm.on('change', (event) => {
            if (event.changed) {
                if (event.changed.component && event.changed.component.key === 'showFullSchema') {
                    const { value } = event.changed;
                    this.editForm.submission = {
                        data: {
                            componentJson: value ? instance.component : component,
                            showFullSchema: value
                        },
                    };
                    return;
                }
                // See if this is a manually modified key. Treat custom component keys as manually modified
                if ((event.changed.component && (event.changed.component.key === 'key')) || isJsonEdit) {
                    componentCopy.keyModified = true;
                }
                let isComponentLabelChanged = false;
                if (event.changed.instance) {
                    isComponentLabelChanged = ['label', 'title'].includes(event.changed.instance.path);
                }
                else if (event.changed.component) {
                    isComponentLabelChanged = ['label', 'title'].includes(event.changed.component.key);
                }
                if (isComponentLabelChanged) {
                    // Ensure this component has a key.
                    if (isNew) {
                        if (!event.data.keyModified) {
                            this.editForm.everyComponent(component => {
                                if (component.key === 'key' && component.parent.component.key === 'tabs') {
                                    component.setValue(this.updateComponentKey(event.data));
                                    return false;
                                }
                            });
                        }
                        if (this.form) {
                            let formComponents = this.findNamespaceRoot(parent.formioComponent);
                            // excluding component which key uniqueness is to be checked to prevent the comparing of the same keys
                            formComponents = formComponents.filter(comp => editFormOptions.editComponent.id !== comp.id);
                            // Set a unique key for this component.
                            builder_1.default.uniquify(formComponents, event.data);
                        }
                    }
                }
                // If the edit form has any nested form inside, we get a partial data (nested form's data) in the
                // event.data property
                let editFormData;
                if (event.changed.instance && event.changed.instance.root && event.changed.instance.root.id !== this.editForm.id) {
                    editFormData = this.editForm.data;
                }
                // Update the component.
                this.updateComponent(event.data.componentJson || editFormData || event.data, event.changed);
            }
        });
        this.attachEditComponentControls(component, parent, isNew, original, ComponentClass);
        const dialogClose = () => {
            this.editForm.destroy(true);
            if (this.preview) {
                this.preview.destroy(true);
                this.preview = null;
            }
            if (isNew && !this.saved) {
                this.removeComponent(component, parent, original);
                this.highlightInvalidComponents();
            }
            // Clean up.
            this.removeEventListener(this.dialog, 'close', dialogClose);
            this.dialog = null;
        };
        this.addEventListener(this.dialog, 'close', dialogClose);
        // Called when we edit a component.
        this.emit('editComponent', component);
    }
    updateComponentKey(data) {
        return lodash_1.default.camelCase(data.title ||
            data.label ||
            data.placeholder ||
            data.type).replace(/^[0-9]*/, '');
    }
    moveComponent(component) {
        var _a;
        if (this.selectedComponent) {
            const prevSelected = this.selectedComponent;
            (_a = prevSelected.element) === null || _a === void 0 ? void 0 : _a.classList.remove('builder-component-selected');
            this.removeEventListener(document, 'keydown');
        }
        component.element.focus();
        component.element.classList.add('builder-component-selected');
        this.selectedComponent = component;
        this.addEventListener(document, 'keydown', this.moveHandler.bind(this));
    }
    updateComponentPlacement(direction) {
        const component = this.selectedComponent;
        let index, info;
        const step = direction ? -1 : 1;
        if (component) {
            const element = component.element;
            const sibling = direction ? element.previousElementSibling : element.nextElementSibling;
            const source = element.parentNode;
            const containerLength = source.formioContainer.length;
            if (containerLength && containerLength <= 1) {
                return;
            }
            if (source.formioContainer) {
                index = lodash_1.default.findIndex(source.formioContainer, { key: element.formioComponent.component.key });
                if (index !== -1) {
                    info = source.formioContainer.splice(lodash_1.default.findIndex(source.formioContainer, { key: element.formioComponent.component.key }), 1);
                    info = info[0];
                    source.removeChild(element);
                }
            }
            const len = source.formioComponent.components.length;
            index = (index === -1) ? 0 : index + step;
            if (index === -1) {
                source.formioContainer.push(info);
                source.appendChild(element);
            }
            else if (index === len) {
                const key = source.formioContainer[0].key;
                index = lodash_1.default.findIndex(source.formioComponent.components, { key: key });
                const firstElement = source.formioComponent.components[index].element;
                source.formioContainer.splice(0, 0, info);
                source.insertBefore(element, firstElement);
            }
            else if (index !== -1) {
                source.formioContainer.splice(index, 0, info);
                direction
                    ? source.insertBefore(element, sibling)
                    : source.insertBefore(element, sibling.nextElementSibling);
            }
            element.focus();
        }
    }
    stopMoving(comp) {
        const parent = comp.element.parentNode;
        this.removeEventListener(document, 'keydown');
        parent.formioComponent.rebuild();
        this.selectedComponent = null;
    }
    addNewComponent(element) {
        var _a;
        const source = document.querySelector('.formio-builder-form');
        const key = element.getAttribute('data-key');
        const group = element.getAttribute('data-group');
        const isNew = true;
        let info;
        if (key && group) {
            info = this.getComponentInfo(key, group);
        }
        if (isNew && !this.options.noNewEdit && !info.noNewEdit) {
            builder_1.default.uniquify(this.findNamespaceRoot(source.formioComponent), info);
            this.editComponent(info, source, isNew, null, null);
        }
        const firstComponent = (_a = source.formioComponent.components[0]) === null || _a === void 0 ? void 0 : _a.element;
        if (firstComponent) {
            source.formioContainer.splice(0, 0, info);
        }
        else {
            source.formioContainer.push(info);
        }
        source.formioComponent.rebuild().then(() => {
            this.isComponentCreated = true;
        });
    }
    /**
     * Creates copy of component schema and stores it under sessionStorage.
     * @param {Component} component - The component to copy.
     * @returns {void}
     */
    copyComponent(component) {
        if (!window.sessionStorage) {
            return console.warn(this.t('sessionStorageSupportError'));
        }
        this.addClass(this.refs.form, 'builder-paste-mode');
        window.sessionStorage.setItem('formio.clipboard', JSON.stringify(component.schema));
    }
    /**
     * Paste copied component after the current component.
     * @param {Component} component - The component to paste after.
     * @returns {void}
     */
    pasteComponent(component) {
        if (!window.sessionStorage) {
            return console.warn(this.t('sessionStorageSupportError'));
        }
        this.removeClass(this.refs.form, 'builder-paste-mode');
        if (window.sessionStorage) {
            const data = window.sessionStorage.getItem('formio.clipboard');
            if (data) {
                const schema = JSON.parse(data);
                const parent = this.getParentElement(component.element);
                if (parent) {
                    builder_1.default.uniquify(this.findNamespaceRoot(parent.formioComponent), schema);
                    let path = '';
                    let index = 0;
                    const isParentSaveChildMethod = this.isParentSaveChildMethod(parent.formioComponent);
                    if (parent.formioContainer && !isParentSaveChildMethod) {
                        index = parent.formioContainer.indexOf(component.component);
                        path = this.getComponentsPath(schema, parent.formioComponent.component);
                        parent.formioContainer.splice(index + 1, 0, schema);
                    }
                    else if (isParentSaveChildMethod) {
                        parent.formioComponent.saveChildComponent(schema, false);
                    }
                    parent.formioComponent.rebuild();
                    this.emitSaveComponentEvent(schema, schema, parent.formioComponent.component, path, (index + 1), true, schema);
                }
                this.emit('change', this.form);
            }
        }
    }
    isParentSaveChildMethod(parentComp) {
        return !!(parentComp && parentComp.saveChildComponent);
    }
    getParentElement(element) {
        let container = element;
        do {
            container = container.parentNode;
        } while (container && !container.formioComponent);
        return container;
    }
    addBuilderComponentInfo(component) {
        if (!component || !component.group || !this.groups[component.group]) {
            return;
        }
        component = lodash_1.default.clone(component);
        const groupInfo = this.groups[component.group];
        if (!groupInfo.components.hasOwnProperty(component.key)) {
            groupInfo.components[component.key] = component;
        }
        return component;
    }
    init() {
        if (this.webform) {
            this.webform.init();
        }
        return super.init();
    }
    clear() {
        if (this.webform.initialized) {
            this.webform.clear();
        }
    }
    destroy(all = false) {
        if (this.webform.initialized) {
            this.webform.destroy(all);
        }
        super.destroy(all);
    }
    addBuilderGroup(name, group) {
        if (!this.groups[name]) {
            this.groups[name] = group;
            this.groupOrder.push(name);
            this.triggerRedraw();
        }
        else {
            this.updateBuilderGroup(name, group);
        }
    }
    updateBuilderGroup(name, group) {
        if (this.groups[name]) {
            this.groups[name] = group;
            this.triggerRedraw();
        }
    }
    generateKey(info) {
        return info.key || lodash_1.default.camelCase(info.title ||
            info.label ||
            info.placeholder ||
            info.type);
    }
    hasEditTabs(type) {
        // If the component type does not exist then it has no edit tabs
        if (!Components_1.default.components[type === 'custom' ? 'unknown' : type]) {
            return false;
        }
        const editTabs = (0, formUtils_1.getComponent)(Components_1.default.components[type === 'custom' ? 'unknown' : type].editForm().components, 'tabs', true).components;
        const hiddenEditTabs = lodash_1.default.filter(lodash_1.default.get(this.options, `editForm.${type}`, []), 'ignore');
        return lodash_1.default.intersectionBy(editTabs, hiddenEditTabs, 'key').length !== editTabs.length;
    }
}
exports.default = WebformBuilder;
