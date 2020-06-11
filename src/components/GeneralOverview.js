import React from 'react';
import { useSelector } from "react-redux";

let GeneralOverview = () => {

	const files = useSelector(state => state.files.list);

	return(

		<div className="row spacing-1">
		    <div className="col-12 col-sm-6 col-md-3">

		        <div className="card text-center border-info bg-light">
		            <a href="https://docs.google.com/documents/" target="_blank" rel="noopener noreferrer"><img className="card-img-top link" src="images/docs.png" alt="Google Docs" /></a>
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
		            <a href="https://docs.google.com/spreadsheets/" target="_blank" rel="noopener noreferrer"><img className="card-img-top link" src="images/spreadsheets.png" alt="Google Sheets" /></a>
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
		            <a href="https://docs.google.com/presentation/" target="_blank" rel="noopener noreferrer"><img className="card-img-top link" src="images/slides.png" alt="Google Presentations" /></a>
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
		            <a href="https://drive.google.com/" target="_blank" rel="noopener noreferrer"><img className="card-img-top link" src="images/drawings.png" alt="Google Drawings" /></a>
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

export default GeneralOverview;