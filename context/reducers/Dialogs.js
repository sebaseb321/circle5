export const DIALOGS = {
  INITIAL_STATE: {
    dialogs: {},
  },

  SHOW: 'DIALOGS_SHOW',
  HIDE: 'DIALOGS_HIDE',
};

export const DialogsReducer = (draft, action) => {
  const { payload, type } = action;
  switch (type) {
    case DIALOGS.SHOW:
      draft.dialogs = {
        ...draft.dialogs,
        [payload.dialog]: { isShown: true },
      };
      break;
    case DIALOGS.HIDE:
      draft.dialogs = {
        ...draft.dialogs,
        [payload.dialog]: { isShown: false },
      };
      break;

    default:
      return draft;
  }
};
