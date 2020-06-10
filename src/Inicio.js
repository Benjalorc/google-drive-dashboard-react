import React, { createRef, useState } from 'react';
import { Link } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import { setUser } from "./redux/actions/index";
import store from "./redux/store/index";
import './Inicio.css';

function mapToProps(dispatch) {
	return{
		setUser: user => dispatch(setUser(user))
	}
}

function Inicio(){

  let [loading, setLoading] = useState(true);
  let [renderSent, setRenderSent] = useState(false);
  let gapi = createRef(window.gapi);

  const user = useSelector(state => state.user);

function waitForGapi(){
	return new Promise((resolve, reject)=>{
		let interval = setInterval(check, 1000);
		function check(){
			if(window.gapi){
				gapi.current = window.gapi;
				clearInterval(interval);
				resolve(true);
			}
		}
	});
}

function renderButton(){

	if(renderSent) return false;

  	//Inicializa un boton pre-configurado para permitir
  	//El inicio de sesion

  	let onSignIn = (googleUser)=> {
		let perfil = googleUser.getBasicProfile();
		let data = {
			gUser: googleUser,
			username: perfil.getName(),
			imgUrl: perfil.getImageUrl(),
			isLogged: true
		}
		store.dispatch(setUser(data));
		setLoading(false);
	}

	let onFailure = (err)=>{ 
		console.log(err);
		setLoading(false);
	}
	
	gapi.current.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 220,
        'height': 50,
        'longtitle': true,
        'theme': 'light',
        'onsuccess': onSignIn,
        'onfailure': onFailure
    });

    let addEvent = ()=>{
	    setTimeout(() =>{

			let element = document.querySelector("#my-signin2 > div");
			if(element){
				element.addEventListener("click", ()=>{
					setLoading(true);
				});
			}
			else{
				addEvent();
			}
	    },1000);
    }
    addEvent();

	setRenderSent(true);
    //setLoading(false);
}

function cambiarUsuario(){
	let element = document.querySelector("#my-signin2 > div");
	element.click()
}

function goDashboard(){
	console.log("placeholder");
}

if(!gapi.current){
	waitForGapi().then(()=> renderButton());
}
else{
	renderButton();
}

  if(user && user.isLogged){

	  return (
		<div className="row login">
			<div className="col-12 col-md-3"></div>
			<div className="col-12 col-md-6">


				<div className="card bg-white text-center box-shadow-1">

					<div className="card-header">
						<span className="golden"> <i className="fa fa-key" aria-hidden="true"></i> </span>Acceso Autorizado
					</div>
					
					<div className="card-body">
						<div className="row">
							<div className="col">
								<div id="my-signin2"></div>
							</div>
						</div>

						<div className="row">

							<div className="col-3 col-md-4"></div>
							<div className="col-6 col-md-4 profilePic">
								<img className="card-img-top profilePic" alt="user" src={user.imgUrl} onClick={()=> cambiarUsuario() } />
								<span className="overlay-switch" onClick={()=> cambiarUsuario() }><i className="fa fa-exchange" aria-hidden="true"></i></span>
							</div>
							<div className="col-3 col-md-4"></div>
							<div className="col-12">
								<h5 className="card-title">Bienvenido(a) {user.username}!</h5>
								<p className="card-text">Ya puede ingresar a su dashboard haciendo click en el botón a continuación.</p>
								<Link to="/dashboard" className="btn btn-outline-success">Continuar</Link>
							</div>
						</div>
					</div>
					
					<div className="card-footer text-muted">
						<span className="wrongUserLink" onClick={()=> cambiarUsuario() }> ¿No eres {user.username}? </span>
					</div>
				
				</div>
			</div>
			<div className="col-12 col-md-3"></div>
		</div>
	  );

  }
  else{

	  return (
		<div className="row login">
			<div className="col-12 col-md-3"></div>
			<div className="col-12 col-md-6">

				<div className="card bg-white text-center box-shadow-1">

					<div className="card-header">

					</div>

					<div className="card-body">
						<div className="row">
							<div className="col">
								<div id="my-signin2"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="col-12 col-md-3"></div>
		</div>
	  );
  }

}

export default connect(mapToProps)(Inicio);