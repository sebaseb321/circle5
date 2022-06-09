import React, { createContext } from 'react';
import { useImmerReducer } from 'use-immer';
import { RefsReducer, REFS } from './reducers';

// Custom imports:
import { useFirebase } from '../hooks';


export const refTypes = ['@firebase', '@cookie', '@element', '@menu', '@property'];
export const getKeys = (ref) => {
  if (!ref) {
    return [];
  }
  const refType =
    refTypes.find((rt) => {
      const regExp = new RegExp(`^${rt}`);
      return ref.match(regExp);
    }) || '';
  const mainKey = refType.split('.').pop().replace('@','');
  const keys = ref.replace(`${refType}.`, '').split('.')
  return [mainKey, ...keys];
};

export const RefsContext = createContext({});

export const RefsProvider = (props) => {
  const [state, dispatch] = useImmerReducer(RefsReducer, REFS.INITIAL_STATE);
  // Custom consts:

	const { firebase = {} } = useFirebase();

  //Custom code:

  const setRefs = (refs) => {
    dispatch({ type: REFS.SET, payload: { refs } });
  };

  

  return (
    <RefsContext.Provider
      value={{
        ...state,

				firebase,
        setRefs,
      }}
    >
      {props.children}
    </RefsContext.Provider>
  );
};

export const RefsConsumer = RefsContext.Consumer;
export default RefsContext;
