import md5 from 'crypto-js/md5';
import { getUnique, isDate, isEmpty, isObject } from '.';

export const initializeDefines = () => {
  // eslint-disable-next-line
  String.prototype.encodeUrl = function () {
    return encodeURI(this);
  };

  // eslint-disable-next-line
  String.prototype.decodeUrl = function () {
    return decodeURI(this);
  };

  // eslint-disable-next-line
  String.prototype.toMd5 = function () {
    return md5(this).toString();
  };

  // eslint-disable-next-line
  String.prototype.toJson = function () {
    return JSON.parse(this);
  };

  // eslint-disable-next-line
  Object.defineProperty(Object.prototype, '_equals', {
    enumerable: false,
    value: function (obj) {
      let p;
      if (this === obj) {
        return true;
      }

      // some checks for native types first

      // function and sring
      if (
        typeof this === 'function' ||
        typeof this === 'string' ||
        this instanceof String
      ) {
        if (
          typeof obj === 'function' ||
          typeof obj === 'string' ||
          obj instanceof String
        ) {
          return this.toString() === obj.toString();
        }
        return false;
      }

      // number
      if (this instanceof Number || typeof this === 'number') {
        if (obj instanceof Number || typeof obj === 'number') {
          return this.valueOf() === obj.valueOf();
        }
        return false;
      }

      // null._equals(null) and undefined._equals(undefined) do not inherit from the
      // Object.prototype so we can return false when they are passed as obj
      if (
        typeof this !== typeof obj ||
        obj === null ||
        typeof obj === 'undefined'
      ) {
        return false;
      }

      function sort(o) {
        const result = {};

        if (o === null || typeof o !== 'object') {
          return o;
        }

        Object.keys(o)
          .sort()
          .forEach(function (key) {
            result[key] = sort(o[key]);
          });

        return result;
      }

      if (typeof this === 'object') {
        if (Array.isArray(this)) {
          // check on arrays
          return JSON.stringify(this) === JSON.stringify(obj);
        } else {
          // anyway objects
          for (p in this) {
            if (typeof this[p] !== typeof obj[p]) {
              return false;
            }
            if ((this[p] === null) !== (obj[p] === null)) {
              return false;
            }
            switch (typeof this[p]) {
              case 'undefined':
                if (typeof obj[p] !== 'undefined') {
                  return false;
                }
                break;
              case 'object':
                if (
                  this[p] !== null &&
                  obj[p] !== null &&
                  (this[p].constructor.toString() !==
                    obj[p].constructor.toString() ||
                    !this[p]._equals(obj[p]))
                ) {
                  return false;
                }
                break;
              case 'function':
                if (this[p].toString() !== obj[p].toString()) {
                  return false;
                }
                break;
              default:
                if (this[p] !== obj[p]) {
                  return false;
                }
            }
          }
        }
      }

      // at least check them with JSON
      return JSON.stringify(sort(this)) === JSON.stringify(sort(obj));
    },
  });

  // eslint-disable-next-line
  Object.defineProperty(Object.prototype, '_diff', {
    enumerable: false,
    value: function (rhs) {
      const lhs = this;
      const properObject = (o) =>
        isObject(o) && !o.hasOwnProperty ? { ...o } : o;

      const diff = (lhs, rhs) => {
        if (lhs === rhs) return {}; // equal return no diff

        if (!isObject(lhs) || !isObject(rhs)) return rhs; // return updated rhs

        const l = properObject(lhs);
        const r = properObject(rhs);

        const deletedValues = Object.keys(l).reduce((acc, key) => {
          // eslint-disable-next-line
          return r.hasOwnProperty(key) ? acc : { ...acc, [key]: undefined };
        }, {});

        if (isDate(l) || isDate(r)) {
          // eslint-disable-next-line
          if (l.valueOf() == r.valueOf()) return {};
          return r;
        }

        return Object.keys(r).reduce((acc, key) => {
          // eslint-disable-next-line
          if (!l.hasOwnProperty(key)) return { ...acc, [key]: r[key] }; // return added r key

          const difference = diff(l[key], r[key]);

          if (
            isObject(difference) &&
            isEmpty(difference) &&
            !isDate(difference)
          )
            return acc; // return no diff

          return { ...acc, [key]: difference }; // return updated key
        }, deletedValues);
      };
      return diff(lhs, rhs);
    },
  });

  // eslint-disable-next-line
  Object.defineProperty(Object.prototype, '_clone', {
    enumerable: false,
    value: function () {
      return JSON.parse(JSON.stringify(this));
    },
  });

  // eslint-disable-next-line
  Object.defineProperty(Object.prototype, '_delete', {
    enumerable: false,
    value: function (keys) {
      let obj1 = this;
      keys = `${keys}`.split('.');
      if (keys.length === 1) {
        if (Array.isArray(obj1)) {
          obj1.splice(parseInt(keys[0]), 1);
        } else {
          delete obj1[keys[0]];
        }
        return obj1;
      }
      return keys.reduce((result, key) => {
        keys.shift();
        const value1 = obj1[key];
        if (isObject(value1)) {
          result[key] = value1._delete(keys.join('.'));
        }
        return result;
      }, obj1);
    },
  });

  // eslint-disable-next-line
  Object.defineProperty(Object.prototype, '_merge', {
    enumerable: false,
    value: function (obj2, uniqueAttr = 'id') {
      let obj1 = this;
      if (obj1._equals({})) {
        obj1 = { ...obj1, ...obj2 };
      }
      return Object.keys(obj1).reduce((result, key) => {
        const value1 = obj1[key];
        const value2 = obj2[key];
        if (Array.isArray(value1) && Array.isArray(value2)) {
          if (isObject(value1[0]) && isObject(value2[0])) {
            result[key] = getUnique(
              [
                ...value1.map(
                  (item) =>
                    value2.find(
                      ({ [uniqueAttr]: id = 0 }) => id === item[uniqueAttr]
                    ) || item
                ),
                ...value2,
              ],
              uniqueAttr
            );
          } else {
            result[key] = [...new Set([...value1, ...value2])];
          }
          if (
            result[key].length ===
            result[key].filter(({ [uniqueAttr]: id }) => id).length
          ) {
            result[key] = getUnique(result[key], uniqueAttr);
          }
        } else if (isObject(value1) && isObject(value2)) {
          result[key] = value1._merge(value2);
        } else if (typeof value1 === typeof value2 || !value1) {
          result[key] = value2;
        } else if (!value2) {
          result[key] = value1;
        }
        return { ...obj2, ...result };
      }, obj1);
    },
  });

  // eslint-disable-next-line
  Array.prototype._move = function (oldIndex, newIndex) {
    // eslint-disable-next-line
    while (oldIndex < 0 || newIndex < 0) {
      oldIndex += this.length;
    }
    while (newIndex < 0) {
      newIndex += this.length;
    }
    if (newIndex >= this.length) {
      let k = newIndex - this.length;
      while (k-- + 1) {
        this.push(undefined);
      }
    }
    this.splice(newIndex, 0, this.splice(oldIndex, 1)[0]);
  };

  // eslint-disable-next-line
  Date.prototype.toW3CString = function () {
    const f = this.getFullYear();
    let e = this.getMonth();
    e++;
    if (e < 10) {
      e = '0' + e;
    }
    let g = this.getDate();
    if (g < 10) {
      g = '0' + g;
    }
    let h = this.getHours();
    if (h < 10) {
      h = '0' + h;
    }
    let c = this.getMinutes();
    if (c < 10) {
      c = '0' + c;
    }
    let j = this.getSeconds();
    if (j < 10) {
      j = '0' + j;
    }
    const d = -this.getTimezoneOffset();
    let b = Math.abs(Math.floor(d / 60));
    let i = Math.abs(d) - b * 60;
    if (b < 10) {
      b = '0' + b;
    }
    if (i < 10) {
      i = '0' + i;
    }
    let a = '+';
    if (d < 0) {
      a = '-';
    }
    return (
      f + '-' + e + '-' + g + 'T' + h + ':' + c + ':' + j + a + b + ':' + i
    );
  };
};
