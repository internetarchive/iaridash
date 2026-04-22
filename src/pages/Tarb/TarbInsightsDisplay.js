import React from "react";
import Table from "../../components/Table";

export default function TarbInsightsDisplay({tarbData={}, options = null, onAction}) {

    const convertSummaryData = (rawData) => {

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

        const rows = Object.entries(rawData.summary_data).map(([key, value], index) => ({
            id: index + 1,
            DataType: key,
            DataVal: typeof value === 'number' ? value.toLocaleString() : value
        }));

        return {
            cols,
            rows
        };

    }


    if (!tarbData || typeof (tarbData) !== 'object' || !tarbData.summary_data) {
        return <div>
            <h1>iari/tarb_instights data</h1>
            <p>tarbData is not a valid object or missing summary_data.</p>
            <p>tarbData: {JSON.stringify(tarbData)}</p>
        </div>
    }


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

            {summary}

        </div>

    </div>
}
