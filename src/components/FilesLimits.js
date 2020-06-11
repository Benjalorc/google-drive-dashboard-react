import React from 'react';
import { useSelector } from 'react-redux';

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

export default FilesLimits;