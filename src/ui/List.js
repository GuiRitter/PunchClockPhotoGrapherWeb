import React/*, { useState }*/ from 'react';
import { useDispatch/*, useSelector*/ } from 'react-redux';

import { getLog } from '../util/log';

import { showPhoto, signOut } from '../flux/action/index';

const log = getLog('List.');

function List(props) {

	const dispatch = useDispatch();

	log('List');

	return <><input
		onClick={() => dispatch(showPhoto())}
		type='button'
		value='Take photo'
	/><input
		onClick={() => dispatch(signOut())}
		type='button'
		value='Sign out'
	/></>;
}

export default List;
