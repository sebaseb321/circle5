export const FIREBASE = {
  INITIAL_STATE: {
    // Custom states:
		user: {},
		firestore: {},
  },
  // Custom consts:
		LOGOUT: 'FIREBASE_LOGOUT',
		LOGIN: 'FIREBASE_LOGIN',
		DELETE: 'FIREBASE_DELETE',
		SET: 'FIREBASE_SET',
		GET: 'FIREBASE_GET',
};

export const FirebaseReducer = (draft, action) => {
  const { payload, type } = action;
  switch (type) {
    // Custom case:
    case FIREBASE.LOGIN:
      draft.user = payload.user;
      break;

    case FIREBASE.LOGOUT:
      draft.user = FIREBASE.INITIAL_STATE.user;
      break;

    case FIREBASE.GET:
        const firestoreObj1 = draft.firestore._clone();
        const firestoreObj2 = { ...(payload.data || {}) };
        let draftFirestore = firestoreObj1._clone();
        draftFirestore = draftFirestore._merge(firestoreObj2);
        if (!firestoreObj1._equals(draftFirestore)) {
            draft.firestore = draftFirestore;
          }
        break;
    case FIREBASE.DELETE:
        let firestoreDeleted = draft.firestore._clone();
        firestoreDeleted = firestoreDeleted._delete(payload.keys.join('.'));
        draft.firestore = firestoreDeleted;
        break;
    
    default:
      return draft;
  }
};
