import React, { createContext, useEffect, useState } from 'react';
// Custom imports:
import {
	getAuth,
	EmailAuthProvider,
	FacebookAuthProvider,
	GoogleAuthProvider,
	GithubAuthProvider,
	PhoneAuthProvider,
	TwitterAuthProvider,
	linkWithPopup,
	linkWithRedirect,
	signInWithEmailAndPassword,
	signInWithPopup,
	createUserWithEmailAndPassword
} from 'firebase/auth';
import { addDoc, collection, deleteDoc, deleteField, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';

import {
  useFirebaseApp,
  // reactfire imports:
	AuthProvider,
	useSigninCheck,
	FirestoreProvider,
	useFirestoreDocData,
	useFirestoreCollectionData,

} from 'reactfire';

import { useImmerReducer } from 'use-immer';
import { parse } from '../util';
import { FirebaseReducer, FIREBASE } from './reducers';

export const FirebaseContext = createContext({});

// Custom code:
const getProvider = (providerId) => {
  switch (providerId) {
    case 'email':
    case 'password':
      return new EmailAuthProvider();
    case 'google':
    case 'google.com':
      return new GoogleAuthProvider();
    case 'facebook':
    case 'facebook.com':
      return new FacebookAuthProvider();
    case 'github':
    case 'github.com':
      return new GithubAuthProvider();
    case 'phone':
      return new PhoneAuthProvider();
    case 'twitter':
    case 'twitter.com':
      return new TwitterAuthProvider();
    default:
      throw new Error(`No provider implemented for ${providerId}`);
  }
}

const Auth = ({ dispatch, user: userProps }) => {
  const { status, data = {} } = useSigninCheck();
  let { user } = data;
  user = user || {};
  const { providerData = [] } = user;
  const { displayName, photoURL } =
    providerData.find(({ displayName, photoURL }) => displayName && photoURL) ||
    {};
  const { email, emailVerified, uid: id } = user;
  user = { displayName, email, emailVerified, photoURL, id };

  useEffect(() => {
    if (!userProps._equals(user))
      dispatch({
        type: FIREBASE.LOGIN,
        payload: { status, user },
      });
  }, [user]);

  return null;
};
const firestoreCondition = {
  is: '==',
  is_not: '!=',
  less_equal_than: '<=',
  less_than: '<',
  more_equal_than: '>=',
  more_than: '>',
  includes: 'in',
};

const FirestoreCollectionData = ({ dispatch, _key: key, _ref: ref }) => {
  const { status, data: _data } = useFirestoreCollectionData(ref);
  useEffect(() => {
    const __data = _data?.reduce((result, item) => {
      const { NO_ID_FIELD } = item;
      return {
        ...result,
        [NO_ID_FIELD]: item,
      };
    }, {});
    const data =
      _data &&
      key
        .split('.')
        .reverse()
        .reduce((result, key) => ({ [key]: result }), __data);
    dispatch({
      type: FIREBASE.GET,
      payload: { status, data },
    });
  }, [_data]);
  return null;
};

const FirestoreDocData = ({ dispatch, _key: key, _ref: ref }) => {
  const { status, data: _data } = useFirestoreDocData(ref);
  useEffect(() => {
    const field = key.split('.').pop();
    const data =
      _data &&
      key
        .split('.')
        .reverse()
        .reduce((result, key) => ({ [key]: result }), _data[field] || _data);
    dispatch({
      type: FIREBASE.GET,
      payload: { status, data },
    });
  }, [_data]);
  return null;
};

const FirestoreData = ({
  _key: key,
  _ref: ref,
  _type: type = 'document',
  dispatch,
}) => {
  switch (type) {
    case 'collection':
      return (
        <FirestoreCollectionData _key={key} _ref={ref} dispatch={dispatch} />
      );
    case 'document':
      return <FirestoreDocData _key={key} _ref={ref} dispatch={dispatch} />;
    default:
      return null;
  }
};

const Firestore = ({ dispatch, refs }) => {
  return (
    <>
      {refs.map(({ key, type, ref }, i) => (
        <FirestoreData
          key={`Firestore-${i}`}
          dispatch={dispatch}
          _key={key}
          _type={type}
          _ref={ref}
        />
      ))}
    </>
  );
};



export const FirebaseProvider = (props) => {
  const app = useFirebaseApp();
  const [state, dispatch] = useImmerReducer(
    FirebaseReducer,
    FIREBASE.INITIAL_STATE
  );
  
  // provider code:
    const auth = getAuth(app);

    const logInWithFirebase = async ({ provider: providerId, email, pass }) => {
    let data = {};
    providerId = providerId.replace("firebase.", "");
    const provider = getProvider(providerId);
    try {
      if (providerId === 'email') {
        data = await signInWithEmailAndPassword(auth, email, pass);
      } else {
        if (state?.user?.uid) {
          data = linkWithPopup(auth.currentUser, provider);
        } else {
          data = await signInWithPopup(auth, provider);
        }
      }
      const { _tokenResponse: user } = data;
      return { ...data, user };
    } catch (error) {
      if (
        error.customData?._tokenResponse &&
        error.code === 'auth/account-exists-with-different-credential'
      ) {
        const { email } = error.customData;
        if (state?.user?.uid) {
          provider.setCustomParameters({ login_hint: email });
          const result = await linkWithRedirect(auth.currentUser, provider);
          return result;
        }
        return await linkWithRedirect(auth, provider);
      }
      return { error };
    }
  };

  const logOutWithFirebase = async () => await auth.signOut();

  const signUpWithFirebase = async ({ email, pass }) => {
    try {
      const data = await createUserWithEmailAndPassword(auth, email, pass);
      return data;
    } catch (error) {
      console.error(error);
      return { error };
    }
  };
    const [refs, setRef] = useState([]);
    const firestore = getFirestore(app);

    const addToFirestore = async ({ key, to, what }) => {
      let keys = to.replace('@firebase.firestore.', '').split('.');
      if (!key) {
        return await addDoc(collection(firestore, ...keys), what);
      }
      keys = [...keys, key];
      const ref = doc(firestore, ...keys);
      return await setDoc(ref, what, { merge: true });
    };

    const deleteFromFirestore = async (what) => {
      const keys = what.replace('@firebase.firestore.', '').split('.');
      try {
        const ref = doc(firestore, ...keys);
        await deleteDoc(ref);
      } catch (e) {
        const field = keys.pop();
        const ref = doc(firestore, ...keys);
        // Remove field from the document
        await updateDoc(ref, {
          [field]: deleteField(),
        });
      }
      dispatch({
        type: FIREBASE.DELETE,
        payload: { keys },
      });
    };
    
    const getCollectionFromFirestore = (key, options = []) => {
      const keys = key.split('.');
      const ref = query(collection(firestore, ...keys), ...options);
      const { _query = {} } = ref;
      const { explicitOrderBy, filters, limit } = _query;
      const queryKey = JSON.stringify({ explicitOrderBy, filters, limit });
      setRef((refs) => {
        if (
          refs.some(({ key: k, ref: { _query = {} } }) => {
            const { explicitOrderBy, filters, limit } = _query;
            const _queryKey = JSON.stringify({ explicitOrderBy, filters, limit });
            return key === k && _queryKey === queryKey;
          })
        ) {
          return refs;
        }
        return [...refs, { key, type: 'collection', ref }];
      });
    };

    const getDocumentFromFirestore = (key, options = []) => {
      const keys = key.split('.');
      let ref;
      try {
        ref = query(doc(firestore, ...keys), ...options);
      } catch (e) {
        keys.pop();
        ref = query(doc(firestore, ...keys), ...options);
      }
      const { _query = {} } = ref;
      const { explicitOrderBy, filters, limit } = _query;
      const queryKey = JSON.stringify({ explicitOrderBy, filters, limit });
      setRef((refs) => {
        if (
          refs.some(({ key: k, ref: { _query = {} } }) => {
            const { explicitOrderBy, filters, limit } = _query;
            const _queryKey = JSON.stringify({ explicitOrderBy, filters, limit });
            return key === k && _queryKey === queryKey;
          })
        ) {
          return refs;
        }
        return [...refs, { key, type: 'document', ref }];
      });
    };

    const getFromFirestore = async (
      str,
      { filter: f, isCollection, limit: l, order = {} } = {}
    ) => {
      const { field: oField, type: oType } = order;
      let _str = str.replace('@firebase.firestore.', '');

      const getFilter = ({ what, and, or, ...condition }) => {
        let filter = [];
        const value = Object.values(condition)[0];
        condition = Object.keys(condition)[0];
        condition = firestoreCondition[condition] || '==';
        filter = [...filter, where(what, condition, value)];
        if (and) {
          filter = [...filter, ...getFilter(and)];
        }
        if (or) {
          (() => getFromFirestore(str, { filter: or, order, limit: l }))();
        }
        return filter;
      };
      const _filter = f && getFilter(f);
      const _order = (oField || oType) && orderBy(oField, oType || 'asc');
      const _limit = l && limit(l);
      const options = [];
      _filter && options.push(..._filter);
      _order && options.push(_order);
      _limit && options.push(_limit);
      const keys = _str.split('.');
      let ref;
      let field = '';
      try {
        ref =
          keys.length === 1 || isCollection
            ? collection(firestore, ...keys)
            : doc(firestore, ...keys);
      } catch (e) {
        field = keys.pop();
        ref = doc(firestore, ...keys);
      }
      try {
        let queryRef = query(ref, ...options);
        let replacedStr;
        if (ref.type === 'collection') {
          const docsRef = await getDocs(queryRef);
          replacedStr = docsRef.docs
            .map(
              (docRef) => ({
                id: docRef.id,
                NO_ID_FIELD: docRef.id,
                ...docRef.data(),
              }),
              {}
            )
            .reduce((result, item) => {
              const { NO_ID_FIELD } = item;
              return {
                ...result,
                [NO_ID_FIELD]: item,
              };
            }, {});
        }  else if (ref.type === 'document') {
          const docRef = await getDoc(queryRef);
          replacedStr = docRef.data();
          replacedStr = replacedStr && {
            id: docRef.id,
            NO_ID_FIELD: docRef.id,
            ...replacedStr,
          };
        }

        if (_str.split('.').length === 1 || isCollection) {
          getCollectionFromFirestore(_str, options);
        } else {
          getDocumentFromFirestore(_str, options);
        }

        replacedStr = field ? replacedStr[field] : replacedStr;
        replacedStr = parse(replacedStr);
        return replacedStr;
      } catch (error) {
        console.error(error);
        return null;
      }
    };

    const updateFirestore = async ({ what, value }) => {
      try {
        let keys = what.replace('@firebase.firestore.', '').split('.');
        let field = keys.pop();
        let docRef = doc(firestore, ...keys);
        if (docRef && field) {
          return await setDoc(docRef, { [field]: value }, { merge: true });
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    };


  return (
    <FirebaseContext.Provider value={{ 
      firebase: state,
			signUpWithFirebase,
			logOutWithFirebase,
			logInWithFirebase,
			updateFirestore,
			getFromFirestore,
			deleteFromFirestore,
			addToFirestore,
    }}>
      {/* return code */}
    <AuthProvider sdk={auth}>
        <Auth dispatch={dispatch} user={state?.user} />
    </AuthProvider>
          <FirestoreProvider sdk={firestore}>
        <Firestore dispatch={dispatch} refs={refs} />
        {props.children}
    </FirestoreProvider>
    </FirebaseContext.Provider>
  );
};

export const FirebaseConsumer = FirebaseContext.Consumer;
export default FirebaseContext;
