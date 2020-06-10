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

		let obj = {'fields': "storageQuota, maxUploadSize, maxImportSizes"};
		return window.gapi.client.drive.about.get(obj).then((data)=> {

			if(data.status === 200){

		        let quota = data.result.storageQuota;
		        let maxImports = data.result.maxImportSizes;

		        let usage = {
			        storageLimit: (!quota.limit ? 0 : parseFloat((quota.limit/1073741824).toFixed(2)) ),
			        storageUsage: (!quota.usage ? 0 : parseFloat((quota.usage/1073741824).toFixed(2)) ),
			        storageUsageDrive: (!quota.usageInDrive ? 0 : parseFloat((quota.usageInDrive/1073741824).toFixed(2)) ),
			        storageUsageTrash: (!quota.usageInTrash ? 0 : parseFloat((quota.usageInTrash/1073741824).toFixed(2)) )
		        }
		        let uploads = {
					maxUploadSize: !data.result.maxUploadSize ? 0 : parseFloat((data.result.maxUploadSize/1024/1024/1024/1024).toFixed(2))
		        }

		        let docsize = maxImports["application/vnd.google-apps.document"];
		        let drawsize = maxImports["application/vnd.google-apps.drawing"];
		        let sheetsize = maxImports["application/vnd.google-apps.spreadsheet"];
		        let slidesize = maxImports["application/vnd.google-apps.presentation"];

		        let imports = {
			        document: !parseFloat(docsize) ? 0 : (parseFloat(docsize)/1048576).toFixed(2),
			        draw: !parseFloat(drawsize) ? 0 : (parseFloat(drawsize)/1048576).toFixed(2),
			        spreadsheet: !parseFloat(sheetsize) ? 0 : (parseFloat(sheetsize)/1048576).toFixed(2),
			        presentation: !parseFloat(slidesize) ? 0 : (parseFloat(slidesize)/1048576).toFixed(2)
		        }

		        //Ya almacenadas las variables procede a enviar
		        //los datos para dibujar las gráficas
				dispatch(recieveStorageData({usage, uploads, imports}));
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
