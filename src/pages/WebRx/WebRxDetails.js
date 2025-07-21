import React from "react";
// import RawJson from "../RawJson";
import Table from "../../components/Table"
import {isNullOrUndef} from "chart.js/helpers";


export default function WebRxDetails({tables={}, selectedTableId = null,  options = null, onAction}) {

    console.log(`WebRxDetails render, tables.length: ${Object.keys(tables).length}`)

    if (Object.keys(tables).length === 0) {
        return <div>tables.length is 0</div>
    }

    return <>
        <div>tables.length is {Object.keys(tables).length}, selectedTableId is: {selectedTableId}</div>

        <div className="row">
        {/*<div className="row iari-table-display">*/}
            <div className="col col-12">

                <div className={"webrx-details-section"}>

                    {tables.map( (table, i) => {

                        // skip all tables except that which matches selectedTableId
                        if (isNullOrUndef(selectedTableId) ||
                            (Number(table.id) !== Number(selectedTableId))) {
                            // return null
                            return <div>skipping table id {table.id}</div>
                        }

                        return (
                            <div className="row iari-table-display" key={i}>
                                <div className="col col-12">

                                    <div className={"webrx-table-wrapper"}>

                                        <div className={"webrx-table-main"}>

                                            <h3>Details for: {table.name}</h3>

                                            <div className="webrx-table">
                                                <Table
                                                    data={table.rows}
                                                    columns={table.cols}
                                                    sortable={true}
                                                />
                                            </div>

                                        </div>
                                        <div className={"webrx-table-shim"}>
                                            &nbsp; {/* provides shim so that out-of-table scrolling can occur */}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>


    </>
}


