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

		default:
			return state;
	}
}

export default rootReducer;