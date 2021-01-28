import { Dimensions } from 'react-native';

export const StateReducer = (state, action) => {
	switch (action.type) {
		case 'setStore':
			return {
				...state,
				store: action.value,
			};
		case 'setBatch':
			return {
				...state,
				batch: action.value,
			};
		case 'setDone':
			return {
				...state,
				done: action.value,
			};
		case 'setReplacement':
			return {
				...state,
				replacement: action.value,
			};
		case 'isLoading':
			return {
				...state,
				isLoading: action.value,
			};

		default:
			return state;
	}
};

export const InitialState = {
	store: '',
	batch: [],
	done: [],
	replacement: [],
	dimensions: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('screen').height,
	},
	isLoading: true,
};