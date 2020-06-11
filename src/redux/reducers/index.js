import {
	SET_USER,
	LOAD_STORAGE,
	UPDATE_CHANGES_TOKEN,
	UPDATE_FILES_TOKEN,
	CLEAR_STORE
} from "../constants/action-types";

function initState(){
	return {
		user: {
			gUser: null,
			gAuth: null,
			username: null,
			imgUrl: null,
			isLogged: null
		},
		storage: {
			usage: {
			    storageLimit: 0,
			    storageUsage: 0,
			    storageUsageDrive: 0,
			    storageUsageTrash: 0
			},
			uploads: {
				maxUploadSize: 0
			},
			imports: {
			    document: 0,
			    draw: 0,
			    spreadsheet: 0,
			    presentation: 0
			}
		},
		changes: {
			token: "",
			list: []
		},
		files: {
			token: "",
			list: {
				docs: [],
				sheets: [],
				presentations: [],
				drawings: []
			}
		},
		status: null
	}
}
const initialState = initState();

function rootReducer(state = initialState, action){

	switch(action.type){
		case SET_USER:
			return Object.assign({}, state, {user: action.payload});

		case LOAD_STORAGE:
			return Object.assign({}, state, {storage: action.payload});

		case UPDATE_CHANGES_TOKEN:
			return Object.assign({}, state, {changes: action.payload});

		case UPDATE_FILES_TOKEN:

			let data = {
				token: action.payload.token,
				list: {
					docs: state.files.list.docs.concat(action.payload.list.docs),
					sheets: state.files.list.sheets.concat(action.payload.list.sheets),
					presentations: state.files.list.presentations.concat(action.payload.list.presentations),
					drawings: state.files.list.drawings.concat(action.payload.list.docs)
				}
			};
			return Object.assign({}, state, {files: data});

		case CLEAR_STORE:
			return Object.assign({}, state, initState(), {user: action.payload});

		default:
			return state;
	}
}

export default rootReducer;