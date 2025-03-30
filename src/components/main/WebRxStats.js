import React from "react";
// import RawJson from "../RawJson";
import Table  from "../Table"


export default function WebRxStats({webRxData={}, options = null, onAction}) {

    // const selectedRowRef = React.useRef(null);
    const [selectedRow, setSelectedRow] = React.useState(null);

    const handleSelectionChange = React.useCallback((selectedId) => {
        setSelectedRow(selectedId); // Updates selection without unnecessary re-renders
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

    const getTableTotals = (tableData = {}) => {
        const getColumnData = (dataColNames =[], idCaption = "ID") => {
            // define columns
            const cols = []
            cols.push({
                accessorKey: "id", header: idCaption
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
            cols: getColumnData(tableData['column_names'], "Table Name"),
            rows: getRowData(tableData['tables'])
        }

    }  // end getTableTotals


    const getTableDetails = (tableData) => {

        console.log("getting table details")

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

    const tableTotals = getTableTotals(webRxData['table_totals'])
    const tablesDetails = getTableDetails(webRxData['tables'])

    console.log(`re-rendering WebRxStats, selectedRow: ${selectedRow}`)

    return <>

        {/* Totals Table */}
        <div className="row iari-table-display">
            <div className="col col-12">
                <h3>Totals for All Wikis</h3>
                <div className="webrx-table">
                    <Table
                        data={tableTotals.rows}
                        columns={tableTotals.cols}
                        onSelectionChange={handleSelectionChange}
                        sortable={false}
                        selectedRow={selectedRow}
                        // selectedRow={selectedRowRef.current}
                    />
                </div>
            </div>
        </div>

        {/*{false && ( <>*/}
        {/*    <h3>Transformed WebRx data</h3>*/}
        {/*    <RawJson obj={tables}/>*/}
        {/*</>)}*/}

        {/* Details tables - show */}
        {tablesDetails.map( (table, i) => {
            if (Number(table.id) !== Number(selectedRow)) {  // NB != non-equate (vs. !== non-equate) to match number to string (4 == "4")
                return null
            }
            return (
                <div className="row iari-table-display" key={i}>
                    <div className="col col-12">
                        <div className={"webrx-table-wrapper"}>
                            <div className={"webrx-table-element webrx-table-main"}>
                                <h3>{table.name}</h3>
                                <div className="webrx-table">
                                    <Table
                                        data={table.rows}
                                        columns={table.cols}
                                        className={"stats-by-site"}
                                        sortable={true}
                                    />
                                </div>
                            </div>
                            <div className={"webrx-table-element webrx-table-filler"}>
                                &nbsp;
                            </div>
                        </div>
                    </div>
                </div>
            )
        })}

    </>
}


