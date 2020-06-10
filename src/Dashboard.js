import React, { createRef, useRef, useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
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

function StorageUsage(){

	const storage = useSelector(state => state.storage);
    useEffect(()=>{
		console.log(storage);
    }, [storage]);

	const storageCanvas = useRef(null);
	const driveCanvas = useRef(null);
	const trashCanvas = useRef(null);

	let totalStorageChart = createRef(null);
	let driveStorageChart = createRef(null);
	let trashStorageChart = createRef(null);

    if(!storage || !storage.usage) return null;

    let usage = storage.usage;

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
		drawStorageTotalChart();
		drawStorageDriveChart();
		drawStorageTrashChart();
	}, 1000);

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

function SideNav(){

	const user = useSelector(state => state.user);
	const mySidenav = useRef();
	let history = useHistory();

	if(!user || !user.gUser) return null;

	let profile = user.gUser.getBasicProfile();

	let usermail = profile.getEmail();
	let username = profile.getName();
	let userpic = profile.getImageUrl();

	function toHome(){
		toggleMenu();
		history.push('/');
	}

	function toggleMenu(){
		if(mySidenav.current.classList.contains("open")){
			mySidenav.current.classList.remove("open");
		}
		else{
			mySidenav.current.classList.add("open");
		}
	}

	return(

		<React.Fragment>
			<div className="sidenav" ref={mySidenav} id="mySidenav">

			    <div className="card bg-light">

			        <div className="card-header">
			            <i className="fa fa-user-circle-o"></i> Usuario
			        </div>

			        <div className="card-body">
			            <p className="card-text"><i className="fa fa-address-card-o"></i> Nombre:</p>
			            <p>{username}</p>
			            <p className="card-text"><i className="fa fa-envelope-open-o"></i> E-mail:</p>
			            <p>{usermail}</p>
			        </div>

			        <div className="card-footer text-muted">
			            <button type="button" className="btn btn-outline-danger" onClick={()=> toHome() }><i className="fa fa-sign-out"></i>Salir</button>
			        </div>

			    </div>

			</div>

			<div className="dash-backdrop" onClick={()=> toggleMenu() }></div>

			<div className="floating-special" onClick={()=> toggleMenu() }>
			    <img src={userpic} className="profilePic" />
			</div>
		</React.Fragment>
	)
}

function Dashboard(){

	let [first, setFirst] = useState(false);
	let [loading, setLoading] = useState(true);
	let [sessionExpires, setSessionExpires] = useState(null);
	let backdropLoading = useRef(null);
	let cornerLoading = useRef(null);
	let gapi = createRef();

	const dispatch = useDispatch();
	//const user = useSelector(state => state.user);
	//const changes = useSelector(state => state.changes);
	//const files = useSelector(state => state.files);
	const authStatus = useSelector(state => state.status);

    useEffect(()=>{
    	dispatch(checkStatus());
    }, [dispatch]);

    useEffect(()=>{
    	if(authStatus === "connected" && !first){

			backdropLoading.current.classList.remove("loading");
			cornerLoading.current.classList.add("loading");
    		gapi.current = window.gapi;
	        cargarPerfil();
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

	return (
		<React.Fragment>
			<StorageUsage />
			<SideNav />
			<React.Fragment>
				<div ref={cornerLoading} className="loadingCorner">
				    <i className="fa fa-spinner fa-spin"></i>
				</div>
				<div ref={backdropLoading} className="dash-backdrop bd-2 loading"></div>
				<i className="fa fa-spinner fa-spin"></i>
			</React.Fragment>
		</React.Fragment>
	)

}

export default Dashboard;