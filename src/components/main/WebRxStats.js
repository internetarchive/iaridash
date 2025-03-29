import React from "react";
import RawJson from "../RawJson";
import Table  from "../Table"


export default function WebRxStats({webRxData={}, options = null, onAction}) {

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

    const transformTableData = (tableData) => {
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
            const t = {name: table.name}  // initialize temporary table object

            // get column names - data columns have keys "dX", where X is index of column
            t.cols = [{
                accessorKey: "id",
                header: "Site",
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


    const colsTotals = getColumnData(webRxData['table_totals']['column_names'], "Table Name")
    const dataTotals = getRowData(webRxData['table_totals']['tables'])
    const tables = transformTableData(webRxData['tables'])


    return <>

        <div className="row iari-table-display">
            <div className="col col-12">
                <h3>WebRx Statistics, All Wikis</h3>
                <div className="webrx-table">
                    <Table data={dataTotals} columns={colsTotals} />
                </div>
            </div>
        </div>


        {false && ( <>
            <h3>Transformed WebRx data</h3>
            <RawJson obj={tables}/>
        </>)}

        {tables.map( (table, i) => {
            return <div className="row iari-table-display" key={i}>
                <div className="col col-12">
                    <h3>{table.name}</h3>
                    <div className="webrx-table">
                        <Table data={table.rows} columns={table.cols} className={"stats-by-site"} />
                    </div>
                </div>
            </div>
        })}

    </>
}


