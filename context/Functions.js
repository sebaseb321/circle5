import React, { createContext, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useRefs, useDialogs, useFirebase } from '../hooks';
import { i18n } from '../i18n';
import { isObject, parse } from '../util';
// Custom imports:
import { useFirestore } from 'reactfire';

export const modifiers = [
  '\\.\\+\\d+',
  '\\.\\-\\d+',
  '\\.\\*\\d+',
  '\\.\\/\\d+',
  '\\.\\d+\\-\\d+',
  '\\.\\d+',
  '\\.json',
  '\\.length',
  '\\.lower',
  '\\.md5',
  '\\.trim',
  '\\.upper',
  '\\.urldecode',
  '\\.urlencode',
];

export const modifiersMap = {
  json: '.toJson()',
  length: '.length',
  lower: '.toLowerCase()',
  md5: '.toMd5()',
  trim: '.trim()',
  upper: '.toUpperCase()',
  urldecode: '.decodeUrl()',
  urlencode: '.encodeUrl()',
};

function operate(operand, operation) {
  return eval(`operand${operation}`);
}

export const FunctionsContext = createContext({});

export const FunctionsProvider = (props) => {
  const history = useHistory();
  const { search, pathname } = useLocation();

  useEffect(() => {
    const paramFunctions = search
      .replace('?', '')
      .split('&')
      .filter((entry) => entry)
      .map((entry) => {
        const [key, value] = entry.split('=');
        return { function: 'set', what: `@property.${key}`, value };
      });
    const path = pathname.split('/').slice(1);
    const viewKey = path.shift();
    const viewValue = path.join('/');
    viewValue &&
      paramFunctions.push({
        function: 'set',
        what: `@property.${viewKey}`,
        value: viewValue,
      });
    run(paramFunctions);
  }, []);

  // Custom consts:
	const { hide: hideDialog, show: showDialog } = useDialogs();
	const {addToFirestore,deleteFromFirestore,getFromFirestore,updateFirestore,logInWithFirebase,logOutWithFirebase,signUpWithFirebase} = useFirebase();


  let { setRefs, ...refs } = useRefs();

  const handlers = {
    // Custom functions:
    replaceFirestore: async function ({ str, filter, isCollection, order, limit }) {
      if (str.indexOf('@firebase.firestore.') !== 0) {
        return str;
      }
      try {
        return await getFromFirestore(str, { filter, isCollection, order, limit });
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    browser: async function ({ url, target = '_self' }, options) {
        const a = document.createElement('a');
        url = await this.replaceRefs(url, options);
        target = await this.replaceRefs(target, options);
        a.href = url;
        a.target = target;
        a.click();
        a.remove();
      },
    popup: async function ({ dialog }, options) {
        dialog = await this.replaceRefs(dialog, options);
        showDialog(dialog);
      },
    hide: async function ({ dialog }, options) {
        dialog = await this.replaceRefs(dialog, options);
        hideDialog(dialog);
      },
    set: async function ({ what, value }, options) {
        what = await this.replaceRefs(what, { ...options, onlyParanthesis: true });
        value = await this.replaceRefs(value, options);
        
        if (false) {}
        // Custom set:
        else if (what.indexOf('@firebase.firestore.') === 0) {
          return await updateFirestore({ what, value });
        }


        value = what
          .replace('@', '')
          .split('.')
          .reverse()
          .reduce((value, key) => ({ [key]: value }), value);
        const mainKey = Object.keys(value)[0];
        if (value?.app?.language) {
          i18n.changeLanguage(value.app?.language);
        }
        refs = {
          ...refs,
          [mainKey]: {
            ...refs[mainKey],
            ...value[mainKey],
          },
        };
        setRefs({ ...value });
      },

    functions: async function (functions = [], options) {
      for (const entry of functions) {
        const { function: f, if: _if = true, ...rest } = entry;
        const handleIf = await this.if(_if, options);
        if (_if === true || handleIf) {
          if (f === 'abort') {
            return;
          }
          await (this[f].bind(this) || (() => {}))(rest, options);
        } else {
          const { else: _else = [] } = _if;
          _else.length && (await this.functions(_else, options));
        }
      }
    },

    if: async function (
      {
        what,
        is,
        is_not,
        less_than,
        more_than,
        in: _in,
        includes,
        not_into,
        ends_with,
        starts_with,
        and,
        or,
      } = {},
      { data } = {}
    ) {
      let _what = await this.replaceRefs(what, { data });
      is =
        typeof is !== 'undefined'
          ? await this.replaceRefs(is, { data })
          : undefined;
      is_not =
        typeof is_not !== 'undefined'
          ? await this.replaceRefs(is_not, { data })
          : undefined;
      less_than =
        typeof less_than !== 'undefined'
          ? await this.replaceRefs(less_than, { data })
          : undefined;
      more_than =
        typeof more_than !== 'undefined'
          ? await this.replaceRefs(more_than, { data })
          : undefined;
      _in =
        typeof _in !== 'undefined'
          ? await this.replaceRefs(_in, { data })
          : undefined;
      includes =
        typeof includes !== 'undefined'
          ? await this.replaceRefs(includes, { data })
          : undefined;
      not_into =
        typeof not_into !== 'undefined'
          ? await this.replaceRefs(not_into, { data })
          : undefined;
      ends_with =
        typeof ends_with !== 'undefined'
          ? await this.replaceRefs(ends_with, { data })
          : undefined;
      starts_with =
        typeof starts_with !== 'undefined'
          ? await this.replaceRefs(starts_with, { data })
          : undefined;
      return (
        (((typeof is !== 'undefined' && _what === is) ||
          (typeof is_not !== 'undefined' && _what !== is_not) ||
          (typeof less_than !== 'undefined' && _what < less_than) ||
          (typeof more_than !== 'undefined' && _what > more_than) ||
          (typeof _in !== 'undefined' &&
            (_in.stringify?.() || `${_in}`).includes(_what)) ||
          (typeof includes !== 'undefined' &&
            `${_what}`.match(new RegExp(`${includes}`)) !== null) ||
          (typeof not_into !== 'undefined' &&
            `${_what}`.match(new RegExp(`${not_into}`)) === null) ||
          (typeof starts_with !== 'undefined' &&
            `${_what}`.match(new RegExp(`^${starts_with}`)) !== null) ||
          (typeof ends_with !== 'undefined' &&
            `${_what}`.match(new RegExp(`${ends_with}$`)) !== null)) &&
          (typeof and === 'undefined' || (await this.if(and, { data })))) ||
        (typeof or !== 'undefined' && (await this.if(or, { data })))
      );
    },

    get: async function (
      { what, filter, isCollection, order, limit },
      { data } = {}
    ) {
      const replaceFilterRefs = async (filter) => {
        let { what, and, or, ...condition } = filter;
        what = await this.replaceRefs(what, { data });
        let value = Object.values(condition)[0];
        value = await this.replaceRefs(value, { data });
        condition = Object.keys(condition)[0];
        let result = { ...filter, what, [condition]: value };
        if (and) {
          and = await replaceFilterRefs(and);
          result = { ...result, and };
        }
        if (or) {
          or = await replaceFilterRefs(or);
          result = { ...result, or };
        }
        return result;
      };
      const replaceOrderRefs = async (order) => {
        let { field, type } = order;
        field = await this.replaceRefs(field, { data });
        type = await this.replaceRefs(type, { data });
        return { field, type };
      };
      const replaceLimitRefs = async (limit) => {
        limit = await this.replaceRefs(limit, { data });
        return limit;
      };
      filter = filter && (await replaceFilterRefs(filter));
      order = order && (await replaceOrderRefs(order));
      limit = limit && (await replaceLimitRefs(limit));
      const value = await this.replaceRefs(what, {
        data,
        filter,
        isCollection,
        order,
        limit,
      });
      return value;
    },

    replaceRef: function (str, parenthesis, type, key) {
      const exp = new RegExp(`(${modifiers.join('|')})(\\.|$)[^.]*`);
      return key.split('.').reduce(
        function (resp, _key) {
          let operation = (`.${_key}`.match(exp)?.[0] || '').substr(1);
          key = operation ? key.replace(`.${operation}`, '') : key;
          if (operation) {
            let operand =
              typeof resp?.[_key] !== 'undefined' ? resp[_key] : resp;
            operand = typeof operand !== 'undefined' ? operand : '';
            if (operation.match(/^\d+-\d+$/)) {
              operation = `.substring(${operation.replace('-', ',')})`;
            } else if (operation.match(/^\d+$/)) {
              operation = `.charAt(${operation})`;
            } else if (operation.match(/^[+\-*/]+/)) {
              operand = operand || 0;
            }
            operation = modifiersMap[operation] || operation;
            try {
              operand = isObject(operand) ? Object.values(operand) : operand;
              return operate(operand, operation);
            } catch (e) {}
          }
          return typeof resp?.[_key] === 'object'
            ? resp?.[_key]
            : typeof resp?.[_key] === 'undefined'
            ? null
            : typeof resp[_key] === 'function'
            ? resp[_key]()
            : resp[_key];
        },
        { ...refs[type] }
      );
    },

    replaceRefs: async function (
      str,
      { data, filter, isCollection, order, limit, onlyParanthesis = false } = {}
    ) {
      refs.field = data;
      if (typeof str !== 'string') {
        return str;
      }

      let strWithReplacedRefs = '';
      if (data) {
        let dataStr = `${str}`.replace(
          /(^@|\(@)(field)\.([^)]+)\)?/g,
          this.replaceRef.bind(this)
        );
        if (dataStr.match(/\[object/)) {
          strWithReplacedRefs = data[str];
        } else {
          str = dataStr;
        }
      }

      if (str.indexOf('@app.timestamp') === 0) {
        return Date.now();
      }

      if (str.indexOf('@window.') === 0) {
        return eval(str.substring(1));
      }

      if (false) {
      }
      // Custom replaceRefs:
      else if (
        !onlyParanthesis &&
        str.indexOf('@firebase.firestore.') === 0
      ) {
        str = `${str}`.replace(
          /(\(@)([^.]+)\.([^)]+)\)?/g,
          this.replaceRef.bind(this)
        );
        const exp = new RegExp(`(${modifiers.join('|')})(\\.|$)[^.]*`);
        let operation = (str.match(exp)?.[0] || '').substr(1);
        str = operation ? str.replace(`.${operation}`, '') : str;
        let resp = await this.replaceFirestore({ str, filter, isCollection, order, limit });
        if (operation) {
          let operand = typeof resp !== 'undefined' ? resp : '';
          if (operation.match(/^\d+-\d+$/)) {
            operation = `.substring(${operation.replace('-', ',')})`;
          } else if (operation.match(/^\d+$/)) {
            operation = `.charAt(${operation})`;
          } else if (operation.match(/^[+\-*/]+/)) {
            operand = operand || 0;
          }
          operation = modifiersMap[operation] || operation;
          try {
            operand = isObject(operand) ? Object.values(operand) : operand;
            return operate(operand, operation);
          } catch (e) {
            console.error(e);
          }
        }
        return resp;
      }

      strWithReplacedRefs = `${str}`.replace(
        onlyParanthesis
          ? /(\(@)([^.]+)\.([^)]+)\)?/g
          : /(^@|\(@)([^.]+)\.([^)]+)\)?/g,
        this.replaceRef.bind(this)
      );

      if (strWithReplacedRefs.match(/\[object/)) {
        const replacedRef = str
          .substring(1)
          .split('.')
          .reduce(
            (resp, key) => {
              if (!resp) {
                return resp;
              }
              return typeof resp?.[key] === 'undefined'
                ? null
                : typeof resp[key] === 'function'
                ? resp[key]()
                : resp[key];
            },
            { ...refs }
          );
        return replacedRef;
      }

      strWithReplacedRefs = parse(strWithReplacedRefs);
      return Promise.resolve(strWithReplacedRefs);
    },
  };

  const get = async (props, options) => {
    return await handlers.get?.(props, options);
  };

  const _if = async (props, options) => {
    return await handlers.if(props, options);
  };

  const set = async (props, options) => {
    return await handlers.set?.(props, options);
  };

  const run = async (_functions, options) => {
    return await handlers.functions(_functions, options);
  };

  return (
    <FunctionsContext.Provider
      value={{
        run,
        get,
        if: _if,
        set,
      }}
    >
      {props.children}
    </FunctionsContext.Provider>
  );
};

export const FunctionsConsumer = FunctionsContext.Consumer;
export default FunctionsContext;
