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
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter3_1 = require("eventemitter3");
const utils = __importStar(require("./utils/utils"));
class EventEmitter extends eventemitter3_1.EventEmitter {
    constructor(conf = {}) {
        const { loadLimit = 1000, eventsSafeInterval = 300 } = conf;
        super();
        this.onAny = (fn) => {
            this.on('any', fn);
        };
        this.offAny = (fn) => {
            this.off('any', fn);
        };
        const overloadHandler = () => {
            console.warn(`There were more than ${loadLimit} events emitted in ${eventsSafeInterval} ms. It might be caused by events' infinite loop`, this.id);
        };
        const dispatch = utils.observeOverload(overloadHandler, {
            limit: loadLimit,
            delay: eventsSafeInterval
        });
        this.emit = (...args) => {
            super.emit(...args);
            super.emit('any', ...args);
            dispatch();
        };
    }
}
exports.default = EventEmitter;
