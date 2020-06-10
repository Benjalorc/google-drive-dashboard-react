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
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';

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

function ChangesTable({changes}){


	if(!changes || !changes.length){

		return(
			<p className="card-text">No hay cambios en archivos que mostrar</p>
		)
	}
	else{

		return (
            <div className="table-responsive">

                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Ubicacion</th>
                            <th scope="col">Modificado</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                    	changes.map((file, i)=>{
                    		return(
		                        <tr>
		                            <th scope="row">{i+1}</th>
		                            <td>{file.name}</td>
		                            <td> <a href={file.webViewLink} target="_blank">Ver</a> </td>
		                            <td>{file.time.getDate()}-{file.time.getMonth()+1}-{file.time.getFullYear()}</td>
		                        </tr>
                    		)
                    	})
                    }
                    </tbody>
                </table>

            </div>
		)
	}
}

function RecentChanges(){

	const changes = useSelector(state => state.changes);

	console.log(changes);

	const [activeTab, setActiveTab] = useState('1');
	const toggle = tab => {
		if(activeTab !== tab) setActiveTab(tab);
	}


  	return (
		<div className="card border-warning bg-transparent">
			<div className="card-body">
		      <Nav tabs>
		        <NavItem>
		          <NavLink
		            className={ `${ activeTab === '1' ? 'active' : '' }` }
		            onClick={() => { toggle('1'); }}
		          >
		            Cambios recientes en archivos
		          </NavLink>
		        </NavItem>
		      </Nav>
		      <TabContent activeTab={activeTab}>
		        <TabPane tabId="1">
		          <div className="row">
		            <div className="col-12">
		            	<ChangesTable changes={changes.list}/>
		            </div>
		          </div>
		        </TabPane>
		      </TabContent>
			</div>
	    </div>
  	);
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
	        dispatch(getChanges());
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
			<RecentChanges />
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