import React from 'react';
import BreadCrumb from 'Common/BreadCrumb';
import ProcessListView from './ProcessListView';
// import PermittedVehicleListView from './PermittedVehicleListView';

const Index = () => {
    return (
        <React.Fragment>
            <div className='container-fluid group-data-[content=boxed]:max-w-boxed mx-auto'>
                <BreadCrumb title='Entry Permission' pageTitle='Process Management'/>
                    <>
                        <ProcessListView />
                        {/* <PermittedVehicleListView /> */}
                    </>
              </div>
        </React.Fragment>
    )
}

export default Index;