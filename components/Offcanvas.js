import React from 'react';
import BootstrapOffcanvas from 'react-bootstrap/Offcanvas';
import { Component } from '.';
import { useDialogs } from '../hooks';

export const Offcanvas = ({ children, ...props }) => {
  const { dialogs = {}, hide } = useDialogs();
  const { [props.id]: dialog = {} } = dialogs;
  const { isShown = false } = dialog;

  const handleHide = () => {
    hide(props.id);
  };

  return (
    <Component
      {...props}
      show={isShown}
      onHide={handleHide}
      component={BootstrapOffcanvas}
    >
      {children}
    </Component>
  );
};

Offcanvas.Body = BootstrapOffcanvas.Body;
Offcanvas.Header = BootstrapOffcanvas.Header;
Offcanvas.Title = BootstrapOffcanvas.Title;

Offcanvas.displayName = 'Offcanvas';
export default Offcanvas;
