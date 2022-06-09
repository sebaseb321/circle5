export const condition = (
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
) => {
  what = what
    .replace('@', '')
    .split('.')
    .reverse()
    .reduce((value, key) => value[key], data);
  return (
    (((typeof is !== 'undefined' && what === is) ||
      (typeof is_not !== 'undefined' && what !== is_not) ||
      (typeof less_than !== 'undefined' && what < less_than) ||
      (typeof more_than !== 'undefined' && what > more_than) ||
      (typeof _in !== 'undefined' &&
        (_in.stringify?.() || `${_in}`).includes(what)) ||
      (typeof includes !== 'undefined' &&
        `${what}`.match(new RegExp(`${includes || ''}`)) !== null) ||
      (typeof not_into !== 'undefined' &&
        `${what}`.match(new RegExp(`${not_into}`)) === null) ||
      (typeof starts_with !== 'undefined' &&
        `${what}`.match(new RegExp(`^${starts_with}`)) !== null) ||
      (typeof ends_with !== 'undefined' &&
        `${what}`.match(new RegExp(`${ends_with}$`)) !== null)) &&
      (typeof and === 'undefined' || condition(and, { data }))) ||
    (typeof or !== 'undefined' && condition(or, { data }))
  );
};

export const kebabToCamel = (kebab) => {
  return kebab.replace(/-./g, (str) => str.toUpperCase()[1]);
};
export const getLanguage = () => {
  return navigator.language.split('-')[0];
};

export const getUnique = (arr, attribute = 'id') => {
  return arr
    .map((e) => e[attribute])
    .map((e, i, final) => final.indexOf(e) === i && i)
    .filter((e) => arr[e])
    .map((e) => arr[e]);
};

export const isDate = (d) => d instanceof Date;

export const isEmpty = (o) => Object.keys(o).length === 0;

export const isObject = (o) => o !== null && typeof o === 'object';

export const isValidHex = (hex) =>
  hex.match(/^#([A-Fa-f0-9]{3,4}){1,2}$/) !== null;

export const getAmountFormat = (amount, options = {}) => {
  try {
    const { decimals = 0, thousands = true } = options;
    amount = amount.toFixed(decimals);
    if (!thousands) {
      return amount;
    }
    amount = parseFloat(amount);
    let lang = getLanguage();
    lang = lang.includes('es') ? 'de' : lang;
    return new Intl.NumberFormat(lang).format(amount);
  } catch (error) {
    return amount;
  }
};

export const getCurrencyFormat = (amount, options = {}) => {
  try {
    let { currency = 'EUR', lang = 'local' } = options;
    if (lang === 'local') {
      lang = getLanguage();
    }
    lang = lang.includes('es') ? 'de' : lang;
    const formatter = new Intl.NumberFormat(lang, {
      style: 'currency',
      currency,
      // These options are needed to round to whole numbers if that's what you want.
      // minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      // maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });
    return formatter.format(amount);
  } catch (error) {
    return amount;
  }
};

export const getDateFormat = (date, options = {}) => {
  try {
    let { lang = 'local', ...dateOptions } = options;
    if (lang === 'local') {
      lang = getLanguage();
    }
    return new Intl.DateTimeFormat(lang, dateOptions).format(date);
  } catch (error) {
    return date;
  }
};

export const parse = (what) => {
  if (typeof what === 'undefined') {
    return null;
  }
  if (isObject(what) || typeof what === 'number') {
    return what;
  }
  let _what = `${what}`;
  const isNumber = _what !== '' && !_what.match(/^0\d/) && !isNaN(_what);
  _what = isNumber ? parseFloat(_what) : _what;
  _what = _what === 'null' ? null : _what;
  _what = _what === 'true' ? true : _what;
  _what = _what === 'false' ? false : _what;
  return _what;
};
