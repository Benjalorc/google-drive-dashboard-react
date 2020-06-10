import {
	SET_USER,
	GET_USER,
	LOAD_STORAGE,
	CHECK_STATUS,
	UPDATE_CHANGES_TOKEN,
	UPDATE_FILES_TOKEN
} from "../constants/action-types";

export function setUser(payload){
	return {type: SET_USER, payload}
}

export function getUser(payload){
	return {type: GET_USER, payload}
}

function recieveStorageData(payload){
	return {
		type: LOAD_STORAGE,
		payload
	}
}

function recieveTokens(tipo, payload){
	return {
		type: tipo,
		payload
	}
}

function verifiedStatus(status){
	return {
		type: CHECK_STATUS,
		payload: status
	}
}

export function loadStorage(){

	return function (dispatch) {

		let data = {'fields': "storageQuota, maxUploadSize, maxImportSizes"};
		return window.gapi.client.drive.about.get(data)
			.then((response)=> {
				if(response.status === 200){
					dispatch(recieveStorageData(response.result));
				}
	        });
	}
}

export function checkStatus(){

	return function (dispatch) {

		//Si aun no existe una instancia de googleAuth la inicializa
		//Y retorna un JSON que se podra leer cuando la operación se complete

		const gapi = window.gapi;

		const apiKey = "AIzaSyAEdrFiBDNK-HVnj5qxU7gMNcN58zpkR_c";
		const clientId = "774012725108-tnnusra4io75rsiih2jsp8ukch4j1auu.apps.googleusercontent.com";
		const scope = "https://www.googleapis.com/auth/drive";
		const discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
		let googleAuth;

		let final = ()=>{
			googleAuth = gapi.auth2.getAuthInstance();
			let con = googleAuth.isSignedIn.get();
			if(con){
				dispatch(verifiedStatus("connected"));
				return gapi.client.drive.changes.getStartPageToken().then((res) =>{
					let token = res.result.startPageToken;
					dispatch(recieveTokens(UPDATE_CHANGES_TOKEN, {token: token, list: []}));
				});
			}
			else{
				dispatch(verifiedStatus("disconnected"));
			}
		}


		if(!gapi.auth2 || !gapi.auth2.getAuthInstance()){

	        return gapi.client.init({
	          'apiKey': apiKey,
	          'clientId': clientId,
	          'scope': scope,
	          'discoveryDocs': discoveryDocs
	        }).then(final);
	    }

		return final();
	}
}

export function getChanges() {

	return function (dispatch) {

		const gapi = window.gapi;
		let data = {
			fields: 'nextPageToken, files, files/webViewLink, files/name, files/modifiedTime',
			orderBy: "modifiedTime desc",
			pageSize: 5
		};

		return 	gapi.client.drive.files.list(data).then((res) =>{
			if(res.status === 200){
				let files = [];
				res.result.files.forEach((element) =>{
					element.time = new Date(element.modifiedTime);
					files.push(element);
	        	});
				dispatch(recieveTokens(UPDATE_CHANGES_TOKEN, {token: res.result.nextPageToken, list: files}));
			}
		});
	}
}

export function getFilesList(pageToken) {

	return function (dispatch) {

		const gapi = window.gapi;
		let data = {
			pageSize: 5,
			pageToken: pageToken,
			fields: 'nextPageToken, files, files/webViewLink, files/name, files/modifiedTime, files/mimeType',
			q: "mimeType='application/vnd.google-apps.document' or mimeType='application/vnd.google-apps.spreadsheet' or mimeType='application/vnd.google-apps.presentation' or mimeType='application/vnd.google-apps.drawing'",
			orderBy: "modifiedTime desc"
		};

		return gapi.client.drive.files.list(data).then((res)=>{
			if(res.status === 200){
				dispatch(recieveTokens(UPDATE_FILES_TOKEN, {token: res.result.nextPageToken, list: res.result.files}));
			}
		});
	}
}
