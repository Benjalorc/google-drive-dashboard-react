import {
	SET_USER,
	GET_USER,
	LOAD_STORAGE,
	CHECK_STATUS,
	UPDATE_CHANGES_TOKEN,
	UPDATE_FILES_TOKEN
} from "../constants/action-types";

const initialState = {
	user: {
		gUser: null,
		username: null,
		imgUrl: null,
		isLogged: false
	},
	storage: {},
	changes: {
		token: "",
		list: []
	},
	files: {
		token: "",
		list: []
	},
	status: null
}

function rootReducer(state = initialState, action){

	switch(action.type){
		case SET_USER:
			return Object.assign({}, state, {user: action.payload});

		case GET_USER:
			return Object.assign({}, state, {user: action.payload});

		case LOAD_STORAGE:
			return Object.assign({}, state, {storage: action.payload});

		case CHECK_STATUS:
			return Object.assign({}, state, {status: action.payload});

		case UPDATE_CHANGES_TOKEN:
			return Object.assign({}, state, {changes: action.payload});

		case UPDATE_FILES_TOKEN:
			return Object.assign({}, state, {files: action.payload});

		default:
			return state;
	}
}

export default rootReducer;