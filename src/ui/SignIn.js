import React from 'react';
import { useDispatch } from 'react-redux';

import { buildCell, buildRow, buildTable } from '../util/html';

import { showMenu, signIn } from '../flux/action/index';

function SignIn(props) {

	const dispatch = useDispatch();

	let loginField;
	let passwordField;

	return buildTable({},
		buildRow('login', buildCell('login', <input
			ref={(ref) => { if (ref) loginField = ref; }}
			type='text'
			name='login'
		></input>)),
		buildRow('password', buildCell('password', <input
			ref={(ref) => { if (ref) passwordField = ref; }}
			type='password'
			name='password'
		></input>)),
		buildRow('signIn', buildCell('signIn', <input
			onClick={() => dispatch(signIn(loginField.value, passwordField.value))}
			id='logInButton'
			type='submit'
			value='Sign In'
		/>))
	);
}

export default SignIn;
