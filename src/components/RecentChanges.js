import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import FilesTable from './FilesTable';

function ChangesTable({changes}){


	if(!changes || !changes.length){

		return(
			<p className="card-text">No hay cambios en archivos que mostrar</p>
		)
	}
	else{

		return (
			<FilesTable files={changes} titulo="changes" />
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