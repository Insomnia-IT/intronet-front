/**
 * Сравнивает на равенство два значения.
 * Поддерживается проверка объектов: встроенное сравнение объектов(метод 'equals'), array, Set, Map, любой object.
 *
 * Ограничения для: array, Set, Map.
 * Корректное сравнение можно ожидать:
 *   - если массивы были предварительно отсортированы;
 *   - если Set содержит только примитивы;
 *   - если ключи Map состоят только из примитивов.
 *
 * Важно!
 * Предполагается, что нет разницы между null и undefined, т.е.:
 *   compare(null, undefined) -> true
 *   compare(undefined, null) -> true
 */
export function compare(a: any, b: any): boolean {
  switch (typeof a) {
    case 'object':    // a{object | null | undefined} and b{any}
    case 'undefined':
      if (a == null && b == null) // ЕСЛИ и a и b равны null/undefined
        return true;
      if (a == null || b == null) // ЕСЛИ либо только a либо только b равен null/undefined
        return false;
      if (typeof b !== 'object')
        return false; // a{object} and b{boolean | number | bigint | string | symbol | function}
      break;
    default:
      return a === b; // a{boolean | number | bigint | string | symbol | function} and b{any}
  }
  // здесь и a и b это объекты
  if (a === b)
    return true;
  if (a.equals && b.equals)
    return a.equals(b);

  const aIsArr = Array.isArray(a);
  const bIsArr = Array.isArray(b);
  if (aIsArr && bIsArr)
    return compareArrays(a, b);
  else if (aIsArr || bIsArr)
    return false;

  const aIsSet = a instanceof Set;
  const bIsSet = b instanceof Set;
  if (aIsSet && bIsSet)
    return compareSets(a, b);
  else if (aIsSet || bIsSet)
    return false;

  const aIsMap = a instanceof Map;
  const bIsMap = b instanceof Map;
  if (aIsMap && bIsMap)
    return compareMaps(a, b);
  else if (aIsMap || bIsMap)
    return false;

  return compareObjects(a, b);
}


function compareArrays(a: any[], b: any[]): boolean {
  return a.length === b.length &&
      a.every((x, i) => compare(x, b[i]));
}

function compareSets(a: Set<any>, b: Set<any>): boolean {
  if (a.size !== b.size)
    return false;
  for (let x of a) {
    if (!b.has(x))
      return false;
  }
  return true;
}

function compareMaps(a: Map<any, any>, b: Map<any, any>): boolean {
  if (a.size !== b.size)
    return false;
  for (let key of a.keys()) {
    if (!b.has(key))
      return false;
    if (!compare(a.get(key), b.get(key)))
      return false;
  }
  return true;
}

function compareObjects(a: object, b: object): boolean {
  for (let key in a) {
    if (!(key in b))
      return false;
    if (!compare(a[key], b[key]))
      return false;
  }
  for (let key in b) {
    if (!(key in a))
      return false;
  }
  return true;
}
