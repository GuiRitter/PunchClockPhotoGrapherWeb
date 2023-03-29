import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as state from '../constant/state';

import { restoreFromLocalStorage } from '../flux/action/index';

import List from './List';
import Loading from './Loading';
import Photo from './Photo';
import SignIn from './SignIn';

import './App.css';

function componentDidMount(props, dispatch) {
	dispatch(restoreFromLocalStorage());
}

function App(props) {

	const didMountRef = useRef(false);

	const dispatch = useDispatch();

	const isAuthenticated = useSelector(state => !!(((state || {}).reducer || {}).token));
	const isLoading = useSelector(state => ((state || {}).reducer || {}).isLoading);
	const currentState = useSelector(state => ((state || {}).reducer || {}).state);

	useEffect(() => {
		if (didMountRef.current) {
			// componentDidUpdate(props, prevProps);
		} else {
			didMountRef.current = true;
			componentDidMount(props, dispatch);
		}
	});

	if (isLoading) {
		return <Loading />;
	}

	if (!isAuthenticated) {
		return <SignIn />
	}

	if (currentState === state.PHOTO) {
		return <Photo />;
	}
	return <List />;
}

export default App;
