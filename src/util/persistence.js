import { LOCAL_STORAGE_NAME } from '../constant/system';

export const updateLocalStorage = state => {
	let savedState = Object.keys(state).filter(key => key !== 'data').reduce((object, key) => ({ ...object, [key]: state[key] }), {});
	localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(savedState));
	return state;
}
