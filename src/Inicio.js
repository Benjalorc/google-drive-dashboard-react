import React, { createRef, useState } from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/actions/index";
import './Inicio.css';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from 'reactstrap';

const items = [
  {
    src: "images/slide-1-transparent.png",
    altText: 'Slide 1',
    caption: 'Acceso fácil a documentos'
  },
  {
    src: "images/slide-2-transparent.png",
    altText: 'Slide 2',
    caption: 'Prácticas estadísticas'
  },
  {
    src: "images/slide-3-transparent.png",
    altText: 'Slide 3',
    caption: 'Haga click para comenzar!'
  }
];

function CarouselPromo(){
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  }

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  }

  const slides = items.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.src}
      >
        <img src={item.src} alt={item.altText} />
        <CarouselCaption captionHeader={item.caption} />
      </CarouselItem>
    );
  });

  return (
    <Carousel
      activeIndex={activeIndex}
      next={next}
      previous={previous}
    >
      <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
      {slides}
      <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
      <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
    </Carousel>
  );
}

function UserRow({user, cambiarUsuario}){
	if(!user || !user.isLogged) return null
	return(
		<div className="row">

			<div className="col-3 col-md-4"></div>
			<div className="col-6 col-md-4 profilePic">
				<img className="card-img-top profilePic" alt="user" src={user.imgUrl} onClick={cambiarUsuario} />
				<span className="overlay-switch" onClick={cambiarUsuario}><i className="fa fa-exchange" aria-hidden="true"></i></span>
			</div>
			<div className="col-3 col-md-4"></div>
			<div className="col-12">
				<h5 className="card-title">Bienvenido(a) {user.username}!</h5>
				<p className="card-text">Ya puede ingresar a su dashboard haciendo click en el botón a continuación.</p>
				<Link to="/dashboard" className="btn btn-outline-success">Continuar</Link>
			</div>
		</div>
	)
}

function UserFoot({user, cambiarUsuario}){
	if(!user || !user.isLogged) return null
	return(
		<div className="card-footer text-muted">
			<span className="wrongUserLink" onClick={cambiarUsuario}> ¿No eres {user.username}? </span>
		</div>
	)
}

function Inicio(){

  let [loading, setLoading] = useState(true);
  let [renderSent, setRenderSent] = useState(false);
  let gapi = createRef(window.gapi);
  const dispatch = useDispatch();

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
		dispatch(setUser(data));
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
    setLoading(false);
}

	function cambiarUsuario(){
		let element = document.querySelector("#my-signin2 > div");
		element.click()
	}

	if(!gapi.current){
		waitForGapi().then(()=> renderButton());
	}
	else{
		renderButton();
	}

	return (
		<div className="row login">
			<div className="col-12 col-md-3"></div>
			<div className="col-12 col-md-6">

				<div className="card bg-white text-center box-shadow-1">

					<div className="card-header">
						<CarouselPromo />
						{
							user.isLogged ? <span><span className="golden"> <i className="fa fa-key" aria-hidden="true"></i> </span>Acceso Autorizado</span> : null
						}
					</div>
					
					<div className="card-body">
						<div className="row">
							<div className="col">
								<div id="my-signin2"></div>
							</div>
						</div>
						<UserRow user={user} cambiarUsuario={cambiarUsuario} />

					</div>

					<UserFoot user={user} cambiarUsuario={cambiarUsuario} />

					{loading ? <div className="backdropLogin"><i className="fa fa-spinner fa-spin"></i></div> : null}
				</div>
			</div>
			<div className="col-12 col-md-3"></div>
		</div>
	);

}

export default Inicio;