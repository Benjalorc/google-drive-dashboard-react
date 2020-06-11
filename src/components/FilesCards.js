import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFilesList } from "../redux/actions/index";
import FilesTable from './FilesTable';
import FilesModal from './FilesModal';

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
	}, [files, dispatch, doneLoading])

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

export default FilesCards;