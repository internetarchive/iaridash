import React from "react";
import Table from "../../components/Table";

export default function TarbInsightsDisplayRaw({tarbData={}, options = null, onAction}) {
// todo:
//    is it raw data or formatted sumamry data like iari?

    const convertTableData_raw = (rawData) => {
        const parseLocaleNumber = (value) => {
            if (typeof value !== "string") return value;
            // eslint-disable-next-line
            const normalized = value.replace(/[,\.]/g, match =>
                match === ',' ? '' : '.');
            return parseFloat(normalized);
        };

        const numericSortFunction = (rowA, rowB, columnId) => {
            const numA = parseLocaleNumber(rowA.getValue(columnId));
            const numB = parseLocaleNumber(rowB.getValue(columnId));
            return numA - numB;
        }

        const alphaSort = (rowA, rowB, columnId) => {
            const strA = String(rowA.getValue(columnId)).toLowerCase();
            const strB = String(rowB.getValue(columnId)).toLowerCase();
            return strA.localeCompare(strB);
        }

        const cols = [
            {accessorKey: "Wiki", header: "Wiki", sortingFn: alphaSort},
            {accessorKey: "Timestamp", header: "Timestamp", sortingFn: alphaSort},
            {accessorKey: "TotalEdits", header: "Total Edits", sortingFn: numericSortFunction},
            {accessorKey: "TotalLinks", header: "Total Links", sortingFn: numericSortFunction},
            {accessorKey: "ReactiveEdits", header: "Reactive Edits", sortingFn: numericSortFunction},
            {accessorKey: "ProactiveEdits", header: "Proactive Edits", sortingFn: numericSortFunction},
            {accessorKey: "DeadEdits", header: "Dead Edits", sortingFn: numericSortFunction},
            {accessorKey: "UnknownEdits", header: "Unknown Edits", sortingFn: numericSortFunction},
            {accessorKey: "LiveLinks", header: "Live Links", sortingFn: numericSortFunction},
            {accessorKey: "DeadLinks", header: "Dead Links", sortingFn: numericSortFunction},
            {accessorKey: "TagLinks", header: "Tag Links", sortingFn: numericSortFunction},
            {accessorKey: "UnknownLinks", header: "Unknown Links", sortingFn: numericSortFunction}
        ];

        const rows = rawData.statistics.map(record => {
            const rowObj = {...record};
            Object.keys(rowObj).forEach(key => {
                if (typeof rowObj[key] === 'number') {
                    rowObj[key] = rowObj[key].toLocaleString();
                }
            });
            return rowObj;
        });

        return {
            cols,
            rows
        };
    }
    const convertTableData = (rawData) => {
        return convertTableData_raw(rawData)
    }

    const convertSummaryData_raw = (rawData) => {
                    // const parseLocaleNumber = (value) => {
                    //     if (typeof value !== "string") return value;
                    //     // eslint-disable-next-line
                    //     const normalized = value.replace(/[,\.]/g, match =>
                    //         match === ',' ? '' : '.');
                    //     return parseFloat(normalized);
                    // };

                    // const numericSortFunction = (rowA, rowB, columnId) => {
                    //     const numA = parseLocaleNumber(rowA.getValue(columnId));
                    //     const numB = parseLocaleNumber(rowB.getValue(columnId));
                    //     return numA - numB;
                    // }

        const alphaSort = (rowA, rowB, columnId) => {
            const strA = String(rowA.getValue(columnId)).toLowerCase();
            const strB = String(rowB.getValue(columnId)).toLowerCase();
            return strA.localeCompare(strB);
        }

        const cols = [
            {accessorKey: "DataType", header: "Data Type", sortingFn: alphaSort},
            {accessorKey: "DataVal", header: "Value", sortingFn: alphaSort},
        ];

        const rows = [
            { id: 1, DataType: "Stat1", DataVal: 25 },
            { id: 2, DataType: "Stat2", DataVal: 50 },
            { id: 3, DataType: "Stat3", DataVal: 75 },
        ];

        return {
            cols,
            rows
        };
    }

    const convertSummaryData = (rawData) => {
        return convertSummaryData_raw(rawData)
    }


    // when in TEST mode with RAW data, tarbData.statistics must be available.
    if (!tarbData || typeof (tarbData) !== 'object' || !tarbData.statistics) {
        return <div>
            <h1>RAW data (test mode)</h1>
            <p>tarbData is not a valid object or missing statistics data.</p>

        </div>
    }


    const tableData = convertTableData(tarbData)
    const summaryData = convertSummaryData(tarbData)

    const summary = <div className="tarb-display-header iari-ux-header">

        <div className={"tarb-summary-header iari-ux-header"}>
            <h3>Details for: {"TARB Summary Data"}</h3>
        </div>

        <div className={"tarb-details-body iari-ux-body"}>
            <div className="tarb-table">
                <Table
                    data={summaryData.rows}
                    columns={summaryData.cols}
                    sortable={true}
                />
            </div>
        </div>

    </div>


    return <div className="tarb-display-container iari-ux-container">

        <div className="tarb-display-body iari-ux-body">

            {true && summary}

            <div className={"tarb-details-header iari-ux-header"}>
                <h3>Details for: {"TARB external urls"}</h3>
            </div>

            <div className={"tarb-details-body iari-ux-body"}>
                <div className="tarb-table">
                    <Table
                        data={tableData.rows}
                        columns={tableData.cols}
                        sortable={true}
                    />
                </div>
            </div>

        </div>

    </div>
}
