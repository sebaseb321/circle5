import React, { createContext } from 'react';
import { useImmerReducer } from 'use-immer';
import { DialogsReducer, DIALOGS } from './reducers';

export const DialogsContext = createContext({});

export const DialogsProvider = (props) => {
  const [state, dispatch] = useImmerReducer(
    DialogsReducer,
    DIALOGS.INITIAL_STATE
  );

  const show = (dialog) => {
    dispatch({ type: DIALOGS.SHOW, payload: { dialog } });
  };

  const hide = (dialog) => {
    dispatch({ type: DIALOGS.HIDE, payload: { dialog } });
  };

  return (
    <DialogsContext.Provider
      value={{
        ...state,
        show,
        hide,
      }}
    >
      {props.children}
    </DialogsContext.Provider>
  );
};

export const DialogsConsumer = DialogsContext.Consumer;
export default DialogsContext;
