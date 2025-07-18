import React from "react";
// import RawJson from "../RawJson";
import Table  from "../../components/Table"
import {isNullOrUndef} from "chart.js/helpers";


export default function WebRxStats({webRxData={}, options = null, onAction}) {

    //// const selectedRowRef = React.useRef(null);
    const [selectedRowId, setSelectedRowId] = React.useState(0)  // assume first row as default selection

    const handleSelectionChange = React.useCallback((selectedId) => {
        setSelectedRowId(selectedId); // Updates selection without unnecessary re-renders
        // selectedRowRef.current = selectedId;
        console.log(`Selected row changed to: ${selectedId}`)
    }, [])

    // // Sample Data

    // const columns = [
    //     { accessorKey: "id", header: "ID" },
    //     { accessorKey: "name", header: "Name" },
    //     { accessorKey: "age", header: "Age" },
    // ];

    // const data = [
    //     { id: 1, name: "Alice", age: 25 },
    //     { id: 2, name: "Bob", age: 30 },
    //     { id: 3, name: "Charlie", age: 35 },
    // ];

    const getSummaryTable = (tableData = {}) => {

        const getColumnData = (dataColNames =[]) => {
            // define columns
            const cols = []
            cols.push({
                accessorKey: "id", header: "Metric"
            })

            // add column names as columns with keys dX, where X is index of column
            dataColNames.forEach( (colName, i) => {
                cols.push({
                    accessorKey: `d${i}`, header: colName
                })
            })

            // add final "Total" column
            cols.push({
                accessorKey: "total", header: "Total"
            })

            return cols
        }

        const getRowData = (dataRows =[], idKey = "name", totalKey="total") => {
            // create row data for each array element of dataRows
            // assumes there is a "cols" array in each row of dataRows
            const rows = []
            dataRows.forEach( row => {
                const r = {
                    id: row[idKey],  // NB row.name should "match" the id column of column descriptor
                    total: row[totalKey].toLocaleString()
                }
                row.cols.forEach( (d,i) => {
                    r[`d${i}`] = d.toLocaleString()  // each column keyed as "dx", where x is index of column
                })

                rows.push(r)
            })

            return rows
        }

        return {
            cols: getColumnData(tableData['column_names']),
            rows: getRowData(tableData['tables'])
        }

    }  // end getTableTotals


    const getDetailTables = (tableData) => {

        console.log("getting tables details")

        const parseLocaleNumber = (value) => {
            if (typeof value !== "string") return value;

            // Handle different locale formats by removing grouping separators
            const normalized =
                value.replace(/,/g, "").replace(/\./g, ".")

            return parseFloat(normalized);
        };

        const mySortFunction = (rowA, rowB, columnId) => {
            const numA = parseLocaleNumber(rowA.getValue(columnId));
            const numB = parseLocaleNumber(rowB.getValue(columnId));
            return numA - numB;
        }

        // return empty array of tableData is empty
        if (!tableData) return []

        // create table data for details
        const tables = tableData.map( (table, i) => {
            const t = {
                name: table.name,
                id: i
            }  // initialize new table object

            // get column names - data columns have keys "dX", where X is index of column
            t.cols = [{
                accessorKey: "id",
                header: "Wiki Site",
            }]

            table["column_names"].forEach( (colName, i) => {
                t.cols.push({
                    accessorKey: `d${i}`,
                    header: colName,
                    sortingFn: mySortFunction
                })
            })

            t.cols.push({
                accessorKey: "total",
                header: "Total",
                sortingFn: mySortFunction
            })

            // add data rows to table; data columns keyed as "dX"
            t.rows = table["rows"].map( (row, i) => {
                const r = {id: row["site"]}
                row.cols.forEach( (d,i) => {
                    r[`d${i}`] = d.toLocaleString()
                })
                r.total =  row["total"].toLocaleString()
                return r
            })

            return t  // to be added to tables array

        })

        return tables
    }

    if (!webRxData || typeof(webRxData) !== 'object') {
        return <p>WebRx is not a valid object.</p>
    }
    if (!webRxData['table_totals']) {
        return <p>WebRx data is missing 'table_totals'.</p>
    }
    if (!webRxData['tables']) {
        return <p>WebRx data is missing 'tables'.</p>
    }

    const tableSummary = getSummaryTable(webRxData['table_totals'])
    const tablesDetails = getDetailTables(webRxData['tables'])

    console.log(`WebRxStats render, selectedRowId: ${selectedRowId}`)

    return <>

        {/* Totals Table */}
        <div className="row iari-table-display">
            <div className="col col-12">
                <div className={"webrx-table-wrapper"}>
                    <div className={"webrx-table-main"}>
                        <h3>WebRx Metrics, All Wikis <
                            span
                            style={{fontSize:"67%", fontStyle:"italic", color:"hsl(201deg 37% 49% / 96%)"}}
                        > &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Click on row to show expanded metric details<
                            /span></h3>
                        <div className="webrx-table webrx-summary-table">
                            <Table
                                data={tableSummary.rows}
                                columns={tableSummary.cols}
                                onSelectionChange={handleSelectionChange}
                                sortable={false}
                                selectedRowId={selectedRowId}
                                // selectedRow={selectedRowRef.current}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/*{false && ( <>*/}
        {/*    <h3>Transformed WebRx data</h3>*/}
        {/*    <RawJson obj={tables}/>*/}
        {/*</>)}*/}

        {/*webrx-details-table*/}

        {/* Details tables */}
        <div className="row iari-table-display">
            <div className="col col-12">
                <div className={"webrx-details-section"}>

                    {tablesDetails.map( (table, i) => {

                        // skip all tables except that which id matches selectedRowId
                        if (isNullOrUndef(selectedRowId) ||
                            (Number(table.id) !== Number(selectedRowId))) {
                            return null
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


