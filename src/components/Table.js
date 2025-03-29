import React from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table"
// NB: load first using: npm install @tanstack/react-table


const Table = ({ data, columns, className = "" }) => {

    const [sorting, setSorting] = React.useState([]);

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

    //style={{ maxHeight: "300px", overflowY: "auto" }}
    return (
        <div
             className={`${className ? className : null}`}>
            <table className={"border-collapse border border-gray-400 w-full"}>
                <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th
                                key={header.id}
                                onClick={header.column.getToggleSortingHandler()}
                                style={{cursor: "pointer"}}
                                className="border border-gray-400 px-4 py-2">

                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {header.column.getIsSorted() === "asc" ? " 🔼" : ""}
                                {header.column.getIsSorted() === "desc" ? " 🔽" : ""}

                                {/*{header.column.columnDef.header}*/}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="border border-gray-400 px-4 py-2">

                                {flexRender(cell.column.columnDef.cell, cell.getContext())}

                                {/*{cell.renderValue()}*/}
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