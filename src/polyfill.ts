// @ts-ignore
globalThis.global = globalThis;

const metadataMap = new Map();
Reflect.getMetadata = function (metadataKey, target) {
  var _a;
  return (_a = metadataMap.get(target)) === null || _a === void 0 ? void 0 : _a.get(metadataKey);
};
Reflect.metadata = function metadata(metadataKey, metadataValue) {
  return target => {
    metadataMap.getOrAdd(target, () => new Map()).set(metadataKey, metadataValue);
  };
};
function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  for (var i = decorators.length - 1; i >= 0; i--)
    if (d = decorators[i])
      r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function __exportStar(m, exports) {
  for (var p in m)
    if (p !== "default" && !exports.hasOwnProperty(p))
      exports[p] = m[p];
}
function __param(paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); };
}
Object.assign(globalThis, {
  __decorate,
  __metadata: Reflect.metadata,
  __exportStar,
  __param
});
