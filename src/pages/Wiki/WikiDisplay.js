import React from "react";
import Table from "../../components/Table";

export default function WikiDisplay({wikiData={}, options = null, onAction}) {

    const convertTableData = (rawTableData) => {
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

        // Create columns from schema fields
        const cols = rawTableData.schema.fields.map(field => ({
            accessorKey: field.name,
            header: field.title.en,
            sortingFn: field.type === 'number' ? numericSortFunction : alphaSort
        }));

        // Create rows from raw data
        const rows = rawTableData.data.map((row, index) => {
            const rowObj = {};
            rawTableData.schema.fields.forEach((field, colIndex) => {
                rowObj[field.name] = field.type === 'number' ?
                    row[colIndex].toLocaleString() :
                    row[colIndex];
            });
            return rowObj;
        });

        return {
            cols,
            rows
        };
    }


    if (!wikiData || typeof(wikiData) !== 'object') {
        return <p>wikiData is not a valid object.</p>
    }

    if (!wikiData.schema) {
        return <p>wikiData is missing "schema".</p>
    }
    if (!wikiData.schema.fields) {
        return <p>wikiData is missing "schema.fields".</p>
    }
    if (!wikiData.data) {
        return <p>wikiData is missing "data".</p>
    }


    const tableData = convertTableData(wikiData)

    const summary = <div className="webrx-display-header iari-ux-header">
            {/*<WebRxSummary*/}
            {/*    tableSummary={tableSummary}*/}
            {/*    selectedTableId={selectedTableId}*/}
            {/*    onSelectionChange={handleSelectionChange}*/}
            {/*/>*/}
        </div>


    return <div className="wiki-display-container iari-ux-container">

        <div className="wiki-display-body iari-ux-body">

            {false && summary}

            <div className={"wiki-details-header iari-ux-header"}>
                <h3>Details for: {"Wiki external urls"}</h3>
            </div>

            <div className={"wiki-details-body iari-ux-body"}>
                <div className="wiki-table">
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
