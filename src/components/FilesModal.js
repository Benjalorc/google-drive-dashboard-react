import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import FilesTable from './FilesTable';

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

export default FilesModal;