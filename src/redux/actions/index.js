import {
	SET_USER,
	GET_USER,
	LOAD_STORAGE,
	CHECK_STATUS,
	UPDATE_CHANGES_TOKEN,
	UPDATE_FILES_TOKEN,
	CLEAR_STORE
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

function clearStore(payload){
	return {
		type: CLEAR_STORE,
		payload
	}
}

function waitForGapi(){
	return new Promise((resolve, reject)=>{
		let interval = setInterval(check, 1000);
		function check(){
			if(window.gapi){
				setTimeout(()=>{
					resolve(true);
				});
				clearInterval(interval);
			}
		}
	});
}
function waitForDrive(){
	return new Promise((resolve, reject)=>{
		let interval = setInterval(check, 1000);
		function check(){
			if(window.gapi.client
			&& window.gapi.client.drive){
				setTimeout(()=>{
					resolve(true);
				});
				clearInterval(interval);
			}
		}
	});
}

export function loadStorage(){

	return async function (dispatch) {

		await waitForDrive();

		let obj = {'fields': "storageQuota, maxUploadSize, maxImportSizes"};
		const gapi = window.gapi;
		return gapi.client.drive.about.get(obj).then((data)=> {

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

export function logOut(){

	const gapi = window.gapi;
	let auth2 = gapi.auth2.getAuthInstance();

	return function (dispatch) {
		return auth2.signOut().then(()=> {
			setTimeout(() =>{
				dispatch(clearStore({isLogged: false}));
			},1500)
		});
	}

}

export function checkStatus(){

	return async function (dispatch) {

		//Si aun no existe una instancia de googleAuth la inicializa
		//Y retorna un JSON que se podra leer cuando la operación se complete
		await waitForGapi();

		const gapi = window.gapi;

		const apiKey = "AIzaSyAEdrFiBDNK-HVnj5qxU7gMNcN58zpkR_c";
		const clientId = "774012725108-tnnusra4io75rsiih2jsp8ukch4j1auu.apps.googleusercontent.com";
		const scope = "https://www.googleapis.com/auth/drive";
		const discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
		let googleAuth;

		let final = async ()=>{
			googleAuth = gapi.auth2.getAuthInstance();
			let con = googleAuth.isSignedIn.get();
			if(con){

				let googleUser = googleAuth.currentUser.get()
				let perfil = googleUser.getBasicProfile();
				let usuario = {
					gUser: googleUser,
					gAuth: googleAuth,
					username: perfil.getName(),
					imgUrl: perfil.getImageUrl(),
					isLogged: true
				}

				await waitForDrive();

				return gapi.client.drive.changes.getStartPageToken().then((res) =>{
					let token = res.result.startPageToken;
					dispatch(recieveTokens(UPDATE_CHANGES_TOKEN, {token: token, list: []}));
					dispatch(setUser(usuario));
				});
			}
			else{
				dispatch(setUser({isLogged: false}));
			}
		}

        return gapi.client.init({
          'apiKey': apiKey,
          'clientId': clientId,
          'scope': scope,
          'discoveryDocs': discoveryDocs
        }).then(final);
	}
}

export function getChanges() {

	return async function (dispatch) {

		const gapi = window.gapi;
		let data = {
			fields: 'nextPageToken, files, files/webViewLink, files/name, files/modifiedTime',
			orderBy: "modifiedTime desc",
			pageSize: 5
		};

		await waitForDrive();

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

	return async function (dispatch) {

		const gapi = window.gapi;
		let data = {
			pageSize: 5,
			pageToken: pageToken,
			fields: 'nextPageToken, files, files/webViewLink, files/name, files/modifiedTime, files/mimeType',
			q: "mimeType='application/vnd.google-apps.document' or mimeType='application/vnd.google-apps.spreadsheet' or mimeType='application/vnd.google-apps.presentation' or mimeType='application/vnd.google-apps.drawing'",
			orderBy: "modifiedTime desc"
		};

		await waitForDrive();

		return gapi.client.drive.files.list(data).then((res)=>{
			if(res.status === 200){

				let docs = [], sheets = [], presentations = [], drawings = [];
				res.result.files.forEach((element) =>{

				element.time = new Date(element.modifiedTime);
				switch(element.mimeType){

					case "application/vnd.google-apps.document":
						docs.push(element);
					break;

					case "application/vnd.google-apps.spreadsheet":
						sheets.push(element);
					break;

					case "application/vnd.google-apps.presentation":
						presentations.push(element);
					break;

					case "application/vnd.google-apps.drawing":
						drawings.push(element);
					break;
					default:
				}

				});

				let payload = {
					token: (res.result.nextPageToken || false),
					list: {
						docs,
						sheets,
						presentations,
						drawings
					}
				};
				dispatch(recieveTokens(UPDATE_FILES_TOKEN, payload));
			}
		});
	}
}
