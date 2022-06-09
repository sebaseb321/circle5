import { useEffect, useState } from 'react';
import { useFunctions, useRefs } from '.';
import { getKeys } from '../context/Refs';

export function useVisibility(
  ifProp,
  { data, id, isVisible: isVisibleProp = true } = {}
) {
  const { if: condition } = useFunctions();
  const refs = useRefs();
  const [isVisible, setVisible] = useState(isVisibleProp);
  const { what } = ifProp || {};
  const keys = getKeys(what);
  const { [keys[0]]: mainRef = {} } = refs;
  const { [keys[1]]: ref } = mainRef;
  const { visible: isElementVisible = isVisible } = refs.element?.[id] || {};

  useEffect(() => {
    let mounted = true;
    (async () => {
      const isVisible = ifProp
        ? await condition(ifProp, { data })
        : isElementVisible;
      mounted && setVisible(isVisible);
    })();
    return () => {
      mounted = false;
    };
  }, [data, ifProp, ref, isElementVisible]);

  return isVisible;
}
