import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
// NB: load first using: npm install @tanstack/react-table


const Table = ({ data, columns }) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <table className="border-collapse border border-gray-400 w-full">
            <thead>
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <th key={header.id} className="border border-gray-400 px-4 py-2">
                            {header.column.columnDef.header}
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
                            {cell.renderValue()}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
};
