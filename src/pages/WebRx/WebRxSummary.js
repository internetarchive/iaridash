import React from "react";
// import RawJson from "../RawJson";
import Table from "../../components/Table"
import {isNullOrUndef} from "chart.js/helpers";


export default function WebRxSummary({
         tableSummary = {},
         options = null,
         onAction,
         selectedTableId = null,
         onSelectionChange = () => null
         }) {

    return <>
        <div className="row">
            <div className="col col-12">

                <div className={"webrx-table-wrapper"}> {/* this sets up flex container in ot's css */}

                    {/* TOEJAM <div className={"webrx-table-main webrx-display-container"}>*/}
                    <div className={"iari-ux-container"}>

                        <div className={"iari-ux-header"}>
                            <h3>All Wikis <span
                                style={{fontSize:"67%", fontStyle:"italic", color:"hsl(201deg 37% 49% / 96%)"}}
                            > &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Click on row to show expanded metric details<
                                /span></h3>
                        </div>

                        <div className={"iari-ux-body"}>
                            <div className="webrx-table webrx-summary-table">
                                <Table
                                    data={tableSummary.rows}
                                    columns={tableSummary.cols}
                                    onSelectionChange={onSelectionChange}
                                    sortable={false}
                                    selectedRowId={selectedTableId}
                                    // selectedRow={selectedRowRef.current}
                                />
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    </>
}


