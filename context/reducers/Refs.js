import Cookies from 'js-cookie';
import { i18n } from '../../i18n';

export const REFS = {
  INITIAL_STATE: {
    app: {
      language: i18n.language,
    },
    cookie: Cookies.get(),
    element: {},
    menu: {},
    property: {},
  },

  SET: 'REFS_SET',
};

export const RefsReducer = (draft, action) => {
  const { payload, type } = action;
  switch (type) {
    case REFS.SET:
      Object.keys(payload.refs.cookie || {}).forEach((key) =>
        Cookies.set(key, payload.refs.cookie[key])
      );
      draft.app = {
        ...draft.app,
        ...(payload.refs.app || {}),
      };
      draft.cookie = {
        ...draft.cookie,
        ...(payload.refs.cookie || {}),
      };
      draft.element = {
        ...draft.element,
        ...(payload.refs.element || {}),
      };
      draft.menu = {
        ...draft.menu,
        ...(payload.refs.menu || {}),
      };
      draft.property = {
        ...draft.property,
        ...(payload.refs.property || {}),
      };
      break;

    default:
      return draft;
  }
};
