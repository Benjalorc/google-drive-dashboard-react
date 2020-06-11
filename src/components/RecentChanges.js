import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';

function ChangesTable({changes}){


	if(!changes || !changes.length){

		return(
			<p className="card-text">No hay cambios en archivos que mostrar</p>
		)
	}
	else{

		return (
            <div className="table-responsive">

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
                    {
                    	changes.map((file, i)=>{
                    		return(
		                        <tr key={`changes-${i+1}`}>
		                            <th scope="row">{i+1}</th>
		                            <td>{file.name}</td>
		                            <td> <a href={file.webViewLink} target="_blank" rel="noopener noreferrer">Ver</a> </td>
		                            <td>{file.time.getDate()}-{file.time.getMonth()+1}-{file.time.getFullYear()}</td>
		                        </tr>
                    		)
                    	})
                    }
                    </tbody>
                </table>

            </div>
		)
	}
}

function RecentChanges(){

	const changes = useSelector(state => state.changes);
	const [activeTab, setActiveTab] = useState('1');
	const toggle = tab => {
		if(activeTab !== tab) setActiveTab(tab);
	}


  	return (
		<div className="card border-warning bg-transparent">
			<div className="card-body">
		      <Nav tabs>
		        <NavItem>
		          <NavLink
		            className={ `${ activeTab === '1' ? 'active' : '' }` }
		            onClick={() => { toggle('1'); }}
		          >
		            Cambios recientes en archivos
		          </NavLink>
		        </NavItem>
		      </Nav>
		      <TabContent activeTab={activeTab}>
		        <TabPane tabId="1">
		          <div className="row">
		            <div className="col-12">
		            	<ChangesTable changes={changes.list}/>
		            </div>
		          </div>
		        </TabPane>
		      </TabContent>
			</div>
	    </div>
  	);
}

export default RecentChanges;