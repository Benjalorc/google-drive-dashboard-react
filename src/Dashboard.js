import React, { createRef, useRef, useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
	loadStorage,
	checkStatus,
	getChanges,
	getFilesList,
	logOut
} from "./redux/actions/index";
import './Dashboard.css';
import { Chart } from 'chart.js';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


function GeneralOverview(){

	const files = useSelector(state => state.files.list);

	return(

		<div className="row spacing-1">
		    <div className="col-12 col-sm-6 col-md-3">

		        <div className="card text-center border-info bg-light">
		            <a href="https://docs.google.com/documents/" target="_blank"><img className="card-img-top link" src="images/docs.png" alt="Card image cap" /></a>
		            <div className="card-body">
		                <p>Documentos</p>
		            </div>
		            <div className="card-footer border-info text-muted">
		                <h2>{files.docs.length}</h2>
		            </div>
		        </div>

		    </div>
		    <div className="col-12 col-sm-6 col-md-3">

		        <div className="card text-center border-success bg-light">
		            <a href="https://docs.google.com/spreadsheets/" target="_blank"><img className="card-img-top link" src="images/spreadsheets.png" alt="Card image cap" /></a>
		            <div className="card-body">
		                <p>Hojas de Cálculo</p>
		            </div>
		            <div className="card-footer border-success text-muted">
		                <h2>{files.sheets.length}</h2>
		            </div>
		        </div>

		    </div>
		    <div className="col-12 col-sm-6 col-md-3">

		        <div className="card text-center border-warning bg-light">
		            <a href="https://docs.google.com/presentation/" target="_blank"><img className="card-img-top link" src="images/slides.png" alt="Card image cap" /></a>
		            <div className="card-body">
		                <p>Presentaciones</p>
		            </div>
		            <div className="card-footer border-warning text-muted">
		                <h2>{files.presentations.length}</h2>
		            </div>
		        </div>

		    </div>
		    <div className="col-12 col-sm-6 col-md-3">

		        <div className="card text-center border-danger bg-light">
		            <a href="https://drive.google.com/" target="_blank"><img className="card-img-top link" src="images/drawings.png" alt="Card image cap" /></a>
		            <div className="card-body">
		                <p>Drawings</p>
		            </div>
		            <div className="card-footer border-danger text-muted">
		                <h2>{files.drawings.length}</h2>
		            </div>
		        </div>

		    </div>
		</div>
	)
}

function FilesRows({files, short, titulo}){

	if(short){

	    let arr = [0,1,2,3,4];
		return(
			arr.map((i)=>{
				let file = files[i];
				if(!file) return null;
				return(
					<tr key={`${titulo}-${i+1}`}>
						<th scope="row">{i+1}</th>
						<td>{file.name}</td>
						<td> <a href={file.webViewLink} target="_blank">Ver</a> </td>
						<td>{file.time.getDate()}-{file.time.getMonth()+1}-{file.time.getFullYear()}</td>
					</tr>
				)

			})
		)
	}
	else{

		return(
			files.map((file, i)=>{
				return(
					<tr key={`${titulo}-${i+1}`}>
						<th scope="row">{i+1}</th>
						<td>{file.name}</td>
						<td> <a href={file.webViewLink} target="_blank">Ver</a> </td>
						<td>{file.time.getDate()}-{file.time.getMonth()+1}-{file.time.getFullYear()}</td>
					</tr>
				)

			})
		)
	}
}

function FilesTable({files, titulo, tableClass="table-responsive", short = true}){


	if(!files || !files.length){

		return (
			<p className="card-text">No hay documentos que mostrar</p>
		)
	}
	else{

		return(
			<div className={tableClass}>

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
			        	<FilesRows files={files} short={short} titulo={titulo} />
			        </tbody>
		        </table>

		    </div>
		)

	}
}

function FilesModal({listado, titulo}){

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  if(listado.length <= 5){
  	return(
      <button type="button" className="btn btn-outline-light" disabled>
      	<i className="fa fa-folder-o"></i>
      </button>
  	)
  }
  else{

	  return (
	    <React.Fragment>
	      <button type="button" className="btn btn-outline-light" onClick={toggle}>
	      	<i className="fa fa-folder-open-o"></i> 
	      </button>

	      <Modal isOpen={modal} size="lg" toggle={toggle}>
	        <ModalHeader toggle={toggle}>
	        	{titulo}
	        </ModalHeader>
	        <ModalBody>
	        	<FilesTable files={listado} titulo={titulo} tableClass="table-responsive modal-table" short={false} />
	        </ModalBody>
	        <ModalFooter>
	          <button type="button" className="btn btn-outline-dark" onClick={toggle}>Cerrar</button>
	        </ModalFooter>
	      </Modal>
	    </React.Fragment>
	  )
  }

}

function FilesPerType({files, cardClass, headerClass, titulo}){

	//`<app-filemodal [listado]="files" [titulo]="titulo"></app-filemodal>`

	return(
		<React.Fragment>

		    <div className={cardClass}>
		        <div className={headerClass}>
		        	<FilesModal listado={files} titulo={titulo} />
		        	{titulo}
		        </div>
		        <div className="card-body">
		        	<FilesTable files={files} titulo={titulo} />
		        </div>
		    </div>
		</React.Fragment>
	)
}

function FilesCards({doneLoading}){

	const dispatch = useDispatch();
	const files = useSelector(state => state.files);

	useEffect(()=>{
		if(files.token && files.token !== ""){
			dispatch(getFilesList(files.token));
		}
		else if(files.token === false){
			doneLoading(true);
		}
	}, [files, dispatch])

	return(
		<React.Fragment>
		<div className="row spacing-1">
		    <div className="col-12 col-lg-6 spacing-2">
				<FilesPerType files={files.list.docs} cardClass="card border-primary bg-light mb-3" headerClass="card-header bg-primary text-white" titulo="Documentos" />
			</div>
			<div className="col-12 col-lg-6 spacing-2">
				<FilesPerType files={files.list.presentations} cardClass="card border-warning bg-light mb-3" headerClass="card-header bg-warning text-white" titulo="Presentaciones" />
			</div>
		</div>
		<div className="row spacing-1">
		    <div className="col-12 col-lg-6 spacing-2">
				<FilesPerType files={files.list.sheets} cardClass="card border-success bg-light mb-3" headerClass="card-header bg-success text-white" titulo="Hojas de Cálculo" />
			</div>
		    <div className="col-12 col-lg-6 spacing-2">
				<FilesPerType files={files.list.drawings} cardClass="card border-danger bg-light mb-3" headerClass="card-header bg-danger text-white" titulo="Drawings" />
			</div>
		</div>
		</React.Fragment>
	)
}

function StorageUsage(){

	const storage = useSelector(state => state.storage);

	const storageCanvas = useRef(null);
	const driveCanvas = useRef(null);
	const trashCanvas = useRef(null);

	let totalStorageChart = createRef(null);
	let driveStorageChart = createRef(null);
	let trashStorageChart = createRef(null);

    if(!storage || !storage.usage) return null;

    let usage = storage.usage;

	function drawStorageTotalChart(){

		if(!totalStorageChart.current && storageCanvas.current){

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

		if(!driveStorageChart.current && storageCanvas.current){

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

		if(!trashStorageChart.current && storageCanvas.current){

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

function FilesLimits(){

	const storage = useSelector(state => state.storage);

	return(

        <div className="card text-white bg-info mb-3">
            <div className="card-header">
                Límites de tamaño de archivos
            </div>
            <div className="card-body">

                <p> <strong>Subidas: </strong> {storage.uploads.maxUploadSize} TB</p>
                <p> <strong>Documentos importados: </strong> {storage.imports.document} MB</p>
                <p> <strong>Presentaciones importadas: </strong> {storage.imports.presentation} MB</p>
                <p> <strong>Hojas de Cálculo importadas: </strong> {storage.imports.spreadsheet} MB</p>
                <p> <strong>Drawings importados: </strong> {storage.imports.draw} MB</p>

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
		                        <tr key={`changes-${i+1}`}>
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

function SideNav({logginOut}){

	const user = useSelector(state => state.user);
	const mySidenav = useRef();
	const dispatch = useDispatch();

	if(!user || !user.gUser) return null;

	let profile = user.gUser.getBasicProfile();

	let usermail = profile.getEmail();
	let username = profile.getName();
	let userpic = profile.getImageUrl();

	function signOut(){
		logginOut();
		toggleMenu();
		dispatch(logOut());
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
			            <button type="button" className="btn btn-outline-danger" onClick={()=> signOut() }><i className="fa fa-sign-out"></i>Salir</button>
			        </div>

			    </div>

			</div>

			<div className="dash-backdrop" onClick={()=> toggleMenu() }></div>

			<div className="floating-special" onClick={()=> toggleMenu() }>
			    <img src={userpic} className="profilePic" alt="profile_pic" />
			</div>
		</React.Fragment>
	)
}

function Dashboard(){

	let [first, setFirst] = useState(false);
	let [sessionExpires, setSessionExpires] = useState(null);
	let backdropLoading = useRef(null);
	let cornerLoading = useRef(null);
	let history = useHistory();
	const dispatch = useDispatch();
	const user = useSelector(state => state.user);

    useEffect(()=>{
    	dispatch(checkStatus());
    }, [dispatch]);

    useEffect(()=>{

    	if(user.isLogged === true && !first){


			backdropLoading.current.classList.remove("loading");
			cornerLoading.current.classList.add("loading");
	        dispatch(loadStorage());
	        dispatch(getChanges());
	        dispatch(getFilesList(""));
	        setFirst(true);
    	}
    	else if(user.isLogged === false){

    		toHome();
    	}
    }, [user.isLogged, setFirst, dispatch]);

    useEffect(()=>{

    	if(user && user.gUser){
    		let expires = user.gUser.getAuthResponse().expires_at;
    		setSessionExpires(parseFloat(((expires - Date.now())/60000).toFixed(1)));
    	}

    }, [user]);

    function spinOff(){
		backdropLoading.current.classList.remove("loading");
		cornerLoading.current.classList.remove("loading");
    }

    function turnSpinCenter(){
		backdropLoading.current.classList.add("loading");
    }

	function toHome(){
		history.push('/');
	}

	return (
		<React.Fragment>
			<GeneralOverview />
			<StorageUsage />
			<div className="row spacing-1">
				<div className="col-12 col-md-4 spacing-2">
					<FilesLimits />
				</div>
				<div className="col-12 col-md-8 spacing-2">
					<RecentChanges />
				</div>
			</div>
			<FilesCards doneLoading={()=> spinOff() } />
			<SideNav logginOut={()=> turnSpinCenter()} />
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