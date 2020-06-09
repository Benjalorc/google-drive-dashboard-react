import { SET_USER, GET_USER } from "../constants/action-types";

const initialState = {
	user: {
		gUser: null,
		username: null,
		imgUrl: null,
		isLogged: false
	},
}

function rootReducer(state = initialState, action){
	console.log("VAMOS VAMOS", action);
	if(action.type === SET_USER){
		return Object.assign({}, state, {user: action.payload});
	}
	else if(action.type === GET_USER){
		return Object.assign({}, state, {user: action.payload});
	}
	return state;
}

export default rootReducer;