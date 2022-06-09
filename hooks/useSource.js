import { useEffect, useState } from 'react';
import { useFunctions, useRefs } from '.';
import { getKeys } from '../context/Refs';

export function useSource(
  what,
  { data, filter, isCollection, order, limit } = {}
) {
  const { get } = useFunctions();
  const refs = useRefs();
  const keys = getKeys(what);
  const { [keys[0]]: mainRef = {} } = refs;
  const { [keys[1]]: ref } = mainRef;
  const _value = keys.length
    ? keys.reduce((resp, key) => resp?.[key], refs)
    : what;
  const [value, setValue] = useState(_value);
  const [vars, setVars] = useState([]);

  useEffect(() => {
    (async () => {
      let _refs = `${what}`.match(/(\(@)([^.]+)\.([^)]+)\)?/g) || [];
      const _vars = await Promise.all(
        _refs.map(async (ref) => {
          return await get({ what: ref }, { data });
        })
      );
      if (!vars._equals(_vars)) {
        setVars(_vars);
      }
    })();
  }, [what, refs]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (what) {
        const value = await get(
          { what, filter, isCollection, order, limit },
          { data }
        );
        mounted && setValue(value);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [what, ref, data, filter, order, limit, vars]);

  return { value };
}

export default useSource;
