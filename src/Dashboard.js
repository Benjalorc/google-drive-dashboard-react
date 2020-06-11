import React, { useRef, useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
	loadStorage,
	checkStatus,
	getChanges,
	getFilesList
} from "./redux/actions/index";
import './Dashboard.css';
import GeneralOverview from './components/GeneralOverview';
import StorageUsage from './components/StorageUsage';
import FilesLimits from './components/FilesLimits';
import RecentChanges from './components/RecentChanges';
import FilesCards from './components/FilesCards';
import SideNav from './components/SideNav';

function Dashboard(){

	let [first, setFirst] = useState(false);
	//let [sessionExpires, setSessionExpires] = useState(null);
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

    		history.push('/');
    	}
    }, [user.isLogged, first, dispatch, history]);
/*
    useEffect(()=>{

    	if(user && user.gUser){
    		let expires = user.gUser.getAuthResponse().expires_at;
    		setSessionExpires(parseFloat(((expires - Date.now())/60000).toFixed(1)));
    	}

    }, [user]);
*/
    function spinOff(){
		backdropLoading.current.classList.remove("loading");
		cornerLoading.current.classList.remove("loading");
    }

    function turnSpinCenter(){
		backdropLoading.current.classList.add("loading");
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