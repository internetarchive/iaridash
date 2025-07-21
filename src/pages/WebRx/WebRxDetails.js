import React from "react";
// import RawJson from "../RawJson";
import Table from "../../components/Table"
import {isNullOrUndef} from "chart.js/helpers";


export default function WebRxDetails({tables={}, selectedTableId = null,  options = null, onAction}) {

    console.log(`WebRxDetails render, tables.length: ${Object.keys(tables).length}`)

    if (Object.keys(tables).length === 0) {
        return <div>WebRx details: no tables to show (tables.length is 0)</div>
    }

    const table = tables[selectedTableId];

    const extraInfo = false && <div>tables.length is {Object.keys(tables).length}, selectedTableId is: {selectedTableId}</div>

    const tableDisplay = isNullOrUndef(table)
        ? <div>No table data found for table index {selectedTableId}</div>
        : <div className={"webrx-details-container iari-ux-container"}>

                <div className={"webrx-details-header iari-ux-header"}>
                    <h3>Details for: {table.name}</h3>
                    {extraInfo}
                </div>

                <div className={"webrx-details-body iari-ux-body"}>
                    <div className="webrx-table">
                        <Table
                            data={table.rows}
                            columns={table.cols}
                            sortable={true}
                        />
                    </div>
                </div>

            </div>

    return <>
        {tableDisplay}
    </>
}


