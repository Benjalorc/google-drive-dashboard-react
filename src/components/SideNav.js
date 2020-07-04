import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from "../redux/actions/index";

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

export default SideNav;