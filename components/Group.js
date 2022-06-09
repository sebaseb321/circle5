import React from 'react';
import Container from 'react-bootstrap/Container';
import Component from './Component';

export const Group = ({
  container = false,
  children,
  className = '',
  itemData,
  direction = 'vertical',
  tag: Tag = 'div',
  ...props
}) => {
  children = Array.isArray(children) ? children : [children];
  Tag = container ? Container : Tag;
  return (
    <Component
      {...props}
      className={`group direction-${direction} ${className}`.trim()}
      component={Tag}
    >
      {itemData
        ? children
            .filter((child) => child)
            .map(({ props, ...child }) => ({
              ...child,
              props: {
                ...props,
                itemData,
                itemDataSrc: props?.src ? itemData[props?.src] : props?.src,
              },
            }))
        : children}
    </Component>
  );
};

Group.displayName = 'Group';
export default Group;
