import React, { createRef, useState } from 'react';
import './Inicio.css';

function Inicio(){

  let [isLogged, setLogged] = useState(false);
  let [loading, setLoading] = useState(false);
  let gapi = createRef(window.gapi);
  let gUser = createRef("");
  let username = createRef("");
  let imgUrl = createRef("");


function renderButton(){

  	setLoading(true);

  	//Inicializa un boton pre-configurado para permitir
  	//El inicio de sesion

  	let onSignIn = (googleUser)=> {

  		gUser.current = googleUser;
  		username.current = googleUser.getBasicProfile().getName();
  		imgUrl.current = googleUser.getBasicProfile().getImageUrl();
		setLogged(true);
		setLoading(false);
	}

	let onFailure = (err)=>{ 
		console.log(err);
		setLoading(false);
	}
	
  	gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 220,
        'height': 50,
        'longtitle': true,
        'theme': 'light',
        'onsuccess': onSignIn,
        'onfailure': onFailure
    });

    setTimeout(() =>{

		let element = document.querySelector("#my-signin2 > div");
		element.addEventListener("click", ()=>{
			setLoading(true);
		});
    },1000);
    setLoading(false);
}

function cambiarUsuario(){
	let element = document.querySelector("#my-signin2 > div");
	element.click()
}

function goDashboard(){
	console.log("placeholder");
}


  if(isLogged){

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
								<img className="card-img-top profilePic" src={imgUrl} onClick={()=> cambiarUsuario() } />
								<span className="overlay-switch" onClick={()=> cambiarUsuario() }><i className="fa fa-exchange" aria-hidden="true"></i></span>
							</div>
							<div className="col-3 col-md-4"></div>
							<div className="col-12">
								<h5 className="card-title">Bienvenido(a) {username}!</h5>
								<p className="card-text">Ya puede ingresar a su dashboard haciendo click en el botón a continuación.</p>
								<a className="btn btn-outline-success" onClick={()=> goDashboard() }>Continuar</a>
							</div>
						</div>
					</div>
					
					<div className="card-footer text-muted">
						<span className="wrongUserLink" onClick={()=> cambiarUsuario() }> ¿No eres {username}? </span> 
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

export default Inicio;