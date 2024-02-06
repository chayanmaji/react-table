import React, { useMemo } from 'react';
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from 'react-table';
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import SortIcon from './SortIcon';
import ColumnFilter from './ColumnFilter';
import './ReactTable.css';

const ReactTable = (props) => {
    let data = useMemo(() => props.data );
    let columns = useMemo(() => props.columns )
    const defaultColumn = useMemo(() => {
        return {
            Filter: ColumnFilter
        }
    }, [])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        previousPage,
        canPreviousPage,
        nextPage,
        canNextPage,
        pageOptions,
        gotoPage,
        pageCount,
        prepareRow,
        setPageSize,
        state
    } = useTable({
        columns,
        data,
        defaultColumn,
        initialState: { pageIndex: 0, pageSize: 25 }
    }, useFilters, useGlobalFilter, useSortBy, usePagination);

    const { pageIndex, pageSize } = state;

    return (
        <>
            <div>
                <span>
                    Page{' '}<strong>{pageIndex + 1} of {pageOptions.length}</strong>
                </span>
                    &nbsp;&nbsp;&nbsp;
                    <span>
                    | Go to page: {' '}
                    <input type='number' defaultValue={pageIndex + 1}
                        onChange={e => {
                            const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                            gotoPage(pageNumber);
                        }} style={{ width: '50px' }} />
                </span>
                    &nbsp;&nbsp;&nbsp;
                    <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
                    {
                        [25, 50, 100].map(pageSize => (
                            <option key={pageSize} value={pageSize}>Show { pageSize}</option>
                        ))
                    }
                </select>
                    &nbsp;&nbsp;&nbsp;
                    <Button variant="secondary" onClick={() => { gotoPage(0) }} disabled={!canPreviousPage}>First</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button variant="secondary" onClick={() => { previousPage() }} disabled={!canPreviousPage} >Previous</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button variant="secondary" onClick={() => { nextPage() }} disabled={!canNextPage}>Next</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button variant="secondary" onClick={() => { gotoPage(pageCount - 1) }} disabled={!canNextPage}>Last</Button>
            </div>
            <Table striped bordered hover {...getTableProps()} size="sm">
                <thead>
                    {// Loop over the header rows
                        headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {// Loop over the headers in each row
                                    headerGroup.headers.map(column => {
                                        const headerProps = column.getHeaderProps(column.getSortByToggleProps());
                                        const className = column.getHeaderProps({ className: column.className }).className;
                                        console.log('className', className);
                                        const { key, colSpan, role, title, onClick, style } = {...headerProps};
                                        return (
                                            <th key={key} colSpan={colSpan} role={role} className={className}> 
                                                {
                                                    onClick && (
                                                        <div onClick={(e) => { onClick(e) }} title={title} style={style}>
                                                            {column.render('Header')}
                                                            <SortIcon isSorted={column.isSorted} isSortedDesc={column.isSortedDesc} />
                                                        </div>
                                                    )
                                                }
                                                {
                                                    !onClick && (
                                                        <div>{column.render('Header')}</div>
                                                    )
                                                }
                                                <div>{column.canFilter ? column.render('Filter') : null}</div>
                                            </th>
                                        )
                                    })}
                            </tr>
                        ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {// Loop over the table rows
                        page.map(row => {
                            prepareRow(row)
                            return (
                                <tr {...row.getRowProps()}>
                                    {// Loop over the rows cells
                                        row.cells.map(cell => {
                                            // Apply the cell props
                                            return (
                                                <td {...cell.getCellProps({ className: cell.column.className })}>
                                                    {// Render the cell contents
                                                        cell.render('Cell')}
                                                </td>
                                            )
                                        })}
                                </tr>
                            )
                        })}
                </tbody>
            </Table>
        </>
    )
}

export default ReactTable;