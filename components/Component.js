import React from 'react';
import { useVisibility } from '../hooks';

export const Component = ({
  __listId__,
  children,
  className = '',
  component: Cmp = 'div',
  itemData: data,
  itemDataSrc,
  if: condition,
  visible: isVisible = true,
  ...props
}) => {
  const { id, onClick } = props;
  const conditionVisible = useVisibility(condition, { data, id, isVisible });
  className = `${className} ${onClick ? 'cursor-pointer' : ''}`.trim();

  if (!conditionVisible) {
    return null;
  }

  if (onClick) {
    props.onClick = () => onClick({ data })
  }

  return (
    <Cmp {...props} className={className}>
      {children}
    </Cmp>
  );
};

Component.displayName = 'Component';
export default Component;
