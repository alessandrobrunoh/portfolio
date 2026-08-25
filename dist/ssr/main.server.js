import { createRequire } from "node:module";
import { BehaviorSubject, Observable, Subject, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { RouterOutlet } from "@angular/router";
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var __require = /* #__PURE__ */ (() => createRequire(import.meta.url))();
//#endregion
//#region node_modules/@angular/core/fesm2022/_effect-chunk.mjs
/**
* @license Angular v22.1.3
* (c) 2010-2026 Google LLC. https://angular.dev/
* License: MIT
*/
var activeConsumer = null;
var epoch = 1;
var SIGNAL = /* @__PURE__ */ Symbol("SIGNAL");
function setActiveConsumer(consumer) {
	const prev = activeConsumer;
	activeConsumer = consumer;
	return prev;
}
function getActiveConsumer() {
	return activeConsumer;
}
var REACTIVE_NODE = {
	version: 0,
	lastCleanEpoch: 0,
	dirty: false,
	producers: void 0,
	producersTail: void 0,
	consumers: void 0,
	consumersTail: void 0,
	recomputing: false,
	consumerAllowSignalWrites: false,
	consumerIsAlwaysLive: false,
	kind: "unknown",
	producerMustRecompute: () => false,
	producerRecomputeValue: () => {},
	consumerMarkedDirty: () => {},
	consumerOnSignalRead: () => {}
};
function producerUpdateValueVersion(node) {
	if (consumerIsLive(node) && !node.dirty) return;
	if (!node.dirty && node.lastCleanEpoch === epoch) return;
	if (!node.producerMustRecompute(node) && !consumerPollProducersForChange(node)) {
		producerMarkClean(node);
		return;
	}
	node.producerRecomputeValue(node);
	producerMarkClean(node);
}
function producerMarkClean(node) {
	node.dirty = false;
	node.lastCleanEpoch = epoch;
}
function consumerBeforeComputation(node) {
	if (node) resetConsumerBeforeComputation(node);
	return setActiveConsumer(node);
}
function resetConsumerBeforeComputation(node) {
	if (node.producersTail?.knownValidAtEpoch === epoch) {
		let producer = node.producers;
		while (producer !== void 0) {
			producer.knownValidAtEpoch = null;
			producer = producer.nextProducer;
		}
	}
	node.producersTail = void 0;
	node.recomputing = true;
}
function consumerAfterComputation(node, prevConsumer) {
	setActiveConsumer(prevConsumer);
	if (node) finalizeConsumerAfterComputation(node);
}
function finalizeConsumerAfterComputation(node) {
	node.recomputing = false;
	const producersTail = node.producersTail;
	let toRemove = producersTail !== void 0 ? producersTail.nextProducer : node.producers;
	if (toRemove !== void 0) {
		if (consumerIsLive(node)) do
			toRemove = producerRemoveLiveConsumerLink(toRemove);
		while (toRemove !== void 0);
		if (producersTail !== void 0) producersTail.nextProducer = void 0;
		else node.producers = void 0;
	}
}
function consumerPollProducersForChange(node) {
	for (let link = node.producers; link !== void 0; link = link.nextProducer) {
		const producer = link.producer;
		const seenVersion = link.lastReadVersion;
		if (seenVersion !== producer.version) return true;
		producerUpdateValueVersion(producer);
		if (seenVersion !== producer.version) return true;
	}
	return false;
}
function consumerDestroy(node) {
	if (consumerIsLive(node)) {
		let link = node.producers;
		while (link !== void 0) link = producerRemoveLiveConsumerLink(link);
	}
	node.producers = void 0;
	node.producersTail = void 0;
	node.consumers = void 0;
	node.consumersTail = void 0;
}
function producerRemoveLiveConsumerLink(link) {
	const producer = link.producer;
	const nextProducer = link.nextProducer;
	const nextConsumer = link.nextConsumer;
	const prevConsumer = link.prevConsumer;
	link.nextConsumer = void 0;
	link.prevConsumer = void 0;
	if (nextConsumer !== void 0) nextConsumer.prevConsumer = prevConsumer;
	else producer.consumersTail = prevConsumer;
	if (prevConsumer !== void 0) prevConsumer.nextConsumer = nextConsumer;
	else {
		producer.consumers = nextConsumer;
		if (!consumerIsLive(producer)) {
			let producerLink = producer.producers;
			while (producerLink !== void 0) producerLink = producerRemoveLiveConsumerLink(producerLink);
		}
	}
	return nextProducer;
}
function consumerIsLive(node) {
	return node.consumerIsAlwaysLive || node.consumers !== void 0;
}
//#endregion
//#region node_modules/@angular/core/fesm2022/_not_found-chunk.mjs
/**
* @license Angular v22.1.3
* (c) 2010-2026 Google LLC. https://angular.dev/
* License: MIT
*/
var _currentInjector = void 0;
function getCurrentInjector() {
	return _currentInjector;
}
function setCurrentInjector(injector) {
	const former = _currentInjector;
	_currentInjector = injector;
	return former;
}
var NOT_FOUND$1 = /*#__PURE__*/ Symbol("NotFound");
function isNotFound(e) {
	return e === NOT_FOUND$1 || e?.name === "ɵNotFound";
}
//#endregion
//#region node_modules/@angular/core/fesm2022/_pending_tasks-chunk.mjs
/**
* @license Angular v22.1.3
* (c) 2010-2026 Google LLC. https://angular.dev/
* License: MIT
*/
var RuntimeError = class extends Error {
	code;
	constructor(code, message) {
		super(formatRuntimeError(code, message));
		this.code = code;
	}
};
function formatRuntimeErrorCode(code) {
	return `NG0${Math.abs(code)}`;
}
function formatRuntimeError(code, message) {
	return `${formatRuntimeErrorCode(code)}${message ? ": " + message : ""}`;
}
function getClosureSafeProperty(objWithPropertyToExtract) {
	for (let key in objWithPropertyToExtract) if (objWithPropertyToExtract[key] === getClosureSafeProperty) return key;
	throw Error("");
}
function concatStringsWithSpace(before, after) {
	if (!before) return after || "";
	if (!after) return before;
	return `${before} ${after}`;
}
var __forward_ref__ = /*#__PURE__*/ getClosureSafeProperty({ __forward_ref__: getClosureSafeProperty });
function forwardRef(forwardRefFn) {
	forwardRefFn.__forward_ref__ = forwardRef;
	return forwardRefFn;
}
function resolveForwardRef(type) {
	return isForwardRef(type) ? type() : type;
}
function isForwardRef(fn) {
	return typeof fn === "function" && Object.hasOwn(fn, __forward_ref__) && fn.__forward_ref__ === forwardRef;
}
function ɵɵdefineInjectable(opts) {
	return {
		token: opts.token,
		providedIn: opts.providedIn || null,
		factory: opts.factory,
		value: void 0
	};
}
function getInjectableDef(type) {
	return getOwnDefinition(type, NG_PROV_DEF);
}
function getOwnDefinition(type, field) {
	return Object.hasOwn(type, field) && type[field] || null;
}
function getInheritedInjectableDef(type) {
	const def = type?.[NG_PROV_DEF] ?? null;
	if (def) return def;
	else return null;
}
function getInjectorDef(type) {
	return type && Object.hasOwn(type, NG_INJ_DEF) ? type[NG_INJ_DEF] : null;
}
var NG_PROV_DEF = /*#__PURE__*/ getClosureSafeProperty({ ɵprov: getClosureSafeProperty });
var NG_INJ_DEF = /*#__PURE__*/ getClosureSafeProperty({ ɵinj: getClosureSafeProperty });
var InjectionToken = class {
	_desc;
	ngMetadataName = "InjectionToken";
	ɵprov;
	constructor(_desc, options) {
		this._desc = _desc;
		this.ɵprov = void 0;
		if (typeof options == "number") this.__NG_ELEMENT_ID__ = options;
		else if (options !== void 0) this.ɵprov = ɵɵdefineInjectable({
			token: this,
			providedIn: options.providedIn || "root",
			factory: options.factory
		});
	}
	get multi() {
		return this;
	}
	toString() {
		return `InjectionToken ${this._desc}`;
	}
};
function isEnvironmentProviders(value) {
	return value && !!value.ɵproviders;
}
var NG_COMP_DEF = /*#__PURE__*/ getClosureSafeProperty({ ɵcmp: getClosureSafeProperty });
var NG_DIR_DEF = /*#__PURE__*/ getClosureSafeProperty({ ɵdir: getClosureSafeProperty });
var NG_PIPE_DEF = /*#__PURE__*/ getClosureSafeProperty({ ɵpipe: getClosureSafeProperty });
var NG_FACTORY_DEF = /*#__PURE__*/ getClosureSafeProperty({ ɵfac: getClosureSafeProperty });
var NG_ELEMENT_ID = /*#__PURE__*/ getClosureSafeProperty({ __NG_ELEMENT_ID__: getClosureSafeProperty });
var NG_ENV_ID = /*#__PURE__*/ getClosureSafeProperty({ __NG_ENV_ID__: getClosureSafeProperty });
function getComponentDef(type) {
	assertTypeDefined(type, "@Component");
	return type[NG_COMP_DEF] || null;
}
function getDirectiveDef(type) {
	assertTypeDefined(type, "@Directive");
	return type[NG_DIR_DEF] || null;
}
function getPipeDef(type) {
	assertTypeDefined(type, "@Pipe");
	return type[NG_PIPE_DEF] || null;
}
function assertTypeDefined(type, symbolType) {
	if (type == null) throw new RuntimeError(-919, false);
}
var NG_RUNTIME_ERROR_CODE = /*#__PURE__*/ getClosureSafeProperty({ "ngErrorCode": getClosureSafeProperty });
var NG_RUNTIME_ERROR_MESSAGE = /*#__PURE__*/ getClosureSafeProperty({ "ngErrorMessage": getClosureSafeProperty });
var NG_TOKEN_PATH = /*#__PURE__*/ getClosureSafeProperty({ "ngTokenPath": getClosureSafeProperty });
function cyclicDependencyError(token, path) {
	return createRuntimeError("", -200, path);
}
function throwProviderNotFoundError(token, injectorName) {
	throw new RuntimeError(-201, false);
}
function createRuntimeError(message, code, path) {
	const error = new RuntimeError(code, message);
	error[NG_RUNTIME_ERROR_CODE] = code;
	error[NG_RUNTIME_ERROR_MESSAGE] = message;
	if (path) error[NG_TOKEN_PATH] = path;
	return error;
}
function getRuntimeErrorCode(error) {
	return error[NG_RUNTIME_ERROR_CODE];
}
var _injectImplementation;
function getInjectImplementation() {
	return _injectImplementation;
}
function setInjectImplementation(impl) {
	const previous = _injectImplementation;
	_injectImplementation = impl;
	return previous;
}
function injectRootLimpMode(token, notFoundValue, flags) {
	const injectableDef = getInjectableDef(token);
	if (injectableDef && injectableDef.providedIn == "root") return injectableDef.value === void 0 ? injectableDef.value = injectableDef.factory() : injectableDef.value;
	if (flags & 8) return null;
	if (notFoundValue !== void 0) return notFoundValue;
	throwProviderNotFoundError(token, "");
}
var THROW_IF_NOT_FOUND = {};
var DI_DECORATOR_FLAG = "__NG_DI_FLAG__";
var RetrievingInjector = class {
	injector;
	constructor(injector) {
		this.injector = injector;
	}
	retrieve(token, options) {
		const flags = convertToBitFlags(options) || 0;
		try {
			return this.injector.get(token, flags & 8 ? null : THROW_IF_NOT_FOUND, flags);
		} catch (e) {
			if (isNotFound(e)) return e;
			throw e;
		}
	}
};
function injectInjectorOnly(token, flags = 0) {
	const currentInjector = getCurrentInjector();
	if (currentInjector === void 0) throw new RuntimeError(-203, false);
	else if (currentInjector === null) return injectRootLimpMode(token, void 0, flags);
	else {
		const options = convertToInjectOptions(flags);
		const value = currentInjector.retrieve(token, options);
		if (isNotFound(value)) {
			if (options.optional) return null;
			throw value;
		}
		return value;
	}
}
function ɵɵinject(token, flags = 0) {
	return (getInjectImplementation() || injectInjectorOnly)(resolveForwardRef(token), flags);
}
function inject(token, options) {
	return ɵɵinject(token, convertToBitFlags(options));
}
function convertToBitFlags(flags) {
	if (typeof flags === "undefined" || typeof flags === "number") return flags;
	return 0 | (flags.optional && 8) | (flags.host && 1) | (flags.self && 2) | (flags.skipSelf && 4);
}
function convertToInjectOptions(flags) {
	return {
		optional: !!(flags & 8),
		host: !!(flags & 1),
		self: !!(flags & 2),
		skipSelf: !!(flags & 4)
	};
}
function injectArgs(types) {
	const args = [];
	for (let i = 0; i < types.length; i++) {
		const arg = resolveForwardRef(types[i]);
		if (Array.isArray(arg)) {
			if (arg.length === 0) throw new RuntimeError(900, false);
			let type = void 0;
			let flags = 0;
			for (let j = 0; j < arg.length; j++) {
				const meta = arg[j];
				const flag = getInjectFlag(meta);
				if (typeof flag === "number") {
					if (flag === -1) type = meta.token;
					else flags |= flag;
				} else type = meta;
			}
			args.push(ɵɵinject(type, flags));
		} else args.push(ɵɵinject(arg));
	}
	return args;
}
function getInjectFlag(token) {
	return token[DI_DECORATOR_FLAG];
}
function getFactoryDef(type, throwNotFound) {
	return Object.hasOwn(type, NG_FACTORY_DEF) ? type[NG_FACTORY_DEF] : null;
}
function deepForEach(input, fn) {
	input.forEach((value) => Array.isArray(value) ? deepForEach(value, fn) : fn(value));
}
function removeFromArray(arr, index) {
	if (index >= arr.length - 1) return arr.pop();
	else return arr.splice(index, 1)[0];
}
var EMPTY_OBJ = {};
var EMPTY_ARRAY = [];
var ENVIRONMENT_INITIALIZER = /*#__PURE__*/ new InjectionToken("");
var INJECTOR$1 = /*#__PURE__*/ new InjectionToken("", -1);
var INJECTOR_DEF_TYPES = /*#__PURE__*/ new InjectionToken("");
var NullInjector = class {
	get(token, notFoundValue = THROW_IF_NOT_FOUND) {
		if (notFoundValue === THROW_IF_NOT_FOUND) {
			const error = createRuntimeError("", -201);
			error.name = "ɵNotFound";
			throw error;
		}
		return notFoundValue;
	}
};
function makeEnvironmentProviders(providers) {
	return { ɵproviders: providers };
}
function importProvidersFrom(...sources) {
	return {
		ɵproviders: internalImportProvidersFrom(true, sources),
		ɵfromNgModule: true
	};
}
function internalImportProvidersFrom(checkForStandaloneCmp, ...sources) {
	const providersOut = [];
	const dedup = /* @__PURE__ */ new Set();
	let injectorTypesWithProviders;
	const collectProviders = (provider) => {
		providersOut.push(provider);
	};
	deepForEach(sources, (source) => {
		const internalSource = source;
		if (walkProviderTree(internalSource, collectProviders, [], dedup)) {
			injectorTypesWithProviders ||= [];
			injectorTypesWithProviders.push(internalSource);
		}
	});
	if (injectorTypesWithProviders !== void 0) processInjectorTypesWithProviders(injectorTypesWithProviders, collectProviders);
	return providersOut;
}
function processInjectorTypesWithProviders(typesWithProviders, visitor) {
	for (let i = 0; i < typesWithProviders.length; i++) {
		const { ngModule, providers } = typesWithProviders[i];
		deepForEachProvider(providers, (provider) => {
			visitor(provider, ngModule);
		});
	}
}
function walkProviderTree(container, visitor, parents, dedup) {
	container = resolveForwardRef(container);
	if (!container) return false;
	let defType = null;
	let injDef = getInjectorDef(container);
	const cmpDef = !injDef && getComponentDef(container);
	if (!injDef && !cmpDef) {
		const ngModule = container.ngModule;
		injDef = getInjectorDef(ngModule);
		if (injDef) defType = ngModule;
		else return false;
	} else if (cmpDef && !cmpDef.standalone) return false;
	else defType = container;
	const isDuplicate = dedup.has(defType);
	if (cmpDef) {
		if (isDuplicate) return false;
		dedup.add(defType);
		if (cmpDef.dependencies) {
			const deps = typeof cmpDef.dependencies === "function" ? cmpDef.dependencies() : cmpDef.dependencies;
			for (const dep of deps) walkProviderTree(dep, visitor, parents, dedup);
		}
	} else if (injDef) {
		if (injDef.imports != null && !isDuplicate) {
			dedup.add(defType);
			let importTypesWithProviders;
			try {
				deepForEach(injDef.imports, (imported) => {
					if (walkProviderTree(imported, visitor, parents, dedup)) {
						importTypesWithProviders ||= [];
						importTypesWithProviders.push(imported);
					}
				});
			} finally {}
			if (importTypesWithProviders !== void 0) processInjectorTypesWithProviders(importTypesWithProviders, visitor);
		}
		if (!isDuplicate) {
			const factory = getFactoryDef(defType) || (() => new defType());
			visitor({
				provide: defType,
				useFactory: factory,
				deps: EMPTY_ARRAY
			}, defType);
			visitor({
				provide: INJECTOR_DEF_TYPES,
				useValue: defType,
				multi: true
			}, defType);
			visitor({
				provide: ENVIRONMENT_INITIALIZER,
				useValue: () => ɵɵinject(defType),
				multi: true
			}, defType);
		}
		const defProviders = injDef.providers;
		if (defProviders != null && !isDuplicate) {
			const injectorType = container;
			deepForEachProvider(defProviders, (provider) => {
				visitor(provider, injectorType);
			});
		}
	} else return false;
	return defType !== container && container.providers !== void 0;
}
function deepForEachProvider(providers, fn) {
	for (let provider of providers) {
		if (isEnvironmentProviders(provider)) provider = provider.ɵproviders;
		if (Array.isArray(provider)) deepForEachProvider(provider, fn);
		else fn(provider);
	}
}
var USE_VALUE = /*#__PURE__*/ getClosureSafeProperty({
	provide: String,
	useValue: getClosureSafeProperty
});
function isValueProvider(value) {
	return value !== null && typeof value == "object" && USE_VALUE in value;
}
function isExistingProvider(value) {
	return !!(value && value.useExisting);
}
function isFactoryProvider(value) {
	return !!(value && value.useFactory);
}
function isTypeProvider(value) {
	return typeof value === "function";
}
var INJECTOR_SCOPE = /*#__PURE__*/ new InjectionToken("");
var NOT_YET = {};
var CIRCULAR = {};
var NULL_INJECTOR = void 0;
function getNullInjector() {
	if (NULL_INJECTOR === void 0) NULL_INJECTOR = new NullInjector();
	return NULL_INJECTOR;
}
var EnvironmentInjector = class {};
var R3Injector = class extends EnvironmentInjector {
	parent;
	source;
	scopes;
	records = /* @__PURE__ */ new Map();
	_ngOnDestroyHooks = /* @__PURE__ */ new Set();
	_onDestroyHooks = [];
	get destroyed() {
		return this._destroyed;
	}
	_destroyed = false;
	injectorDefTypes;
	constructor(providers, parent, source, scopes) {
		super();
		this.parent = parent;
		this.source = source;
		this.scopes = scopes;
		forEachSingleProvider(providers, (provider) => this.processProvider(provider));
		this.records.set(INJECTOR$1, makeRecord(void 0, this));
		if (scopes.has("environment")) this.records.set(EnvironmentInjector, makeRecord(void 0, this));
		const record = this.records.get(INJECTOR_SCOPE);
		if (record != null && typeof record.value === "string") this.scopes.add(record.value);
		this.injectorDefTypes = new Set(this.get(INJECTOR_DEF_TYPES, EMPTY_ARRAY, { self: true }));
	}
	retrieve(token, options) {
		const flags = convertToBitFlags(options) || 0;
		try {
			return this.get(token, THROW_IF_NOT_FOUND, flags);
		} catch (e) {
			if (isNotFound(e)) return e;
			throw e;
		}
	}
	destroy() {
		assertNotDestroyed(this);
		this._destroyed = true;
		const prevConsumer = setActiveConsumer(null);
		try {
			for (const service of this._ngOnDestroyHooks) service.ngOnDestroy();
			const onDestroyHooks = this._onDestroyHooks;
			this._onDestroyHooks = [];
			for (const hook of onDestroyHooks) hook();
		} finally {
			this.records.clear();
			this._ngOnDestroyHooks.clear();
			this.injectorDefTypes.clear();
			setActiveConsumer(prevConsumer);
		}
	}
	onDestroy(callback) {
		assertNotDestroyed(this);
		this._onDestroyHooks.push(callback);
		return () => this.removeOnDestroy(callback);
	}
	runInContext(fn) {
		assertNotDestroyed(this);
		const previousInjector = setCurrentInjector(this);
		const previousInjectImplementation = setInjectImplementation(void 0);
		try {
			return fn();
		} finally {
			setCurrentInjector(previousInjector);
			setInjectImplementation(previousInjectImplementation);
		}
	}
	get(token, notFoundValue = THROW_IF_NOT_FOUND, options) {
		assertNotDestroyed(this);
		if (Object.hasOwn(token, NG_ENV_ID)) return token[NG_ENV_ID](this);
		const flags = convertToBitFlags(options);
		const previousInjector = setCurrentInjector(this);
		const previousInjectImplementation = setInjectImplementation(void 0);
		try {
			if (!(flags & 4)) {
				let record = this.records.get(token);
				if (record === void 0) {
					const def = couldBeInjectableType(token) && getInjectableDef(token);
					if (def && this.injectableDefInScope(def)) record = makeRecord(injectableDefOrInjectorDefFactory(token), NOT_YET);
					else record = null;
					this.records.set(token, record);
				}
				if (record != null) return this.hydrate(token, record, flags);
			}
			const nextInjector = !(flags & 2) ? this.parent : getNullInjector();
			notFoundValue = flags & 8 && notFoundValue === THROW_IF_NOT_FOUND ? null : notFoundValue;
			return nextInjector.get(token, notFoundValue);
		} catch (error) {
			const errorCode = getRuntimeErrorCode(error);
			if (errorCode === -200 || errorCode === -201) throw new RuntimeError(errorCode, null);
			else throw error;
		} finally {
			setInjectImplementation(previousInjectImplementation);
			setCurrentInjector(previousInjector);
		}
	}
	resolveInjectorInitializers() {
		const prevConsumer = setActiveConsumer(null);
		const previousInjector = setCurrentInjector(this);
		const previousInjectImplementation = setInjectImplementation(void 0);
		try {
			const initializers = this.get(ENVIRONMENT_INITIALIZER, EMPTY_ARRAY, { self: true });
			for (const initializer of initializers) initializer();
		} finally {
			setCurrentInjector(previousInjector);
			setInjectImplementation(previousInjectImplementation);
			setActiveConsumer(prevConsumer);
		}
	}
	toString() {
		return "R3Injector[...]";
	}
	processProvider(provider) {
		provider = resolveForwardRef(provider);
		let token = isTypeProvider(provider) ? provider : resolveForwardRef(provider && provider.provide);
		const record = providerToRecord(provider);
		if (!isTypeProvider(provider) && provider.multi === true) {
			let multiRecord = this.records.get(token);
			if (multiRecord) {} else {
				multiRecord = makeRecord(void 0, NOT_YET, true);
				multiRecord.factory = () => injectArgs(multiRecord.multi);
				this.records.set(token, multiRecord);
			}
			token = provider;
			multiRecord.multi.push(provider);
		}
		this.records.set(token, record);
	}
	hydrate(token, record, flags) {
		const prevConsumer = setActiveConsumer(null);
		try {
			if (record.value === CIRCULAR) throw cyclicDependencyError("");
			else if (record.value === NOT_YET) {
				record.value = CIRCULAR;
				record.value = record.factory(void 0, flags);
			}
			if (typeof record.value === "object" && record.value && hasOnDestroy(record.value)) this._ngOnDestroyHooks.add(record.value);
			return record.value;
		} finally {
			setActiveConsumer(prevConsumer);
		}
	}
	injectableDefInScope(def) {
		if (!def.providedIn) return false;
		const providedIn = resolveForwardRef(def.providedIn);
		if (typeof providedIn === "string") return providedIn === "any" || this.scopes.has(providedIn);
		else return this.injectorDefTypes.has(providedIn);
	}
	removeOnDestroy(callback) {
		const destroyCBIdx = this._onDestroyHooks.indexOf(callback);
		if (destroyCBIdx !== -1) this._onDestroyHooks.splice(destroyCBIdx, 1);
	}
};
function injectableDefOrInjectorDefFactory(token) {
	const injectableDef = getInjectableDef(token);
	const factory = injectableDef !== null ? injectableDef.factory : getFactoryDef(token);
	if (factory !== null) return factory;
	if (token instanceof InjectionToken) throw new RuntimeError(-204, false);
	if (token instanceof Function) return getUndecoratedInjectableFactory(token);
	throw new RuntimeError(-204, false);
}
function getUndecoratedInjectableFactory(token) {
	if (token.length > 0) throw new RuntimeError(-204, false);
	const inheritedInjectableDef = getInheritedInjectableDef(token);
	if (inheritedInjectableDef !== null) return () => inheritedInjectableDef.factory(token);
	else return () => new token();
}
function providerToRecord(provider) {
	if (isValueProvider(provider)) return makeRecord(void 0, provider.useValue);
	else return makeRecord(providerToFactory(provider), NOT_YET);
}
function providerToFactory(provider, ngModuleType, providers) {
	let factory = void 0;
	if (isTypeProvider(provider)) {
		const unwrappedProvider = resolveForwardRef(provider);
		return getFactoryDef(unwrappedProvider) || injectableDefOrInjectorDefFactory(unwrappedProvider);
	} else if (isValueProvider(provider)) factory = () => resolveForwardRef(provider.useValue);
	else if (isFactoryProvider(provider)) factory = () => provider.useFactory(...injectArgs(provider.deps || []));
	else if (isExistingProvider(provider)) factory = (_, flags) => ɵɵinject(resolveForwardRef(provider.useExisting), flags !== void 0 && flags & 8 ? 8 : void 0);
	else {
		const classRef = resolveForwardRef(provider && (provider.useClass || provider.provide));
		if (hasDeps(provider)) factory = () => new classRef(...injectArgs(provider.deps));
		else return getFactoryDef(classRef) || injectableDefOrInjectorDefFactory(classRef);
	}
	return factory;
}
function assertNotDestroyed(injector) {
	if (injector.destroyed) throw new RuntimeError(-205, false);
}
function makeRecord(factory, value, multi = false) {
	return {
		factory,
		value,
		multi: multi ? [] : void 0
	};
}
function hasDeps(value) {
	return !!value.deps;
}
function hasOnDestroy(value) {
	return value !== null && typeof value === "object" && typeof value.ngOnDestroy === "function";
}
function couldBeInjectableType(value) {
	return typeof value === "function" || typeof value === "object" && value.ngMetadataName === "InjectionToken";
}
function forEachSingleProvider(providers, fn) {
	for (const provider of providers) if (Array.isArray(provider)) forEachSingleProvider(provider, fn);
	else if (provider && isEnvironmentProviders(provider)) forEachSingleProvider(provider.ɵproviders, fn);
	else fn(provider);
}
function runInInjectionContext(injector, fn) {
	let internalInjector;
	if (injector instanceof R3Injector) {
		assertNotDestroyed(injector);
		internalInjector = injector;
	} else internalInjector = new RetrievingInjector(injector);
	const prevInjector = setCurrentInjector(internalInjector);
	const previousInjectImplementation = setInjectImplementation(void 0);
	try {
		return fn();
	} finally {
		setCurrentInjector(prevInjector);
		setInjectImplementation(previousInjectImplementation);
	}
}
function isInInjectionContext() {
	return getInjectImplementation() !== void 0 || getCurrentInjector() != null;
}
var TYPE = 1;
function isLView(value) {
	return Array.isArray(value) && typeof value[TYPE] === "object";
}
function isLContainer(value) {
	return Array.isArray(value) && value[TYPE] === true;
}
function isContentQueryHost(tNode) {
	return (tNode.flags & 4) !== 0;
}
function isComponentHost(tNode) {
	return tNode.componentOffset > -1;
}
function isDirectiveHost(tNode) {
	return (tNode.flags & 1) === 1;
}
function isComponentDef(def) {
	return !!def.template;
}
function isRootView(target) {
	return (target[2] & 512) !== 0;
}
function isDestroyed(lView) {
	return (lView[2] & 256) === 256;
}
var MATH_ML_NAMESPACE = "math";
function unwrapRNode(value) {
	while (Array.isArray(value)) value = value[0];
	return value;
}
function getNativeByTNode(tNode, lView) {
	return unwrapRNode(lView[tNode.index]);
}
function getTNode(tView, index) {
	return tView.data[index];
}
function getComponentLViewByIndex(nodeIndex, hostView) {
	const slotValue = hostView[nodeIndex];
	return isLView(slotValue) ? slotValue : slotValue[0];
}
function viewAttachedToChangeDetector(view) {
	return (view[2] & 128) === 128;
}
function getConstant(consts, index) {
	if (index === null || index === void 0) return null;
	return consts[index];
}
function resetPreOrderHookFlags(lView) {
	lView[17] = 0;
}
function markViewForRefresh(lView) {
	if (lView[2] & 1024) return;
	lView[2] |= 1024;
	if (viewAttachedToChangeDetector(lView)) markAncestorsForTraversal(lView);
}
function requiresRefreshOrTraversal(lView) {
	return !!(lView[2] & 9216 || lView[24]?.dirty);
}
function updateAncestorTraversalFlagsOnAttach(lView) {
	lView[10].changeDetectionScheduler?.notify(8);
	if (lView[2] & 64) lView[2] |= 1024;
	if (requiresRefreshOrTraversal(lView)) markAncestorsForTraversal(lView);
}
function markAncestorsForTraversal(lView) {
	lView[10].changeDetectionScheduler?.notify(0);
	let parent = getLViewParent(lView);
	while (parent !== null) {
		if (parent[2] & 8192) break;
		parent[2] |= 8192;
		if (!viewAttachedToChangeDetector(parent)) break;
		parent = getLViewParent(parent);
	}
}
function storeLViewOnDestroy(lView, onDestroyCallback) {
	if (isDestroyed(lView)) throw new RuntimeError(911, false);
	if (lView[21] === null) lView[21] = [];
	lView[21].push(onDestroyCallback);
}
function removeLViewOnDestroy(lView, onDestroyCallback) {
	if (lView[21] === null) return;
	const destroyCBIdx = lView[21].indexOf(onDestroyCallback);
	if (destroyCBIdx !== -1) lView[21].splice(destroyCBIdx, 1);
}
function getLViewParent(lView) {
	const parent = lView[3];
	return isLContainer(parent) ? parent[3] : parent;
}
var instructionState = {
	lFrame: /*#__PURE__*/ createLFrame(null),
	bindingsEnabled: true,
	skipHydrationRootTNode: null
};
var _isRefreshingViews = false;
function getElementDepthCount() {
	return instructionState.lFrame.elementDepthCount;
}
function increaseElementDepthCount() {
	instructionState.lFrame.elementDepthCount++;
}
function decreaseElementDepthCount() {
	instructionState.lFrame.elementDepthCount--;
}
function getBindingsEnabled() {
	return instructionState.bindingsEnabled;
}
function isInSkipHydrationBlock() {
	return instructionState.skipHydrationRootTNode !== null;
}
function isSkipHydrationRootTNode(tNode) {
	return instructionState.skipHydrationRootTNode === tNode;
}
function leaveSkipHydrationBlock() {
	instructionState.skipHydrationRootTNode = null;
}
function getLView() {
	return instructionState.lFrame.lView;
}
function getTView() {
	return instructionState.lFrame.tView;
}
function getCurrentTNode() {
	let currentTNode = getCurrentTNodePlaceholderOk();
	while (currentTNode !== null && currentTNode.type === 64) currentTNode = currentTNode.parent;
	return currentTNode;
}
function getCurrentTNodePlaceholderOk() {
	return instructionState.lFrame.currentTNode;
}
function getCurrentParentTNode() {
	const lFrame = instructionState.lFrame;
	const currentTNode = lFrame.currentTNode;
	return lFrame.isParent ? currentTNode : currentTNode.parent;
}
function setCurrentTNode(tNode, isParent) {
	const lFrame = instructionState.lFrame;
	lFrame.currentTNode = tNode;
	lFrame.isParent = isParent;
}
function isCurrentTNodeParent() {
	return instructionState.lFrame.isParent;
}
function setCurrentTNodeAsNotParent() {
	instructionState.lFrame.isParent = false;
}
function isRefreshingViews() {
	return _isRefreshingViews;
}
function setIsRefreshingViews(mode) {
	const prev = _isRefreshingViews;
	_isRefreshingViews = mode;
	return prev;
}
function setBindingIndex(value) {
	return instructionState.lFrame.bindingIndex = value;
}
function isInI18nBlock() {
	return instructionState.lFrame.inI18n;
}
function setBindingRootForHostBindings(bindingRootIndex, currentDirectiveIndex) {
	const lFrame = instructionState.lFrame;
	lFrame.bindingIndex = lFrame.bindingRootIndex = bindingRootIndex;
	setCurrentDirectiveIndex(currentDirectiveIndex);
}
function getCurrentDirectiveIndex() {
	return instructionState.lFrame.currentDirectiveIndex;
}
function setCurrentDirectiveIndex(currentDirectiveIndex) {
	instructionState.lFrame.currentDirectiveIndex = currentDirectiveIndex;
}
function setCurrentQueryIndex(value) {
	instructionState.lFrame.currentQueryIndex = value;
}
function getDeclarationTNode(lView) {
	const tView = lView[1];
	if (tView.type === 2) return tView.declTNode;
	if (tView.type === 1) return lView[5];
	return null;
}
function enterDI(lView, tNode, flags) {
	if (flags & 4) {
		let parentTNode = tNode;
		let parentLView = lView;
		while (true) {
			parentTNode = parentTNode.parent;
			if (parentTNode === null && !(flags & 1)) {
				parentTNode = getDeclarationTNode(parentLView);
				if (parentTNode === null) break;
				parentLView = parentLView[14];
				if (parentTNode.type & 10) break;
			} else break;
		}
		if (parentTNode === null) return false;
		else {
			tNode = parentTNode;
			lView = parentLView;
		}
	}
	const lFrame = instructionState.lFrame = allocLFrame();
	lFrame.currentTNode = tNode;
	lFrame.lView = lView;
	return true;
}
function enterView(newView) {
	const newLFrame = allocLFrame();
	const tView = newView[1];
	instructionState.lFrame = newLFrame;
	newLFrame.currentTNode = tView.firstChild;
	newLFrame.lView = newView;
	newLFrame.tView = tView;
	newLFrame.contextLView = newView;
	newLFrame.bindingIndex = tView.bindingStartIndex;
	newLFrame.inI18n = false;
}
function allocLFrame() {
	const currentLFrame = instructionState.lFrame;
	const childLFrame = currentLFrame === null ? null : currentLFrame.child;
	return childLFrame === null ? createLFrame(currentLFrame) : childLFrame;
}
function createLFrame(parent) {
	const lFrame = {
		currentTNode: null,
		isParent: true,
		lView: null,
		tView: null,
		selectedIndex: -1,
		contextLView: null,
		elementDepthCount: 0,
		currentNamespace: null,
		currentDirectiveIndex: -1,
		bindingRootIndex: -1,
		bindingIndex: -1,
		currentQueryIndex: 0,
		parent,
		child: null,
		inI18n: false
	};
	parent !== null && (parent.child = lFrame);
	return lFrame;
}
function leaveViewLight() {
	const oldLFrame = instructionState.lFrame;
	instructionState.lFrame = oldLFrame.parent;
	oldLFrame.currentTNode = null;
	oldLFrame.lView = null;
	return oldLFrame;
}
var leaveDI = leaveViewLight;
function leaveView() {
	const oldLFrame = leaveViewLight();
	oldLFrame.isParent = true;
	oldLFrame.tView = null;
	oldLFrame.selectedIndex = -1;
	oldLFrame.contextLView = null;
	oldLFrame.elementDepthCount = 0;
	oldLFrame.currentDirectiveIndex = -1;
	oldLFrame.currentNamespace = null;
	oldLFrame.bindingRootIndex = -1;
	oldLFrame.bindingIndex = -1;
	oldLFrame.currentQueryIndex = 0;
}
function getSelectedIndex() {
	return instructionState.lFrame.selectedIndex;
}
function setSelectedIndex(index) {
	instructionState.lFrame.selectedIndex = index;
}
function getNamespace() {
	return instructionState.lFrame.currentNamespace;
}
var _wasLastNodeCreated = true;
function wasLastNodeCreated() {
	return _wasLastNodeCreated;
}
function lastNodeWasCreated(flag) {
	_wasLastNodeCreated = flag;
}
function createInjector(defType, parent = null, additionalProviders = null, name) {
	const injector = createInjectorWithoutInjectorInstances(defType, parent, additionalProviders, name);
	injector.resolveInjectorInitializers();
	return injector;
}
function createInjectorWithoutInjectorInstances(defType, parent = null, additionalProviders = null, name, scopes = /* @__PURE__ */ new Set()) {
	return new R3Injector([additionalProviders || EMPTY_ARRAY, importProvidersFrom(defType)], parent || getNullInjector(), null, scopes);
}
var Injector = class Injector {
	static THROW_IF_NOT_FOUND = THROW_IF_NOT_FOUND;
	static NULL = new NullInjector();
	static create(options, parent) {
		if (Array.isArray(options)) return createInjector({ name: "" }, parent, options, "");
		else {
			const name = options.name ?? "";
			return createInjector({ name }, options.parent, options.providers, name);
		}
	}
	static ɵprov = /* @__PURE__ */ ɵɵdefineInjectable({
		token: Injector,
		providedIn: "any",
		factory: () => ɵɵinject(INJECTOR$1)
	});
	static __NG_ELEMENT_ID__ = -1;
};
var DOCUMENT$1 = /*#__PURE__*/ new InjectionToken("");
var DestroyRef = class {
	static __NG_ELEMENT_ID__ = injectDestroyRef;
	static __NG_ENV_ID__ = (injector) => injector;
};
var NodeInjectorDestroyRef = class extends DestroyRef {
	_lView;
	constructor(_lView) {
		super();
		this._lView = _lView;
	}
	get destroyed() {
		return isDestroyed(this._lView);
	}
	onDestroy(callback) {
		const lView = this._lView;
		storeLViewOnDestroy(lView, callback);
		return () => removeLViewOnDestroy(lView, callback);
	}
};
function injectDestroyRef() {
	return new NodeInjectorDestroyRef(getLView());
}
var DEBUG_TASK_TRACKER = /*#__PURE__*/ new InjectionToken("");
var PendingTasksInternal = /*#__PURE__*/ (() => {
	class PendingTasksInternal {
		taskId = 0;
		pendingTasks = /* @__PURE__ */ new Set();
		destroyed = false;
		pendingTask = new BehaviorSubject(false);
		debugTaskTracker = inject(DEBUG_TASK_TRACKER, { optional: true });
		get hasPendingTasks() {
			return this.destroyed ? false : this.pendingTask.value;
		}
		get hasPendingTasksObservable() {
			if (this.destroyed) return new Observable((subscriber) => {
				subscriber.next(false);
				subscriber.complete();
			});
			return this.pendingTask;
		}
		add() {
			if (!this.hasPendingTasks && !this.destroyed) this.pendingTask.next(true);
			const taskId = this.taskId++;
			this.pendingTasks.add(taskId);
			this.debugTaskTracker?.add(taskId);
			return taskId;
		}
		has(taskId) {
			return this.pendingTasks.has(taskId);
		}
		remove(taskId) {
			this.pendingTasks.delete(taskId);
			this.debugTaskTracker?.remove(taskId);
			if (this.pendingTasks.size === 0 && this.hasPendingTasks) this.pendingTask.next(false);
		}
		ngOnDestroy() {
			this.pendingTasks.clear();
			if (this.hasPendingTasks) this.pendingTask.next(false);
			this.destroyed = true;
			this.pendingTask.unsubscribe();
		}
		static ɵprov = /* @__PURE__ */ ɵɵdefineInjectable({
			token: PendingTasksInternal,
			providedIn: "root",
			factory: () => new PendingTasksInternal()
		});
	}
	return PendingTasksInternal;
})();
var EventEmitter_ = class extends Subject {
	__isAsync;
	destroyRef = void 0;
	pendingTasks = void 0;
	constructor(isAsync = false) {
		super();
		this.__isAsync = isAsync;
		if (isInInjectionContext()) {
			this.destroyRef = inject(DestroyRef, { optional: true }) ?? void 0;
			this.pendingTasks = inject(PendingTasksInternal, { optional: true }) ?? void 0;
		}
	}
	emit(value) {
		const prevConsumer = setActiveConsumer(null);
		try {
			super.next(value);
		} finally {
			setActiveConsumer(prevConsumer);
		}
	}
	subscribe(observerOrNext, error, complete) {
		let nextFn = observerOrNext;
		let errorFn = error || (() => null);
		let completeFn = complete;
		if (observerOrNext && typeof observerOrNext === "object") {
			const observer = observerOrNext;
			nextFn = observer.next?.bind(observer);
			errorFn = observer.error?.bind(observer);
			completeFn = observer.complete?.bind(observer);
		}
		if (this.__isAsync) {
			errorFn = this.wrapInTimeout(errorFn);
			if (nextFn) nextFn = this.wrapInTimeout(nextFn);
			if (completeFn) completeFn = this.wrapInTimeout(completeFn);
		}
		const sink = super.subscribe({
			next: nextFn,
			error: errorFn,
			complete: completeFn
		});
		if (observerOrNext instanceof Subscription) observerOrNext.add(sink);
		return sink;
	}
	wrapInTimeout(fn) {
		return (value) => {
			const taskId = this.pendingTasks?.add();
			setTimeout(() => {
				try {
					fn(value);
				} finally {
					if (taskId !== void 0) this.pendingTasks?.remove(taskId);
				}
			});
		};
	}
};
var EventEmitter = EventEmitter_;
function noop(...args) {}
function scheduleCallbackWithRafRace(callback) {
	let timeoutId;
	let animationFrameId;
	function cleanup() {
		callback = noop;
		try {
			if (animationFrameId !== void 0 && typeof cancelAnimationFrame === "function") cancelAnimationFrame(animationFrameId);
			if (timeoutId !== void 0) clearTimeout(timeoutId);
		} catch {}
	}
	timeoutId = setTimeout(() => {
		callback();
		cleanup();
	});
	if (typeof requestAnimationFrame === "function") animationFrameId = requestAnimationFrame(() => {
		callback();
		cleanup();
	});
	return () => cleanup();
}
function scheduleCallbackWithMicrotask(callback) {
	queueMicrotask(() => callback());
	return () => {
		callback = noop;
	};
}
var isAngularZoneProperty = "isAngularZone";
var angularZoneInstanceIdProperty = "isAngularZone_ID";
var ngZoneInstanceId = 0;
var NgZone = class NgZone {
	hasPendingMacrotasks = false;
	hasPendingMicrotasks = false;
	isStable = true;
	onUnstable = new EventEmitter(false);
	onMicrotaskEmpty = new EventEmitter(false);
	onStable = new EventEmitter(false);
	onError = new EventEmitter(false);
	constructor(options) {
		const { enableLongStackTrace = false, shouldCoalesceEventChangeDetection = false, shouldCoalesceRunChangeDetection = false, scheduleInRootZone = false } = options;
		if (typeof Zone == "undefined") throw new RuntimeError(908, false);
		Zone.assertZonePatched();
		const self = this;
		self._nesting = 0;
		self._outer = self._inner = Zone.current;
		if (Zone["TaskTrackingZoneSpec"]) self._inner = self._inner.fork(new Zone["TaskTrackingZoneSpec"]());
		if (enableLongStackTrace && Zone["longStackTraceZoneSpec"]) self._inner = self._inner.fork(Zone["longStackTraceZoneSpec"]);
		self.shouldCoalesceEventChangeDetection = !shouldCoalesceRunChangeDetection && shouldCoalesceEventChangeDetection;
		self.shouldCoalesceRunChangeDetection = shouldCoalesceRunChangeDetection;
		self.callbackScheduled = false;
		self.scheduleInRootZone = scheduleInRootZone;
		forkInnerZoneWithAngularBehavior(self);
	}
	static isInAngularZone() {
		return typeof Zone !== "undefined" && Zone.current.get(isAngularZoneProperty) === true;
	}
	static assertInAngularZone() {
		if (!NgZone.isInAngularZone()) throw new RuntimeError(909, false);
	}
	static assertNotInAngularZone() {
		if (NgZone.isInAngularZone()) throw new RuntimeError(909, false);
	}
	run(fn, applyThis, applyArgs) {
		return this._inner.run(fn, applyThis, applyArgs);
	}
	runTask(fn, applyThis, applyArgs, name) {
		const zone = this._inner;
		const task = zone.scheduleEventTask("NgZoneEvent: " + name, fn, EMPTY_PAYLOAD, noop, noop);
		try {
			return zone.runTask(task, applyThis, applyArgs);
		} finally {
			zone.cancelTask(task);
		}
	}
	runGuarded(fn, applyThis, applyArgs) {
		return this._inner.runGuarded(fn, applyThis, applyArgs);
	}
	runOutsideAngular(fn) {
		return this._outer.run(fn);
	}
};
var EMPTY_PAYLOAD = {};
function checkStable(zone) {
	if (zone._nesting == 0 && !zone.hasPendingMicrotasks && !zone.isStable) try {
		zone._nesting++;
		zone.onMicrotaskEmpty.emit(null);
	} finally {
		zone._nesting--;
		if (!zone.hasPendingMicrotasks) try {
			zone.runOutsideAngular(() => zone.onStable.emit(null));
		} finally {
			zone.isStable = true;
		}
	}
}
function delayChangeDetectionForEvents(zone) {
	if (zone.isCheckStableRunning || zone.callbackScheduled) return;
	zone.callbackScheduled = true;
	function scheduleCheckStable() {
		scheduleCallbackWithRafRace(() => {
			zone.callbackScheduled = false;
			updateMicroTaskStatus(zone);
			zone.isCheckStableRunning = true;
			checkStable(zone);
			zone.isCheckStableRunning = false;
		});
	}
	if (zone.scheduleInRootZone) Zone.root.run(() => {
		scheduleCheckStable();
	});
	else zone._outer.run(() => {
		scheduleCheckStable();
	});
	updateMicroTaskStatus(zone);
}
function forkInnerZoneWithAngularBehavior(zone) {
	const delayChangeDetectionForEventsDelegate = () => {
		delayChangeDetectionForEvents(zone);
	};
	const instanceId = ngZoneInstanceId++;
	zone._inner = zone._inner.fork({
		name: "angular",
		properties: {
			[isAngularZoneProperty]: true,
			[angularZoneInstanceIdProperty]: instanceId,
			[angularZoneInstanceIdProperty + instanceId]: true
		},
		onInvokeTask: (delegate, current, target, task, applyThis, applyArgs) => {
			if (shouldBeIgnoredByZone(applyArgs)) return delegate.invokeTask(target, task, applyThis, applyArgs);
			try {
				onEnter(zone);
				return delegate.invokeTask(target, task, applyThis, applyArgs);
			} finally {
				if (zone.shouldCoalesceEventChangeDetection && task.type === "eventTask" || zone.shouldCoalesceRunChangeDetection) delayChangeDetectionForEventsDelegate();
				onLeave(zone);
			}
		},
		onInvoke: (delegate, current, target, callback, applyThis, applyArgs, source) => {
			try {
				onEnter(zone);
				return delegate.invoke(target, callback, applyThis, applyArgs, source);
			} finally {
				if (zone.shouldCoalesceRunChangeDetection && !zone.callbackScheduled && !isSchedulerTick(applyArgs)) delayChangeDetectionForEventsDelegate();
				onLeave(zone);
			}
		},
		onHasTask: (delegate, current, target, hasTaskState) => {
			delegate.hasTask(target, hasTaskState);
			if (current === target) {
				if (hasTaskState.change == "microTask") {
					zone._hasPendingMicrotasks = hasTaskState.microTask;
					updateMicroTaskStatus(zone);
					checkStable(zone);
				} else if (hasTaskState.change == "macroTask") zone.hasPendingMacrotasks = hasTaskState.macroTask;
			}
		},
		onHandleError: (delegate, current, target, error) => {
			delegate.handleError(target, error);
			zone.runOutsideAngular(() => zone.onError.emit(error));
			return false;
		}
	});
}
function updateMicroTaskStatus(zone) {
	if (zone._hasPendingMicrotasks || (zone.shouldCoalesceEventChangeDetection || zone.shouldCoalesceRunChangeDetection) && zone.callbackScheduled === true) zone.hasPendingMicrotasks = true;
	else zone.hasPendingMicrotasks = false;
}
function onEnter(zone) {
	zone._nesting++;
	if (zone.isStable) {
		zone.isStable = false;
		zone.onUnstable.emit(null);
	}
}
function onLeave(zone) {
	zone._nesting--;
	checkStable(zone);
}
var NoopNgZone = class {
	hasPendingMicrotasks = false;
	hasPendingMacrotasks = false;
	isStable = true;
	onUnstable = new EventEmitter();
	onMicrotaskEmpty = new EventEmitter();
	onStable = new EventEmitter();
	onError = new EventEmitter();
	run(fn, applyThis, applyArgs) {
		return fn.apply(applyThis, applyArgs);
	}
	runGuarded(fn, applyThis, applyArgs) {
		return fn.apply(applyThis, applyArgs);
	}
	runOutsideAngular(fn) {
		return fn();
	}
	runTask(fn, applyThis, applyArgs, name) {
		return fn.apply(applyThis, applyArgs);
	}
};
function shouldBeIgnoredByZone(applyArgs) {
	return hasApplyArgsData(applyArgs, "__ignore_ng_zone__");
}
function isSchedulerTick(applyArgs) {
	return hasApplyArgsData(applyArgs, "__scheduler_tick__");
}
function hasApplyArgsData(applyArgs, key) {
	if (!Array.isArray(applyArgs)) return false;
	if (applyArgs.length !== 1) return false;
	return applyArgs[0]?.data?.[key] === true;
}
var ErrorHandler = class {
	_console = console;
	handleError(error) {
		this._console.error("ERROR", error);
	}
};
var INTERNAL_APPLICATION_ERROR_HANDLER = /*#__PURE__*/ new InjectionToken("", { factory: () => {
	const zone = inject(NgZone);
	const injector = inject(EnvironmentInjector);
	let userErrorHandler;
	return (e) => {
		zone.runOutsideAngular(() => {
			if (injector.destroyed && !userErrorHandler) setTimeout(() => {
				throw e;
			});
			else {
				userErrorHandler ??= injector.get(ErrorHandler);
				userErrorHandler.handleError(e);
			}
		});
	};
} });
var errorHandlerEnvironmentInitializer = {
	provide: ENVIRONMENT_INITIALIZER,
	useValue: () => {
		inject(ErrorHandler, { optional: true });
	},
	multi: true
};
var APP_ID = /*#__PURE__*/ new InjectionToken("", { factory: () => DEFAULT_APP_ID });
var DEFAULT_APP_ID = "ng";
var PLATFORM_INITIALIZER = /*#__PURE__*/ new InjectionToken("");
var PLATFORM_ID = /*#__PURE__*/ new InjectionToken("", {
	providedIn: "platform",
	factory: () => "unknown"
});
var CSP_NONCE = /*#__PURE__*/ new InjectionToken("", { factory: () => {
	return inject(DOCUMENT$1).body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") || null;
} });
var TransferState = /*#__PURE__*/ (() => {
	class TransferState {
		static ɵprov = /* @__PURE__ */ ɵɵdefineInjectable({
			token: TransferState,
			providedIn: "root",
			factory: () => {
				const transferState = new TransferState();
				transferState.store = retrieveTransferredState(inject(DOCUMENT$1), inject(APP_ID));
				return transferState;
			}
		});
		store = {};
		onSerializeCallbacks = {};
		get(key, defaultValue) {
			return this.store[key] !== void 0 ? this.store[key] : defaultValue;
		}
		set(key, value) {
			this.store[key] = value;
		}
		remove(key) {
			delete this.store[key];
		}
		hasKey(key) {
			return Object.hasOwn(this.store, key);
		}
		get isEmpty() {
			return Object.keys(this.store).length === 0;
		}
		onSerialize(key, callback) {
			this.onSerializeCallbacks[key] = callback;
		}
		toJson() {
			for (const key in this.onSerializeCallbacks) if (Object.hasOwn(this.onSerializeCallbacks, key)) try {
				this.store[key] = this.onSerializeCallbacks[key]();
			} catch (e) {
				console.warn("Exception in onSerialize callback: ", e);
			}
			return JSON.stringify(this.store).replace(/</g, "\\u003C").replace(/\//g, "\\u002F");
		}
	}
	return TransferState;
})();
function retrieveTransferredState(doc, appId) {
	const script = doc.getElementById(appId + "-state");
	if (script?.tagName === "SCRIPT" && script.textContent) try {
		return JSON.parse(script.textContent);
	} catch (e) {
		console.warn("Exception while restoring TransferState for app " + appId, e);
	}
	return {};
}
var ChangeDetectionScheduler = class {};
var ZONELESS_ENABLED = /*#__PURE__*/ new InjectionToken("", { factory: () => true });
var SCHEDULE_IN_ROOT_ZONE = /*#__PURE__*/ new InjectionToken("");
var EffectScheduler = /*#__PURE__*/ (() => {
	class EffectScheduler {
		static ɵprov = /* @__PURE__ */ ɵɵdefineInjectable({
			token: EffectScheduler,
			providedIn: "root",
			factory: () => new ZoneAwareEffectScheduler()
		});
	}
	return EffectScheduler;
})();
var ZoneAwareEffectScheduler = class {
	dirtyEffectCount = 0;
	queues = /* @__PURE__ */ new Map();
	add(handle) {
		this.enqueue(handle);
		this.schedule(handle);
	}
	schedule(handle) {
		if (!handle.dirty) return;
		this.dirtyEffectCount++;
	}
	remove(handle) {
		const zone = handle.zone;
		const queue = this.queues.get(zone);
		if (!queue.has(handle)) return;
		queue.delete(handle);
		if (handle.dirty) this.dirtyEffectCount--;
	}
	enqueue(handle) {
		const zone = handle.zone;
		if (!this.queues.has(zone)) this.queues.set(zone, /* @__PURE__ */ new Set());
		const queue = this.queues.get(zone);
		if (queue.has(handle)) return;
		queue.add(handle);
	}
	flush() {
		while (this.dirtyEffectCount > 0) {
			let ranOneEffect = false;
			for (const [zone, queue] of this.queues) if (zone === null) ranOneEffect ||= this.flushQueue(queue);
			else ranOneEffect ||= zone.run(() => this.flushQueue(queue));
			if (!ranOneEffect) this.dirtyEffectCount = 0;
		}
	}
	flushQueue(queue) {
		let ranOneEffect = false;
		for (const handle of queue) {
			if (!handle.dirty) continue;
			this.dirtyEffectCount--;
			ranOneEffect = true;
			handle.run();
		}
		return ranOneEffect;
	}
};
//#endregion
//#region node_modules/@angular/core/fesm2022/_debug_node-chunk.mjs
/**
* @license Angular v22.1.3
* (c) 2010-2026 Google LLC. https://angular.dev/
* License: MIT
*/
function noSideEffects(fn) {
	return { toString: fn }.toString();
}
var ProfilerEvent = /*#__PURE__*/ (function(ProfilerEvent) {
	ProfilerEvent[ProfilerEvent["TemplateCreateStart"] = 0] = "TemplateCreateStart";
	ProfilerEvent[ProfilerEvent["TemplateCreateEnd"] = 1] = "TemplateCreateEnd";
	ProfilerEvent[ProfilerEvent["TemplateUpdateStart"] = 2] = "TemplateUpdateStart";
	ProfilerEvent[ProfilerEvent["TemplateUpdateEnd"] = 3] = "TemplateUpdateEnd";
	ProfilerEvent[ProfilerEvent["LifecycleHookStart"] = 4] = "LifecycleHookStart";
	ProfilerEvent[ProfilerEvent["LifecycleHookEnd"] = 5] = "LifecycleHookEnd";
	ProfilerEvent[ProfilerEvent["OutputStart"] = 6] = "OutputStart";
	ProfilerEvent[ProfilerEvent["OutputEnd"] = 7] = "OutputEnd";
	ProfilerEvent[ProfilerEvent["BootstrapApplicationStart"] = 8] = "BootstrapApplicationStart";
	ProfilerEvent[ProfilerEvent["BootstrapApplicationEnd"] = 9] = "BootstrapApplicationEnd";
	ProfilerEvent[ProfilerEvent["BootstrapComponentStart"] = 10] = "BootstrapComponentStart";
	ProfilerEvent[ProfilerEvent["BootstrapComponentEnd"] = 11] = "BootstrapComponentEnd";
	ProfilerEvent[ProfilerEvent["ChangeDetectionStart"] = 12] = "ChangeDetectionStart";
	ProfilerEvent[ProfilerEvent["ChangeDetectionEnd"] = 13] = "ChangeDetectionEnd";
	ProfilerEvent[ProfilerEvent["ChangeDetectionSyncStart"] = 14] = "ChangeDetectionSyncStart";
	ProfilerEvent[ProfilerEvent["ChangeDetectionSyncEnd"] = 15] = "ChangeDetectionSyncEnd";
	ProfilerEvent[ProfilerEvent["AfterRenderHooksStart"] = 16] = "AfterRenderHooksStart";
	ProfilerEvent[ProfilerEvent["AfterRenderHooksEnd"] = 17] = "AfterRenderHooksEnd";
	ProfilerEvent[ProfilerEvent["ComponentStart"] = 18] = "ComponentStart";
	ProfilerEvent[ProfilerEvent["ComponentEnd"] = 19] = "ComponentEnd";
	ProfilerEvent[ProfilerEvent["DeferBlockStateStart"] = 20] = "DeferBlockStateStart";
	ProfilerEvent[ProfilerEvent["DeferBlockStateEnd"] = 21] = "DeferBlockStateEnd";
	ProfilerEvent[ProfilerEvent["DynamicComponentStart"] = 22] = "DynamicComponentStart";
	ProfilerEvent[ProfilerEvent["DynamicComponentEnd"] = 23] = "DynamicComponentEnd";
	ProfilerEvent[ProfilerEvent["HostBindingsUpdateStart"] = 24] = "HostBindingsUpdateStart";
	ProfilerEvent[ProfilerEvent["HostBindingsUpdateEnd"] = 25] = "HostBindingsUpdateEnd";
	return ProfilerEvent;
})(ProfilerEvent || {});
function applyValueToInputField(instance, inputSignalNode, privateName, value) {
	if (inputSignalNode !== null) inputSignalNode.applyValueToInputSignal(inputSignalNode, value);
	else instance[privateName] = value;
}
var _ngOnChangesFeatureImpl = null;
function getNgOnChangesFeatureImpl() {
	return _ngOnChangesFeatureImpl;
}
var profilerCallbacks = [];
var profiler = function(event, instance = null, eventFn) {
	for (let i = 0; i < profilerCallbacks.length; i++) {
		const profilerCallback = profilerCallbacks[i];
		profilerCallback(event, instance, eventFn);
	}
};
function registerPreOrderHooks(directiveIndex, directiveDef, tView) {
	const { ngOnChanges, ngOnInit, ngDoCheck } = directiveDef.type.prototype;
	if (ngOnChanges) {
		const wrappedOnChanges = getNgOnChangesFeatureImpl()(directiveDef);
		(tView.preOrderHooks ??= []).push(directiveIndex, wrappedOnChanges);
		(tView.preOrderCheckHooks ??= []).push(directiveIndex, wrappedOnChanges);
	}
	if (ngOnInit) (tView.preOrderHooks ??= []).push(0 - directiveIndex, ngOnInit);
	if (ngDoCheck) {
		(tView.preOrderHooks ??= []).push(directiveIndex, ngDoCheck);
		(tView.preOrderCheckHooks ??= []).push(directiveIndex, ngDoCheck);
	}
}
function registerPostOrderHooks(tView, tNode) {
	for (let i = tNode.directiveStart, end = tNode.directiveEnd; i < end; i++) {
		const { ngAfterContentInit, ngAfterContentChecked, ngAfterViewInit, ngAfterViewChecked, ngOnDestroy } = tView.data[i].type.prototype;
		if (ngAfterContentInit) (tView.contentHooks ??= []).push(-i, ngAfterContentInit);
		if (ngAfterContentChecked) {
			(tView.contentHooks ??= []).push(i, ngAfterContentChecked);
			(tView.contentCheckHooks ??= []).push(i, ngAfterContentChecked);
		}
		if (ngAfterViewInit) (tView.viewHooks ??= []).push(-i, ngAfterViewInit);
		if (ngAfterViewChecked) {
			(tView.viewHooks ??= []).push(i, ngAfterViewChecked);
			(tView.viewCheckHooks ??= []).push(i, ngAfterViewChecked);
		}
		if (ngOnDestroy != null) (tView.destroyHooks ??= []).push(i, ngOnDestroy);
	}
}
function executeCheckHooks(lView, hooks, nodeIndex) {
	callHooks(lView, hooks, 3, nodeIndex);
}
function executeInitAndCheckHooks(lView, hooks, initPhase, nodeIndex) {
	if ((lView[2] & 3) === initPhase) callHooks(lView, hooks, initPhase, nodeIndex);
}
function incrementInitPhaseFlags(lView, initPhase) {
	let flags = lView[2];
	if ((flags & 3) === initPhase) {
		flags &= 16383;
		flags += 1;
		lView[2] = flags;
	}
}
function callHooks(currentView, arr, initPhase, currentNodeIndex) {
	const startIndex = currentNodeIndex !== void 0 ? currentView[17] & 65535 : 0;
	const nodeIndexLimit = currentNodeIndex != null ? currentNodeIndex : -1;
	const max = arr.length - 1;
	let lastNodeIndexFound = 0;
	for (let i = startIndex; i < max; i++) if (typeof arr[i + 1] === "number") {
		lastNodeIndexFound = arr[i];
		if (currentNodeIndex != null && lastNodeIndexFound >= currentNodeIndex) break;
	} else {
		if (arr[i] < 0) currentView[17] += 65536;
		if (lastNodeIndexFound < nodeIndexLimit || nodeIndexLimit == -1) {
			callHook(currentView, initPhase, arr, i);
			currentView[17] = (currentView[17] & 4294901760) + i + 2;
		}
		i++;
	}
}
function callHookInternal(directive, hook) {
	profiler(ProfilerEvent.LifecycleHookStart, directive, hook);
	const prevConsumer = setActiveConsumer(null);
	try {
		hook.call(directive);
	} finally {
		setActiveConsumer(prevConsumer);
		profiler(ProfilerEvent.LifecycleHookEnd, directive, hook);
	}
}
function callHook(currentView, initPhase, arr, i) {
	const isInitHook = arr[i] < 0;
	const hook = arr[i + 1];
	const directive = currentView[isInitHook ? -arr[i] : arr[i]];
	if (isInitHook) {
		if (currentView[2] >> 14 < currentView[17] >> 16 && (currentView[2] & 3) === initPhase) {
			currentView[2] += 16384;
			callHookInternal(directive, hook);
		}
	} else callHookInternal(directive, hook);
}
var NO_PARENT_INJECTOR = -1;
var NodeInjectorFactory = class {
	factory;
	name;
	injectImpl;
	resolving = false;
	canSeeViewProviders;
	multi;
	componentProviders;
	index;
	providerFactory;
	constructor(factory, isViewProvider, injectImplementation, name) {
		this.factory = factory;
		this.name = name;
		this.canSeeViewProviders = isViewProvider;
		this.injectImpl = injectImplementation;
	}
};
function hasClassInput(tNode) {
	return (tNode.flags & 8) !== 0;
}
function hasStyleInput(tNode) {
	return (tNode.flags & 16) !== 0;
}
function setUpAttributes(renderer, native, attrs) {
	let i = 0;
	while (i < attrs.length) {
		const value = attrs[i];
		if (typeof value === "number") {
			if (value !== 0) break;
			i++;
			const namespaceURI = attrs[i++];
			const attrName = attrs[i++];
			const attrVal = attrs[i++];
			renderer.setAttribute(native, attrName, attrVal, namespaceURI);
		} else {
			const attrName = value;
			const attrVal = attrs[++i];
			if (isAnimationProp(attrName)) renderer.setProperty(native, attrName, attrVal);
			else renderer.setAttribute(native, attrName, attrVal);
			i++;
		}
	}
	return i;
}
function isNameOnlyAttributeMarker(marker) {
	return marker === 3 || marker === 4 || marker === 6;
}
function isAnimationProp(name) {
	return name.charCodeAt(0) === 64;
}
function mergeHostAttrs(dst, src) {
	if (src === null || src.length === 0);
	else if (dst === null || dst.length === 0) dst = src.slice();
	else {
		let srcMarker = -1;
		for (let i = 0; i < src.length; i++) {
			const item = src[i];
			if (typeof item === "number") srcMarker = item;
			else if (srcMarker === 0);
			else if (srcMarker === -1 || srcMarker === 2) mergeHostAttribute(dst, srcMarker, item, null, src[++i]);
			else mergeHostAttribute(dst, srcMarker, item, null, null);
		}
	}
	return dst;
}
function mergeHostAttribute(dst, marker, key1, key2, value) {
	let i = 0;
	let markerInsertPosition = dst.length;
	if (marker === -1) markerInsertPosition = -1;
	else while (i < dst.length) {
		const dstValue = dst[i++];
		if (typeof dstValue === "number") {
			if (dstValue === marker) {
				markerInsertPosition = -1;
				break;
			} else if (dstValue > marker) {
				markerInsertPosition = i - 1;
				break;
			}
		}
	}
	while (i < dst.length) {
		const item = dst[i];
		if (typeof item === "number") break;
		else if (item === key1) {
			if (value !== null) dst[i + 1] = value;
			return;
		}
		i++;
		if (value !== null) i++;
	}
	if (markerInsertPosition !== -1) {
		dst.splice(markerInsertPosition, 0, marker);
		i = markerInsertPosition + 1;
	}
	dst.splice(i++, 0, key1);
	if (value !== null) dst.splice(i++, 0, value);
}
function hasParentInjector(parentLocation) {
	return parentLocation !== NO_PARENT_INJECTOR;
}
function getParentInjectorIndex(parentLocation) {
	return parentLocation & 32767;
}
function getParentInjectorViewOffset(parentLocation) {
	return parentLocation >> 16;
}
function getParentInjectorView(location, startView) {
	let viewOffset = getParentInjectorViewOffset(location);
	let parentView = startView;
	while (viewOffset > 0) {
		parentView = parentView[14];
		viewOffset--;
	}
	return parentView;
}
var includeViewProviders = true;
function setIncludeViewProviders(v) {
	const oldValue = includeViewProviders;
	includeViewProviders = v;
	return oldValue;
}
var BLOOM_MASK = 255;
var BLOOM_BUCKET_BITS = 5;
var nextNgElementId = 0;
var NOT_FOUND = {};
function bloomAdd(injectorIndex, tView, type) {
	let id;
	if (typeof type === "string") id = type.charCodeAt(0) || 0;
	else if (Object.hasOwn(type, NG_ELEMENT_ID)) id = type[NG_ELEMENT_ID];
	if (id == null) id = type[NG_ELEMENT_ID] = nextNgElementId++;
	const bloomHash = id & BLOOM_MASK;
	const mask = 1 << bloomHash;
	tView.data[injectorIndex + (bloomHash >> BLOOM_BUCKET_BITS)] |= mask;
}
function getOrCreateNodeInjectorForNode(tNode, lView) {
	const existingInjectorIndex = getInjectorIndex(tNode, lView);
	if (existingInjectorIndex !== -1) return existingInjectorIndex;
	const tView = lView[1];
	if (tView.firstCreatePass) {
		tNode.injectorIndex = lView.length;
		insertBloom(tView.data, tNode);
		insertBloom(lView, null);
		insertBloom(tView.blueprint, null);
	}
	const parentLoc = getParentInjectorLocation(tNode, lView);
	const injectorIndex = tNode.injectorIndex;
	if (hasParentInjector(parentLoc)) {
		const parentIndex = getParentInjectorIndex(parentLoc);
		const parentLView = getParentInjectorView(parentLoc, lView);
		const parentData = parentLView[1].data;
		for (let i = 0; i < 8; i++) lView[injectorIndex + i] = parentLView[parentIndex + i] | parentData[parentIndex + i];
	}
	lView[injectorIndex + 8] = parentLoc;
	return injectorIndex;
}
function insertBloom(arr, footer) {
	arr.push(0, 0, 0, 0, 0, 0, 0, 0, footer);
}
function getInjectorIndex(tNode, lView) {
	if (tNode.injectorIndex === -1 || tNode.parent && tNode.parent.injectorIndex === tNode.injectorIndex || lView[tNode.injectorIndex + 8] === null) return -1;
	else return tNode.injectorIndex;
}
function getParentInjectorLocation(tNode, lView) {
	if (tNode.parent && tNode.parent.injectorIndex !== -1) return tNode.parent.injectorIndex;
	let declarationViewOffset = 0;
	let parentTNode = null;
	let lViewCursor = lView;
	while (lViewCursor !== null) {
		parentTNode = getTNodeFromLView(lViewCursor);
		if (parentTNode === null) return NO_PARENT_INJECTOR;
		declarationViewOffset++;
		lViewCursor = lViewCursor[14];
		if (parentTNode.injectorIndex !== -1) return parentTNode.injectorIndex | declarationViewOffset << 16;
	}
	return NO_PARENT_INJECTOR;
}
function diPublicInInjector(injectorIndex, tView, token) {
	bloomAdd(injectorIndex, tView, token);
}
function notFoundValueOrThrow(notFoundValue, token, flags) {
	if (flags & 8 || notFoundValue !== void 0) return notFoundValue;
	else throwProviderNotFoundError(token, "NodeInjector");
}
function lookupTokenUsingModuleInjector(lView, token, flags, notFoundValue) {
	if (flags & 8 && notFoundValue === void 0) notFoundValue = null;
	if ((flags & 3) === 0) {
		const moduleInjector = lView[9];
		const previousInjectImplementation = setInjectImplementation(void 0);
		try {
			if (moduleInjector) return moduleInjector.get(token, notFoundValue, flags & 8);
			else return injectRootLimpMode(token, notFoundValue, flags & 8);
		} finally {
			setInjectImplementation(previousInjectImplementation);
		}
	}
	return notFoundValueOrThrow(notFoundValue, token, flags);
}
function getOrCreateInjectable(tNode, lView, token, flags = 0, notFoundValue) {
	if (tNode !== null) {
		if (lView[2] & 2048 && !(flags & 2)) {
			const embeddedInjectorValue = lookupTokenUsingEmbeddedInjector(tNode, lView, token, flags, NOT_FOUND);
			if (embeddedInjectorValue !== NOT_FOUND) return embeddedInjectorValue;
		}
		const value = lookupTokenUsingNodeInjector(tNode, lView, token, flags, NOT_FOUND);
		if (value !== NOT_FOUND) return value;
	}
	return lookupTokenUsingModuleInjector(lView, token, flags, notFoundValue);
}
function lookupTokenUsingNodeInjector(tNode, lView, token, flags, notFoundValue) {
	const bloomHash = bloomHashBitOrFactory(token);
	if (typeof bloomHash === "function") {
		if (!enterDI(lView, tNode, flags)) return flags & 1 ? notFoundValueOrThrow(notFoundValue, token, flags) : lookupTokenUsingModuleInjector(lView, token, flags, notFoundValue);
		try {
			let value;
			value = bloomHash(flags);
			if (value == null && !(flags & 8)) throwProviderNotFoundError(token);
			else return value;
		} finally {
			leaveDI();
		}
	} else if (typeof bloomHash === "number") {
		let previousTView = null;
		let injectorIndex = getInjectorIndex(tNode, lView);
		let parentLocation = NO_PARENT_INJECTOR;
		let hostTElementNode = flags & 1 ? lView[15][5] : null;
		if (injectorIndex === -1 || flags & 4) {
			parentLocation = injectorIndex === -1 ? getParentInjectorLocation(tNode, lView) : lView[injectorIndex + 8];
			if (parentLocation === NO_PARENT_INJECTOR || !shouldSearchParent(flags, false)) injectorIndex = -1;
			else {
				previousTView = lView[1];
				injectorIndex = getParentInjectorIndex(parentLocation);
				lView = getParentInjectorView(parentLocation, lView);
			}
		}
		while (injectorIndex !== -1) {
			const tView = lView[1];
			if (bloomHasToken(bloomHash, injectorIndex, tView.data)) {
				const instance = searchTokensOnInjector(injectorIndex, lView, token, previousTView, flags, hostTElementNode);
				if (instance !== NOT_FOUND) return instance;
			}
			parentLocation = lView[injectorIndex + 8];
			if (parentLocation !== NO_PARENT_INJECTOR && shouldSearchParent(flags, lView[1].data[injectorIndex + 8] === hostTElementNode) && bloomHasToken(bloomHash, injectorIndex, lView)) {
				previousTView = tView;
				injectorIndex = getParentInjectorIndex(parentLocation);
				lView = getParentInjectorView(parentLocation, lView);
			} else injectorIndex = -1;
		}
	}
	return notFoundValue;
}
function searchTokensOnInjector(injectorIndex, lView, token, previousTView, flags, hostTElementNode) {
	const currentTView = lView[1];
	const tNode = currentTView.data[injectorIndex + 8];
	const injectableIdx = locateDirectiveOrProvider(tNode, currentTView, token, previousTView == null ? isComponentHost(tNode) && includeViewProviders : previousTView != currentTView && (tNode.type & 3) !== 0, flags & 1 && hostTElementNode === tNode);
	if (injectableIdx !== null) return getNodeInjectable(lView, currentTView, injectableIdx, tNode, flags);
	else return NOT_FOUND;
}
function locateDirectiveOrProvider(tNode, tView, token, canAccessViewProviders, isHostSpecialCase) {
	const nodeProviderIndexes = tNode.providerIndexes;
	const tInjectables = tView.data;
	const injectablesStart = nodeProviderIndexes & 1048575;
	const directivesStart = tNode.directiveStart;
	const directiveEnd = tNode.directiveEnd;
	const cptViewProvidersCount = nodeProviderIndexes >> 20;
	const startingIndex = canAccessViewProviders ? injectablesStart : injectablesStart + cptViewProvidersCount;
	const endIndex = isHostSpecialCase ? injectablesStart + cptViewProvidersCount : directiveEnd;
	for (let i = startingIndex; i < endIndex; i++) {
		const providerTokenOrDef = tInjectables[i];
		if (i < directivesStart && token === providerTokenOrDef || i >= directivesStart && providerTokenOrDef.type === token) return i;
	}
	if (isHostSpecialCase) {
		const dirDef = tInjectables[directivesStart];
		if (dirDef && isComponentDef(dirDef) && dirDef.type === token) return directivesStart;
	}
	return null;
}
function getNodeInjectable(lView, tView, index, tNode, flags) {
	let value = lView[index];
	const tData = tView.data;
	if (value instanceof NodeInjectorFactory) {
		const factory = value;
		if (factory.resolving) throw cyclicDependencyError("");
		const previousIncludeViewProviders = setIncludeViewProviders(factory.canSeeViewProviders);
		factory.resolving = true;
		tData[index].type || tData[index];
		const previousInjectImplementation = factory.injectImpl ? setInjectImplementation(factory.injectImpl) : null;
		enterDI(lView, tNode, 0);
		try {
			value = lView[index] = factory.factory(void 0, flags, tData, lView, tNode);
			if (tView.firstCreatePass && index >= tNode.directiveStart) registerPreOrderHooks(index, tData[index], tView);
		} finally {
			previousInjectImplementation !== null && setInjectImplementation(previousInjectImplementation);
			setIncludeViewProviders(previousIncludeViewProviders);
			factory.resolving = false;
			leaveDI();
		}
	}
	return value;
}
function bloomHashBitOrFactory(token) {
	if (typeof token === "string") return token.charCodeAt(0) || 0;
	const tokenId = Object.hasOwn(token, NG_ELEMENT_ID) ? token[NG_ELEMENT_ID] : void 0;
	if (typeof tokenId === "number") {
		if (tokenId >= 0) return tokenId & BLOOM_MASK;
		else return createNodeInjector;
	} else return tokenId;
}
function bloomHasToken(bloomHash, injectorIndex, injectorView) {
	const mask = 1 << bloomHash;
	return !!(injectorView[injectorIndex + (bloomHash >> BLOOM_BUCKET_BITS)] & mask);
}
function shouldSearchParent(flags, isFirstHostTNode) {
	return !(flags & 2) && !(flags & 1 && isFirstHostTNode);
}
var NodeInjector = class {
	_tNode;
	_lView;
	constructor(_tNode, _lView) {
		this._tNode = _tNode;
		this._lView = _lView;
	}
	get(token, notFoundValue, flags) {
		return getOrCreateInjectable(this._tNode, this._lView, token, convertToBitFlags(flags), notFoundValue);
	}
};
function createNodeInjector() {
	return new NodeInjector(getCurrentTNode(), getLView());
}
function lookupTokenUsingEmbeddedInjector(tNode, lView, token, flags, notFoundValue) {
	let currentTNode = tNode;
	let currentLView = lView;
	while (currentTNode !== null && currentLView !== null && currentLView[2] & 2048 && !isRootView(currentLView)) {
		const nodeInjectorValue = lookupTokenUsingNodeInjector(currentTNode, currentLView, token, flags | 2, NOT_FOUND);
		if (nodeInjectorValue !== NOT_FOUND) return nodeInjectorValue;
		let parentTNode = currentTNode.parent;
		if (!parentTNode) {
			const embeddedViewInjector = currentLView[20];
			if (embeddedViewInjector) {
				const embeddedViewInjectorValue = embeddedViewInjector.get(token, NOT_FOUND, flags & -5);
				if (embeddedViewInjectorValue !== NOT_FOUND) return embeddedViewInjectorValue;
			}
			parentTNode = getTNodeFromLView(currentLView);
			currentLView = currentLView[14];
		}
		currentTNode = parentTNode;
	}
	return notFoundValue;
}
function getTNodeFromLView(lView) {
	const tView = lView[1];
	const tViewType = tView.type;
	if (tViewType === 2) return tView.declTNode;
	else if (tViewType === 1) return lView[5];
	return null;
}
function ɵɵdefineService(opts) {
	return {
		token: opts.token,
		providedIn: opts.autoProvided === false ? null : "root",
		factory: opts.factory,
		value: void 0
	};
}
function injectElementRef() {
	return createElementRef(getCurrentTNode(), getLView());
}
function createElementRef(tNode, lView) {
	return new ElementRef(getNativeByTNode(tNode, lView));
}
var ElementRef = /*#__PURE__*/ (() => {
	class ElementRef {
		nativeElement;
		constructor(nativeElement) {
			this.nativeElement = nativeElement;
		}
		static __NG_ELEMENT_ID__ = injectElementRef;
	}
	return ElementRef;
})();
function hasInSkipHydrationBlockFlag(tNode) {
	return (tNode.flags & 128) === 128;
}
var ChangeDetectionStrategy = /*#__PURE__*/ (function(ChangeDetectionStrategy) {
	ChangeDetectionStrategy[ChangeDetectionStrategy["OnPush"] = 0] = "OnPush";
	ChangeDetectionStrategy[ChangeDetectionStrategy["Eager"] = 1] = "Eager";
	ChangeDetectionStrategy[ChangeDetectionStrategy["Default"] = 1] = "Default";
	return ChangeDetectionStrategy;
})(ChangeDetectionStrategy || {});
var TRACKED_LVIEWS = /*#__PURE__*/ new Map();
var uniqueIdCounter = 0;
function getUniqueLViewId() {
	return uniqueIdCounter++;
}
function registerLView(lView) {
	TRACKED_LVIEWS.set(lView[19], lView);
}
function unregisterLView(lView) {
	TRACKED_LVIEWS.delete(lView[19]);
}
var MONKEY_PATCH_KEY_NAME = "__ngContext__";
function attachPatchData(target, data) {
	if (isLView(data)) {
		target[MONKEY_PATCH_KEY_NAME] = data[19];
		registerLView(data);
	} else target[MONKEY_PATCH_KEY_NAME] = data;
}
function getFirstLContainer(lView) {
	return getNearestLContainer(lView[12]);
}
function getNextLContainer(container) {
	return getNearestLContainer(container[4]);
}
function getNearestLContainer(viewOrContainer) {
	while (viewOrContainer !== null && !isLContainer(viewOrContainer)) viewOrContainer = viewOrContainer[4];
	return viewOrContainer;
}
var DOCUMENT = void 0;
function setDocument(document) {
	DOCUMENT = document;
}
function getDocument() {
	if (DOCUMENT !== void 0) return DOCUMENT;
	else if (typeof document !== "undefined") return document;
	throw new RuntimeError(210, false);
}
var PRESERVE_HOST_CONTENT_DEFAULT = false;
var PRESERVE_HOST_CONTENT = /*#__PURE__*/ new InjectionToken("", { factory: () => PRESERVE_HOST_CONTENT_DEFAULT });
function isDetachedByI18n(tNode) {
	return (tNode.flags & 32) === 32;
}
var _retrieveHydrationInfoImpl = () => null;
function retrieveHydrationInfo(rNode, injector, isRootView = false) {
	return _retrieveHydrationInfoImpl(rNode, injector, isRootView);
}
function refreshContentQueries(tView, lView) {
	const contentQueries = tView.contentQueries;
	if (contentQueries !== null) {
		const prevConsumer = setActiveConsumer(null);
		try {
			for (let i = 0; i < contentQueries.length; i += 2) {
				const queryStartIdx = contentQueries[i];
				const directiveDefIdx = contentQueries[i + 1];
				if (directiveDefIdx !== -1) {
					const directiveDef = tView.data[directiveDefIdx];
					setCurrentQueryIndex(queryStartIdx);
					directiveDef.contentQueries(2, lView[directiveDefIdx], directiveDefIdx);
				}
			}
		} finally {
			setActiveConsumer(prevConsumer);
		}
	}
}
function executeViewQueryFn(flags, viewQueryFn, component) {
	setCurrentQueryIndex(0);
	const prevConsumer = setActiveConsumer(null);
	try {
		viewQueryFn(flags, component);
	} finally {
		setActiveConsumer(prevConsumer);
	}
}
function executeContentQueries(tView, tNode, lView) {
	if (isContentQueryHost(tNode)) {
		const prevConsumer = setActiveConsumer(null);
		try {
			const start = tNode.directiveStart;
			const end = tNode.directiveEnd;
			for (let directiveIndex = start; directiveIndex < end; directiveIndex++) {
				const def = tView.data[directiveIndex];
				if (def.contentQueries) {
					const directiveInstance = lView[directiveIndex];
					def.contentQueries(1, directiveInstance, directiveIndex);
				}
			}
		} finally {
			setActiveConsumer(prevConsumer);
		}
	}
}
var ViewEncapsulation = /*#__PURE__*/ (function(ViewEncapsulation) {
	ViewEncapsulation[ViewEncapsulation["Emulated"] = 0] = "Emulated";
	ViewEncapsulation[ViewEncapsulation["None"] = 2] = "None";
	ViewEncapsulation[ViewEncapsulation["ShadowDom"] = 3] = "ShadowDom";
	ViewEncapsulation[ViewEncapsulation["ExperimentalIsolatedShadowDom"] = 4] = "ExperimentalIsolatedShadowDom";
	return ViewEncapsulation;
})(ViewEncapsulation || {});
function createElementNode(renderer, name, namespace) {
	return renderer.createElement(name, namespace);
}
function nativeInsertBefore(renderer, parent, child, beforeNode, isMove) {
	renderer.insertBefore(parent, child, beforeNode, isMove);
}
function nativeAppendChild(renderer, parent, child) {
	renderer.appendChild(parent, child);
}
function nativeAppendOrInsertBefore(renderer, parent, child, beforeNode, isMove) {
	if (beforeNode !== null) nativeInsertBefore(renderer, parent, child, beforeNode, isMove);
	else nativeAppendChild(renderer, parent, child);
}
function nativeRemoveNode(renderer, rNode, isHostElement, requireSynchronousElementRemoval) {
	renderer.removeChild(null, rNode, isHostElement, requireSynchronousElementRemoval);
}
function writeDirectStyle(renderer, element, newValue) {
	renderer.setAttribute(element, "style", newValue);
}
function writeDirectClass(renderer, element, newValue) {
	if (newValue === "") renderer.removeAttribute(element, "class");
	else renderer.setAttribute(element, "class", newValue);
}
function setupStaticAttributes(renderer, element, tNode) {
	const { mergedAttrs, classes, styles } = tNode;
	if (mergedAttrs !== null) setUpAttributes(renderer, element, mergedAttrs);
	if (classes !== null) writeDirectClass(renderer, element, classes);
	if (styles !== null) writeDirectStyle(renderer, element, styles);
}
function classIndexOf(className, classToSearch, startingIndex) {
	let end = className.length;
	while (true) {
		const foundIndex = className.indexOf(classToSearch, startingIndex);
		if (foundIndex === -1) return foundIndex;
		if (foundIndex === 0 || className.charCodeAt(foundIndex - 1) <= 32) {
			const length = classToSearch.length;
			if (foundIndex + length === end || className.charCodeAt(foundIndex + length) <= 32) return foundIndex;
		}
		startingIndex = foundIndex + 1;
	}
}
var NG_TEMPLATE_SELECTOR = "ng-template";
function isCssClassMatching(tNode, attrs, cssClassToMatch, isProjectionMode) {
	let i = 0;
	if (isProjectionMode) {
		for (; i < attrs.length && typeof attrs[i] === "string"; i += 2) if (attrs[i] === "class" && classIndexOf(attrs[i + 1].toLowerCase(), cssClassToMatch, 0) !== -1) return true;
	} else if (isInlineTemplate(tNode)) return false;
	i = attrs.indexOf(1, i);
	if (i > -1) {
		let item;
		while (++i < attrs.length && typeof (item = attrs[i]) === "string") if (item.toLowerCase() === cssClassToMatch) return true;
	}
	return false;
}
function isInlineTemplate(tNode) {
	return tNode.type === 4 && tNode.value !== NG_TEMPLATE_SELECTOR;
}
function hasTagAndTypeMatch(tNode, currentSelector, isProjectionMode) {
	return currentSelector === (tNode.type === 4 && !isProjectionMode ? NG_TEMPLATE_SELECTOR : tNode.value);
}
function isNodeMatchingSelector(tNode, selector, isProjectionMode) {
	let mode = 4;
	const nodeAttrs = tNode.attrs;
	const nameOnlyMarkerIdx = nodeAttrs !== null ? getNameOnlyMarkerIndex(nodeAttrs) : 0;
	let skipToNextSelector = false;
	for (let i = 0; i < selector.length; i++) {
		const current = selector[i];
		if (typeof current === "number") {
			if (!skipToNextSelector && !isPositive(mode) && !isPositive(current)) return false;
			if (skipToNextSelector && isPositive(current)) continue;
			skipToNextSelector = false;
			mode = current | mode & 1;
			continue;
		}
		if (skipToNextSelector) continue;
		if (mode & 4) {
			mode = 2 | mode & 1;
			if (current !== "" && !hasTagAndTypeMatch(tNode, current, isProjectionMode) || current === "" && selector.length === 1) {
				if (isPositive(mode)) return false;
				skipToNextSelector = true;
			}
		} else if (mode & 8) {
			if (nodeAttrs === null || !isCssClassMatching(tNode, nodeAttrs, current, isProjectionMode)) {
				if (isPositive(mode)) return false;
				skipToNextSelector = true;
			}
		} else {
			const selectorAttrValue = selector[++i];
			const attrIndexInNode = findAttrIndexInNode(current, nodeAttrs, isInlineTemplate(tNode), isProjectionMode);
			if (attrIndexInNode === -1) {
				if (isPositive(mode)) return false;
				skipToNextSelector = true;
				continue;
			}
			if (selectorAttrValue !== "") {
				let nodeAttrValue;
				if (attrIndexInNode > nameOnlyMarkerIdx) nodeAttrValue = "";
				else nodeAttrValue = nodeAttrs[attrIndexInNode + 1].toLowerCase();
				if (mode & 2 && selectorAttrValue !== nodeAttrValue) {
					if (isPositive(mode)) return false;
					skipToNextSelector = true;
				}
			}
		}
	}
	return isPositive(mode) || skipToNextSelector;
}
function isPositive(mode) {
	return (mode & 1) === 0;
}
function findAttrIndexInNode(name, attrs, isInlineTemplate, isProjectionMode) {
	if (attrs === null) return -1;
	let i = 0;
	if (isProjectionMode || !isInlineTemplate) {
		let bindingsMode = false;
		while (i < attrs.length) {
			const maybeAttrName = attrs[i];
			if (maybeAttrName === name) return i;
			else if (maybeAttrName === 3 || maybeAttrName === 6) bindingsMode = true;
			else if (maybeAttrName === 1 || maybeAttrName === 2) {
				let value = attrs[++i];
				while (typeof value === "string") value = attrs[++i];
				continue;
			} else if (maybeAttrName === 4) break;
			else if (maybeAttrName === 0) {
				i += 4;
				continue;
			}
			i += bindingsMode ? 1 : 2;
		}
		return -1;
	} else return matchTemplateAttribute(attrs, name);
}
function isNodeMatchingSelectorList(tNode, selector, isProjectionMode = false) {
	for (let i = 0; i < selector.length; i++) if (isNodeMatchingSelector(tNode, selector[i], isProjectionMode)) return true;
	return false;
}
function getNameOnlyMarkerIndex(nodeAttrs) {
	for (let i = 0; i < nodeAttrs.length; i++) {
		const nodeAttr = nodeAttrs[i];
		if (isNameOnlyAttributeMarker(nodeAttr)) return i;
	}
	return nodeAttrs.length;
}
function matchTemplateAttribute(attrs, name) {
	let i = attrs.indexOf(4);
	if (i > -1) {
		i++;
		while (i < attrs.length) {
			const attr = attrs[i];
			if (typeof attr === "number") return -1;
			if (attr === name) return i;
			i++;
		}
	}
	return -1;
}
function maybeWrapInNotSelector(isNegativeMode, chunk) {
	return isNegativeMode ? ":not(" + chunk.trim() + ")" : chunk;
}
function stringifyCSSSelector(selector) {
	let result = selector[0];
	let i = 1;
	let mode = 2;
	let currentChunk = "";
	let isNegativeMode = false;
	while (i < selector.length) {
		let valueOrMarker = selector[i];
		if (typeof valueOrMarker === "string") {
			if (mode & 2) {
				const attrValue = selector[++i];
				currentChunk += "[" + valueOrMarker + (attrValue.length > 0 ? "=\"" + attrValue + "\"" : "") + "]";
			} else if (mode & 8) currentChunk += "." + valueOrMarker;
			else if (mode & 4) currentChunk += " " + valueOrMarker;
		} else {
			if (currentChunk !== "" && !isPositive(valueOrMarker)) {
				result += maybeWrapInNotSelector(isNegativeMode, currentChunk);
				currentChunk = "";
			}
			mode = valueOrMarker;
			isNegativeMode = isNegativeMode || !isPositive(mode);
		}
		i++;
	}
	if (currentChunk !== "") result += maybeWrapInNotSelector(isNegativeMode, currentChunk);
	return result;
}
function stringifyCSSSelectorList(selectorList) {
	return selectorList.map(stringifyCSSSelector).join(",");
}
function extractAttrsAndClassesFromSelector(selector) {
	const attrs = [];
	const classes = [];
	let i = 1;
	let mode = 2;
	while (i < selector.length) {
		let valueOrMarker = selector[i];
		if (typeof valueOrMarker === "string") {
			if (mode === 2) {
				if (valueOrMarker !== "") attrs.push(valueOrMarker, selector[++i]);
			} else if (mode === 8) classes.push(valueOrMarker);
		} else {
			if (!isPositive(mode)) break;
			mode = valueOrMarker;
		}
		i++;
	}
	if (classes.length) attrs.push(1, ...classes);
	return attrs;
}
var NO_CHANGE = {};
var RendererStyleFlags2 = /*#__PURE__*/ (function(RendererStyleFlags2) {
	RendererStyleFlags2[RendererStyleFlags2["Important"] = 1] = "Important";
	RendererStyleFlags2[RendererStyleFlags2["DashCase"] = 2] = "DashCase";
	return RendererStyleFlags2;
})(RendererStyleFlags2 || {});
var _icuContainerIterate;
function icuContainerIterate(tIcuContainerNode, lView) {
	return _icuContainerIterate(tIcuContainerNode, lView);
}
var allLeavingAnimations = /*#__PURE__*/ new Set();
typeof document !== "undefined" && document?.documentElement?.getAnimations;
var leavingNodes = /*#__PURE__*/ new WeakMap();
function getDeclarationView(lView) {
	if (!lView) return null;
	return lView[14] ?? lView;
}
var reusedNodes = /*#__PURE__*/ new WeakSet();
function cancelLeavingNodes(tNode, newElement, newLView) {
	const nodes = leavingNodes.get(tNode);
	if (!nodes || nodes.length === 0) return;
	const newParent = newElement.parentNode;
	const prevSibling = newElement.previousSibling;
	const newDeclarationView = getDeclarationView(newLView);
	for (let i = nodes.length - 1; i >= 0; i--) {
		const { el: leavingEl, declarationView: leavingDeclarationView } = nodes[i];
		const leavingParent = leavingEl.parentNode;
		if (leavingEl === newElement) {
			nodes.splice(i, 1);
			reusedNodes.add(leavingEl);
			leavingEl.dispatchEvent(new CustomEvent("animationend", { detail: { cancel: true } }));
		} else if (prevSibling && leavingEl === prevSibling) {
			nodes.splice(i, 1);
			leavingEl.dispatchEvent(new CustomEvent("animationend", { detail: { cancel: true } }));
			leavingEl.parentNode?.removeChild(leavingEl);
		} else if (leavingParent && newParent && leavingParent !== newParent) {
			if (newDeclarationView === null || leavingDeclarationView === null || newDeclarationView === leavingDeclarationView) {
				nodes.splice(i, 1);
				leavingEl.dispatchEvent(new CustomEvent("animationend", { detail: { cancel: true } }));
				leavingEl.parentNode?.removeChild(leavingEl);
			}
		}
	}
}
function trackLeavingNodes(tNode, el, lView) {
	const declarationView = getDeclarationView(lView);
	const nodes = leavingNodes.get(tNode);
	if (nodes) {
		if (!nodes.some((node) => node.el === el)) nodes.push({
			el,
			declarationView
		});
	} else leavingNodes.set(tNode, [{
		el,
		declarationView
	}]);
}
var TracingAction = /*#__PURE__*/ (function(TracingAction) {
	TracingAction[TracingAction["CHANGE_DETECTION"] = 0] = "CHANGE_DETECTION";
	TracingAction[TracingAction["AFTER_NEXT_RENDER"] = 1] = "AFTER_NEXT_RENDER";
	return TracingAction;
})(TracingAction || {});
var TracingService = /*#__PURE__*/ new InjectionToken("");
var markedFeatures = /*#__PURE__*/ new Set();
function performanceMarkFeature(feature) {
	if (markedFeatures.has(feature)) return;
	markedFeatures.add(feature);
	performance?.mark?.("mark_feature_usage", { detail: { feature } });
}
var AfterRenderManager = /*#__PURE__*/ (() => {
	class AfterRenderManager {
		impl = null;
		execute() {
			this.impl?.execute();
		}
		static ɵprov = /* @__PURE__ */ ɵɵdefineInjectable({
			token: AfterRenderManager,
			providedIn: "root",
			factory: () => new AfterRenderManager()
		});
	}
	return AfterRenderManager;
})();
var ANIMATION_QUEUE = /*#__PURE__*/ new InjectionToken("", { factory: () => {
	const injector = inject(EnvironmentInjector);
	const queue = /* @__PURE__ */ new Set();
	injector.onDestroy(() => queue.clear());
	return {
		queue,
		isScheduled: false,
		scheduler: null,
		injector
	};
} });
function addToAnimationQueue(injector, animationFns, animationData) {
	const animationQueue = injector.get(ANIMATION_QUEUE);
	if (Array.isArray(animationFns)) for (const animateFn of animationFns) {
		animationQueue.queue.add(animateFn);
		animationData?.detachedLeaveAnimationFns?.push(animateFn);
	}
	else {
		animationQueue.queue.add(animationFns);
		animationData?.detachedLeaveAnimationFns?.push(animationFns);
	}
	animationQueue.scheduler && animationQueue.scheduler(injector);
}
function removeAnimationsFromQueue(injector, animationFns) {
	const animationQueue = injector.get(ANIMATION_QUEUE);
	if (Array.isArray(animationFns)) for (const animateFn of animationFns) animationQueue.queue.delete(animateFn);
	else animationQueue.queue.delete(animationFns);
}
function queueEnterAnimations(injector, enterAnimations) {
	for (const [_, nodeAnimations] of enterAnimations) addToAnimationQueue(injector, nodeAnimations.animateFns);
}
function maybeQueueEnterAnimation(parentLView, parent, tNode, injector) {
	const enterAnimations = parentLView?.[26]?.enter;
	if (parent !== null && enterAnimations && enterAnimations.has(tNode.index)) queueEnterAnimations(injector, enterAnimations);
}
function runLeaveAnimationsWithCallback(lView, tNode, injector, callback) {
	try {
		injector.get(INJECTOR$1);
	} catch {
		return callback(false);
	}
	const animations = lView?.[26];
	if (animations?.enter?.has(tNode.index)) removeAnimationsFromQueue(injector, animations.enter.get(tNode.index).animateFns);
	const nodesWithExitAnimations = aggregateDescendantAnimations(lView, tNode, animations);
	if (nodesWithExitAnimations.size === 0) {
		let hasNestedAnimations = false;
		if (lView) {
			const nestedPromises = [];
			collectNestedViewAnimations(lView, tNode, nestedPromises);
			hasNestedAnimations = nestedPromises.length > 0;
		}
		if (!hasNestedAnimations) return callback(false);
	}
	if (lView) allLeavingAnimations.add(lView[19]);
	addToAnimationQueue(injector, () => executeLeaveAnimations(lView, tNode, animations || void 0, nodesWithExitAnimations, callback), animations || void 0);
}
function aggregateDescendantAnimations(lView, tNode, animations) {
	const nodesWithExitAnimations = /* @__PURE__ */ new Map();
	const leaveAnimations = animations?.leave;
	if (leaveAnimations && leaveAnimations.has(tNode.index)) nodesWithExitAnimations.set(tNode.index, leaveAnimations.get(tNode.index));
	if (lView && leaveAnimations) for (const [index, animationData] of leaveAnimations) {
		if (nodesWithExitAnimations.has(index)) continue;
		let parent = lView[1].data[index].parent;
		while (parent) {
			if (parent === tNode) {
				nodesWithExitAnimations.set(index, animationData);
				break;
			}
			parent = parent.parent;
		}
	}
	return nodesWithExitAnimations;
}
function executeLeaveAnimations(lView, tNode, animations, nodesWithExitAnimations, callback) {
	const runningAnimations = [];
	if (animations && animations.leave) for (const [index] of nodesWithExitAnimations) {
		if (!animations.leave.has(index)) continue;
		const currentAnimationData = animations.leave.get(index);
		for (const animationFn of currentAnimationData.animateFns) {
			const { promise } = animationFn();
			runningAnimations.push(promise);
		}
		animations.detachedLeaveAnimationFns = void 0;
	}
	if (lView) collectNestedViewAnimations(lView, tNode, runningAnimations);
	if (runningAnimations.length > 0) {
		const currentAnimations = animations || lView?.[26];
		if (currentAnimations) {
			const prevRunning = currentAnimations.running;
			if (prevRunning) runningAnimations.push(prevRunning);
			currentAnimations.running = Promise.allSettled(runningAnimations);
			runAfterLeaveAnimations(lView, currentAnimations.running, callback);
		} else Promise.allSettled(runningAnimations).then(() => {
			if (lView) allLeavingAnimations.delete(lView[19]);
			callback(true);
		});
	} else {
		if (lView) allLeavingAnimations.delete(lView[19]);
		callback(false);
	}
}
function collectNestedViewAnimations(lView, tNode, collectedPromises) {
	if (tNode.type & 12) {
		const lContainer = lView[tNode.index];
		if (isLContainer(lContainer)) for (let i = 10; i < lContainer.length; i++) {
			const subView = lContainer[i];
			if (subView[1].type === 2) collectAllViewLeaveAnimations(subView, collectedPromises);
		}
	}
	let child = tNode.child;
	while (child) {
		collectNestedViewAnimations(lView, child, collectedPromises);
		child = child.next;
	}
}
function collectAllViewLeaveAnimations(view, collectedPromises) {
	const animations = view[26];
	if (animations && animations.leave) for (const animationData of animations.leave.values()) for (const animationFn of animationData.animateFns) {
		const { promise } = animationFn();
		collectedPromises.push(promise);
	}
	let child = view[1].firstChild;
	while (child) {
		collectNestedViewAnimations(view, child, collectedPromises);
		child = child.next;
	}
}
function runAfterLeaveAnimations(lView, runningAnimations, callback) {
	runningAnimations.then(() => {
		if (lView[26]?.running === runningAnimations) {
			lView[26].running = void 0;
			allLeavingAnimations.delete(lView[19]);
		}
		callback(true);
	});
}
function applyToElementOrContainer(action, renderer, injector, parent, lNodeToHandle, tNode, beforeNode, parentLView) {
	if (lNodeToHandle != null) {
		let lContainer;
		let isComponent = false;
		if (isLContainer(lNodeToHandle)) lContainer = lNodeToHandle;
		else if (isLView(lNodeToHandle)) {
			isComponent = true;
			lNodeToHandle = lNodeToHandle[0];
		}
		const rNode = unwrapRNode(lNodeToHandle);
		if (action === 0 && parent !== null) {
			maybeQueueEnterAnimation(parentLView, parent, tNode, injector);
			if (beforeNode == null) nativeAppendChild(renderer, parent, rNode);
			else nativeInsertBefore(renderer, parent, rNode, beforeNode || null, true);
		} else if (action === 1 && parent !== null) {
			maybeQueueEnterAnimation(parentLView, parent, tNode, injector);
			nativeInsertBefore(renderer, parent, rNode, beforeNode || null, true);
			cancelLeavingNodes(tNode, rNode, parentLView);
		} else if (action === 2) {
			if (parentLView?.[26]?.leave?.has(tNode.index)) trackLeavingNodes(tNode, rNode, parentLView);
			reusedNodes.delete(rNode);
			runLeaveAnimationsWithCallback(parentLView, tNode, injector, (nodeHasLeaveAnimations) => {
				if (reusedNodes.has(rNode)) {
					reusedNodes.delete(rNode);
					return;
				}
				nativeRemoveNode(renderer, rNode, isComponent, nodeHasLeaveAnimations);
			});
		} else if (action === 3) {
			reusedNodes.delete(rNode);
			runLeaveAnimationsWithCallback(parentLView, tNode, injector, () => {
				renderer.destroyNode(rNode);
			});
		}
		if (lContainer != null) applyContainer(renderer, action, injector, lContainer, tNode, parent, beforeNode);
	}
}
function removeViewFromDOM(tView, lView) {
	detachViewFromDOM(tView, lView);
	lView[0] = null;
	lView[5] = null;
}
function detachViewFromDOM(tView, lView) {
	lView[10].changeDetectionScheduler?.notify(9);
	applyView(tView, lView, lView[11], 2, null, null);
}
function destroyViewTree(rootView) {
	let lViewOrLContainer = rootView[12];
	if (!lViewOrLContainer) return cleanUpView(rootView[1], rootView);
	while (lViewOrLContainer) {
		let next = null;
		if (isLView(lViewOrLContainer)) next = lViewOrLContainer[12];
		else {
			const firstView = lViewOrLContainer[10];
			if (firstView) next = firstView;
		}
		if (!next) {
			while (lViewOrLContainer && !lViewOrLContainer[4] && lViewOrLContainer !== rootView) {
				if (isLView(lViewOrLContainer)) cleanUpView(lViewOrLContainer[1], lViewOrLContainer);
				lViewOrLContainer = lViewOrLContainer[3];
			}
			if (lViewOrLContainer === null) lViewOrLContainer = rootView;
			if (isLView(lViewOrLContainer)) cleanUpView(lViewOrLContainer[1], lViewOrLContainer);
			next = lViewOrLContainer && lViewOrLContainer[4];
		}
		lViewOrLContainer = next;
	}
}
function detachMovedView(declarationContainer, lView) {
	const movedViews = declarationContainer[9];
	const declarationViewIndex = movedViews.indexOf(lView);
	movedViews.splice(declarationViewIndex, 1);
}
function destroyLView(tView, lView) {
	if (isDestroyed(lView)) return;
	const renderer = lView[11];
	if (renderer.destroyNode) applyView(tView, lView, renderer, 3, null, null);
	destroyViewTree(lView);
}
function cleanUpView(tView, lView) {
	if (isDestroyed(lView)) return;
	const prevConsumer = setActiveConsumer(null);
	try {
		lView[2] &= -129;
		lView[2] |= 256;
		lView[24] && consumerDestroy(lView[24]);
		executeOnDestroys(tView, lView);
		processCleanups(tView, lView);
		if (lView[1].type === 1) lView[11].destroy();
		const declarationContainer = lView[16];
		if (declarationContainer !== null && isLContainer(lView[3])) {
			if (declarationContainer !== lView[3]) detachMovedView(declarationContainer, lView);
			const lQueries = lView[18];
			if (lQueries !== null) lQueries.detachView(tView);
		}
		unregisterLView(lView);
	} finally {
		setActiveConsumer(prevConsumer);
	}
}
function processCleanups(tView, lView) {
	const tCleanup = tView.cleanup;
	const lCleanup = lView[7];
	if (tCleanup !== null) for (let i = 0; i < tCleanup.length - 1; i += 2) if (typeof tCleanup[i] === "string") {
		const targetIdx = tCleanup[i + 3];
		if (targetIdx >= 0) lCleanup[targetIdx]();
		else lCleanup[-targetIdx].unsubscribe();
		i += 2;
	} else {
		const context = lCleanup[tCleanup[i + 1]];
		tCleanup[i].call(context);
	}
	if (lCleanup !== null) lView[7] = null;
	const destroyHooks = lView[21];
	if (destroyHooks !== null) {
		lView[21] = null;
		for (let i = 0; i < destroyHooks.length; i++) {
			const destroyHooksFn = destroyHooks[i];
			destroyHooksFn();
		}
	}
	const effects = lView[23];
	if (effects !== null) {
		lView[23] = null;
		for (const effect of effects) effect.destroy();
	}
}
function executeOnDestroys(tView, lView) {
	let destroyHooks;
	if (tView != null && (destroyHooks = tView.destroyHooks) != null) for (let i = 0; i < destroyHooks.length; i += 2) {
		const context = lView[destroyHooks[i]];
		if (!(context instanceof NodeInjectorFactory)) {
			const toCall = destroyHooks[i + 1];
			if (Array.isArray(toCall)) for (let j = 0; j < toCall.length; j += 2) {
				const callContext = context[toCall[j]];
				const hook = toCall[j + 1];
				profiler(ProfilerEvent.LifecycleHookStart, callContext, hook);
				try {
					hook.call(callContext);
				} finally {
					profiler(ProfilerEvent.LifecycleHookEnd, callContext, hook);
				}
			}
			else {
				profiler(ProfilerEvent.LifecycleHookStart, context, toCall);
				try {
					toCall.call(context);
				} finally {
					profiler(ProfilerEvent.LifecycleHookEnd, context, toCall);
				}
			}
		}
	}
}
function getParentRElement(tView, tNode, lView) {
	return getClosestRElement(tView, tNode.parent, lView);
}
function getClosestRElement(tView, tNode, lView) {
	let parentTNode = tNode;
	while (parentTNode !== null && parentTNode.type & 168) {
		tNode = parentTNode;
		parentTNode = tNode.parent;
	}
	if (parentTNode === null) return lView[0];
	else {
		if (isComponentHost(parentTNode)) {
			const { encapsulation } = tView.data[parentTNode.directiveStart + parentTNode.componentOffset];
			if (encapsulation === ViewEncapsulation.None || encapsulation === ViewEncapsulation.Emulated) return null;
		}
		return getNativeByTNode(parentTNode, lView);
	}
}
function getInsertInFrontOfRNode(parentTNode, currentTNode, lView) {
	return _getInsertInFrontOfRNodeWithI18n(parentTNode, currentTNode, lView);
}
function getInsertInFrontOfRNodeWithNoI18n(parentTNode, currentTNode, lView) {
	if (parentTNode.type & 40) return getNativeByTNode(parentTNode, lView);
	return null;
}
var _getInsertInFrontOfRNodeWithI18n = getInsertInFrontOfRNodeWithNoI18n;
function appendChild(tView, lView, childRNode, childTNode) {
	const parentRNode = getParentRElement(tView, childTNode, lView);
	const renderer = lView[11];
	const anchorNode = getInsertInFrontOfRNode(childTNode.parent || lView[5], childTNode, lView);
	if (parentRNode != null) {
		if (Array.isArray(childRNode)) for (let i = 0; i < childRNode.length; i++) nativeAppendOrInsertBefore(renderer, parentRNode, childRNode[i], anchorNode, false);
		else nativeAppendOrInsertBefore(renderer, parentRNode, childRNode, anchorNode, false);
	}
}
function getProjectionNodes(lView, tNode) {
	if (tNode !== null) {
		const componentHost = lView[15][5];
		const slotIdx = tNode.projection;
		return componentHost.projection[slotIdx];
	}
	return null;
}
function applyNodes(renderer, action, tNode, lView, parentRElement, beforeNode, isProjection) {
	while (tNode != null) {
		const injector = lView[9];
		if (tNode.type === 128) {
			tNode = tNode.next;
			continue;
		}
		const rawSlotValue = lView[tNode.index];
		const tNodeType = tNode.type;
		if (isProjection) {
			if (action === 0) {
				rawSlotValue && attachPatchData(unwrapRNode(rawSlotValue), lView);
				tNode.flags |= 2;
			}
		}
		if (!isDetachedByI18n(tNode)) {
			if (tNodeType & 8) {
				applyNodes(renderer, action, tNode.child, lView, parentRElement, beforeNode, false);
				applyToElementOrContainer(action, renderer, injector, parentRElement, rawSlotValue, tNode, beforeNode, lView);
			} else if (tNodeType & 32) {
				const nextRNode = icuContainerIterate(tNode, lView);
				let rNode;
				while (rNode = nextRNode()) applyToElementOrContainer(action, renderer, injector, parentRElement, rNode, tNode, beforeNode, lView);
				applyToElementOrContainer(action, renderer, injector, parentRElement, rawSlotValue, tNode, beforeNode, lView);
			} else if (tNodeType & 16) applyProjectionRecursive(renderer, action, lView, tNode, parentRElement, beforeNode);
			else applyToElementOrContainer(action, renderer, injector, parentRElement, rawSlotValue, tNode, beforeNode, lView);
		}
		tNode = isProjection ? tNode.projectionNext : tNode.next;
	}
}
function applyView(tView, lView, renderer, action, parentRElement, beforeNode) {
	if (tView.type === 3) applyForeignNodes(renderer, action, lView, parentRElement, beforeNode);
	else applyNodes(renderer, action, tView.firstChild, lView, parentRElement, beforeNode, false);
}
function applyForeignNodes(renderer, action, lView, parent, beforeNode) {
	const headTNode = lView[1].firstChild;
	const tailTNode = headTNode.next;
	const head = unwrapRNode(lView[headTNode.index]);
	const tail = unwrapRNode(lView[tailTNode.index]);
	const fragmentSlotIndex = tailTNode.index + 1;
	let fragment = lView[fragmentSlotIndex];
	if (action === 1 || action === 0) {
		if (parent !== null) {
			if (fragment && fragment.hasChildNodes()) nativeInsertBefore(renderer, parent, fragment, beforeNode, true);
			else {
				nativeInsertBefore(renderer, parent, head, beforeNode, true);
				nativeInsertBefore(renderer, parent, tail, beforeNode, true);
			}
		}
	} else if (action === 2) {
		if (!fragment) {
			fragment = document.createDocumentFragment();
			lView[fragmentSlotIndex] = fragment;
		}
		if (head && head.parentNode === fragment) return;
		let current = head;
		while (current !== null) {
			const next = current.nextSibling;
			fragment.appendChild(current);
			if (current === tail) break;
			current = next;
		}
	}
}
function applyProjectionRecursive(renderer, action, lView, tProjectionNode, parentRElement, beforeNode) {
	const componentLView = lView[15];
	const nodeToProjectOrRNodes = componentLView[5].projection[tProjectionNode.projection];
	if (Array.isArray(nodeToProjectOrRNodes)) for (let i = 0; i < nodeToProjectOrRNodes.length; i++) {
		const rNode = nodeToProjectOrRNodes[i];
		applyToElementOrContainer(action, renderer, lView[9], parentRElement, rNode, tProjectionNode, beforeNode, lView);
	}
	else {
		let nodeToProject = nodeToProjectOrRNodes;
		const projectedComponentLView = componentLView[3];
		if (hasInSkipHydrationBlockFlag(tProjectionNode)) nodeToProject.flags |= 128;
		applyNodes(renderer, action, nodeToProject, projectedComponentLView, parentRElement, beforeNode, true);
	}
}
function applyContainer(renderer, action, injector, lContainer, tNode, parentRElement, beforeNode) {
	const anchor = lContainer[7];
	if (anchor !== unwrapRNode(lContainer)) applyToElementOrContainer(action, renderer, injector, parentRElement, anchor, tNode, beforeNode);
	if ((lContainer[2] & 4) !== 0) return;
	for (let i = 10; i < lContainer.length; i++) {
		const lView = lContainer[i];
		applyView(lView[1], lView, renderer, action, parentRElement, anchor);
	}
}
function createTView(type, declTNode, templateFn, decls, vars, directives, pipes, viewQuery, schemas, constsOrFactory, ssrId) {
	const bindingStartIndex = 27 + decls;
	const initialViewLength = bindingStartIndex + vars;
	const blueprint = createViewBlueprint(bindingStartIndex, initialViewLength);
	const consts = typeof constsOrFactory === "function" ? constsOrFactory() : constsOrFactory;
	return blueprint[1] = {
		type,
		blueprint,
		template: templateFn,
		queries: null,
		viewQuery,
		declTNode,
		data: blueprint.slice().fill(null, bindingStartIndex),
		bindingStartIndex,
		expandoStartIndex: initialViewLength,
		hostBindingOpCodes: null,
		firstCreatePass: true,
		firstUpdatePass: true,
		staticViewQueries: false,
		staticContentQueries: false,
		preOrderHooks: null,
		preOrderCheckHooks: null,
		contentHooks: null,
		contentCheckHooks: null,
		viewHooks: null,
		viewCheckHooks: null,
		destroyHooks: null,
		cleanup: null,
		contentQueries: null,
		components: null,
		directiveRegistry: typeof directives === "function" ? directives() : directives,
		pipeRegistry: typeof pipes === "function" ? pipes() : pipes,
		firstChild: null,
		schemas,
		consts,
		incompleteFirstPass: false,
		ssrId
	};
}
function createViewBlueprint(bindingStartIndex, initialViewLength) {
	const blueprint = [];
	for (let i = 0; i < initialViewLength; i++) blueprint.push(i < bindingStartIndex ? null : NO_CHANGE);
	return blueprint;
}
function getOrCreateComponentTView(def) {
	const tView = def.tView;
	if (tView === null || tView.incompleteFirstPass) return def.tView = createTView(1, null, def.template, def.decls, def.vars, def.directiveDefs, def.pipeDefs, def.viewQuery, def.schemas, def.consts, def.id);
	return tView;
}
function createLView(parentLView, tView, context, flags, host, tHostNode, environment, renderer, injector, embeddedViewInjector, hydrationInfo) {
	const lView = tView.blueprint.slice();
	lView[0] = host;
	lView[2] = flags | 1228;
	if (embeddedViewInjector !== null || parentLView && parentLView[2] & 2048) lView[2] |= 2048;
	resetPreOrderHookFlags(lView);
	lView[3] = lView[14] = parentLView;
	lView[8] = context;
	lView[10] = environment || parentLView && parentLView[10];
	lView[11] = renderer || parentLView && parentLView[11];
	lView[9] = injector || parentLView && parentLView[9] || null;
	lView[5] = tHostNode;
	lView[19] = getUniqueLViewId();
	lView[6] = hydrationInfo;
	lView[20] = embeddedViewInjector;
	lView[15] = tView.type == 2 ? parentLView[15] : lView;
	return lView;
}
function createComponentLView(lView, hostTNode, def) {
	const native = getNativeByTNode(hostTNode, lView);
	const tView = getOrCreateComponentTView(def);
	const rendererFactory = lView[10].rendererFactory;
	const componentView = addToEndOfViewTree(lView, createLView(lView, tView, null, getInitialLViewFlagsFromDef(def), native, hostTNode, null, rendererFactory.createRenderer(native, def), null, null, null));
	return lView[hostTNode.index] = componentView;
}
function getInitialLViewFlagsFromDef(def) {
	let flags = 16;
	if (def.signals) flags = 4096;
	else if (def.onPush) flags = 64;
	return flags;
}
function allocExpando(tView, lView, numSlotsToAlloc, initialValue) {
	if (numSlotsToAlloc === 0) return -1;
	const allocIdx = lView.length;
	for (let i = 0; i < numSlotsToAlloc; i++) {
		lView.push(initialValue);
		tView.blueprint.push(initialValue);
		tView.data.push(null);
	}
	return allocIdx;
}
function addToEndOfViewTree(lView, lViewOrLContainer) {
	if (lView[12]) lView[13][4] = lViewOrLContainer;
	else lView[12] = lViewOrLContainer;
	lView[13] = lViewOrLContainer;
	return lViewOrLContainer;
}
function selectIndexInternal(tView, lView, index, checkNoChangesMode) {
	if (!checkNoChangesMode) {
		if ((lView[2] & 3) === 3) {
			const preOrderCheckHooks = tView.preOrderCheckHooks;
			if (preOrderCheckHooks !== null) executeCheckHooks(lView, preOrderCheckHooks, index);
		} else {
			const preOrderHooks = tView.preOrderHooks;
			if (preOrderHooks !== null) executeInitAndCheckHooks(lView, preOrderHooks, 0, index);
		}
	}
	setSelectedIndex(index);
}
var InputFlags = /*#__PURE__*/ (function(InputFlags) {
	InputFlags[InputFlags["None"] = 0] = "None";
	InputFlags[InputFlags["SignalBased"] = 1] = "SignalBased";
	InputFlags[InputFlags["HasDecoratorInputTransform"] = 2] = "HasDecoratorInputTransform";
	return InputFlags;
})(InputFlags || {});
function writeToDirectiveInput(def, instance, publicName, value) {
	const prevConsumer = setActiveConsumer(null);
	try {
		const [privateName, flags, transform] = def.inputs[publicName];
		let inputSignalNode = null;
		if ((flags & InputFlags.SignalBased) !== 0) inputSignalNode = instance[privateName][SIGNAL];
		if (inputSignalNode !== null && inputSignalNode.transformFn !== void 0) value = inputSignalNode.transformFn(value);
		else if (transform !== null) value = transform.call(instance, value);
		if (def.setInput !== null) def.setInput(instance, inputSignalNode, value, publicName, privateName);
		else applyValueToInputField(instance, inputSignalNode, privateName, value);
	} finally {
		setActiveConsumer(prevConsumer);
	}
}
function executeTemplate(tView, lView, templateFn, rf, context) {
	const prevSelectedIndex = getSelectedIndex();
	const isUpdatePhase = rf & 2;
	try {
		setSelectedIndex(-1);
		if (isUpdatePhase && lView.length > 27) selectIndexInternal(tView, lView, 27, false);
		profiler(isUpdatePhase ? ProfilerEvent.TemplateUpdateStart : ProfilerEvent.TemplateCreateStart, context, templateFn);
		templateFn(rf, context);
	} finally {
		setSelectedIndex(prevSelectedIndex);
		profiler(isUpdatePhase ? ProfilerEvent.TemplateUpdateEnd : ProfilerEvent.TemplateCreateEnd, context, templateFn);
	}
}
function createDirectivesInstances(tView, lView, tNode) {
	instantiateAllDirectives(tView, lView, tNode);
	if ((tNode.flags & 64) === 64) invokeDirectivesHostBindings(tView, lView, tNode);
}
function saveResolvedLocalsInData(viewData, tNode, localRefExtractor = getNativeByTNode) {
	const localNames = tNode.localNames;
	if (localNames !== null) {
		let localIndex = tNode.index + 1;
		for (let i = 0; i < localNames.length; i += 2) {
			const index = localNames[i + 1];
			const value = index === -1 ? localRefExtractor(tNode, viewData) : viewData[index];
			viewData[localIndex++] = value;
		}
	}
}
function locateHostElement(renderer, elementOrSelector, encapsulation, injector) {
	const preserveContent = injector.get(PRESERVE_HOST_CONTENT, PRESERVE_HOST_CONTENT_DEFAULT) || encapsulation === ViewEncapsulation.ShadowDom || encapsulation === ViewEncapsulation.ExperimentalIsolatedShadowDom;
	return renderer.selectRootElement(elementOrSelector, preserveContent);
}
function instantiateAllDirectives(tView, lView, tNode) {
	const start = tNode.directiveStart;
	const end = tNode.directiveEnd;
	if (isComponentHost(tNode)) createComponentLView(lView, tNode, tView.data[start + tNode.componentOffset]);
	if (!tView.firstCreatePass) getOrCreateNodeInjectorForNode(tNode, lView);
	const initialInputs = tNode.initialInputs;
	for (let i = start; i < end; i++) {
		const def = tView.data[i];
		const directive = getNodeInjectable(lView, tView, i, tNode);
		attachPatchData(directive, lView);
		if (initialInputs !== null) setInputsFromAttrs(lView, i - start, directive, def, tNode, initialInputs);
		if (isComponentDef(def)) {
			const componentView = getComponentLViewByIndex(tNode.index, lView);
			componentView[8] = getNodeInjectable(lView, tView, i, tNode);
		}
	}
}
function invokeDirectivesHostBindings(tView, lView, tNode) {
	const start = tNode.directiveStart;
	const end = tNode.directiveEnd;
	const elementIndex = tNode.index;
	const currentDirectiveIndex = getCurrentDirectiveIndex();
	try {
		setSelectedIndex(elementIndex);
		for (let dirIndex = start; dirIndex < end; dirIndex++) {
			const def = tView.data[dirIndex];
			const directive = lView[dirIndex];
			setCurrentDirectiveIndex(dirIndex);
			if (def.hostBindings !== null || def.hostVars !== 0 || def.hostAttrs !== null) invokeHostBindingsInCreationMode(def, directive);
		}
	} finally {
		setSelectedIndex(-1);
		setCurrentDirectiveIndex(currentDirectiveIndex);
	}
}
function invokeHostBindingsInCreationMode(def, directive) {
	if (def.hostBindings !== null) def.hostBindings(1, directive);
}
function findDirectiveDefMatches(tView, tNode) {
	const registry = tView.directiveRegistry;
	let matches = null;
	if (registry) for (let i = 0; i < registry.length; i++) {
		const def = registry[i];
		if (isNodeMatchingSelectorList(tNode, def.selectors, false)) {
			matches ??= [];
			if (isComponentDef(def)) matches.unshift(def);
			else matches.push(def);
		}
	}
	return matches;
}
function setInputsFromAttrs(lView, directiveIndex, instance, def, tNode, initialInputData) {
	const initialInputs = initialInputData[directiveIndex];
	if (initialInputs !== null) for (let i = 0; i < initialInputs.length; i += 2) {
		const lookupName = initialInputs[i];
		const value = initialInputs[i + 1];
		writeToDirectiveInput(def, instance, lookupName, value);
	}
}
function elementLikeStartShared(tNode, lView, index, name, locateOrCreateNativeNode) {
	const adjustedIndex = 27 + index;
	const tView = lView[1];
	const native = locateOrCreateNativeNode(tView, lView, tNode, name, index);
	lView[adjustedIndex] = native;
	setCurrentTNode(tNode, true);
	const isElement = tNode.type === 2;
	if (isElement) {
		setupStaticAttributes(lView[11], native, tNode);
		if (getElementDepthCount() === 0 || isDirectiveHost(tNode)) attachPatchData(native, lView);
		increaseElementDepthCount();
	} else attachPatchData(native, lView);
	if (wasLastNodeCreated() && (!isElement || !isDetachedByI18n(tNode))) appendChild(tView, lView, native, tNode);
	return tNode;
}
function elementLikeEndShared(tNode) {
	let currentTNode = tNode;
	if (isCurrentTNodeParent()) setCurrentTNodeAsNotParent();
	else {
		currentTNode = currentTNode.parent;
		setCurrentTNode(currentTNode, false);
	}
	return currentTNode;
}
function setAllInputsForProperty(tNode, tView, lView, publicName, value) {
	const inputs = tNode.inputs?.[publicName];
	const hostDirectiveInputs = tNode.hostDirectiveInputs?.[publicName];
	let hasMatch = false;
	if (hostDirectiveInputs) for (let i = 0; i < hostDirectiveInputs.length; i += 2) {
		const index = hostDirectiveInputs[i];
		const publicName = hostDirectiveInputs[i + 1];
		const def = tView.data[index];
		writeToDirectiveInput(def, lView[index], publicName, value);
		hasMatch = true;
	}
	if (inputs) for (const index of inputs) {
		const instance = lView[index];
		const def = tView.data[index];
		writeToDirectiveInput(def, instance, publicName, value);
		hasMatch = true;
	}
	return hasMatch;
}
function renderComponent(hostLView, componentHostIdx) {
	const componentView = getComponentLViewByIndex(componentHostIdx, hostLView);
	const componentTView = componentView[1];
	syncViewWithBlueprint(componentTView, componentView);
	const hostRNode = componentView[0];
	if (hostRNode !== null && componentView[6] === null) componentView[6] = retrieveHydrationInfo(hostRNode, componentView[9]);
	profiler(ProfilerEvent.ComponentStart);
	try {
		renderView(componentTView, componentView, componentView[8]);
	} finally {
		profiler(ProfilerEvent.ComponentEnd, componentView[8]);
	}
}
function syncViewWithBlueprint(tView, lView) {
	for (let i = lView.length; i < tView.blueprint.length; i++) lView.push(tView.blueprint[i]);
}
function renderView(tView, lView, context) {
	enterView(lView);
	try {
		const viewQuery = tView.viewQuery;
		if (viewQuery !== null) executeViewQueryFn(1, viewQuery, context);
		const templateFn = tView.template;
		if (templateFn !== null) executeTemplate(tView, lView, templateFn, 1, context);
		if (tView.firstCreatePass) tView.firstCreatePass = false;
		lView[18]?.finishViewCreation(tView);
		if (tView.staticContentQueries) refreshContentQueries(tView, lView);
		if (tView.staticViewQueries) executeViewQueryFn(2, tView.viewQuery, context);
		const components = tView.components;
		if (components !== null) renderChildComponents(lView, components);
	} catch (error) {
		if (tView.firstCreatePass) {
			tView.incompleteFirstPass = true;
			tView.firstCreatePass = false;
		}
		throw error;
	} finally {
		lView[2] &= -5;
		leaveView();
	}
}
function renderChildComponents(hostLView, components) {
	for (let i = 0; i < components.length; i++) renderComponent(hostLView, components[i]);
}
function collectNativeNodes(tView, lView, tNode, result, isProjection = false) {
	if (tView.type === 3) {
		const headTNode = tView.firstChild;
		const tailTNode = headTNode.next;
		const head = unwrapRNode(lView[headTNode.index]);
		const tail = unwrapRNode(lView[tailTNode.index]);
		let current = head;
		while (current !== null) {
			result.push(current);
			if (current === tail) break;
			current = current.nextSibling;
		}
		return result;
	}
	while (tNode !== null) {
		if (tNode.type === 128) {
			tNode = isProjection ? tNode.projectionNext : tNode.next;
			continue;
		}
		const lNode = lView[tNode.index];
		if (lNode !== null) {
			if (isLContainer(lNode)) {
				const anchor = lNode[7];
				if (anchor !== lNode[0]) result.push(unwrapRNode(lNode));
				if (!(lNode[2] & 4)) collectNativeNodesInLContainer(lNode, result);
				result.push(anchor);
			} else result.push(unwrapRNode(lNode));
		}
		const tNodeType = tNode.type;
		if (tNodeType & 8) collectNativeNodes(tView, lView, tNode.child, result);
		else if (tNodeType & 32) {
			const nextRNode = icuContainerIterate(tNode, lView);
			let rNode;
			while (rNode = nextRNode()) result.push(rNode);
		} else if (tNodeType & 16) {
			const nodesInSlot = getProjectionNodes(lView, tNode);
			if (Array.isArray(nodesInSlot)) result.push(...nodesInSlot);
			else {
				const parentView = getLViewParent(lView[15]);
				collectNativeNodes(parentView[1], parentView, nodesInSlot, result, true);
			}
		}
		tNode = isProjection ? tNode.projectionNext : tNode.next;
	}
	return result;
}
function collectNativeNodesInLContainer(lContainer, result) {
	for (let i = 10; i < lContainer.length; i++) {
		const lViewInAContainer = lContainer[i];
		const lViewFirstChildTNode = lViewInAContainer[1].firstChild;
		if (lViewFirstChildTNode !== null) collectNativeNodes(lViewInAContainer[1], lViewInAContainer, lViewFirstChildTNode, result);
	}
}
function addAfterRenderSequencesForView(lView) {
	if (lView[25] !== null) {
		for (const sequence of lView[25]) sequence.impl.addSequence(sequence);
		lView[25].length = 0;
	}
}
var freeConsumers = [];
function getOrBorrowReactiveLViewConsumer(lView) {
	return lView[24] ?? borrowReactiveLViewConsumer(lView);
}
function borrowReactiveLViewConsumer(lView) {
	const consumer = freeConsumers.pop() ?? Object.create(REACTIVE_LVIEW_CONSUMER_NODE);
	consumer.lView = lView;
	return consumer;
}
function maybeReturnReactiveLViewConsumer(consumer) {
	if (consumer.lView[24] === consumer) return;
	consumer.lView = null;
	freeConsumers.push(consumer);
}
var REACTIVE_LVIEW_CONSUMER_NODE = {
	...REACTIVE_NODE,
	consumerIsAlwaysLive: true,
	kind: "template",
	consumerMarkedDirty: (node) => {
		markAncestorsForTraversal(node.lView);
	},
	consumerOnSignalRead() {
		this.lView[24] = this;
	}
};
function getOrCreateTemporaryConsumer(lView) {
	const consumer = lView[24] ?? Object.create(TEMPORARY_CONSUMER_NODE);
	consumer.lView = lView;
	return consumer;
}
var TEMPORARY_CONSUMER_NODE = {
	...REACTIVE_NODE,
	consumerIsAlwaysLive: true,
	kind: "template",
	consumerMarkedDirty: (node) => {
		let parent = getLViewParent(node.lView);
		while (parent && !viewShouldHaveReactiveConsumer(parent[1])) parent = getLViewParent(parent);
		if (!parent) return;
		markViewForRefresh(parent);
	},
	consumerOnSignalRead() {
		this.lView[24] = this;
	}
};
function viewShouldHaveReactiveConsumer(tView) {
	return tView.type !== 2;
}
function runEffectsInView(view) {
	if (view[23] === null) return;
	let tryFlushEffects = true;
	while (tryFlushEffects) {
		let foundDirtyEffect = false;
		for (const effect of view[23]) {
			if (!effect.dirty) continue;
			foundDirtyEffect = true;
			if (effect.zone === null || Zone.current === effect.zone) effect.run();
			else effect.zone.run(() => effect.run());
			if (view[23] === null) return;
		}
		tryFlushEffects = foundDirtyEffect && !!(view[2] & 8192);
	}
}
var MAXIMUM_REFRESH_RERUNS$1 = 100;
function detectChangesInternal(lView, mode = 0) {
	const rendererFactory = lView[10].rendererFactory;
	rendererFactory.begin?.();
	try {
		detectChangesInViewWhileDirty(lView, mode);
	} finally {
		rendererFactory.end?.();
	}
}
function detectChangesInViewWhileDirty(lView, mode) {
	const lastIsRefreshingViewsValue = isRefreshingViews();
	try {
		setIsRefreshingViews(true);
		detectChangesInView(lView, mode);
		let retries = 0;
		while (requiresRefreshOrTraversal(lView)) {
			if (retries === MAXIMUM_REFRESH_RERUNS$1) throw new RuntimeError(103, false);
			retries++;
			detectChangesInView(lView, 1);
		}
	} finally {
		setIsRefreshingViews(lastIsRefreshingViewsValue);
	}
}
function refreshView(tView, lView, templateFn, context) {
	if (isDestroyed(lView)) return;
	const flags = lView[2];
	enterView(lView);
	let returnConsumerToPool = true;
	let prevConsumer = null;
	let currentConsumer = null;
	if (viewShouldHaveReactiveConsumer(tView)) {
		currentConsumer = getOrBorrowReactiveLViewConsumer(lView);
		prevConsumer = consumerBeforeComputation(currentConsumer);
	} else if (getActiveConsumer() === null) {
		returnConsumerToPool = false;
		currentConsumer = getOrCreateTemporaryConsumer(lView);
		prevConsumer = consumerBeforeComputation(currentConsumer);
	} else if (lView[24]) {
		consumerDestroy(lView[24]);
		lView[24] = null;
	}
	try {
		resetPreOrderHookFlags(lView);
		setBindingIndex(tView.bindingStartIndex);
		if (templateFn !== null) executeTemplate(tView, lView, templateFn, 2, context);
		const hooksInitPhaseCompleted = (flags & 3) === 3;
		if (hooksInitPhaseCompleted) {
			const preOrderCheckHooks = tView.preOrderCheckHooks;
			if (preOrderCheckHooks !== null) executeCheckHooks(lView, preOrderCheckHooks, null);
		} else {
			const preOrderHooks = tView.preOrderHooks;
			if (preOrderHooks !== null) executeInitAndCheckHooks(lView, preOrderHooks, 0, null);
			incrementInitPhaseFlags(lView, 0);
		}
		markTransplantedViewsForRefresh(lView);
		runEffectsInView(lView);
		detectChangesInEmbeddedViews(lView, 0);
		if (tView.contentQueries !== null) refreshContentQueries(tView, lView);
		if (hooksInitPhaseCompleted) {
			const contentCheckHooks = tView.contentCheckHooks;
			if (contentCheckHooks !== null) executeCheckHooks(lView, contentCheckHooks);
		} else {
			const contentHooks = tView.contentHooks;
			if (contentHooks !== null) executeInitAndCheckHooks(lView, contentHooks, 1);
			incrementInitPhaseFlags(lView, 1);
		}
		processHostBindingOpCodes(tView, lView);
		const components = tView.components;
		if (components !== null) detectChangesInChildComponents(lView, components, 0);
		const viewQuery = tView.viewQuery;
		if (viewQuery !== null) executeViewQueryFn(2, viewQuery, context);
		if (hooksInitPhaseCompleted) {
			const viewCheckHooks = tView.viewCheckHooks;
			if (viewCheckHooks !== null) executeCheckHooks(lView, viewCheckHooks);
		} else {
			const viewHooks = tView.viewHooks;
			if (viewHooks !== null) executeInitAndCheckHooks(lView, viewHooks, 2);
			incrementInitPhaseFlags(lView, 2);
		}
		if (tView.firstUpdatePass === true) tView.firstUpdatePass = false;
		if (lView[22]) {
			for (const notifyEffect of lView[22]) notifyEffect();
			lView[22] = null;
		}
		addAfterRenderSequencesForView(lView);
		lView[2] &= -73;
	} catch (e) {
		markAncestorsForTraversal(lView);
		throw e;
	} finally {
		if (currentConsumer !== null) {
			consumerAfterComputation(currentConsumer, prevConsumer);
			if (returnConsumerToPool) maybeReturnReactiveLViewConsumer(currentConsumer);
		}
		leaveView();
	}
}
function detectChangesInEmbeddedViews(lView, mode) {
	for (let lContainer = getFirstLContainer(lView); lContainer !== null; lContainer = getNextLContainer(lContainer)) for (let i = 10; i < lContainer.length; i++) {
		const embeddedLView = lContainer[i];
		detectChangesInViewIfAttached(embeddedLView, mode);
	}
}
function markTransplantedViewsForRefresh(lView) {
	for (let lContainer = getFirstLContainer(lView); lContainer !== null; lContainer = getNextLContainer(lContainer)) {
		if (!(lContainer[2] & 2)) continue;
		const movedViews = lContainer[9];
		for (let i = 0; i < movedViews.length; i++) {
			const movedLView = movedViews[i];
			markViewForRefresh(movedLView);
		}
	}
}
function detectChangesInComponent(hostLView, componentHostIdx, mode) {
	profiler(ProfilerEvent.ComponentStart);
	const componentView = getComponentLViewByIndex(componentHostIdx, hostLView);
	try {
		detectChangesInViewIfAttached(componentView, mode);
	} finally {
		profiler(ProfilerEvent.ComponentEnd, componentView[8]);
	}
}
function detectChangesInViewIfAttached(lView, mode) {
	if (!viewAttachedToChangeDetector(lView)) return;
	detectChangesInView(lView, mode);
}
function detectChangesInView(lView, mode) {
	const tView = lView[1];
	const flags = lView[2];
	const consumer = lView[24];
	let shouldRefreshView = !!(mode === 0 && flags & 16);
	shouldRefreshView ||= !!(flags & 64 && mode === 0 && true);
	shouldRefreshView ||= !!(flags & 1024);
	shouldRefreshView ||= !!(consumer?.dirty && consumerPollProducersForChange(consumer));
	shouldRefreshView ||= false;
	if (consumer) consumer.dirty = false;
	lView[2] &= -9217;
	if (shouldRefreshView) refreshView(tView, lView, tView.template, lView[8]);
	else if (flags & 8192) {
		const prevConsumer = setActiveConsumer(null);
		try {
			runEffectsInView(lView);
			detectChangesInEmbeddedViews(lView, 1);
			const components = tView.components;
			if (components !== null) detectChangesInChildComponents(lView, components, 1);
			addAfterRenderSequencesForView(lView);
		} finally {
			setActiveConsumer(prevConsumer);
		}
	}
}
function detectChangesInChildComponents(hostLView, components, mode) {
	for (let i = 0; i < components.length; i++) detectChangesInComponent(hostLView, components[i], mode);
}
function processHostBindingOpCodes(tView, lView) {
	const hostBindingOpCodes = tView.hostBindingOpCodes;
	if (hostBindingOpCodes === null) return;
	try {
		for (let i = 0; i < hostBindingOpCodes.length; i++) {
			const opCode = hostBindingOpCodes[i];
			if (opCode < 0) setSelectedIndex(~opCode);
			else {
				const directiveIdx = opCode;
				const bindingRootIndx = hostBindingOpCodes[++i];
				const hostBindingFn = hostBindingOpCodes[++i];
				setBindingRootForHostBindings(bindingRootIndx, directiveIdx);
				const context = lView[directiveIdx];
				profiler(ProfilerEvent.HostBindingsUpdateStart, context);
				try {
					hostBindingFn(2, context);
				} finally {
					profiler(ProfilerEvent.HostBindingsUpdateEnd, context);
				}
			}
		}
	} finally {
		setSelectedIndex(-1);
	}
}
function markViewDirty(lView, source) {
	const dirtyBitsToUse = isRefreshingViews() ? 64 : 1088;
	lView[10].changeDetectionScheduler?.notify(source);
	while (lView) {
		lView[2] |= dirtyBitsToUse;
		const parent = getLViewParent(lView);
		if (isRootView(lView) && !parent) return lView;
		lView = parent;
	}
	return null;
}
function detachView(lContainer, removeIndex) {
	if (lContainer.length <= 10) return;
	const indexInContainer = 10 + removeIndex;
	const viewToDetach = lContainer[indexInContainer];
	if (viewToDetach) {
		const declarationLContainer = viewToDetach[16];
		if (declarationLContainer !== null && declarationLContainer !== lContainer) detachMovedView(declarationLContainer, viewToDetach);
		if (removeIndex > 0) lContainer[indexInContainer - 1][4] = viewToDetach[4];
		const removedLView = removeFromArray(lContainer, 10 + removeIndex);
		removeViewFromDOM(viewToDetach[1], viewToDetach);
		const lQueries = removedLView[18];
		if (lQueries !== null) lQueries.detachView(removedLView[1]);
		viewToDetach[3] = null;
		viewToDetach[4] = null;
		viewToDetach[2] &= -129;
	}
	return viewToDetach;
}
function trackMovedView(declarationContainer, lView) {
	const movedViews = declarationContainer[9];
	const parent = lView[3];
	if (isLView(parent)) declarationContainer[2] |= 2;
	else {
		const insertedComponentLView = parent[3][15];
		if (lView[15] !== insertedComponentLView) declarationContainer[2] |= 2;
	}
	if (movedViews === null) declarationContainer[9] = [lView];
	else movedViews.push(lView);
}
var ViewRef = class {
	_lView;
	_cdRefInjectingView;
	_appRef = null;
	_attachedToViewContainer = false;
	exhaustive;
	get rootNodes() {
		const lView = this._lView;
		const tView = lView[1];
		return collectNativeNodes(tView, lView, tView.firstChild, []);
	}
	constructor(_lView, _cdRefInjectingView) {
		this._lView = _lView;
		this._cdRefInjectingView = _cdRefInjectingView;
	}
	get context() {
		return this._lView[8];
	}
	set context(value) {
		this._lView[8] = value;
	}
	get destroyed() {
		return isDestroyed(this._lView);
	}
	destroy() {
		if (this._appRef) this._appRef.detachView(this);
		else if (this._attachedToViewContainer) {
			const parent = this._lView[3];
			if (isLContainer(parent)) {
				const viewRefs = parent[8];
				const index = viewRefs ? viewRefs.indexOf(this) : -1;
				if (index > -1) {
					detachView(parent, index);
					removeFromArray(viewRefs, index);
				}
			}
			this._attachedToViewContainer = false;
		}
		destroyLView(this._lView[1], this._lView);
	}
	onDestroy(callback) {
		storeLViewOnDestroy(this._lView, callback);
	}
	markForCheck() {
		markViewDirty(this._cdRefInjectingView || this._lView, 4);
	}
	detach() {
		this._lView[2] &= -129;
	}
	reattach() {
		updateAncestorTraversalFlagsOnAttach(this._lView);
		this._lView[2] |= 128;
	}
	detectChanges() {
		this._lView[2] |= 1024;
		detectChangesInternal(this._lView);
	}
	checkNoChanges() {}
	attachToViewContainerRef() {
		if (this._appRef) throw new RuntimeError(902, false);
		this._attachedToViewContainer = true;
	}
	detachFromAppRef() {
		this._appRef = null;
		const isRoot = isRootView(this._lView);
		const declarationContainer = this._lView[16];
		if (declarationContainer !== null && !isRoot) detachMovedView(declarationContainer, this._lView);
		detachViewFromDOM(this._lView[1], this._lView);
	}
	attachToAppRef(appRef) {
		if (this._attachedToViewContainer) throw new RuntimeError(902, false);
		this._appRef = appRef;
		const isRoot = isRootView(this._lView);
		const declarationContainer = this._lView[16];
		if (declarationContainer !== null && !isRoot) trackMovedView(declarationContainer, this._lView);
		updateAncestorTraversalFlagsOnAttach(this._lView);
	}
};
function getOrCreateTNode(tView, index, type, name, attrs) {
	let tNode = tView.data[index];
	if (tNode === null) {
		tNode = createTNodeAtIndex(tView, index, type, name, attrs);
		if (isInI18nBlock()) tNode.flags |= 32;
	} else if (tNode.type & 64) {
		tNode.type = type;
		tNode.value = name;
		tNode.attrs = attrs;
		const parent = getCurrentParentTNode();
		tNode.injectorIndex = parent === null ? -1 : parent.injectorIndex;
	}
	setCurrentTNode(tNode, true);
	return tNode;
}
function createTNodeAtIndex(tView, index, type, name, attrs) {
	const currentTNode = getCurrentTNodePlaceholderOk();
	const isParent = isCurrentTNodeParent();
	const parent = isParent ? currentTNode : currentTNode && currentTNode.parent;
	const tNode = tView.data[index] = createTNode(tView, parent, type, index, name, attrs);
	linkTNodeInTView(tView, tNode, currentTNode, isParent);
	return tNode;
}
function linkTNodeInTView(tView, tNode, currentTNode, isParent) {
	if (tView.firstChild === null) tView.firstChild = tNode;
	if (currentTNode !== null) {
		if (isParent) {
			if (currentTNode.child == null && tNode.parent !== null) currentTNode.child = tNode;
		} else if (currentTNode.next === null) {
			currentTNode.next = tNode;
			tNode.prev = currentTNode;
		}
	}
}
function createTNode(tView, tParent, type, index, value, attrs) {
	let injectorIndex = tParent ? tParent.injectorIndex : -1;
	let flags = 0;
	if (isInSkipHydrationBlock()) flags |= 128;
	return {
		type,
		index,
		insertBeforeIndex: null,
		injectorIndex,
		directiveStart: -1,
		directiveEnd: -1,
		directiveStylingLast: -1,
		componentOffset: -1,
		controlDirectiveIndex: -1,
		customControlIndex: -1,
		propertyBindings: null,
		flags,
		providerIndexes: 0,
		value,
		namespace: getNamespace(),
		attrs,
		mergedAttrs: null,
		localNames: null,
		initialInputs: null,
		inputs: null,
		hostDirectiveInputs: null,
		outputs: null,
		hostDirectiveOutputs: null,
		directiveToIndex: null,
		tView: null,
		next: null,
		prev: null,
		projectionNext: null,
		child: null,
		parent: tParent,
		projection: null,
		styles: null,
		stylesWithoutHost: null,
		residualStyles: void 0,
		classes: null,
		classesWithoutHost: null,
		residualClasses: void 0,
		classBindings: 0,
		styleBindings: 0
	};
}
var ComponentRef$1 = class ComponentRef {};
var RendererFactory2 = class {};
var Sanitizer = /*#__PURE__*/ (() => {
	class Sanitizer {
		static ɵprov = /* @__PURE__ */ ɵɵdefineInjectable({
			token: Sanitizer,
			providedIn: "root",
			factory: () => null
		});
	}
	return Sanitizer;
})();
function getComponentName(def) {
	return def.debugInfo?.className || def.type.name || null;
}
var NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR = {};
var ChainedInjector = class {
	injector;
	parentInjector;
	constructor(injector, parentInjector) {
		this.injector = injector;
		this.parentInjector = parentInjector;
	}
	get(token, notFoundValue, options) {
		const value = this.injector.get(token, NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR, options);
		if (value !== NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR || notFoundValue === NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR) return value;
		return this.parentInjector.get(token, notFoundValue, options);
	}
};
var BINDING = /* @__PURE__ */ Symbol("BINDING");
var SHARED_STYLES_HOST = /*#__PURE__*/ new InjectionToken("");
function computeStaticStyling(tNode, attrs, writeToHost) {
	let styles = writeToHost ? tNode.styles : null;
	let classes = writeToHost ? tNode.classes : null;
	let mode = 0;
	if (attrs !== null) for (let i = 0; i < attrs.length; i++) {
		const value = attrs[i];
		if (typeof value === "number") mode = value;
		else if (mode == 1) classes = concatStringsWithSpace(classes, value);
		else if (mode == 2) {
			const style = value;
			const styleValue = attrs[++i];
			styles = concatStringsWithSpace(styles, style + ": " + styleValue + ";");
		}
	}
	writeToHost ? tNode.styles = styles : tNode.stylesWithoutHost = styles;
	writeToHost ? tNode.classes = classes : tNode.classesWithoutHost = classes;
}
function ɵɵdirectiveInject(token, flags = 0) {
	const lView = getLView();
	if (lView === null) return ɵɵinject(token, flags);
	return getOrCreateInjectable(getCurrentTNode(), lView, resolveForwardRef(token), flags);
}
function resolveDirectives(tView, lView, tNode, localRefs, directiveMatcher) {
	const exportsMap = localRefs === null ? null : { "": -1 };
	const matchedDirectiveDefs = directiveMatcher(tView, tNode);
	if (matchedDirectiveDefs !== null) {
		let directiveDefs = matchedDirectiveDefs;
		let hostDirectiveDefs = null;
		let hostDirectiveRanges = null;
		for (const def of matchedDirectiveDefs) if (def.resolveHostDirectives !== null) {
			[directiveDefs, hostDirectiveDefs, hostDirectiveRanges] = def.resolveHostDirectives(matchedDirectiveDefs);
			break;
		}
		initializeDirectives(tView, lView, tNode, directiveDefs, exportsMap, hostDirectiveDefs, hostDirectiveRanges);
	}
	if (exportsMap !== null && localRefs !== null) cacheMatchingLocalNames(tNode, localRefs, exportsMap);
}
function cacheMatchingLocalNames(tNode, localRefs, exportsMap) {
	const localNames = tNode.localNames = [];
	for (let i = 0; i < localRefs.length; i += 2) {
		const index = exportsMap[localRefs[i + 1]];
		if (index == null) throw new RuntimeError(-301, false);
		localNames.push(localRefs[i], index);
	}
}
function markAsComponentHost(tView, hostTNode, componentOffset) {
	hostTNode.componentOffset = componentOffset;
	(tView.components ??= []).push(hostTNode.index);
}
function initializeDirectives(tView, lView, tNode, directives, exportsMap, hostDirectiveDefs, hostDirectiveRanges) {
	const directivesLength = directives.length;
	let componentDef = null;
	for (let i = 0; i < directivesLength; i++) {
		const def = directives[i];
		if (componentDef === null && isComponentDef(def)) {
			componentDef = def;
			markAsComponentHost(tView, tNode, i);
		}
		diPublicInInjector(getOrCreateNodeInjectorForNode(tNode, lView), tView, def.type);
	}
	initTNodeFlags(tNode, tView.data.length, directivesLength);
	if (componentDef?.viewProvidersResolver) componentDef.viewProvidersResolver(componentDef);
	for (let i = 0; i < directivesLength; i++) {
		const def = directives[i];
		if (def.providersResolver) def.providersResolver(def);
	}
	let preOrderHooksFound = false;
	let preOrderCheckHooksFound = false;
	let directiveIdx = allocExpando(tView, lView, directivesLength, null);
	if (directivesLength > 0) tNode.directiveToIndex = /* @__PURE__ */ new Map();
	for (let i = 0; i < directivesLength; i++) {
		const def = directives[i];
		tNode.mergedAttrs = mergeHostAttrs(tNode.mergedAttrs, def.hostAttrs);
		configureViewWithDirective(tView, tNode, lView, directiveIdx, def);
		saveNameToExportMap(directiveIdx, def, exportsMap);
		if (hostDirectiveRanges !== null && hostDirectiveRanges.has(def)) {
			const [start, end] = hostDirectiveRanges.get(def);
			tNode.directiveToIndex.set(def.type, [
				directiveIdx,
				start + tNode.directiveStart,
				end + tNode.directiveStart
			]);
		} else if (hostDirectiveDefs === null || !hostDirectiveDefs.has(def)) tNode.directiveToIndex.set(def.type, directiveIdx);
		if (def.contentQueries !== null) tNode.flags |= 4;
		if (def.hostBindings !== null || def.hostAttrs !== null || def.hostVars !== 0) tNode.flags |= 64;
		const lifeCycleHooks = def.type.prototype;
		if (!preOrderHooksFound && (lifeCycleHooks.ngOnChanges || lifeCycleHooks.ngOnInit || lifeCycleHooks.ngDoCheck)) {
			(tView.preOrderHooks ??= []).push(tNode.index);
			preOrderHooksFound = true;
		}
		if (!preOrderCheckHooksFound && (lifeCycleHooks.ngOnChanges || lifeCycleHooks.ngDoCheck)) {
			(tView.preOrderCheckHooks ??= []).push(tNode.index);
			preOrderCheckHooksFound = true;
		}
		directiveIdx++;
	}
	initializeInputAndOutputAliases(tView, tNode, hostDirectiveDefs);
}
function initializeInputAndOutputAliases(tView, tNode, hostDirectiveDefs) {
	for (let index = tNode.directiveStart; index < tNode.directiveEnd; index++) {
		const directiveDef = tView.data[index];
		if (hostDirectiveDefs === null || !hostDirectiveDefs.has(directiveDef)) {
			setupSelectorMatchedInputsOrOutputs(0, tNode, directiveDef, index);
			setupSelectorMatchedInputsOrOutputs(1, tNode, directiveDef, index);
			setupInitialInputs(tNode, index, false);
		} else {
			const hostDirectiveDef = hostDirectiveDefs.get(directiveDef);
			setupHostDirectiveInputsOrOutputs(0, tNode, hostDirectiveDef, index);
			setupHostDirectiveInputsOrOutputs(1, tNode, hostDirectiveDef, index);
			setupInitialInputs(tNode, index, true);
		}
	}
}
function setupSelectorMatchedInputsOrOutputs(mode, tNode, def, directiveIndex) {
	const aliasMap = mode === 0 ? def.inputs : def.outputs;
	for (const publicName in aliasMap) if (Object.hasOwn(aliasMap, publicName)) {
		let bindings;
		if (mode === 0) bindings = tNode.inputs ??= {};
		else bindings = tNode.outputs ??= {};
		bindings[publicName] ??= [];
		bindings[publicName].push(directiveIndex);
		setShadowStylingInputFlags(tNode, publicName);
	}
}
function setupHostDirectiveInputsOrOutputs(mode, tNode, config, directiveIndex) {
	const aliasMap = mode === 0 ? config.inputs : config.outputs;
	for (const initialName in aliasMap) if (Object.hasOwn(aliasMap, initialName)) {
		const publicName = aliasMap[initialName];
		let bindings;
		if (mode === 0) bindings = tNode.hostDirectiveInputs ??= {};
		else bindings = tNode.hostDirectiveOutputs ??= {};
		bindings[publicName] ??= [];
		bindings[publicName].push(directiveIndex, initialName);
		setShadowStylingInputFlags(tNode, publicName);
	}
}
function setShadowStylingInputFlags(tNode, publicName) {
	if (publicName === "class") tNode.flags |= 8;
	else if (publicName === "style") tNode.flags |= 16;
}
function setupInitialInputs(tNode, directiveIndex, isHostDirective) {
	const { attrs, inputs, hostDirectiveInputs } = tNode;
	if (attrs === null || !isHostDirective && inputs === null || isHostDirective && hostDirectiveInputs === null || isInlineTemplate(tNode)) {
		tNode.initialInputs ??= [];
		tNode.initialInputs.push(null);
		return;
	}
	let inputsToStore = null;
	let i = 0;
	while (i < attrs.length) {
		const attrName = attrs[i];
		if (attrName === 0) {
			i += 4;
			continue;
		} else if (attrName === 5) {
			i += 2;
			continue;
		} else if (typeof attrName === "number") break;
		if (!isHostDirective && Object.hasOwn(inputs, attrName)) {
			const inputConfig = inputs[attrName];
			for (const index of inputConfig) if (index === directiveIndex) {
				inputsToStore ??= [];
				inputsToStore.push(attrName, attrs[i + 1]);
				break;
			}
		} else if (isHostDirective && Object.hasOwn(hostDirectiveInputs, attrName)) {
			const config = hostDirectiveInputs[attrName];
			for (let j = 0; j < config.length; j += 2) if (config[j] === directiveIndex) {
				inputsToStore ??= [];
				inputsToStore.push(config[j + 1], attrs[i + 1]);
				break;
			}
		}
		i += 2;
	}
	tNode.initialInputs ??= [];
	tNode.initialInputs.push(inputsToStore);
}
function configureViewWithDirective(tView, tNode, lView, directiveIndex, def) {
	tView.data[directiveIndex] = def;
	const nodeInjectorFactory = new NodeInjectorFactory(def.factory || (def.factory = getFactoryDef(def.type, true)), isComponentDef(def), ɵɵdirectiveInject, null);
	tView.blueprint[directiveIndex] = nodeInjectorFactory;
	lView[directiveIndex] = nodeInjectorFactory;
	registerHostBindingOpCodes(tView, tNode, directiveIndex, allocExpando(tView, lView, def.hostVars, NO_CHANGE), def);
}
function registerHostBindingOpCodes(tView, tNode, directiveIdx, directiveVarsIdx, def) {
	const hostBindings = def.hostBindings;
	if (hostBindings) {
		let hostBindingOpCodes = tView.hostBindingOpCodes;
		if (hostBindingOpCodes === null) hostBindingOpCodes = tView.hostBindingOpCodes = [];
		const elementIndx = ~tNode.index;
		if (lastSelectedElementIdx(hostBindingOpCodes) != elementIndx) hostBindingOpCodes.push(elementIndx);
		hostBindingOpCodes.push(directiveIdx, directiveVarsIdx, hostBindings);
	}
}
function lastSelectedElementIdx(hostBindingOpCodes) {
	let i = hostBindingOpCodes.length;
	while (i > 0) {
		const value = hostBindingOpCodes[--i];
		if (typeof value === "number" && value < 0) return value;
	}
	return 0;
}
function saveNameToExportMap(directiveIdx, def, exportsMap) {
	if (exportsMap) {
		if (def.exportAs) for (let i = 0; i < def.exportAs.length; i++) exportsMap[def.exportAs[i]] = directiveIdx;
		if (isComponentDef(def)) exportsMap[""] = directiveIdx;
	}
}
function initTNodeFlags(tNode, index, numberOfDirectives) {
	tNode.flags |= 1;
	tNode.directiveStart = index;
	tNode.directiveEnd = index + numberOfDirectives;
	tNode.providerIndexes = index;
}
function directiveHostFirstCreatePass(index, lView, type, name, directiveMatcher, bindingsEnabled, attrsIndex, localRefsIndex) {
	const tView = lView[1];
	const tViewConsts = tView.consts;
	const tNode = getOrCreateTNode(tView, index, type, name, getConstant(tViewConsts, attrsIndex));
	if (bindingsEnabled) resolveDirectives(tView, lView, tNode, getConstant(tViewConsts, localRefsIndex), directiveMatcher);
	tNode.mergedAttrs = mergeHostAttrs(tNode.mergedAttrs, tNode.attrs);
	if (tNode.attrs !== null) computeStaticStyling(tNode, tNode.attrs, false);
	if (tNode.mergedAttrs !== null) computeStaticStyling(tNode, tNode.mergedAttrs, true);
	if (tView.queries !== null) tView.queries.elementStart(tView, tNode);
	return tNode;
}
function directiveHostEndFirstCreatePass(tView, tNode) {
	registerPostOrderHooks(tView, tNode);
	if (isContentQueryHost(tNode)) tView.queries.elementEnd(tNode);
}
var shadowRootSupported = typeof ShadowRoot !== "undefined";
var documentSupported = typeof Document !== "undefined";
function toInputRefArray(map) {
	return Object.keys(map).map((name) => {
		const [propName, flags, transform] = map[name];
		const inputData = {
			propName,
			templateName: name,
			isSignal: (flags & InputFlags.SignalBased) !== 0
		};
		if (transform) inputData.transform = transform;
		return inputData;
	});
}
function toOutputRefArray(map) {
	return Object.keys(map).map((name) => ({
		propName: map[name],
		templateName: name
	}));
}
function createRootViewInjector(componentDef, environmentInjector, injector) {
	let realEnvironmentInjector = environmentInjector instanceof EnvironmentInjector ? environmentInjector : environmentInjector?.injector;
	if (realEnvironmentInjector && componentDef.getStandaloneInjector !== null) realEnvironmentInjector = componentDef.getStandaloneInjector(realEnvironmentInjector) || realEnvironmentInjector;
	return realEnvironmentInjector ? new ChainedInjector(injector, realEnvironmentInjector) : injector;
}
function createRootLViewEnvironment(rootLViewInjector) {
	const rendererFactory = rootLViewInjector.get(RendererFactory2, null);
	if (rendererFactory === null) throw new RuntimeError(407, false);
	return {
		rendererFactory,
		sanitizer: rootLViewInjector.get(Sanitizer, null),
		changeDetectionScheduler: rootLViewInjector.get(ChangeDetectionScheduler, null),
		ngReflect: false,
		tracingService: rootLViewInjector.get(TracingService, null, { optional: true })
	};
}
function createHostElement(componentDef, renderer) {
	const tagName = inferTagNameFromDefinition(componentDef);
	return createElementNode(renderer, tagName, tagName === "svg" ? "svg" : tagName === "math" ? MATH_ML_NAMESPACE : null);
}
function assertNotScriptHostElement(element) {
	if ((element && "localName" in element && typeof element.localName === "string" ? element.localName : element?.tagName)?.toLowerCase() === "script") throw new RuntimeError(905, false);
}
function inferTagNameFromDefinition(componentDef) {
	return (componentDef.selectors[0][0] || "div").toLowerCase();
}
var ComponentFactory = class {
	componentDef;
	ngModule;
	selector;
	componentType;
	ngContentSelectors;
	isBoundToModule;
	cachedInputs = null;
	cachedOutputs = null;
	get inputs() {
		this.cachedInputs ??= toInputRefArray(this.componentDef.inputs);
		return this.cachedInputs;
	}
	get outputs() {
		this.cachedOutputs ??= toOutputRefArray(this.componentDef.outputs);
		return this.cachedOutputs;
	}
	constructor(componentDef, ngModule) {
		this.componentDef = componentDef;
		this.ngModule = ngModule;
		this.componentType = componentDef.type;
		this.selector = stringifyCSSSelectorList(componentDef.selectors);
		this.ngContentSelectors = componentDef.ngContentSelectors ?? [];
		this.isBoundToModule = !!ngModule;
	}
	create(injector, projectableNodes, rootSelectorOrNode, environmentInjector, directives, componentBindings) {
		profiler(ProfilerEvent.DynamicComponentStart);
		const prevConsumer = setActiveConsumer(null);
		try {
			const cmpDef = this.componentDef;
			const rootViewInjector = createRootViewInjector(cmpDef, environmentInjector || this.ngModule, injector);
			const environment = createRootLViewEnvironment(rootViewInjector);
			const tracingService = environment.tracingService;
			if (tracingService && tracingService.componentCreate) return tracingService.componentCreate(getComponentName(cmpDef), () => this.createComponentRef(environment, rootViewInjector, projectableNodes, rootSelectorOrNode, directives, componentBindings));
			else return this.createComponentRef(environment, rootViewInjector, projectableNodes, rootSelectorOrNode, directives, componentBindings);
		} finally {
			setActiveConsumer(prevConsumer);
		}
	}
	createComponentRef(environment, rootViewInjector, projectableNodes, rootSelectorOrNode, directives, componentBindings) {
		const cmpDef = this.componentDef;
		const rootTView = createRootTView(rootSelectorOrNode, cmpDef, componentBindings, directives);
		const hostRenderer = environment.rendererFactory.createRenderer(null, cmpDef);
		const hostElement = rootSelectorOrNode ? locateHostElement(hostRenderer, rootSelectorOrNode, cmpDef.encapsulation, rootViewInjector) : createHostElement(cmpDef, hostRenderer);
		assertNotScriptHostElement(hostElement);
		const sharedStylesHost = rootViewInjector.get(SHARED_STYLES_HOST, null);
		const styleHost = getStyleHost(hostElement, () => rootViewInjector.get(DOCUMENT$1, null) ?? getDocument());
		if (sharedStylesHost) sharedStylesHost.addHost(styleHost);
		const hasInputBindings = componentBindings?.some(isInputBinding) || directives?.some((d) => typeof d !== "function" && d.bindings.some(isInputBinding));
		const rootLView = createLView(null, rootTView, null, 512 | getInitialLViewFlagsFromDef(cmpDef), null, null, environment, hostRenderer, rootViewInjector, null, retrieveHydrationInfo(hostElement, rootViewInjector, true));
		if (sharedStylesHost && shadowRootSupported && styleHost instanceof ShadowRoot) storeLViewOnDestroy(rootLView, () => {
			sharedStylesHost.removeHost(styleHost);
		});
		rootLView[27] = hostElement;
		enterView(rootLView);
		let componentView = null;
		try {
			const hostTNode = directiveHostFirstCreatePass(27, rootLView, 2, "#host", () => rootTView.directiveRegistry, true, 0);
			setupStaticAttributes(hostRenderer, hostElement, hostTNode);
			attachPatchData(hostElement, rootLView);
			createDirectivesInstances(rootTView, rootLView, hostTNode);
			executeContentQueries(rootTView, hostTNode, rootLView);
			directiveHostEndFirstCreatePass(rootTView, hostTNode);
			if (projectableNodes !== void 0) projectNodes(hostTNode, this.ngContentSelectors, projectableNodes);
			componentView = getComponentLViewByIndex(hostTNode.index, rootLView);
			rootLView[8] = componentView[8];
			renderView(rootTView, rootLView, null);
		} catch (e) {
			if (componentView !== null) unregisterLView(componentView);
			unregisterLView(rootLView);
			throw e;
		} finally {
			profiler(ProfilerEvent.DynamicComponentEnd);
			leaveView();
		}
		return new ComponentRef(this.componentType, rootLView, !!hasInputBindings);
	}
};
function createRootTView(rootSelectorOrNode, componentDef, componentBindings, directives) {
	const tAttributes = rootSelectorOrNode ? ["ng-version", "22.1.3"] : extractAttrsAndClassesFromSelector(componentDef.selectors[0]);
	let creationBindings = null;
	let updateBindings = null;
	let varsToAllocate = 0;
	if (componentBindings) for (const binding of componentBindings) {
		varsToAllocate += binding[BINDING].requiredVars;
		if (binding.create) {
			binding.targetIdx = 0;
			(creationBindings ??= []).push(binding);
		}
		if (binding.update) {
			binding.targetIdx = 0;
			(updateBindings ??= []).push(binding);
		}
	}
	if (directives) for (let i = 0; i < directives.length; i++) {
		const directive = directives[i];
		if (typeof directive !== "function") for (const binding of directive.bindings) {
			varsToAllocate += binding[BINDING].requiredVars;
			const targetDirectiveIdx = i + 1;
			if (binding.create) {
				binding.targetIdx = targetDirectiveIdx;
				(creationBindings ??= []).push(binding);
			}
			if (binding.update) {
				binding.targetIdx = targetDirectiveIdx;
				(updateBindings ??= []).push(binding);
			}
		}
	}
	const directivesToApply = [componentDef];
	if (directives) for (const directive of directives) {
		const directiveDef = getDirectiveDef(typeof directive === "function" ? directive : directive.type);
		directivesToApply.push(directiveDef);
	}
	return createTView(0, null, getRootTViewTemplate(creationBindings, updateBindings), 1, varsToAllocate, directivesToApply, null, null, null, [tAttributes], null);
}
function getStyleHost(node, doc) {
	const rootNode = node.getRootNode?.();
	if (documentSupported && rootNode instanceof Document) return rootNode.head;
	else if (!rootNode) return doc().head;
	else if (shadowRootSupported && rootNode instanceof ShadowRoot) return rootNode;
	else return doc().head;
}
function getRootTViewTemplate(creationBindings, updateBindings) {
	if (!creationBindings && !updateBindings) return null;
	return (flags) => {
		if (flags & 1 && creationBindings) for (const binding of creationBindings) binding.create();
		if (flags & 2 && updateBindings) for (const binding of updateBindings) binding.update();
	};
}
function isInputBinding(binding) {
	const kind = binding[BINDING].kind;
	return kind === "input" || kind === "twoWay";
}
var ComponentRef = class extends ComponentRef$1 {
	_rootLView;
	_hasInputBindings;
	instance;
	hostView;
	changeDetectorRef;
	componentType;
	location;
	previousInputValues = null;
	_tNode;
	constructor(componentType, _rootLView, _hasInputBindings) {
		super();
		this._rootLView = _rootLView;
		this._hasInputBindings = _hasInputBindings;
		this._tNode = getTNode(_rootLView[1], 27);
		this.location = createElementRef(this._tNode, _rootLView);
		this.instance = getComponentLViewByIndex(this._tNode.index, _rootLView)[8];
		this.hostView = this.changeDetectorRef = new ViewRef(_rootLView, void 0);
		this.componentType = componentType;
	}
	setInput(name, value) {
		if (this._hasInputBindings && false);
		const tNode = this._tNode;
		this.previousInputValues ??= /* @__PURE__ */ new Map();
		if (this.previousInputValues.has(name) && Object.is(this.previousInputValues.get(name), value)) return;
		const lView = this._rootLView;
		setAllInputsForProperty(tNode, lView[1], lView, name, value);
		this.previousInputValues.set(name, value);
		markViewDirty(getComponentLViewByIndex(tNode.index, lView), 1);
	}
	get injector() {
		return new NodeInjector(this._tNode, this._rootLView);
	}
	destroy() {
		this.hostView.destroy();
	}
	onDestroy(callback) {
		this.hostView.onDestroy(callback);
	}
};
function projectNodes(tNode, ngContentSelectors, projectableNodes) {
	const projection = tNode.projection = [];
	for (let i = 0; i < ngContentSelectors.length; i++) {
		const nodesforSlot = projectableNodes[i];
		projection.push(nodesforSlot != null && nodesforSlot.length ? Array.from(nodesforSlot) : null);
	}
}
function isPromise(obj) {
	return !!obj && typeof obj.then === "function";
}
function isSubscribable(obj) {
	return !!obj && typeof obj.subscribe === "function";
}
var NgModuleRef$1 = class NgModuleRef {};
var EnvironmentNgModuleRefAdapter = class extends NgModuleRef$1 {
	injector;
	instance = null;
	constructor(config) {
		super();
		const injector = new R3Injector([...config.providers, {
			provide: NgModuleRef$1,
			useValue: this
		}], config.parent || getNullInjector(), config.debugName, /* @__PURE__ */ new Set(["environment"]));
		this.injector = injector;
		if (config.runEnvironmentInitializers) injector.resolveInjectorInitializers();
	}
	destroy() {
		this.injector.destroy();
	}
	onDestroy(callback) {
		this.injector.onDestroy(callback);
	}
};
function createEnvironmentInjector(providers, parent, debugName = null) {
	return new EnvironmentNgModuleRefAdapter({
		providers,
		parent,
		debugName,
		runEnvironmentInitializers: true
	}).injector;
}
var StandaloneService = /*#__PURE__*/ (() => {
	class StandaloneService {
		_injector;
		cachedInjectors = /* @__PURE__ */ new Map();
		constructor(_injector) {
			this._injector = _injector;
		}
		getOrCreateStandaloneInjector(componentDef) {
			if (!componentDef.standalone) return null;
			if (!this.cachedInjectors.has(componentDef)) {
				const providers = internalImportProvidersFrom(false, componentDef.type);
				const standaloneInjector = providers.length > 0 ? createEnvironmentInjector([providers], this._injector, "") : null;
				this.cachedInjectors.set(componentDef, standaloneInjector);
			}
			return this.cachedInjectors.get(componentDef);
		}
		ngOnDestroy() {
			try {
				for (const injector of this.cachedInjectors.values()) if (injector !== null) injector.destroy();
			} finally {
				this.cachedInjectors.clear();
			}
		}
		static ɵprov = /* @__PURE__ */ ɵɵdefineInjectable({
			token: StandaloneService,
			providedIn: "environment",
			factory: () => new StandaloneService(ɵɵinject(EnvironmentInjector))
		});
	}
	return StandaloneService;
})();
function ɵɵdefineComponent(componentDefinition) {
	return noSideEffects(() => {
		const baseDef = getNgDirectiveDef(componentDefinition);
		const def = {
			...baseDef,
			decls: componentDefinition.decls,
			vars: componentDefinition.vars,
			template: componentDefinition.template,
			consts: componentDefinition.consts || null,
			ngContentSelectors: componentDefinition.ngContentSelectors,
			onPush: componentDefinition.changeDetection !== ChangeDetectionStrategy.Eager,
			directiveDefs: null,
			pipeDefs: null,
			dependencies: baseDef.standalone && componentDefinition.dependencies || null,
			getStandaloneInjector: baseDef.standalone ? (parentInjector) => {
				return parentInjector.get(StandaloneService).getOrCreateStandaloneInjector(def);
			} : null,
			getExternalStyles: null,
			signals: componentDefinition.signals ?? false,
			data: componentDefinition.data || {},
			encapsulation: componentDefinition.encapsulation || ViewEncapsulation.Emulated,
			styles: componentDefinition.styles || EMPTY_ARRAY,
			_: null,
			schemas: componentDefinition.schemas || null,
			tView: null,
			id: ""
		};
		if (baseDef.standalone) performanceMarkFeature("NgStandalone");
		initFeatures(def);
		const dependencies = componentDefinition.dependencies;
		def.directiveDefs = extractDefListOrFactory(dependencies, extractDirectiveDef);
		def.pipeDefs = extractDefListOrFactory(dependencies, getPipeDef);
		def.id = getComponentId(def);
		return def;
	});
}
function extractDirectiveDef(type) {
	return getComponentDef(type) || getDirectiveDef(type);
}
function parseAndConvertInputsForDefinition(obj, declaredInputs) {
	if (obj == null) return EMPTY_OBJ;
	const newLookup = {};
	for (const minifiedKey in obj) if (Object.hasOwn(obj, minifiedKey)) {
		const value = obj[minifiedKey];
		let publicName;
		let declaredName;
		let inputFlags;
		let transform;
		if (Array.isArray(value)) {
			inputFlags = value[0];
			publicName = value[1];
			declaredName = value[2] ?? publicName;
			transform = value[3] || null;
		} else {
			publicName = value;
			declaredName = value;
			inputFlags = InputFlags.None;
			transform = null;
		}
		newLookup[publicName] = [
			minifiedKey,
			inputFlags,
			transform
		];
		declaredInputs[publicName] = declaredName;
	}
	return newLookup;
}
function parseAndConvertOutputsForDefinition(obj) {
	if (obj == null) return EMPTY_OBJ;
	const newLookup = {};
	for (const minifiedKey in obj) if (Object.hasOwn(obj, minifiedKey)) newLookup[obj[minifiedKey]] = minifiedKey;
	return newLookup;
}
function getNgDirectiveDef(directiveDefinition) {
	const declaredInputs = {};
	return {
		type: directiveDefinition.type,
		providersResolver: null,
		viewProvidersResolver: null,
		factory: null,
		hostBindings: directiveDefinition.hostBindings || null,
		hostVars: directiveDefinition.hostVars || 0,
		hostAttrs: directiveDefinition.hostAttrs || null,
		contentQueries: directiveDefinition.contentQueries || null,
		declaredInputs,
		inputConfig: directiveDefinition.inputs || EMPTY_OBJ,
		exportAs: directiveDefinition.exportAs || null,
		standalone: directiveDefinition.standalone ?? true,
		signals: directiveDefinition.signals === true,
		selectors: directiveDefinition.selectors || EMPTY_ARRAY,
		viewQuery: directiveDefinition.viewQuery || null,
		features: directiveDefinition.features || null,
		setInput: null,
		resolveHostDirectives: null,
		hostDirectives: null,
		controlDef: null,
		signalFormsInputPresence: null,
		inputs: parseAndConvertInputsForDefinition(directiveDefinition.inputs, declaredInputs),
		outputs: parseAndConvertOutputsForDefinition(directiveDefinition.outputs),
		debugInfo: null
	};
}
function initFeatures(definition) {
	definition.features?.forEach((fn) => fn(definition));
}
function extractDefListOrFactory(dependencies, defExtractor) {
	if (!dependencies) return null;
	return () => {
		const resolvedDependencies = typeof dependencies === "function" ? dependencies() : dependencies;
		const result = [];
		for (const dep of resolvedDependencies) {
			const definition = defExtractor(dep);
			if (definition !== null) result.push(definition);
		}
		return result;
	};
}
function getComponentId(componentDef) {
	let hash = 0;
	const componentDefConsts = typeof componentDef.consts === "function" ? "" : componentDef.consts;
	const hashSelectors = [
		componentDef.selectors,
		componentDef.ngContentSelectors,
		componentDef.hostVars,
		componentDef.hostAttrs,
		componentDefConsts,
		componentDef.vars,
		componentDef.decls,
		componentDef.encapsulation,
		componentDef.standalone,
		componentDef.signals,
		componentDef.exportAs,
		JSON.stringify(componentDef.inputs),
		JSON.stringify(componentDef.outputs),
		Object.getOwnPropertyNames(componentDef.type.prototype),
		!!componentDef.contentQueries,
		!!componentDef.viewQuery
	];
	for (const char of hashSelectors.join("|")) hash = Math.imul(31, hash) + char.charCodeAt(0) << 0;
	hash += 2147483648;
	return "c" + hash;
}
var APP_INITIALIZER = /*#__PURE__*/ new InjectionToken("");
var ApplicationInitStatus = /*#__PURE__*/ (() => {
	class ApplicationInitStatus {
		resolve;
		reject;
		initialized = false;
		done = false;
		donePromise = new Promise((res, rej) => {
			this.resolve = res;
			this.reject = rej;
		});
		appInits = inject(APP_INITIALIZER, { optional: true }) ?? [];
		injector = inject(Injector);
		constructor() {}
		runInitializers() {
			if (this.initialized) return;
			const asyncInitPromises = [];
			for (const appInits of this.appInits) {
				const initResult = runInInjectionContext(this.injector, appInits);
				if (isPromise(initResult)) asyncInitPromises.push(initResult);
				else if (isSubscribable(initResult)) {
					const observableAsPromise = new Promise((resolve, reject) => {
						initResult.subscribe({
							complete: resolve,
							error: reject
						});
					});
					asyncInitPromises.push(observableAsPromise);
				}
			}
			const complete = () => {
				this.done = true;
				this.resolve();
			};
			Promise.all(asyncInitPromises).then(() => {
				complete();
			}).catch((e) => {
				this.reject(e);
			});
			if (asyncInitPromises.length === 0) complete();
			this.initialized = true;
		}
		static ɵfac = function ApplicationInitStatus_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || ApplicationInitStatus)();
		};
		static ɵprov = /*@__PURE__*/ ɵɵdefineService({
			token: ApplicationInitStatus,
			factory: ApplicationInitStatus.ɵfac
		});
	}
	return ApplicationInitStatus;
})();
var TESTABILITY = /*#__PURE__*/ new InjectionToken("");
var TESTABILITY_GETTER = /*#__PURE__*/ new InjectionToken("");
var USE_PENDING_TASKS = /*#__PURE__*/ new InjectionToken("USE_PENDING_TASKS", {
	providedIn: "root",
	factory: () => typeof Zone === "undefined"
});
var Testability = /*#__PURE__*/ (() => {
	class Testability {
		_ngZone;
		registry;
		_isZoneStable = true;
		_callbacks = [];
		_taskTrackingZone = null;
		_destroyRef;
		pendingTasksInternal = inject(PendingTasksInternal);
		_usePendingTasks = inject(USE_PENDING_TASKS);
		constructor(_ngZone, registry, testabilityGetter) {
			this._ngZone = _ngZone;
			this.registry = registry;
			if (isInInjectionContext()) this._destroyRef = inject(DestroyRef, { optional: true }) ?? void 0;
			if (!_testabilityGetter) {
				setTestabilityGetter(testabilityGetter);
				testabilityGetter.addToWindow(registry);
			}
			this._watchAngularEvents();
			_ngZone.run(() => {
				this._taskTrackingZone = typeof Zone == "undefined" ? null : Zone.current.get("TaskTrackingZone");
			});
		}
		_watchAngularEvents() {
			const onUnstableSubscription = this._ngZone.onUnstable.subscribe({ next: () => {
				this._isZoneStable = false;
			} });
			let pendingTasksSubscription;
			let onStableSubscription;
			this._ngZone.runOutsideAngular(() => {
				if (this._usePendingTasks) pendingTasksSubscription = this.pendingTasksInternal.hasPendingTasksObservable.subscribe(() => {
					if (this.isStable()) this._ngZone.runOutsideAngular(() => {
						this._runCallbacksIfReady();
					});
				});
				onStableSubscription = this._ngZone.onStable.subscribe({ next: () => {
					NgZone.assertNotInAngularZone();
					queueMicrotask(() => {
						this._isZoneStable = true;
						this._runCallbacksIfReady();
					});
				} });
			});
			this._destroyRef?.onDestroy(() => {
				onUnstableSubscription.unsubscribe();
				pendingTasksSubscription?.unsubscribe();
				onStableSubscription.unsubscribe();
			});
		}
		isStable() {
			return this._isZoneStable && !this._ngZone.hasPendingMacrotasks && (!this._usePendingTasks || !this.pendingTasksInternal.hasPendingTasks);
		}
		_runCallbacksIfReady() {
			if (this.isStable()) queueMicrotask(() => {
				while (this._callbacks.length !== 0) {
					let cb = this._callbacks.pop();
					clearTimeout(cb.timeoutId);
					cb.doneCb();
				}
			});
			else {
				let pending = this.getPendingTasks();
				this._callbacks = this._callbacks.filter((cb) => {
					if (cb.updateCb && cb.updateCb(pending)) {
						clearTimeout(cb.timeoutId);
						return false;
					}
					return true;
				});
			}
		}
		getPendingTasks() {
			if (!this._taskTrackingZone) return [];
			return this._taskTrackingZone.macroTasks.map((t) => {
				return {
					source: t.source,
					creationLocation: t.creationLocation,
					data: t.data
				};
			});
		}
		addCallback(cb, timeout, updateCb) {
			let timeoutId = -1;
			if (timeout && timeout > 0) timeoutId = setTimeout(() => {
				this._callbacks = this._callbacks.filter((cb) => cb.timeoutId !== timeoutId);
				cb();
			}, timeout);
			this._callbacks.push({
				doneCb: cb,
				timeoutId,
				updateCb
			});
		}
		whenStable(doneCb, timeout, updateCb) {
			if (updateCb && !this._taskTrackingZone) throw new Error("Task tracking zone is required when passing an update callback to whenStable(). Is \"zone.js/plugins/task-tracking\" loaded?");
			this.addCallback(doneCb, timeout, updateCb);
			this._runCallbacksIfReady();
		}
		registerApplication(token) {
			this.registry.registerApplication(token, this);
		}
		unregisterApplication(token) {
			this.registry.unregisterApplication(token);
		}
		findProviders(using, provider, exactMatch) {
			return [];
		}
		static ɵfac = function Testability_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || Testability)(ɵɵinject(NgZone), ɵɵinject(TestabilityRegistry), ɵɵinject(TESTABILITY_GETTER));
		};
		static ɵprov = /*@__PURE__*/ ɵɵdefineInjectable({
			token: Testability,
			factory: Testability.ɵfac
		});
	}
	return Testability;
})();
var TestabilityRegistry = /*#__PURE__*/ (() => {
	class TestabilityRegistry {
		_applications = /* @__PURE__ */ new Map();
		registerApplication(token, testability) {
			this._applications.set(token, testability);
		}
		unregisterApplication(token) {
			this._applications.delete(token);
		}
		unregisterAllApplications() {
			this._applications.clear();
		}
		getTestability(elem) {
			return this._applications.get(elem) || null;
		}
		getAllTestabilities() {
			return Array.from(this._applications.values());
		}
		getAllRootElements() {
			return Array.from(this._applications.keys());
		}
		findTestabilityInTree(elem, findInAncestors = true) {
			return _testabilityGetter?.findTestabilityInTree(this, elem, findInAncestors) ?? null;
		}
		static ɵfac = function TestabilityRegistry_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || TestabilityRegistry)();
		};
		static ɵprov = /*@__PURE__*/ ɵɵdefineInjectable({
			token: TestabilityRegistry,
			factory: TestabilityRegistry.ɵfac,
			providedIn: "platform"
		});
	}
	return TestabilityRegistry;
})();
function setTestabilityGetter(getter) {
	_testabilityGetter = getter;
}
var _testabilityGetter;
var APP_BOOTSTRAP_LISTENER = /*#__PURE__*/ new InjectionToken("");
var MAXIMUM_REFRESH_RERUNS = 10;
var ApplicationRef = /*#__PURE__*/ (() => {
	class ApplicationRef {
		_runningTick = false;
		_destroyed = false;
		_destroyListeners = [];
		_views = [];
		internalErrorHandler = inject(INTERNAL_APPLICATION_ERROR_HANDLER);
		afterRenderManager = inject(AfterRenderManager);
		zonelessEnabled = inject(ZONELESS_ENABLED);
		rootEffectScheduler = inject(EffectScheduler);
		dirtyFlags = 0;
		tracingSnapshot = null;
		allTestViews = /* @__PURE__ */ new Set();
		autoDetectTestViews = /* @__PURE__ */ new Set();
		includeAllTestViews = false;
		afterTick = new Subject();
		get allViews() {
			return [...(this.includeAllTestViews ? this.allTestViews : this.autoDetectTestViews).keys(), ...this._views];
		}
		get destroyed() {
			return this._destroyed;
		}
		componentTypes = [];
		components = [];
		internalPendingTask = inject(PendingTasksInternal);
		get isStable() {
			return this.internalPendingTask.hasPendingTasksObservable.pipe(map((pending) => !pending));
		}
		constructor() {
			inject(TracingService, { optional: true });
		}
		whenStable() {
			let subscription;
			return new Promise((resolve) => {
				subscription = this.isStable.subscribe({ next: (stable) => {
					if (stable) resolve();
				} });
			}).finally(() => {
				subscription.unsubscribe();
			});
		}
		_injector = inject(EnvironmentInjector);
		_rendererFactory = null;
		get injector() {
			return this._injector;
		}
		bootstrap(component, rootSelectorOrNode) {
			return this.bootstrapImpl(component, rootSelectorOrNode);
		}
		bootstrapImpl(component, hostElementOrOptions, injector = Injector.NULL) {
			return this._injector.get(NgZone).run(() => {
				profiler(ProfilerEvent.BootstrapComponentStart);
				if (!this._injector.get(ApplicationInitStatus).done) throw new RuntimeError(405, "");
				const componentDef = getComponentDef(component);
				const ngModule = this._injector.get(NgModuleRef$1);
				const componentFactory = new ComponentFactory(componentDef, ngModule);
				this.componentTypes.push(component);
				const { hostElement, directives, bindings } = normalizeBootstrapOptions(hostElementOrOptions);
				const selectorOrNode = hostElement || componentFactory.selector;
				const compRef = componentFactory.create(injector, [], selectorOrNode, ngModule.injector, directives, bindings);
				const nativeElement = compRef.location.nativeElement;
				const testability = compRef.injector.get(TESTABILITY, null);
				testability?.registerApplication(nativeElement);
				compRef.onDestroy(() => {
					this.detachView(compRef.hostView);
					remove(this.components, compRef);
					testability?.unregisterApplication(nativeElement);
				});
				this._loadComponent(compRef);
				profiler(ProfilerEvent.BootstrapComponentEnd, compRef);
				return compRef;
			});
		}
		tick() {
			if (!this.zonelessEnabled) this.dirtyFlags |= 1;
			this._tick();
		}
		_tick() {
			profiler(ProfilerEvent.ChangeDetectionStart);
			if (this.tracingSnapshot !== null) this.tracingSnapshot.run(TracingAction.CHANGE_DETECTION, this.tickImpl);
			else this.tickImpl();
		}
		tickImpl = () => {
			if (this._runningTick) {
				profiler(ProfilerEvent.ChangeDetectionEnd);
				throw new RuntimeError(101, false);
			}
			const prevConsumer = setActiveConsumer(null);
			try {
				this._runningTick = true;
				this.synchronize();
			} finally {
				this._runningTick = false;
				this.tracingSnapshot?.dispose();
				this.tracingSnapshot = null;
				setActiveConsumer(prevConsumer);
				this.afterTick.next();
				profiler(ProfilerEvent.ChangeDetectionEnd);
			}
		};
		synchronize() {
			if (this._rendererFactory === null && !this._injector.destroyed) this._rendererFactory = this._injector.get(RendererFactory2, null, { optional: true });
			let runs = 0;
			while (this.dirtyFlags !== 0 && runs++ < MAXIMUM_REFRESH_RERUNS) {
				profiler(ProfilerEvent.ChangeDetectionSyncStart);
				try {
					this.synchronizeOnce();
				} finally {
					profiler(ProfilerEvent.ChangeDetectionSyncEnd);
				}
			}
		}
		synchronizeOnce() {
			if (this.dirtyFlags & 16) {
				this.dirtyFlags &= -17;
				this.rootEffectScheduler.flush();
			}
			let ranDetectChanges = false;
			if (this.dirtyFlags & 7) {
				const useGlobalCheck = Boolean(this.dirtyFlags & 1);
				this.dirtyFlags &= -8;
				this.dirtyFlags |= 8;
				for (let { _lView } of this.allViews) {
					if (!useGlobalCheck && !requiresRefreshOrTraversal(_lView)) continue;
					detectChangesInternal(_lView, useGlobalCheck && !this.zonelessEnabled ? 0 : 1);
					ranDetectChanges = true;
				}
				this.dirtyFlags &= -5;
				this.syncDirtyFlagsWithViews();
				if (this.dirtyFlags & 23) return;
			}
			if (!ranDetectChanges) {
				this._rendererFactory?.begin?.();
				this._rendererFactory?.end?.();
			}
			if (this.dirtyFlags & 8) {
				this.dirtyFlags &= -9;
				this.afterRenderManager.execute();
			}
			this.syncDirtyFlagsWithViews();
		}
		syncDirtyFlagsWithViews() {
			if (this.allViews.some(({ _lView }) => requiresRefreshOrTraversal(_lView))) {
				this.dirtyFlags |= 2;
				return;
			} else this.dirtyFlags &= -8;
		}
		attachView(viewRef) {
			const view = viewRef;
			this._views.push(view);
			view.attachToAppRef(this);
		}
		detachView(viewRef) {
			const view = viewRef;
			remove(this._views, view);
			view.detachFromAppRef();
		}
		_loadComponent(componentRef) {
			this.attachView(componentRef.hostView);
			try {
				this.tick();
			} catch (e) {
				this.internalErrorHandler(e);
			}
			this.components.push(componentRef);
			this._injector.get(APP_BOOTSTRAP_LISTENER, []).forEach((listener) => listener(componentRef));
		}
		ngOnDestroy() {
			if (this._destroyed) return;
			try {
				this._destroyListeners.forEach((listener) => listener());
				this._views.slice().forEach((view) => view.destroy());
			} finally {
				this._destroyed = true;
				this._views = [];
				this._destroyListeners = [];
			}
		}
		onDestroy(callback) {
			this._destroyListeners.push(callback);
			return () => remove(this._destroyListeners, callback);
		}
		destroy() {
			if (this._destroyed) throw new RuntimeError(406, false);
			const injector = this._injector;
			if (injector.destroy && !injector.destroyed) injector.destroy();
		}
		get viewCount() {
			return this._views.length;
		}
		static ɵfac = function ApplicationRef_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || ApplicationRef)();
		};
		static ɵprov = /*@__PURE__*/ ɵɵdefineService({
			token: ApplicationRef,
			factory: ApplicationRef.ɵfac
		});
	}
	return ApplicationRef;
})();
function normalizeBootstrapOptions(hostElementOrOptions) {
	if (hostElementOrOptions === void 0 || typeof hostElementOrOptions === "string" || hostElementOrOptions instanceof Element) return { hostElement: hostElementOrOptions };
	return hostElementOrOptions;
}
function remove(list, el) {
	const index = list.indexOf(el);
	if (index > -1) list.splice(index, 1);
}
function setDirectiveInputsWhichShadowsStyling(tView, tNode, lView, value, isClassBased) {
	setAllInputsForProperty(tNode, tView, lView, isClassBased ? "class" : "style", value);
}
function ɵɵelementStart(index, name, attrsIndex, localRefsIndex) {
	const lView = getLView();
	const tView = lView[1];
	const adjustedIndex = index + 27;
	const tNode = tView.firstCreatePass ? directiveHostFirstCreatePass(adjustedIndex, lView, 2, name, findDirectiveDefMatches, getBindingsEnabled(), attrsIndex, localRefsIndex) : tView.data[adjustedIndex];
	if (isComponentHost(tNode)) {
		const tracingService = lView[10].tracingService;
		if (tracingService && tracingService.componentCreate) {
			const def = tView.data[tNode.directiveStart + tNode.componentOffset];
			return tracingService.componentCreate(getComponentName(def), () => {
				initializeElement(index, name, lView, tNode, localRefsIndex);
				return ɵɵelementStart;
			});
		}
	}
	initializeElement(index, name, lView, tNode, localRefsIndex);
	return ɵɵelementStart;
}
function initializeElement(index, name, lView, tNode, localRefsIndex) {
	elementLikeStartShared(tNode, lView, index, name, _locateOrCreateElementNode);
	if (isDirectiveHost(tNode)) {
		const tView = lView[1];
		createDirectivesInstances(tView, lView, tNode);
		executeContentQueries(tView, tNode, lView);
	}
	if (localRefsIndex != null) saveResolvedLocalsInData(lView, tNode);
}
function ɵɵelementEnd() {
	const tView = getTView();
	const currentTNode = elementLikeEndShared(getCurrentTNode());
	if (tView.firstCreatePass) directiveHostEndFirstCreatePass(tView, currentTNode);
	if (isSkipHydrationRootTNode(currentTNode)) leaveSkipHydrationBlock();
	decreaseElementDepthCount();
	if (currentTNode.classesWithoutHost != null && hasClassInput(currentTNode)) setDirectiveInputsWhichShadowsStyling(tView, currentTNode, getLView(), currentTNode.classesWithoutHost, true);
	if (currentTNode.stylesWithoutHost != null && hasStyleInput(currentTNode)) setDirectiveInputsWhichShadowsStyling(tView, currentTNode, getLView(), currentTNode.stylesWithoutHost, false);
	return ɵɵelementEnd;
}
function ɵɵelement(index, name, attrsIndex, localRefsIndex) {
	ɵɵelementStart(index, name, attrsIndex, localRefsIndex);
	ɵɵelementEnd();
	return ɵɵelement;
}
var _locateOrCreateElementNode = (tView, lView, tNode, name, index) => {
	lastNodeWasCreated(true);
	return createElementNode(lView[11], name, getNamespace());
};
var DEFAULT_LOCALE_ID = "en-US";
function setLocaleId(localeId) {
	if (typeof localeId === "string") localeId.toLowerCase().replace(/_/g, "-");
}
var ChangeDetectionSchedulerImpl = /*#__PURE__*/ (() => {
	class ChangeDetectionSchedulerImpl {
		applicationErrorHandler = inject(INTERNAL_APPLICATION_ERROR_HANDLER);
		appRef = inject(ApplicationRef);
		taskService = inject(PendingTasksInternal);
		ngZone = inject(NgZone);
		zonelessEnabled = inject(ZONELESS_ENABLED);
		tracing = inject(TracingService, { optional: true });
		zoneIsDefined = typeof Zone !== "undefined" && !!Zone.root.run;
		schedulerTickApplyArgs = [{ data: { "__scheduler_tick__": true } }];
		subscriptions = new Subscription();
		angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(angularZoneInstanceIdProperty) : null;
		scheduleInRootZone = !this.zonelessEnabled && this.zoneIsDefined && (inject(SCHEDULE_IN_ROOT_ZONE, { optional: true }) ?? false);
		cancelScheduledCallback = null;
		useMicrotaskScheduler = false;
		runningTick = false;
		pendingRenderTaskId = null;
		constructor() {
			this.subscriptions.add(this.appRef.afterTick.subscribe(() => {
				const task = this.taskService.add();
				if (!this.runningTick) {
					this.cleanup();
					if (!this.zonelessEnabled || this.appRef.includeAllTestViews) {
						this.taskService.remove(task);
						return;
					}
				}
				this.switchToMicrotaskScheduler();
				this.taskService.remove(task);
			}));
			this.subscriptions.add(this.ngZone.onUnstable.subscribe(() => {
				if (!this.runningTick) this.cleanup();
			}));
		}
		switchToMicrotaskScheduler() {
			this.ngZone.runOutsideAngular(() => {
				const task = this.taskService.add();
				this.useMicrotaskScheduler = true;
				queueMicrotask(() => {
					this.useMicrotaskScheduler = false;
					this.taskService.remove(task);
				});
			});
		}
		notify(source) {
			if (!this.zonelessEnabled && source === 5) return;
			switch (source) {
				case 0:
				case 2:
					this.appRef.dirtyFlags |= 2;
					break;
				case 3:
				case 4:
				case 5:
				case 1:
					this.appRef.dirtyFlags |= 4;
					break;
				case 6:
					this.appRef.dirtyFlags |= 2;
					break;
				case 12:
					this.appRef.dirtyFlags |= 16;
					break;
				case 13:
					this.appRef.dirtyFlags |= 2;
					break;
				case 11: break;
				default: this.appRef.dirtyFlags |= 8;
			}
			this.appRef.tracingSnapshot = this.tracing?.snapshot(this.appRef.tracingSnapshot) ?? null;
			if (!this.shouldScheduleTick()) return;
			const scheduleCallback = this.useMicrotaskScheduler ? scheduleCallbackWithMicrotask : scheduleCallbackWithRafRace;
			this.pendingRenderTaskId = this.taskService.add();
			if (this.scheduleInRootZone) this.cancelScheduledCallback = Zone.root.run(() => scheduleCallback(() => this.tick()));
			else this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() => scheduleCallback(() => this.tick()));
		}
		shouldScheduleTick() {
			if (this.appRef.destroyed) return false;
			if (this.pendingRenderTaskId !== null || this.runningTick || this.appRef._runningTick) return false;
			if (!this.zonelessEnabled && this.zoneIsDefined && Zone.current.get("isAngularZone_ID" + this.angularZoneId)) return false;
			return true;
		}
		tick() {
			if (this.runningTick || this.appRef.destroyed) return;
			if (this.appRef.dirtyFlags === 0) {
				this.cleanup();
				return;
			}
			if (!this.zonelessEnabled && this.appRef.dirtyFlags & 7) this.appRef.dirtyFlags |= 1;
			const task = this.taskService.add();
			try {
				this.ngZone.run(() => {
					this.runningTick = true;
					this.appRef._tick();
				}, void 0, this.schedulerTickApplyArgs);
			} catch (e) {
				this.applicationErrorHandler(e);
			} finally {
				this.taskService.remove(task);
				this.cleanup();
			}
		}
		ngOnDestroy() {
			this.subscriptions.unsubscribe();
			this.cleanup();
		}
		cleanup() {
			this.runningTick = false;
			this.cancelScheduledCallback?.();
			this.cancelScheduledCallback = null;
			if (this.pendingRenderTaskId !== null) {
				const taskId = this.pendingRenderTaskId;
				this.pendingRenderTaskId = null;
				this.taskService.remove(taskId);
			}
		}
		static ɵfac = function ChangeDetectionSchedulerImpl_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || ChangeDetectionSchedulerImpl)();
		};
		static ɵprov = /*@__PURE__*/ ɵɵdefineService({
			token: ChangeDetectionSchedulerImpl,
			factory: ChangeDetectionSchedulerImpl.ɵfac
		});
	}
	return ChangeDetectionSchedulerImpl;
})();
function provideZonelessChangeDetectionInternal() {
	return [
		{
			provide: ChangeDetectionScheduler,
			useExisting: ChangeDetectionSchedulerImpl
		},
		{
			provide: NgZone,
			useClass: NoopNgZone
		},
		{
			provide: ZONELESS_ENABLED,
			useValue: true
		}
	];
}
function getGlobalLocale() {
	return typeof $localize !== "undefined" && $localize.locale || "en-US";
}
var LOCALE_ID = /*#__PURE__*/ new InjectionToken("", { factory: () => inject(LOCALE_ID, {
	optional: true,
	skipSelf: true
}) || getGlobalLocale() });
//#endregion
//#region node_modules/@angular/core/fesm2022/core.mjs
/**
* @license Angular v22.1.3
* (c) 2010-2026 Google LLC. https://angular.dev/
* License: MIT
*/
var PLATFORM_DESTROY_LISTENERS = /*#__PURE__*/ new InjectionToken("");
var ENABLE_ROOT_COMPONENT_BOOTSTRAP = /*#__PURE__*/ new InjectionToken("");
function isApplicationBootstrapConfig(config) {
	return !config.moduleRef;
}
function bootstrap(config) {
	const envInjector = isApplicationBootstrapConfig(config) ? config.r3Injector : config.moduleRef.injector;
	const ngZone = envInjector.get(NgZone);
	return ngZone.run(() => {
		if (isApplicationBootstrapConfig(config)) config.r3Injector.resolveInjectorInitializers();
		else config.moduleRef.resolveInjectorInitializers();
		const exceptionHandler = envInjector.get(INTERNAL_APPLICATION_ERROR_HANDLER);
		let onErrorSubscription;
		ngZone.runOutsideAngular(() => {
			onErrorSubscription = ngZone.onError.subscribe({ next: exceptionHandler });
		});
		if (isApplicationBootstrapConfig(config)) {
			const destroyListener = () => envInjector.destroy();
			const onPlatformDestroyListeners = config.platformInjector.get(PLATFORM_DESTROY_LISTENERS);
			onPlatformDestroyListeners.add(destroyListener);
			envInjector.onDestroy(() => {
				onErrorSubscription.unsubscribe();
				onPlatformDestroyListeners.delete(destroyListener);
			});
		} else {
			const destroyListener = () => config.moduleRef.destroy();
			const onPlatformDestroyListeners = config.platformInjector.get(PLATFORM_DESTROY_LISTENERS);
			onPlatformDestroyListeners.add(destroyListener);
			config.moduleRef.onDestroy(() => {
				remove(config.allPlatformModules, config.moduleRef);
				onErrorSubscription.unsubscribe();
				onPlatformDestroyListeners.delete(destroyListener);
			});
		}
		return _callAndReportToErrorHandler(exceptionHandler, ngZone, () => {
			const pendingTasks = envInjector.get(PendingTasksInternal);
			const taskId = pendingTasks.add();
			const initStatus = envInjector.get(ApplicationInitStatus);
			initStatus.runInitializers();
			return initStatus.donePromise.then(() => {
				setLocaleId(envInjector.get(LOCALE_ID, DEFAULT_LOCALE_ID) || "en-US");
				if (!envInjector.get(ENABLE_ROOT_COMPONENT_BOOTSTRAP, true)) {
					if (isApplicationBootstrapConfig(config)) return envInjector.get(ApplicationRef);
					config.allPlatformModules.push(config.moduleRef);
					return config.moduleRef;
				}
				if (isApplicationBootstrapConfig(config)) {
					const appRef = envInjector.get(ApplicationRef);
					if (config.rootComponent !== void 0) appRef.bootstrap(config.rootComponent);
					return appRef;
				} else {
					moduleBootstrapImpl?.(config.moduleRef, config.allPlatformModules);
					return config.moduleRef;
				}
			}).finally(() => void pendingTasks.remove(taskId));
		});
	});
}
var moduleBootstrapImpl;
function _callAndReportToErrorHandler(errorHandler, ngZone, callback) {
	try {
		const result = callback();
		if (isPromise(result)) return result.catch((e) => {
			ngZone.runOutsideAngular(() => errorHandler(e));
			throw e;
		});
		return result;
	} catch (e) {
		ngZone.runOutsideAngular(() => errorHandler(e));
		throw e;
	}
}
var _platformInjector = null;
function createPlatformInjector(providers = [], name) {
	return Injector.create({
		name,
		providers: [
			{
				provide: INJECTOR_SCOPE,
				useValue: "platform"
			},
			{
				provide: PLATFORM_DESTROY_LISTENERS,
				useValue: /* @__PURE__ */ new Set([() => _platformInjector = null])
			},
			...providers
		]
	});
}
function createOrReusePlatformInjector(providers = []) {
	if (_platformInjector) return _platformInjector;
	const injector = createPlatformInjector(providers);
	runPlatformInitializers(injector);
	return injector;
}
function runPlatformInitializers(injector) {
	const inits = injector.get(PLATFORM_INITIALIZER, null);
	runInInjectionContext(injector, () => {
		inits?.forEach((init) => init());
	});
}
function internalCreateApplication(config) {
	const { rootComponent, appProviders, platformProviders, platformRef } = config;
	profiler(ProfilerEvent.BootstrapApplicationStart);
	if (!platformRef) throw new RuntimeError(-401, false);
	try {
		const platformInjector = platformRef?.injector ?? createOrReusePlatformInjector(platformProviders);
		return bootstrap({
			r3Injector: new EnvironmentNgModuleRefAdapter({
				providers: [
					provideZonelessChangeDetectionInternal(),
					errorHandlerEnvironmentInitializer,
					...[],
					...appProviders || []
				],
				parent: platformInjector,
				debugName: "",
				runEnvironmentInitializers: false
			}).injector,
			platformInjector,
			rootComponent
		});
	} catch (e) {
		return Promise.reject(e);
	} finally {
		profiler(ProfilerEvent.BootstrapApplicationEnd);
	}
}
var PERFORMANCE_MARK_PREFIX = "🅰️";
var enablePerfLogging = false;
function startMeasuring(label) {
	if (!enablePerfLogging) return;
	const { startLabel } = labels(label);
	performance.mark(startLabel);
}
function stopMeasuring(label) {
	if (!enablePerfLogging) return;
	const { startLabel, labelName, endLabel } = labels(label);
	performance.mark(endLabel);
	performance.measure(labelName, startLabel, endLabel);
	performance.clearMarks(startLabel);
	performance.clearMarks(endLabel);
}
function labels(label) {
	const labelName = `${PERFORMANCE_MARK_PREFIX}:${label}`;
	return {
		labelName,
		startLabel: `start:${labelName}`,
		endLabel: `end:${labelName}`
	};
}
//#endregion
//#region node_modules/@angular/common/fesm2022/_platform_location-chunk.mjs
/**
* @license Angular v22.1.3
* (c) 2010-2026 Google LLC. https://angular.dev/
* License: MIT
*/
var _DOM = null;
function getDOM() {
	return _DOM;
}
function setRootDomAdapter(adapter) {
	_DOM ??= adapter;
}
var DomAdapter = class {};
var PlatformLocation = /*#__PURE__*/ (() => {
	class PlatformLocation {
		historyGo(relativePosition) {
			throw new Error("");
		}
		static ɵfac = function PlatformLocation_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || PlatformLocation)();
		};
		static ɵprov = /* @__PURE__ */ ɵɵdefineInjectable({
			token: PlatformLocation,
			factory: () => (() => inject(BrowserPlatformLocation))(),
			providedIn: "platform"
		});
	}
	return PlatformLocation;
})();
var BrowserPlatformLocation = /*#__PURE__*/ (() => {
	class BrowserPlatformLocation extends PlatformLocation {
		_location;
		_history;
		_doc = inject(DOCUMENT$1);
		constructor() {
			super();
			this._location = window.location;
			this._history = window.history;
		}
		getBaseHrefFromDOM() {
			return getDOM().getBaseHref(this._doc);
		}
		onPopState(fn) {
			const window = getDOM().getGlobalEventTarget(this._doc, "window");
			window.addEventListener("popstate", fn, false);
			return () => window.removeEventListener("popstate", fn);
		}
		onHashChange(fn) {
			const window = getDOM().getGlobalEventTarget(this._doc, "window");
			window.addEventListener("hashchange", fn, false);
			return () => window.removeEventListener("hashchange", fn);
		}
		get href() {
			return this._location.href;
		}
		get protocol() {
			return this._location.protocol;
		}
		get hostname() {
			return this._location.hostname;
		}
		get port() {
			return this._location.port;
		}
		get pathname() {
			return this._location.pathname;
		}
		get search() {
			return this._location.search;
		}
		get hash() {
			return this._location.hash;
		}
		set pathname(newPath) {
			this._location.pathname = newPath;
		}
		pushState(state, title, url) {
			this._history.pushState(state, title, url);
		}
		replaceState(state, title, url) {
			this._history.replaceState(state, title, url);
		}
		forward() {
			this._history.forward();
		}
		back() {
			this._history.back();
		}
		historyGo(relativePosition = 0) {
			this._history.go(relativePosition);
		}
		getState() {
			return this._history.state;
		}
		static ɵfac = function BrowserPlatformLocation_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || BrowserPlatformLocation)();
		};
		static ɵprov = /* @__PURE__ */ ɵɵdefineInjectable({
			token: BrowserPlatformLocation,
			factory: () => (() => new BrowserPlatformLocation())(),
			providedIn: "platform"
		});
	}
	return BrowserPlatformLocation;
})();
//#endregion
//#region node_modules/@angular/common/fesm2022/_xhr-chunk.mjs
/**
* @license Angular v22.1.3
* (c) 2010-2026 Google LLC. https://angular.dev/
* License: MIT
*/
function parseCookieValue(cookieStr, name) {
	name = encodeURIComponent(name);
	for (const cookie of cookieStr.split(";")) {
		const eqIndex = cookie.indexOf("=");
		const [cookieName, cookieValue] = eqIndex == -1 ? [cookie, ""] : [cookie.slice(0, eqIndex), cookie.slice(eqIndex + 1)];
		if (cookieName.trim() !== name) continue;
		let value = cookieValue;
		try {
			value = decodeURIComponent(cookieValue);
		} catch {}
		if (value.length > 1 && value[0] === "\"" && value[value.length - 1] === "\"") value = value.slice(1, -1);
		return value;
	}
	return null;
}
var BrowserXhr = /*#__PURE__*/ (() => {
	class BrowserXhr {
		build() {
			return new XMLHttpRequest();
		}
		static ɵfac = function BrowserXhr_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || BrowserXhr)();
		};
		static ɵprov = /* @__PURE__ */ ɵɵdefineService({
			token: BrowserXhr,
			factory: BrowserXhr.ɵfac
		});
	}
	return BrowserXhr;
})();
var XhrFactory = /*#__PURE__*/ (() => {
	class XhrFactory {
		static ɵfac = function XhrFactory_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || XhrFactory)();
		};
		static ɵprov = /* @__PURE__ */ ɵɵdefineInjectable({
			token: XhrFactory,
			factory: function XhrFactory_Factory(__ngFactoryType__) {
				let __ngConditionalFactory__ = null;
				if (__ngFactoryType__) __ngConditionalFactory__ = new (__ngFactoryType__ || XhrFactory)();
				else __ngConditionalFactory__ = ɵɵinject(BrowserXhr);
				return __ngConditionalFactory__;
			},
			providedIn: "root"
		});
	}
	return XhrFactory;
})();
//#endregion
//#region node_modules/@angular/common/fesm2022/common.mjs
/**
* @license Angular v22.1.3
* (c) 2010-2026 Google LLC. https://angular.dev/
* License: MIT
*/
var PLATFORM_BROWSER_ID = "browser";
var ViewportScroller = /*#__PURE__*/ (() => {
	class ViewportScroller {
		static ɵprov = /* @__PURE__ */ ɵɵdefineInjectable({
			token: ViewportScroller,
			providedIn: "root",
			factory: () => new BrowserViewportScroller(inject(DOCUMENT$1), window)
		});
	}
	return ViewportScroller;
})();
var BrowserViewportScroller = class {
	document;
	window;
	offset = () => [0, 0];
	constructor(document, window) {
		this.document = document;
		this.window = window;
	}
	setOffset(offset) {
		if (Array.isArray(offset)) this.offset = () => offset;
		else this.offset = offset;
	}
	getScrollPosition() {
		return [this.window.scrollX, this.window.scrollY];
	}
	scrollToPosition(position, options) {
		this.window.scrollTo({
			...options,
			left: position[0],
			top: position[1]
		});
	}
	scrollToAnchor(target, options) {
		const elSelected = findAnchorFromDocument(this.document, target);
		if (elSelected) {
			this.scrollToElement(elSelected, options);
			elSelected.focus({ preventScroll: true });
		}
	}
	setHistoryScrollRestoration(scrollRestoration) {
		try {
			this.window.history.scrollRestoration = scrollRestoration;
		} catch {
			console.warn(formatRuntimeError(2400, false));
		}
	}
	scrollToElement(el, options) {
		const rect = el.getBoundingClientRect();
		const left = rect.left + this.window.pageXOffset;
		const top = rect.top + this.window.pageYOffset;
		const offset = this.offset();
		this.window.scrollTo({
			...options,
			left: left - offset[0],
			top: top - offset[1]
		});
	}
};
function findAnchorFromDocument(document, target) {
	const documentResult = document.getElementById(target) || document.getElementsByName(target)[0];
	if (documentResult) return documentResult;
	if (typeof document.createTreeWalker === "function" && document.body && typeof document.body.attachShadow === "function") {
		const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
		let currentNode = treeWalker.currentNode;
		while (currentNode) {
			const shadowRoot = currentNode.shadowRoot;
			if (shadowRoot) {
				const result = shadowRoot.getElementById(target) || shadowRoot.querySelector(`[name="${CSS.escape(target)}"]`);
				if (result) return result;
			}
			currentNode = treeWalker.nextNode();
		}
	}
	return null;
}
var NullViewportScroller = class {
	setOffset(offset) {}
	getScrollPosition() {
		return [0, 0];
	}
	scrollToPosition(position) {}
	scrollToAnchor(anchor, options) {}
	setHistoryScrollRestoration(scrollRestoration) {}
};
//#endregion
//#region node_modules/@angular/platform-browser/fesm2022/_dom_renderer-chunk.mjs
/**
* @license Angular v22.1.3
* (c) 2010-2026 Google LLC. https://angular.dev/
* License: MIT
*/
var EventManagerPlugin = class {
	_doc;
	constructor(_doc) {
		this._doc = _doc;
	}
	manager;
};
var DomEventsPlugin = /*#__PURE__*/ (() => {
	class DomEventsPlugin extends EventManagerPlugin {
		constructor(doc) {
			super(doc);
		}
		supports(eventName) {
			return true;
		}
		addEventListener(element, eventName, handler, options) {
			element.addEventListener(eventName, handler, options);
			return () => this.removeEventListener(element, eventName, handler, options);
		}
		removeEventListener(target, eventName, callback, options) {
			return target.removeEventListener(eventName, callback, options);
		}
		static ɵfac = function DomEventsPlugin_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || DomEventsPlugin)(ɵɵinject(DOCUMENT$1));
		};
		static ɵprov = /* @__PURE__ */ ɵɵdefineInjectable({
			token: DomEventsPlugin,
			factory: DomEventsPlugin.ɵfac
		});
	}
	return DomEventsPlugin;
})();
var EVENT_MANAGER_PLUGINS = /*#__PURE__*/ new InjectionToken("");
var EventManager = /*#__PURE__*/ (() => {
	class EventManager {
		_zone;
		_plugins;
		_eventNameToPlugin = /* @__PURE__ */ new Map();
		constructor(plugins, _zone) {
			this._zone = _zone;
			plugins.forEach((plugin) => {
				plugin.manager = this;
			});
			const otherPlugins = plugins.filter((p) => !(p instanceof DomEventsPlugin));
			this._plugins = otherPlugins.slice().reverse();
			const domEventPlugin = plugins.find((p) => p instanceof DomEventsPlugin);
			if (domEventPlugin) this._plugins.push(domEventPlugin);
		}
		addEventListener(element, eventName, handler, options) {
			return this._findPluginFor(eventName).addEventListener(element, eventName, handler, options);
		}
		getZone() {
			return this._zone;
		}
		_findPluginFor(eventName) {
			let plugin = this._eventNameToPlugin.get(eventName);
			if (plugin) return plugin;
			plugin = this._plugins.find((plugin) => plugin.supports(eventName));
			if (!plugin) throw new RuntimeError(-5101, false);
			this._eventNameToPlugin.set(eventName, plugin);
			return plugin;
		}
		static ɵfac = function EventManager_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || EventManager)(ɵɵinject(EVENT_MANAGER_PLUGINS), ɵɵinject(NgZone));
		};
		static ɵprov = /* @__PURE__ */ ɵɵdefineInjectable({
			token: EventManager,
			factory: EventManager.ɵfac
		});
	}
	return EventManager;
})();
var APP_ID_ATTRIBUTE_NAME = "ng-app-id";
function removeElements(elements) {
	for (const element of elements) element.remove();
}
function createStyleElement(style, doc) {
	const styleElement = doc.createElement("style");
	styleElement.textContent = style;
	return styleElement;
}
function addServerStyles(doc, appId, inline, external) {
	const elements = doc.head?.querySelectorAll(`style[${APP_ID_ATTRIBUTE_NAME}="${appId}"],link[${APP_ID_ATTRIBUTE_NAME}="${appId}"]`);
	if (!elements || elements.length === 0) return false;
	for (const styleElement of elements) {
		styleElement.removeAttribute(APP_ID_ATTRIBUTE_NAME);
		if (styleElement instanceof HTMLLinkElement) external.set(styleElement.href.slice(styleElement.href.lastIndexOf("/") + 1), {
			usage: 0,
			elements: [styleElement]
		});
		else if (styleElement.textContent) inline.set(styleElement.textContent, {
			usage: 0,
			elements: [styleElement]
		});
	}
	return true;
}
function createLinkElement(url, doc) {
	const linkElement = doc.createElement("link");
	linkElement.setAttribute("rel", "stylesheet");
	linkElement.setAttribute("href", url);
	return linkElement;
}
var SharedStylesHost = /*#__PURE__*/ (() => {
	class SharedStylesHost {
		doc;
		appId;
		nonce;
		inline = /* @__PURE__ */ new Map();
		external = /* @__PURE__ */ new Map();
		hosts = /* @__PURE__ */ new Set();
		constructor(doc, appId, nonce, platformId = {}) {
			this.doc = doc;
			this.appId = appId;
			this.nonce = nonce;
			if (addServerStyles(doc, appId, this.inline, this.external)) this.hosts.add(doc.head);
		}
		addStyles(styles, urls) {
			for (const value of styles) this.addUsage(value, this.inline, createStyleElement);
			urls?.forEach((value) => this.addUsage(value, this.external, createLinkElement));
		}
		removeStyles(styles, urls) {
			for (const value of styles) this.removeUsage(value, this.inline);
			urls?.forEach((value) => this.removeUsage(value, this.external));
		}
		addUsage(value, usages, creator) {
			const record = usages.get(value);
			if (record) record.usage++;
			else usages.set(value, {
				usage: 1,
				elements: [...this.hosts].map((host) => this.addElement(host, creator(value, this.doc)))
			});
		}
		removeUsage(value, usages) {
			const record = usages.get(value);
			if (record) {
				record.usage--;
				if (record.usage <= 0) {
					removeElements(record.elements);
					usages.delete(value);
				}
			}
		}
		ngOnDestroy() {
			for (const [, { elements }] of [...this.inline, ...this.external]) removeElements(elements);
			this.hosts.clear();
		}
		addHost(hostNode) {
			if (this.hosts.has(hostNode)) return;
			this.hosts.add(hostNode);
			for (const [style, { elements }] of this.inline) elements.push(this.addElement(hostNode, createStyleElement(style, this.doc)));
			for (const [url, { elements }] of this.external) elements.push(this.addElement(hostNode, createLinkElement(url, this.doc)));
		}
		removeHost(hostNode) {
			this.hosts.delete(hostNode);
			for (const record of [...this.inline.values(), ...this.external.values()]) {
				const remaining = [];
				for (const element of record.elements) if (element.parentNode === hostNode) element.remove();
				else remaining.push(element);
				record.elements = remaining;
			}
		}
		addElement(host, element) {
			if (this.nonce) element.setAttribute("nonce", this.nonce);
			return host.appendChild(element);
		}
		static ɵfac = function SharedStylesHost_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || SharedStylesHost)(ɵɵinject(DOCUMENT$1), ɵɵinject(APP_ID), ɵɵinject(CSP_NONCE, 8), ɵɵinject(PLATFORM_ID));
		};
		static ɵprov = /* @__PURE__ */ ɵɵdefineInjectable({
			token: SharedStylesHost,
			factory: SharedStylesHost.ɵfac
		});
	}
	return SharedStylesHost;
})();
var NAMESPACE_URIS = {
	"svg": "http://www.w3.org/2000/svg",
	"xhtml": "http://www.w3.org/1999/xhtml",
	"xlink": "http://www.w3.org/1999/xlink",
	"xml": "http://www.w3.org/XML/1998/namespace",
	"xmlns": "http://www.w3.org/2000/xmlns/",
	"math": "http://www.w3.org/1998/Math/MathML"
};
var COMPONENT_REGEX = /%COMP%/g;
var COMPONENT_VARIABLE = "%COMP%";
var HOST_ATTR = `_nghost-${COMPONENT_VARIABLE}`;
var CONTENT_ATTR = `_ngcontent-${COMPONENT_VARIABLE}`;
var REMOVE_STYLES_ON_COMPONENT_DESTROY_DEFAULT = true;
var REMOVE_STYLES_ON_COMPONENT_DESTROY = /*#__PURE__*/ new InjectionToken("", { factory: () => REMOVE_STYLES_ON_COMPONENT_DESTROY_DEFAULT });
var CSS_VAR_NAMESPACE = /*#__PURE__*/ new InjectionToken("");
function shimContentAttribute(componentShortId) {
	return CONTENT_ATTR.replace(COMPONENT_REGEX, componentShortId);
}
function shimHostAttribute(componentShortId) {
	return HOST_ATTR.replace(COMPONENT_REGEX, componentShortId);
}
function shimStylesContent(compId, styles) {
	return styles.map((s) => s.replace(COMPONENT_REGEX, compId));
}
var DomRendererFactory2 = /*#__PURE__*/ (() => {
	class DomRendererFactory2 {
		eventManager;
		sharedStylesHost;
		appId;
		removeStylesOnCompDestroy;
		doc;
		ngZone;
		nonce;
		tracingService;
		rendererByCompId = /* @__PURE__ */ new Map();
		defaultRenderer;
		cssVarNamespace;
		constructor(eventManager, sharedStylesHost, appId, removeStylesOnCompDestroy, doc, ngZone, nonce = null, tracingService = null, cssVarNamespace = null) {
			this.eventManager = eventManager;
			this.sharedStylesHost = sharedStylesHost;
			this.appId = appId;
			this.removeStylesOnCompDestroy = removeStylesOnCompDestroy;
			this.doc = doc;
			this.ngZone = ngZone;
			this.nonce = nonce;
			this.tracingService = tracingService;
			this.cssVarNamespace = cssVarNamespace ?? "";
			this.defaultRenderer = new DefaultDomRenderer2(eventManager, doc, ngZone, this.tracingService, this.cssVarNamespace);
		}
		createRenderer(element, type) {
			if (!element || !type) return this.defaultRenderer;
			const renderer = this.getOrCreateRenderer(element, type);
			if (renderer instanceof EmulatedEncapsulationDomRenderer2) renderer.applyToHost(element);
			else if (renderer instanceof NoneEncapsulationDomRenderer) renderer.applyStyles();
			return renderer;
		}
		getOrCreateRenderer(element, type) {
			const rendererByCompId = this.rendererByCompId;
			let renderer = rendererByCompId.get(type.id);
			if (!renderer) {
				const doc = this.doc;
				const ngZone = this.ngZone;
				const eventManager = this.eventManager;
				const sharedStylesHost = this.sharedStylesHost;
				const removeStylesOnCompDestroy = this.removeStylesOnCompDestroy;
				const tracingService = this.tracingService;
				switch (type.encapsulation) {
					case ViewEncapsulation.Emulated:
						renderer = new EmulatedEncapsulationDomRenderer2(eventManager, sharedStylesHost, type, this.appId, removeStylesOnCompDestroy, doc, ngZone, tracingService, this.cssVarNamespace);
						break;
					case ViewEncapsulation.ShadowDom: return new ShadowDomRenderer(eventManager, element, type, doc, ngZone, this.nonce, tracingService, this.cssVarNamespace, sharedStylesHost);
					case ViewEncapsulation.ExperimentalIsolatedShadowDom: return new ShadowDomRenderer(eventManager, element, type, doc, ngZone, this.nonce, tracingService, this.cssVarNamespace);
					default: renderer = new NoneEncapsulationDomRenderer(eventManager, sharedStylesHost, type, removeStylesOnCompDestroy, doc, ngZone, tracingService, this.cssVarNamespace);
				}
				rendererByCompId.set(type.id, renderer);
			}
			return renderer;
		}
		ngOnDestroy() {
			this.rendererByCompId.clear();
		}
		componentReplaced(componentId) {
			this.rendererByCompId.delete(componentId);
		}
		static ɵfac = function DomRendererFactory2_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || DomRendererFactory2)(ɵɵinject(EventManager), ɵɵinject(SHARED_STYLES_HOST), ɵɵinject(APP_ID), ɵɵinject(REMOVE_STYLES_ON_COMPONENT_DESTROY), ɵɵinject(DOCUMENT$1), ɵɵinject(NgZone), ɵɵinject(CSP_NONCE), ɵɵinject(TracingService, 8), ɵɵinject(CSS_VAR_NAMESPACE, 8));
		};
		static ɵprov = /* @__PURE__ */ ɵɵdefineInjectable({
			token: DomRendererFactory2,
			factory: DomRendererFactory2.ɵfac
		});
	}
	return DomRendererFactory2;
})();
var DefaultDomRenderer2 = class {
	eventManager;
	doc;
	ngZone;
	tracingService;
	cssVarNamespace;
	data = Object.create(null);
	throwOnSyntheticProps = true;
	constructor(eventManager, doc, ngZone, tracingService, cssVarNamespace = "") {
		this.eventManager = eventManager;
		this.doc = doc;
		this.ngZone = ngZone;
		this.tracingService = tracingService;
		this.cssVarNamespace = cssVarNamespace;
	}
	destroy() {}
	destroyNode = null;
	createElement(name, namespace) {
		if (namespace) return this.doc.createElementNS(NAMESPACE_URIS[namespace] || namespace, name);
		return this.doc.createElement(name);
	}
	createComment(value) {
		return this.doc.createComment(value);
	}
	createText(value) {
		return this.doc.createTextNode(value);
	}
	appendChild(parent, newChild) {
		(isTemplateNode(parent) ? parent.content : parent).appendChild(newChild);
	}
	insertBefore(parent, newChild, refChild) {
		if (parent) {
			const targetParent = isTemplateNode(parent) ? parent.content : parent;
			if (refChild != null && refChild.parentNode !== targetParent) throw new RuntimeError(-5106, describeDomNode(refChild));
			targetParent.insertBefore(newChild, refChild);
		}
	}
	removeChild(_parent, oldChild) {
		oldChild.remove();
	}
	selectRootElement(selectorOrNode, preserveContent) {
		let el = typeof selectorOrNode === "string" ? this.doc.querySelector(selectorOrNode) : selectorOrNode;
		if (!el) throw new RuntimeError(-5104, false);
		if (!preserveContent) el.textContent = "";
		return el;
	}
	parentNode(node) {
		return node.parentNode;
	}
	nextSibling(node) {
		return node.nextSibling;
	}
	setAttribute(el, name, value, namespace) {
		if (namespace) {
			name = namespace + ":" + name;
			const namespaceUri = NAMESPACE_URIS[namespace];
			if (namespaceUri) el.setAttributeNS(namespaceUri, name, value);
			else el.setAttribute(name, value);
		} else el.setAttribute(name, value);
	}
	removeAttribute(el, name, namespace) {
		if (namespace) {
			const namespaceUri = NAMESPACE_URIS[namespace];
			if (namespaceUri) el.removeAttributeNS(namespaceUri, name);
			else el.removeAttribute(`${namespace}:${name}`);
		} else el.removeAttribute(name);
	}
	addClass(el, name) {
		el.classList.add(name);
	}
	removeClass(el, name) {
		el.classList.remove(name);
	}
	setStyle(el, style, value, flags) {
		const isVariable = style.startsWith("--");
		if (isVariable) style = style.replace("%NS%", this.cssVarNamespace);
		if (isVariable || flags & (RendererStyleFlags2.DashCase | RendererStyleFlags2.Important)) el.style.setProperty(style, value, flags & RendererStyleFlags2.Important ? "important" : "");
		else el.style[style] = value;
	}
	removeStyle(el, style, flags) {
		const isVariable = style.startsWith("--");
		if (isVariable) style = style.replace("%NS%", this.cssVarNamespace);
		if (isVariable || flags & RendererStyleFlags2.DashCase) el.style.removeProperty(style);
		else el.style[style] = "";
	}
	setProperty(el, name, value) {
		if (el == null) return;
		el[name] = value;
	}
	setValue(node, value) {
		node.nodeValue = value;
	}
	listen(target, event, callback, options) {
		if (typeof target === "string") {
			target = getDOM().getGlobalEventTarget(this.doc, target);
			if (!target) throw new RuntimeError(-5102, false);
		}
		let wrappedCallback = this.decoratePreventDefault(callback);
		if (this.tracingService?.wrapEventListener) wrappedCallback = this.tracingService.wrapEventListener(target, event, wrappedCallback);
		return this.eventManager.addEventListener(target, event, wrappedCallback, options);
	}
	decoratePreventDefault(eventHandler) {
		return (event) => {
			if (event === "__ngUnwrap__") return eventHandler;
			if (eventHandler(event) === false) event.preventDefault();
		};
	}
};
function isTemplateNode(node) {
	return node.tagName === "TEMPLATE" && node.content !== void 0;
}
function describeDomNode(node) {
	const textContent = node.textContent?.slice(0, 50);
	return textContent ? `${node.nodeName} ("${textContent}")` : node.nodeName;
}
var ShadowDomRenderer = class extends DefaultDomRenderer2 {
	hostEl;
	sharedStylesHost;
	shadowRoot;
	constructor(eventManager, hostEl, component, doc, ngZone, nonce, tracingService, cssVarNamespace, sharedStylesHost) {
		super(eventManager, doc, ngZone, tracingService, cssVarNamespace);
		this.hostEl = hostEl;
		this.sharedStylesHost = sharedStylesHost;
		this.shadowRoot = hostEl.attachShadow({ mode: "open" });
		if (this.sharedStylesHost) this.sharedStylesHost.addHost(this.shadowRoot);
		let styles = component.styles;
		styles = shimStylesContent(component.id, styles).map((s) => s.replace(/%NS%/g, cssVarNamespace));
		for (const style of styles) {
			const styleEl = document.createElement("style");
			if (nonce) styleEl.setAttribute("nonce", nonce);
			styleEl.textContent = style;
			this.shadowRoot.appendChild(styleEl);
		}
		const styleUrls = component.getExternalStyles?.();
		if (styleUrls) for (const styleUrl of styleUrls) {
			const linkEl = createLinkElement(styleUrl, doc);
			if (nonce) linkEl.setAttribute("nonce", nonce);
			this.shadowRoot.appendChild(linkEl);
		}
	}
	nodeOrShadowRoot(node) {
		return node === this.hostEl ? this.shadowRoot : node;
	}
	appendChild(parent, newChild) {
		return super.appendChild(this.nodeOrShadowRoot(parent), newChild);
	}
	insertBefore(parent, newChild, refChild) {
		return super.insertBefore(this.nodeOrShadowRoot(parent), newChild, refChild);
	}
	removeChild(_parent, oldChild) {
		return super.removeChild(null, oldChild);
	}
	parentNode(node) {
		return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(node)));
	}
	destroy() {
		if (this.sharedStylesHost) this.sharedStylesHost.removeHost(this.shadowRoot);
	}
};
var NoneEncapsulationDomRenderer = class extends DefaultDomRenderer2 {
	sharedStylesHost;
	removeStylesOnCompDestroy;
	styles;
	styleUrls;
	constructor(eventManager, sharedStylesHost, component, removeStylesOnCompDestroy, doc, ngZone, tracingService, cssVarNamespace, compId) {
		super(eventManager, doc, ngZone, tracingService, cssVarNamespace);
		this.sharedStylesHost = sharedStylesHost;
		this.removeStylesOnCompDestroy = removeStylesOnCompDestroy;
		let styles = component.styles;
		const shimmed = compId ? shimStylesContent(compId, styles) : styles;
		this.styles = shimmed.map((s) => s.replace(/%NS%/g, cssVarNamespace));
		this.styleUrls = component.getExternalStyles?.(compId);
	}
	applyStyles() {
		this.sharedStylesHost.addStyles(this.styles, this.styleUrls);
	}
	destroy() {
		if (!this.removeStylesOnCompDestroy) return;
		if (allLeavingAnimations.size === 0) this.sharedStylesHost.removeStyles(this.styles, this.styleUrls);
	}
};
var EmulatedEncapsulationDomRenderer2 = class extends NoneEncapsulationDomRenderer {
	contentAttr;
	hostAttr;
	constructor(eventManager, sharedStylesHost, component, appId, removeStylesOnCompDestroy, doc, ngZone, tracingService, cssVarNamespace) {
		const compId = appId + "-" + component.id;
		super(eventManager, sharedStylesHost, component, removeStylesOnCompDestroy, doc, ngZone, tracingService, cssVarNamespace, compId);
		this.contentAttr = shimContentAttribute(compId);
		this.hostAttr = shimHostAttribute(compId);
	}
	applyToHost(element) {
		this.applyStyles();
		this.setAttribute(element, this.hostAttr, "");
	}
	createElement(parent, name) {
		const el = super.createElement(parent, name);
		super.setAttribute(el, this.contentAttr, "");
		return el;
	}
};
//#endregion
//#region node_modules/@angular/platform-browser/fesm2022/_browser-chunk.mjs
/**
* @license Angular v22.1.3
* (c) 2010-2026 Google LLC. https://angular.dev/
* License: MIT
*/
var BrowserDomAdapter = class BrowserDomAdapter extends DomAdapter {
	supportsDOMEvents = true;
	static makeCurrent() {
		setRootDomAdapter(new BrowserDomAdapter());
	}
	onAndCancel(el, evt, listener, options) {
		el.addEventListener(evt, listener, options);
		return () => {
			el.removeEventListener(evt, listener, options);
		};
	}
	dispatchEvent(el, evt) {
		el.dispatchEvent(evt);
	}
	remove(node) {
		node.remove();
	}
	createElement(tagName, doc) {
		doc = doc || this.getDefaultDocument();
		return doc.createElement(tagName);
	}
	createHtmlDocument() {
		return document.implementation.createHTMLDocument("fakeTitle");
	}
	getDefaultDocument() {
		return document;
	}
	isElementNode(node) {
		return node.nodeType === Node.ELEMENT_NODE;
	}
	isShadowRoot(node) {
		return node instanceof DocumentFragment;
	}
	getGlobalEventTarget(doc, target) {
		if (target === "window") return window;
		if (target === "document") return doc;
		if (target === "body") return doc.body;
		return null;
	}
	getBaseHref(doc) {
		const href = getBaseElementHref();
		return href == null ? null : relativePath(href);
	}
	resetBaseElement() {
		baseElement = null;
	}
	getUserAgent() {
		return window.navigator.userAgent;
	}
	getCookie(name) {
		return parseCookieValue(document.cookie, name);
	}
};
var baseElement = null;
function getBaseElementHref() {
	baseElement = baseElement || document.head.querySelector("base");
	return baseElement ? baseElement.getAttribute("href") : null;
}
function relativePath(url) {
	return new URL(url, document.baseURI).pathname;
}
var MODIFIER_KEYS = [
	"alt",
	"control",
	"meta",
	"shift"
];
var _keyMap = {
	"\b": "Backspace",
	"	": "Tab",
	"": "Delete",
	"\x1B": "Escape",
	"Del": "Delete",
	"Esc": "Escape",
	"Left": "ArrowLeft",
	"Right": "ArrowRight",
	"Up": "ArrowUp",
	"Down": "ArrowDown",
	"Menu": "ContextMenu",
	"Scroll": "ScrollLock",
	"Win": "OS"
};
var MODIFIER_KEY_GETTERS = {
	"alt": (event) => event.altKey,
	"control": (event) => event.ctrlKey,
	"meta": (event) => event.metaKey,
	"shift": (event) => event.shiftKey
};
var KeyEventsPlugin = /*#__PURE__*/ (() => {
	class KeyEventsPlugin extends EventManagerPlugin {
		constructor(doc) {
			super(doc);
		}
		supports(eventName) {
			return KeyEventsPlugin.parseEventName(eventName) != null;
		}
		addEventListener(element, eventName, handler, options) {
			const parsedEvent = KeyEventsPlugin.parseEventName(eventName);
			const outsideHandler = KeyEventsPlugin.eventCallback(parsedEvent["fullKey"], handler, this.manager.getZone());
			return this.manager.getZone().runOutsideAngular(() => {
				return getDOM().onAndCancel(element, parsedEvent["domEventName"], outsideHandler, options);
			});
		}
		static parseEventName(eventName) {
			const parts = eventName.toLowerCase().split(".");
			const domEventName = parts.shift();
			if (parts.length === 0 || !(domEventName === "keydown" || domEventName === "keyup")) return null;
			const key = KeyEventsPlugin._normalizeKey(parts.pop());
			let fullKey = "";
			let codeIX = parts.indexOf("code");
			if (codeIX > -1) {
				parts.splice(codeIX, 1);
				fullKey = "code.";
			}
			MODIFIER_KEYS.forEach((modifierName) => {
				const index = parts.indexOf(modifierName);
				if (index > -1) {
					parts.splice(index, 1);
					fullKey += modifierName + ".";
				}
			});
			fullKey += key;
			if (parts.length != 0 || key.length === 0) return null;
			const result = {};
			result["domEventName"] = domEventName;
			result["fullKey"] = fullKey;
			return result;
		}
		static matchEventFullKeyCode(event, fullKeyCode) {
			let keycode = _keyMap[event.key] || event.key;
			let key = "";
			if (fullKeyCode.indexOf("code.") > -1) {
				keycode = event.code;
				key = "code.";
			}
			if (keycode == null || !keycode) return false;
			keycode = keycode.toLowerCase();
			if (keycode === " ") keycode = "space";
			else if (keycode === ".") keycode = "dot";
			MODIFIER_KEYS.forEach((modifierName) => {
				if (modifierName !== keycode) {
					const modifierGetter = MODIFIER_KEY_GETTERS[modifierName];
					if (modifierGetter(event)) key += modifierName + ".";
				}
			});
			key += keycode;
			return key === fullKeyCode;
		}
		static eventCallback(fullKey, handler, zone) {
			return (event) => {
				if (KeyEventsPlugin.matchEventFullKeyCode(event, fullKey)) zone.runGuarded(() => handler(event));
			};
		}
		static _normalizeKey(keyName) {
			return keyName === "esc" ? "escape" : keyName;
		}
		static ɵfac = function KeyEventsPlugin_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || KeyEventsPlugin)(ɵɵinject(DOCUMENT$1));
		};
		static ɵprov = /* @__PURE__ */ ɵɵdefineInjectable({
			token: KeyEventsPlugin,
			factory: KeyEventsPlugin.ɵfac
		});
	}
	return KeyEventsPlugin;
})();
async function bootstrapApplication(rootComponent, options, context) {
	return internalCreateApplication({
		rootComponent,
		...createProvidersConfig(options, context)
	});
}
function createProvidersConfig(options, context) {
	return {
		platformRef: context?.platformRef,
		appProviders: [...BROWSER_MODULE_PROVIDERS, ...options?.providers ?? []],
		platformProviders: INTERNAL_BROWSER_PLATFORM_PROVIDERS
	};
}
function initDomAdapter() {
	BrowserDomAdapter.makeCurrent();
}
function errorHandler() {
	return new ErrorHandler();
}
function _document() {
	setDocument(document);
	return document;
}
var INTERNAL_BROWSER_PLATFORM_PROVIDERS = [
	{
		provide: PLATFORM_ID,
		useValue: PLATFORM_BROWSER_ID
	},
	{
		provide: PLATFORM_INITIALIZER,
		useValue: initDomAdapter,
		multi: true
	},
	{
		provide: DOCUMENT$1,
		useFactory: _document
	}
];
var BROWSER_MODULE_PROVIDERS = [
	{
		provide: INJECTOR_SCOPE,
		useValue: "root"
	},
	{
		provide: ErrorHandler,
		useFactory: errorHandler
	},
	{
		provide: EVENT_MANAGER_PLUGINS,
		useClass: DomEventsPlugin,
		multi: true
	},
	{
		provide: EVENT_MANAGER_PLUGINS,
		useClass: KeyEventsPlugin,
		multi: true
	},
	DomRendererFactory2,
	{
		provide: SHARED_STYLES_HOST,
		useClass: SharedStylesHost
	},
	{
		provide: SharedStylesHost,
		useExisting: SHARED_STYLES_HOST
	},
	EventManager,
	{
		provide: RendererFactory2,
		useExisting: DomRendererFactory2
	},
	[]
];
/**
* @license Angular v22.1.3
* (c) 2010-2026 Google LLC. https://angular.dev/
* License: MIT
*/
var HTTP_FETCH_MAX_RESPONSE_SIZE = /*#__PURE__*/ new InjectionToken("", { factory: () => null });
var HTTP_ROOT_INTERCEPTOR_FNS = /*#__PURE__*/ new InjectionToken("");
//#endregion
//#region node_modules/@angular/ssr/fesm2022/_validation-chunk.mjs
var TRUST_ALL_PROXY_HEADERS = "*";
var HOST_HEADERS_TO_VALIDATE = ["host", "x-forwarded-host"];
var VALID_PORT_REGEX = /^\d+$/;
var VALID_PROTO_REGEX = /^https?$/i;
var VALID_PREFIX_REGEX = /^\/([a-z0-9_-]+\/)*[a-z0-9_-]*$/i;
function getFirstHeaderValue(value) {
	return value?.toString().split(",", 1)[0]?.trim();
}
function validateRequest(request, allowedHosts, disableHostCheck) {
	validateHeaders(request, allowedHosts, disableHostCheck);
	if (!disableHostCheck) validateUrl(new URL(request.url), allowedHosts);
}
function validateUrl(url, allowedHosts) {
	const { hostname } = url;
	if (!isHostAllowed(hostname, allowedHosts)) throw new Error(`URL with hostname "${hostname}" is not allowed.`);
}
function sanitizeRequestHeaders(request, trustProxyHeaders) {
	let headersDeleted = false;
	const headers = new Headers();
	for (const [key, value] of request.headers) {
		const lowerKey = key.toLowerCase();
		if ((lowerKey === "forwarded" || lowerKey.startsWith("x-forwarded-")) && !isProxyHeaderAllowed(lowerKey, trustProxyHeaders)) {
			console.warn(`Received "${key}" header but "trustProxyHeaders" was not set up to allow it.\nFor more information, see https://angular.dev/best-practices/security#configuring-trusted-proxy-headers`);
			headersDeleted = true;
		} else headers.set(key, value);
	}
	return headersDeleted ? new Request(request, { headers }) : request;
}
function verifyHostAllowed(headerName, headerValue, allowedHosts) {
	const url = `http://${headerValue}`;
	if (!URL.canParse(url)) throw new Error(`Header "${headerName}" contains an invalid value and cannot be parsed.`);
	const { hostname, pathname, search, hash, username, password } = new URL(url);
	if (pathname !== "/" || search || hash || username || password) throw new Error(`Header "${headerName}" with value "${headerValue}" contains characters that are not allowed.`);
	if (!isHostAllowed(hostname, allowedHosts)) throw new Error(`Header "${headerName}" with value "${headerValue}" is not allowed.`);
}
function isHostAllowed(hostname, allowedHosts) {
	if (allowedHosts.has("*") || allowedHosts.has(hostname)) return true;
	for (const allowedHost of allowedHosts) {
		if (!allowedHost.startsWith("*.")) continue;
		const domain = allowedHost.slice(1);
		if (hostname.endsWith(domain)) return true;
	}
	return false;
}
function validateHeaders(request, allowedHosts, disableHostCheck) {
	const headers = request.headers;
	for (const headerName of HOST_HEADERS_TO_VALIDATE) {
		const headerValue = getFirstHeaderValue(headers.get(headerName));
		if (headerValue && !disableHostCheck) verifyHostAllowed(headerName, headerValue, allowedHosts);
	}
	const forwarded = headers.get("forwarded");
	if (forwarded) {
		const forwardedParams = parseForwardedHeader(forwarded);
		if (forwardedParams.host && !disableHostCheck) verifyHostAllowed("Forwarded \"host\"", forwardedParams.host, allowedHosts);
		if (forwardedParams.proto && !VALID_PROTO_REGEX.test(forwardedParams.proto)) throw new Error("Header \"forwarded\" proto parameter must be either \"http\" or \"https\".");
	}
	const xForwardedPort = getFirstHeaderValue(headers.get("x-forwarded-port"));
	if (xForwardedPort && !VALID_PORT_REGEX.test(xForwardedPort)) throw new Error("Header \"x-forwarded-port\" must be a numeric value.");
	const xForwardedProto = getFirstHeaderValue(headers.get("x-forwarded-proto"));
	if (xForwardedProto && !VALID_PROTO_REGEX.test(xForwardedProto)) throw new Error("Header \"x-forwarded-proto\" must be either \"http\" or \"https\".");
	const xForwardedPrefix = getFirstHeaderValue(headers.get("x-forwarded-prefix"));
	if (xForwardedPrefix && !VALID_PREFIX_REGEX.test(xForwardedPrefix)) throw new Error("Header \"x-forwarded-prefix\" is invalid. It must start with a \"/\" and contain only alphanumeric characters, hyphens, and underscores, separated by single slashes.");
}
function isProxyHeaderAllowed(headerName, trustProxyHeaders) {
	return trustProxyHeaders.has(TRUST_ALL_PROXY_HEADERS) || trustProxyHeaders.has(headerName.toLowerCase());
}
function normalizeTrustProxyHeaders(trustProxyHeaders) {
	if (!trustProxyHeaders) return /* @__PURE__ */ new Set();
	if (trustProxyHeaders === true) return /* @__PURE__ */ new Set([TRUST_ALL_PROXY_HEADERS]);
	const normalizedTrustedProxyHeaders = /* @__PURE__ */ new Set();
	for (const header of trustProxyHeaders) {
		const lowerHeader = header.toLowerCase();
		if (lowerHeader === TRUST_ALL_PROXY_HEADERS) throw new Error(`"${TRUST_ALL_PROXY_HEADERS}" is not allowed as a value for the "trustProxyHeaders" option.`);
		if (!(lowerHeader === "forwarded" || lowerHeader.startsWith("x-forwarded-"))) throw new Error(`"${header}" is not a valid proxy header. Trusted proxy headers must be "forwarded" or start with "x-forwarded-".`);
		normalizedTrustedProxyHeaders.add(lowerHeader);
	}
	return normalizedTrustedProxyHeaders;
}
function parseForwardedHeader(headerValue) {
	if (!headerValue) return {};
	const params = {};
	let inQuotes = false;
	let escaped = false;
	let currentKey = "";
	let currentValue = "";
	let isParsingValue = false;
	let isKeyEnded = false;
	let isParsingValueEnded = false;
	for (const char of headerValue) {
		if (escaped) {
			escaped = false;
			if (isParsingValue) currentValue += char;
			else currentKey += char;
			continue;
		}
		if (char === "\\") {
			if (inQuotes) escaped = true;
			else if (isParsingValue) currentValue += char;
			else currentKey += char;
			continue;
		}
		if (char === "\"") {
			inQuotes = !inQuotes;
			continue;
		}
		if (inQuotes) {
			if (isParsingValue) currentValue += char;
			else currentKey += char;
			continue;
		}
		if (char === ",") {
			addParam(currentKey, currentValue, isParsingValue, params);
			break;
		}
		if (char === ";") {
			addParam(currentKey, currentValue, isParsingValue, params);
			currentKey = "";
			currentValue = "";
			isParsingValue = false;
			isKeyEnded = false;
			isParsingValueEnded = false;
			continue;
		}
		if (char === "=") {
			if (!isParsingValue) isParsingValue = true;
			else currentValue += char;
			continue;
		}
		if (char === " " || char === "	") {
			if (isParsingValue) {
				if (currentValue.length > 0) isParsingValueEnded = true;
			} else if (currentKey.length > 0) isKeyEnded = true;
			continue;
		}
		if (isParsingValue) {
			if (!isParsingValueEnded) currentValue += char;
		} else if (isKeyEnded) {
			currentKey = char;
			isKeyEnded = false;
		} else currentKey += char;
	}
	if (currentKey || currentValue || isParsingValue) addParam(currentKey, currentValue, isParsingValue, params);
	return params;
}
function addParam(key, value, hasValue, params) {
	if (!hasValue) return;
	const trimmedKey = key.trim().toLowerCase();
	if (trimmedKey) params[trimmedKey] = value;
}
//#endregion
//#region node_modules/@angular/platform-server/fesm2022/_server-chunk.mjs
/**
* @license Angular v22.1.3
* (c) 2010-2026 Google LLC. https://angular.dev/
* License: MIT
*/
var BEFORE_APP_SERIALIZED = /*#__PURE__*/ new InjectionToken("Server.RENDER_MODULE_HOOK");
var HTTP_OR_HTTPS_PROTOCOL_REGEX = /^https?:/i;
function resolveUrl(urlStr, origin, options = {}) {
	const originUrl = typeof origin === "string" ? new URL("/", origin) : origin;
	if (!urlStr) return originUrl || null;
	urlStr = urlStr.trim();
	let resolved;
	try {
		resolved = new URL(urlStr);
	} catch {}
	const { allowProtocolRelative = false, allowOriginChange = true } = options;
	if (resolved) {
		if (originUrl && !isSafeOriginChange(resolved, originUrl, urlStr, allowOriginChange)) throwSuspiciousUrlError(urlStr);
		return resolved;
	}
	if (!URL.canParse(urlStr, "http://fake")) throw new RuntimeError(5701, urlStr);
	if (!originUrl) return null;
	if (urlStr.startsWith("//")) {
		if (!allowProtocolRelative) throw new RuntimeError(5702, urlStr);
		return new URL(urlStr, origin);
	}
	resolved = new URL(urlStr, origin);
	if (!isSafeOriginChange(resolved, originUrl, urlStr, allowOriginChange)) throwSuspiciousUrlError(urlStr);
	return resolved;
}
function throwSuspiciousUrlError(urlStr) {
	throw new RuntimeError(-5703, urlStr);
}
function isSafeOriginChange(resolved, origin, urlStr, allowOriginChange) {
	if (origin.origin === resolved.origin) return true;
	if (!allowOriginChange) return false;
	return HTTP_OR_HTTPS_PROTOCOL_REGEX.test(urlStr);
}
var ServerXhr = /*#__PURE__*/ (() => {
	class ServerXhr {
		xhrImpl;
		async ɵloadImpl() {
			if (!this.xhrImpl) {
				const { default: xhr } = await import("./assets/xhr2-kFHiA5nm.js").then((m) => /* @__PURE__ */ __toESM(m.default, 1));
				this.xhrImpl = xhr;
			}
		}
		build() {
			const impl = this.xhrImpl;
			if (!impl) throw new RuntimeError(5705, false);
			return new impl.XMLHttpRequest();
		}
		static ɵfac = function ServerXhr_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || ServerXhr)();
		};
		static ɵprov = /* @__PURE__ */ ɵɵdefineInjectable({
			token: ServerXhr,
			factory: ServerXhr.ɵfac
		});
	}
	return ServerXhr;
})();
var URL_SCHEMA_REGEXP = /^(?:[a-zA-Z][a-zA-Z0-9+\-.]*:)/;
function relativeUrlsTransformerInterceptorFn(request, next) {
	const trimmedUrl = request.url.trim();
	if (URL_SCHEMA_REGEXP.test(trimmedUrl)) return next(request);
	const platformLocation = inject(PlatformLocation);
	const { href, protocol, hostname, port } = platformLocation;
	if (!protocol.startsWith("http")) return next(request);
	let urlPrefix = `${protocol}//${hostname}`;
	if (port) urlPrefix += `:${port}`;
	const baseHref = platformLocation.getBaseHrefFromDOM() || href;
	const baseUrl = new URL(baseHref, urlPrefix);
	const parsedUrl = resolveUrl(request.url, baseUrl, { allowProtocolRelative: true });
	return next(request.clone({ url: parsedUrl.toString() }));
}
var SERVER_HTTP_PROVIDERS = [{
	provide: XhrFactory,
	useClass: ServerXhr
}, {
	provide: HTTP_ROOT_INTERCEPTOR_FNS,
	useValue: relativeUrlsTransformerInterceptorFn,
	multi: true
}];
var ServerEventManagerPlugin = /*#__PURE__*/ (() => {
	class ServerEventManagerPlugin extends EventManagerPlugin {
		doc;
		constructor(doc) {
			super(doc);
			this.doc = doc;
		}
		supports(eventName) {
			return true;
		}
		addEventListener(element, eventName, handler, options) {
			return getDOM().onAndCancel(element, eventName, handler, options);
		}
		static ɵfac = function ServerEventManagerPlugin_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || ServerEventManagerPlugin)(ɵɵinject(DOCUMENT$1));
		};
		static ɵprov = /* @__PURE__ */ ɵɵdefineInjectable({
			token: ServerEventManagerPlugin,
			factory: ServerEventManagerPlugin.ɵfac
		});
	}
	return ServerEventManagerPlugin;
})();
var TRANSFER_STATE_SERIALIZATION_PROVIDERS = [{
	provide: BEFORE_APP_SERIALIZED,
	useFactory: serializeTransferStateFactory,
	multi: true
}];
function createScript(doc, textContent, nonce) {
	const script = doc.createElement("script");
	script.textContent = textContent;
	if (nonce) script.setAttribute("nonce", nonce);
	return script;
}
function serializeTransferStateFactory() {
	const doc = inject(DOCUMENT$1);
	const appId = inject(APP_ID);
	const transferStore = inject(TransferState);
	inject(Injector);
	return () => {
		const measuringLabel = "serializeTransferStateFactory";
		startMeasuring(measuringLabel);
		const content = transferStore.toJson();
		if (transferStore.isEmpty) return;
		const script = createScript(doc, content, null);
		script.id = appId + "-state";
		script.setAttribute("type", "application/json");
		doc.body.appendChild(script);
		stopMeasuring(measuringLabel);
	};
}
var PLATFORM_SERVER_PROVIDERS = [
	TRANSFER_STATE_SERIALIZATION_PROVIDERS,
	[{
		provide: EVENT_MANAGER_PLUGINS,
		multi: true,
		useClass: ServerEventManagerPlugin
	}],
	SERVER_HTTP_PROVIDERS,
	{
		provide: Testability,
		useValue: null
	},
	{
		provide: TESTABILITY,
		useValue: null
	},
	{
		provide: ViewportScroller,
		useClass: NullViewportScroller
	}
];
//#endregion
//#region node_modules/@angular/platform-server/fesm2022/platform-server.mjs
/**
* @license Angular v22.1.3
* (c) 2010-2026 Google LLC. https://angular.dev/
* License: MIT
*/
function provideServerRendering$1(options) {
	const providers = [...PLATFORM_SERVER_PROVIDERS];
	if (options?.maxResponseBodySize) providers.push({
		provide: HTTP_FETCH_MAX_RESPONSE_SIZE,
		useValue: options.maxResponseBodySize
	});
	return makeEnvironmentProviders(providers);
}
function getAngularAppEngineManifest() {
	throw new Error("Angular app engine manifest is not set. Please ensure you are using the '@angular/build:application' builder to build your server application.");
}
function addLeadingSlash(url) {
	return url[0] === "/" ? url : `/${url}`;
}
function joinUrlParts(...parts) {
	const normalizedParts = [];
	for (const part of parts) {
		if (part === "") continue;
		let start = 0;
		let end = part.length;
		while (start < end && part[start] === "/") start++;
		while (end > start && part[end - 1] === "/") end--;
		if (start < end) normalizedParts.push(part.slice(start, end));
	}
	return addLeadingSlash(normalizedParts.join("/"));
}
function createRedirectResponse(location, status = 302, headers) {
	const resHeaders = headers instanceof Headers ? headers : new Headers(headers);
	const varyArray = resHeaders.get("Vary")?.split(",") ?? [];
	const varySet = /* @__PURE__ */ new Set(["X-Forwarded-Prefix"]);
	for (const vary of varyArray) {
		const value = vary.trim();
		if (value) varySet.add(value);
	}
	resHeaders.set("Vary", [...varySet].join(", "));
	resHeaders.set("Location", location);
	return new Response(null, {
		status,
		headers: resHeaders
	});
}
var ServerRenderingFeatureKind = /*#__PURE__*/ (function(ServerRenderingFeatureKind) {
	ServerRenderingFeatureKind[ServerRenderingFeatureKind["AppShell"] = 0] = "AppShell";
	ServerRenderingFeatureKind[ServerRenderingFeatureKind["ServerRoutes"] = 1] = "ServerRoutes";
	return ServerRenderingFeatureKind;
})(ServerRenderingFeatureKind || {});
var RenderMode = /*#__PURE__*/ (function(RenderMode) {
	RenderMode[RenderMode["Server"] = 0] = "Server";
	RenderMode[RenderMode["Client"] = 1] = "Client";
	RenderMode[RenderMode["Prerender"] = 2] = "Prerender";
	return RenderMode;
})(RenderMode || {});
function provideServerRendering(...args) {
	let options;
	let features;
	if (hasOptions(args)) {
		const [first, ...rest] = args;
		options = first;
		features = rest;
	} else features = args;
	const providers = [provideServerRendering$1(options)];
	let hasAppShell = false;
	let hasServerRoutes = false;
	for (const { ɵkind, ɵproviders } of features) {
		hasAppShell ||= ɵkind === ServerRenderingFeatureKind.AppShell;
		hasServerRoutes ||= ɵkind === ServerRenderingFeatureKind.ServerRoutes;
		providers.push(...ɵproviders);
	}
	if (!hasServerRoutes && hasAppShell) throw new Error("Configuration error: found 'withAppShell()' without 'withRoutes()' in the same call to 'provideServerRendering()'.The 'withAppShell()' function requires 'withRoutes()' to be used.");
	return makeEnvironmentProviders(providers);
}
function hasOptions(args) {
	const value = args[0];
	return !!value && typeof value === "object" && !("ɵkind" in value);
}
var Hooks = class {
	store = /* @__PURE__ */ new Map();
	async run(name, context) {
		const hooks = this.store.get(name);
		switch (name) {
			case "html:transform:pre": {
				if (!hooks) return context.html;
				const ctx = { ...context };
				for (const hook of hooks) ctx.html = await hook(ctx);
				return ctx.html;
			}
			default: throw new Error(`Running hook "${name}" is not supported.`);
		}
	}
	on(name, handler) {
		const hooks = this.store.get(name);
		if (hooks) hooks.push(handler);
		else this.store.set(name, [handler]);
	}
	has(name) {
		return !!this.store.get(name)?.length;
	}
};
RenderMode.Prerender, RenderMode.Server, RenderMode.Client;
function getPotentialLocaleIdFromUrl(url, basePath) {
	const { pathname } = url;
	let start = basePath.length;
	if (pathname[start] === "/") start++;
	let end = pathname.indexOf("/", start);
	if (end === -1) end = pathname.length;
	return pathname.slice(start, end);
}
function parseLanguageHeader(header) {
	if (header === "*") return /* @__PURE__ */ new Map([["*", 1]]);
	const parsedValues = header.split(",").map((item) => {
		const [locale, qualityValue] = item.split(";", 2).map((v) => v.trim());
		let quality = qualityValue?.startsWith("q=") ? parseFloat(qualityValue.slice(2)) : void 0;
		if (typeof quality !== "number" || isNaN(quality) || quality < 0 || quality > 1) quality = 1;
		return [locale, quality];
	}).sort(([_localeA, qualityA], [_localeB, qualityB]) => qualityB - qualityA);
	return new Map(parsedValues);
}
function getPreferredLocale(header, supportedLocales) {
	if (supportedLocales.length < 2) return supportedLocales[0];
	const parsedLocales = parseLanguageHeader(header);
	if (parsedLocales.size === 0 || parsedLocales.size === 1 && parsedLocales.has("*")) return supportedLocales[0];
	const normalizedSupportedLocales = /* @__PURE__ */ new Map();
	for (const locale of supportedLocales) normalizedSupportedLocales.set(normalizeLocale(locale), locale);
	let bestMatch;
	const qualityZeroNormalizedLocales = /* @__PURE__ */ new Set();
	for (const [locale, quality] of parsedLocales) {
		const normalizedLocale = normalizeLocale(locale);
		if (quality === 0) {
			qualityZeroNormalizedLocales.add(normalizedLocale);
			continue;
		}
		if (normalizedSupportedLocales.has(normalizedLocale)) return normalizedSupportedLocales.get(normalizedLocale);
		if (bestMatch !== void 0) continue;
		const [languagePrefix] = normalizedLocale.split("-", 1);
		for (const supportedLocale of normalizedSupportedLocales.keys()) if (supportedLocale.startsWith(languagePrefix)) {
			bestMatch = normalizedSupportedLocales.get(supportedLocale);
			break;
		}
	}
	if (bestMatch !== void 0) return bestMatch;
	for (const [normalizedLocale, locale] of normalizedSupportedLocales) if (!qualityZeroNormalizedLocales.has(normalizedLocale)) return locale;
}
function normalizeLocale(locale) {
	return locale.toLowerCase();
}
(class AngularAppEngine {
	static ɵallowStaticRouteRender = false;
	static ɵdisableAllowedHostsCheck = false;
	static ɵhooks = new Hooks();
	manifest = getAngularAppEngineManifest();
	allowedHosts;
	supportedLocales = Object.keys(this.manifest.supportedLocales);
	trustProxyHeaders;
	entryPointsCache = /* @__PURE__ */ new Map();
	constructor(options) {
		this.allowedHosts = this.getAllowedHosts(options);
		this.trustProxyHeaders = normalizeTrustProxyHeaders(options?.trustProxyHeaders);
	}
	getAllowedHosts(options) {
		const allowedHosts = /* @__PURE__ */ new Set([...options?.allowedHosts ?? [], ...this.manifest.allowedHosts]);
		if (allowedHosts.has("*")) console.warn("Allowing all hosts via \"*\" is a security risk. This configuration should only be used when validation for \"Host\" and \"X-Forwarded-Host\" headers is performed in another layer, such as a load balancer or reverse proxy. For more information see: https://angular.dev/best-practices/security#preventing-server-side-request-forgery-ssrf");
		return allowedHosts;
	}
	async handle(request, requestContext) {
		const allowedHost = this.allowedHosts;
		const securedRequest = sanitizeRequestHeaders(request, this.trustProxyHeaders);
		try {
			validateRequest(securedRequest, allowedHost, AngularAppEngine.ɵdisableAllowedHostsCheck);
		} catch (error) {
			return this.handleValidationError(securedRequest.url, error);
		}
		const serverApp = await this.getAngularServerAppForRequest(securedRequest);
		if (serverApp) return serverApp.handle(securedRequest, requestContext);
		if (this.supportedLocales.length > 1) return this.redirectBasedOnAcceptLanguage(securedRequest);
		return null;
	}
	redirectBasedOnAcceptLanguage(request) {
		const { basePath, supportedLocales } = this.manifest;
		const { pathname } = new URL(request.url);
		if (pathname !== basePath) return null;
		const preferredLocale = getPreferredLocale(request.headers.get("Accept-Language") || "*", this.supportedLocales);
		if (preferredLocale) {
			const subPath = supportedLocales[preferredLocale];
			if (subPath !== void 0) return createRedirectResponse(joinUrlParts(request.headers.get("X-Forwarded-Prefix") ?? "", pathname, subPath), 302, { "Vary": "Accept-Language" });
		}
		return null;
	}
	async getAngularServerAppForRequest(request) {
		const url = new URL(request.url);
		const entryPoint = await this.getEntryPointExportsForUrl(url);
		if (!entryPoint) return null;
		const ɵgetOrCreateAngularServerApp = entryPoint.ɵgetOrCreateAngularServerApp;
		return ɵgetOrCreateAngularServerApp({
			allowStaticRouteRender: AngularAppEngine.ɵallowStaticRouteRender,
			hooks: AngularAppEngine.ɵhooks
		});
	}
	getEntryPointExports(potentialLocale) {
		const cachedEntryPoint = this.entryPointsCache.get(potentialLocale);
		if (cachedEntryPoint) return cachedEntryPoint;
		const { entryPoints } = this.manifest;
		const entryPoint = entryPoints[potentialLocale];
		if (!entryPoint) return;
		const entryPointExports = entryPoint();
		this.entryPointsCache.set(potentialLocale, entryPointExports);
		return entryPointExports;
	}
	getEntryPointExportsForUrl(url) {
		const { basePath, supportedLocales } = this.manifest;
		if (this.supportedLocales.length === 1) return this.getEntryPointExports(supportedLocales[this.supportedLocales[0]]);
		const potentialLocale = getPotentialLocaleIdFromUrl(url, basePath);
		return this.getEntryPointExports(potentialLocale) ?? this.getEntryPointExports("");
	}
	handleValidationError(url, error) {
		const errorMessage = error.message;
		console.error(`ERROR: Bad Request ("${url}").\n` + errorMessage + "\n\nFor more information, see https://angular.dev/best-practices/security#preventing-server-side-request-forgery-ssrf");
		return new Response(errorMessage, {
			status: 400,
			statusText: "Bad Request",
			headers: { "Content-Type": "text/plain" }
		});
	}
});
//#endregion
//#region src/app.component.ts
var AppComponent = class AppComponent {
	static ɵfac = function AppComponent_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || AppComponent)();
	};
	static ɵcmp = /*@__PURE__*/ ɵɵdefineComponent({
		type: AppComponent,
		selectors: [["app-root"]],
		decls: 1,
		vars: 0,
		template: function AppComponent_Template(rf, ctx) {
			if (rf & 1) ɵɵelement(0, "router-outlet");
		},
		dependencies: [RouterOutlet],
		encapsulation: 2
	});
};
//#endregion
//#region src/main.server.ts
var main_server_default = () => bootstrapApplication(AppComponent, { providers: [provideServerRendering()] });
//#endregion
export { main_server_default as default, __require as n, __commonJSMin as t };
