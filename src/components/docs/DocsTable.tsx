import type { ReactNode } from 'react'

export type DocsTableColumn<Row> = {
    key: string
    header: ReactNode
    headerClassName?: string
    cellClassName?: string
    render: (row: Row) => ReactNode
}

type DocsTableProps<Row> = {
    columns: DocsTableColumn<Row>[]
    rows: Row[]
    rowKey?: (row: Row, index: number) => string
    wrapperClassName?: string
    tableClassName?: string
}

export function DocsTable<Row>({
    columns,
    rows,
    rowKey,
    wrapperClassName = 'overflow-x-auto',
    tableClassName = 'table w-full',
}: DocsTableProps<Row>) {
    return (
        <div className={wrapperClassName}>
            <table className={tableClassName}>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key} className={column.headerClassName}>
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowKey ? rowKey(row, rowIndex) : rowIndex}>
                            {columns.map((column) => (
                                <td key={column.key} className={column.cellClassName}>
                                    {column.render(row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}