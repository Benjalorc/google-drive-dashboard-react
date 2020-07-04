import React from 'react';

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
						<td> <a href={file.webViewLink} target="_blank" rel="noopener noreferrer">Ver</a> </td>
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
						<td> <a href={file.webViewLink} target="_blank" rel="noopener noreferrer">Ver</a> </td>
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

export default FilesTable;