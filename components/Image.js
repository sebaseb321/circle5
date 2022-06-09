import React, { useEffect, useState } from 'react';
import Component from './Component';
import { useSource } from '../hooks';

export const Image = ({
  className = '',
  itemDataSrc,
  fallback: fallbackProp,
  src: srcProp,
  tag: Tag = 'img',
  ...props
}) => {
  const { itemData: data } = props;
  const [dataValue, setDataValue] = useState();
  if (itemDataSrc?.[0] === '@') {
    srcProp = itemDataSrc;
  }
  let { value: fallback = fallbackProp } = useSource(fallbackProp, { data });
  const { value } = useSource(srcProp, { data });
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { default: url } = await import(
          `../assets/${itemDataSrc || value}`
        );
        mounted && setDataValue(url);
      } catch (e) {}
    })();
    return () => {
      mounted = false;
    };
  }, [itemDataSrc, value]);

  useEffect(() => {
    setHasError(false);
  }, [value]);

  fallback =
    fallback &&
    encodeURI(
      fallback.replace(/\(@field\.([^)]*)\)/g, (str, field) => data[field])
    );
  let src =
    dataValue ||
    (itemDataSrc?.match?.(/^(@|data:image\/|(blob:)?http|\/static\/)/) &&
      itemDataSrc) ||
    (value?.match?.(/^(@|data:image\/|(blob:)?http|\/static\/)/) && value) ||
    (srcProp?.match?.(/^(data:image\/|(blob:)?http|\/static\/)/) && srcProp) ||
    fallback;

  if (hasError) {
    src = fallback;
  }

  if (src?.match(/^@/)) {
    return (
      <Image
        {...props}
        className={className}
        fallback={fallback}
        src={src}
        tag={Tag}
      />
    );
  }

  return (
    <Component
      {...props}
      src={src}
      className={`image ${className}`.trim()}
      component={Tag}
      onError={(e) => {
        if (fallback && e.currentTarget.src !== fallback) {
          setHasError(true);
        }
      }}
    />
  );
};

Image.displayName = 'Image';
export default Image;
