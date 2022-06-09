import React, { createContext } from 'react';
import { useImmerReducer } from 'use-immer';
import { UserReducer, USER } from './reducers';

export const UserContext = createContext(USER.INITIAL_STATE);

export const UserProvider = ({ children }) => {
  const [state] = useImmerReducer(UserReducer, USER.INITIAL_STATE);

  return (
    <UserContext.Provider
      value={{
        ...state,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserConsumer = UserContext.Consumer;
export default UserContext;
