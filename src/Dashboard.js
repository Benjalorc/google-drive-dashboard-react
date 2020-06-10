import React, { createRef, useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { 
	setUser,
	loadStorage,
	checkStatus,
	getChanges,
	getFilesList
} from "./redux/actions/index";
import './Dashboard.css';
import { Chart } from 'chart.js';

function StorageUsage({usage}){

	const storageCanvas = useRef(null);
	const driveCanvas = useRef(null);
	const trashCanvas = useRef(null);

	let totalStorageChart = createRef(null);
	let driveStorageChart = createRef(null);
	let trashStorageChart = createRef(null);

  function drawStorageTotalChart(){

  	if(!totalStorageChart.current){

	    let data = {
	      labels: ['En uso','Disponible'],
	      datasets: [{
	        data: [usage.storageUsage, usage.storageLimit-usage.storageUsage],
	        backgroundColor: ['red','#0000FF']

	      }]
	    };

	    totalStorageChart.current = drawChart(storageCanvas.current, 'pie', data);
  	}

  }

  function drawStorageDriveChart(){

  	if(!driveStorageChart.current){

	    let data = {
	      labels: ['En Drive','Otros'],
	      datasets: [{
	        data: [usage.storageUsageDrive, usage.storageLimit-usage.storageUsageDrive],
	        backgroundColor: ['black','#00FF99']

	      }]
	    }

		driveStorageChart.current = drawChart(driveCanvas.current, 'pie', data);
	    //setDriveStorageChart(drawChart('driveChartCanvas', 'pie', data));
  	}
  }

  function drawStorageTrashChart(){

  	if(!trashStorageChart.current){

	    let data = {
	      labels: ['Papelera','Otros'],
	      datasets: [{
	        data: [usage.storageUsageTrash, usage.storageLimit-usage.storageUsageTrash],
	        backgroundColor: ['black','#3333FF']

	      }]
	    }

	    trashStorageChart.current = drawChart(trashCanvas.current, 'pie', data);
	    //setTrashStorageChart(drawChart('trashChartCanvas', 'pie', data));
  	}
  }


  function drawChart(id, type, data) {

        return new Chart(id, {
          type: type,
          data: data,
          options: {
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                display: true
              }],
              yAxes: [{
                display: true
              }],
            }
          }
        });

  }

  setTimeout(()=>{
  	console.log("QUE VOY PUES!");
	drawStorageTotalChart();
	drawStorageDriveChart();
	drawStorageTrashChart();
  }, 1000);

	console.log("RENDER DUDE...");
	return(
		<div className="row spacing-1">

		    <div className="col-12 col-md-4 spacing-2">

		        <div className="card text-center border-success bg-transparent">
		            <div className="card-header">
		                Almacenamiento total
		            </div>
		            <div className="card-body">
		            	<canvas id="driveChartCanvas" ref={storageCanvas} width="200" height="200"></canvas>
		            </div>
		            <div className="card-footer text-muted">
		                <p> {usage.storageUsage} / {usage.storageLimit} GB </p>
		            </div>

		        </div>
		    </div>

		    <div className="col-12 col-md-4 spacing-2">

		        <div className="card text-center border-info bg-light">
		            <div className="card-header">
		                Almacenamiento en Drive
		            </div>
		            <div className="card-body">
		                <canvas id="driveChartCanvas" ref={driveCanvas} width="200" height="200"></canvas>
		            </div>
		            <div className="card-footer text-muted">
		                <p> {usage.storageUsageDrive} / {usage.storageLimit} GB </p>
		            </div>

		        </div>

		    </div>

		    <div className="col-12 col-md-4 spacing-2">

		        <div className="card text-center border-info bg-light">
		            <div className="card-header">
		                Almacenamiento en Papelera
		            </div>
		            <div className="card-body">
		                <canvas id="trashChartCanvas" ref={trashCanvas} width="200" height="200"></canvas>
		            </div>
		            <div className="card-footer text-muted">
		                <p> {usage.storageUsageTrash} / {usage.storageLimit} GB </p>
		            </div>

		        </div>

		    </div>

		</div>
	)

}

function Dashboard(){

	let [first, setFirst] = useState(false);
	let [loading, setLoading] = useState(true);
	let [sessionExpires, setSessionExpires] = useState(null);
	let gapi = createRef();

	const dispatch = useDispatch();
	//const user = useSelector(state => state.user);
	const storage = useSelector(state => state.storage);
	//const changes = useSelector(state => state.changes);
	//const files = useSelector(state => state.files);
	const authStatus = useSelector(state => state.status);

    useEffect(()=>{
    	dispatch(checkStatus());
    }, [dispatch]);

    useEffect(()=>{
    	console.log("HAY STORAGE", storage);
    }, [storage]);

    useEffect(()=>{
    	if(authStatus === "connected" && !first){
    		gapi.current = window.gapi;
	        //cargarPerfil();
	        dispatch(loadStorage());
	        //dispatch(getChanges());
	        //dispatch(getFilesList(files.token));
	        setFirst(true);
    	}
    }, [authStatus, dispatch, gapi]);


	function cargarPerfil(){

		let googleUser = gapi.current.auth2.getAuthInstance().currentUser.get()
		let expires = googleUser.getAuthResponse().expires_at;
		let perfil = googleUser.getBasicProfile();
		let data = {
			gUser: googleUser,
			username: perfil.getName(),
			imgUrl: perfil.getImageUrl(),
			isLogged: true
		}
		dispatch(setUser(data));
		setSessionExpires(parseFloat(((expires - Date.now())/60000).toFixed(1)));
	}

	function toHome(){
		console.log("placeholder");
	}

	console.log("REEEENDERRRR");

	if(storage && storage.usage){
		return (
			<StorageUsage usage={storage.usage} />
		)
	}
	else{
		return null;
	}


}

export default Dashboard;