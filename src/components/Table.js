import React from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table"
// NB: load first using: npm install @tanstack/react-table


const Table = ({ data, columns, sortable=true, onSelectionChange, className = "" }) => {

    const [sorting, setSorting] = React.useState([]);
    const [selectedRow, setSelectedRow] = React.useState(null);

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


    const handleSelect = (rowId) => {
        setSelectedRow(rowId);
        if (typeof onSelectionChange === 'function') {
            onSelectionChange(rowId);
        }
    };

    // const RadioButtonColumnHeader = <>
    //     {/* Radio Button Column */}
    //     <th
    //         key={"000"}
    //         className={"border border-gray-400 px-3 py-2"}
    //     >
    //         {/*{flexRender(header.column.columnDef.header, header.getContext())}*/}
    //         {/*{header.column.getIsSorted() === "asc" ? " 🔼" : ""}*/}
    //         {/*{header.column.getIsSorted() === "desc" ? " 🔽" : ""}*/}
    //
    //     </th>
    // </>
    //
    // const RadioButtonColumnData = <>
    //     {/* Radio Button Column */}
    //     <td>
    //         <input
    //             type="radio"
    //             name="selectedRow"
    //             checked={selectedRow === row.id}
    //             onChange={() => handleSelect(row.id)}
    //         />
    //     </td>
    // </>

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
                    <tr key={row.id} onClick={() => handleSelect(row.id)} >

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

export default Table