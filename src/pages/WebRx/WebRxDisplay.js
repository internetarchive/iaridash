import React from "react";
import WebRxDetails from "./WebRxDetails";
import WebRxSummary from "./WebRxSummary";


export default function WebRxDisplay({webRxData={}, options = null, onAction}) {

    const [selectedTableId, setSelectedTableId] = React.useState(0)  // assume first row as default selection

    const handleSelectionChange = React.useCallback((selectedId) => {
        setSelectedTableId(selectedId); // Updates selection without unnecessary re-renders
        // selectedRowRef.current = selectedId;
        console.log(`Selected row changed to: ${selectedId}`)
    }, [])

    // // Data format for table data

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

        // return empty array if tableData is empty
        if (!tableData) return []

        // create table data for details
        return tableData.map((table, i) => {
            const t = {
                name: table.name,
                id: i
            }  // initialize new table object

            // get column names - data columns have keys "dX", where X is index of column
            t.cols = [{
                accessorKey: "id",
                header: "Wiki Site",
            }]

            table["column_names"].forEach((colName, i) => {
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
            t.rows = table["rows"].map((row, i) => {
                const r = {id: row["site"]}
                row.cols.forEach((d, i) => {
                    r[`d${i}`] = d.toLocaleString()
                })
                r.total = row["total"].toLocaleString()
                return r
            })

            return t  // to be added to tables array

        })
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

    console.log(`WebRxStats render, selectedTableId: ${selectedTableId}`)

    return <div className="webrx-display-container iari-ux-container">

        <div className="webrx-display-header iari-ux-header">
            <WebRxSummary
                tableSummary={tableSummary}
                selectedTableId={selectedTableId}
                onSelectionChange={handleSelectionChange}
            />
        </div>

        {/*{false && ( <>*/}
        {/*    <h3>Transformed WebRx data</h3>*/}
        {/*    <RawJson obj={tables}/>*/}
        {/*</>)}*/}

        <div className="webrx-display-body iari-ux-body">
            <WebRxDetails tables={tablesDetails} selectedTableId={selectedTableId} />
        </div>

    </div>
}
