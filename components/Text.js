import React from 'react';
import { Component } from '.';
import { useSource } from '../hooks';
import {
  getAmountFormat,
  getCurrencyFormat,
  getDateFormat,
  isObject,
} from '../util';

export const Text = ({
  children: childrenProps = '',
  className = '',
  format = {},
  itemDataSrc,
  src,
  tag: Tag = 'div',
  ...props
}) => {
  let text = childrenProps;
  const { id, itemData: data } = props;
  const { value } = useSource(src, { data });
  text = `${text}`?.replace(
    /\(?@field\.([^)]*)\)?/g,
    (str, field) => data[field]
  );
  let children =
    text
      .match(/\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)/gm)
      ?.reduce((children, entry, i) => {
        const src = entry.substring(1, entry.length - 1);
        const index = text.indexOf(src);
        const subtext = text.substring(0, index - 1);
        const plain = index > 0 ? [subtext] : [];
        text = text.substr(index + src.length + 1);
        return [
          ...children,
          ...plain,
          <Text key={`${id}-${i}`} src={src} tag="span" />,
        ];
      }, []) || [];
  if (text) {
    children = [...children, text];
  }

  let textToShow = children;
  if (src) {
    textToShow =
      (isObject(itemDataSrc) && `${JSON.stringify(itemDataSrc)}`) ||
      (typeof itemDataSrc !== 'undefined' &&
        itemDataSrc !== null &&
        `${`${itemDataSrc}`.replace(
          /\(@field\.([^)]*)\)/g,
          (str, field) => data[field]
        )}`) ||
      (isObject(value) && `${JSON.stringify(value)}`) ||
      (typeof value !== 'undefined' &&
        value !== null &&
        value !== src &&
        `${`${value}`.replace(
          /\(?@field\.([^)]*)\)?/g,
          (str, field) => data[field]
        )}`);
  }

  const { type, ...formatOptions } = format;
  if (type) {
    textToShow = Array.isArray(textToShow) ? textToShow : [textToShow];
    textToShow = textToShow.map((text) => {
      if (type === 'amount') {
        text = parseInt(text);
        return getAmountFormat(text, formatOptions);
      }
      if (type === 'currency') {
        text = parseInt(text);
        return getCurrencyFormat(text, formatOptions);
      }
      if (type === 'date') {
        if (!isNaN(text)) {
          text = parseInt(text);
        }
        const dateFromText = new Date(text);
        return `${getDateFormat(dateFromText, formatOptions)}`;
      }
      return text;
    });
  }

  return (
    <Component
      {...props}
      className={`text ${className}`.trim()}
      component={Tag}
    >
      {textToShow}
    </Component>
  );
};

Text.displayName = 'Text';
export default Text;
