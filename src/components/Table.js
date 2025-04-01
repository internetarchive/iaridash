import React from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table"
// NB: load first using: npm install @tanstack/react-table


const Table = React.memo(
    ({
         data,
         columns,
         onSelectionChange,
         sortable=true,
         selectedRowId = null,
         className = "",

     }) => {

    // const [sorting, setSorting] = React.useState([]);
    const [sorting, setSorting] = React.useState(sortable ? [
        {desc: true, id:"total"}
    ] : []);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
    })


    // // Efficiently update the selected row without causing a re-render
    // const handleSelect = React.useCallback(
    //     (rowId) => {
    //         selectedRowRef.current = rowId;
    //         onSelectionChange(rowId);
    //     },
    //     [onSelectionChange] // Only re-create if `onSelectionChange` changes
    // );

    const handleSelect = (rowId) => {
        if (typeof(onSelectionChange) === "function") {
            onSelectionChange(rowId)
        }
    }

    console.log(`render Table, selectedRowId = ${selectedRowId}`)


    return (
        <div className={`${className ? className : null}`}>
            <table className={"border-collapse border border-gray-400 w-full"}>
                <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>

                        {headerGroup.headers.map((header) => (
                            <th
                                key={header.id}
                                className={"border border-gray-400 px-3 py-2"}
                                style={ sortable ? {cursor: "pointer"} : null}
                                onClick={sortable ? header.column.getToggleSortingHandler() : null}
                            >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {header.column.getIsSorted() === "asc" ? " 🔼" : ""}
                                {header.column.getIsSorted() === "desc" ? " 🔽" : ""}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr
                        key={row.id}
                        onClick={() => handleSelect(row.id)}
                        // className = {selectedRowRef.current === row.id ? "table-row-selected" : ""}
                        className = {String(selectedRowId) === String(row.id) ? "table-row-selected" : ""}
                    >

                        {/* Data Columns */}
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="border border-gray-400 px-3 py-2">

                                {flexRender(cell.column.columnDef.cell, cell.getContext())}

                            </td>
                        ))}

                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}
)  // end of React.memo

export default Table