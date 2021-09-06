import React, { useMemo } from 'react';
import Data from './Data.json';
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from 'react-table';
import { COLUMNS } from './columns';
import Table from 'react-bootstrap/Table';
import SortIcon from './SortIcon';
import GlobalFilter from './GlobalFilter';
import ColumnFilter from './ColumnFilter';

const ReactTable = () => {

    const columns = useMemo(() => COLUMNS, []);
    const data = useMemo(() => Data, []);
    const defaultColumn = useMemo(()=>{
        return {
            Filter : ColumnFilter
        }
    }, [])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
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
        state,
        setGlobalFilter
    } = useTable({
        columns,
        data,
        defaultColumn,
        initialState: { pageIndex : 0, pageSize : 25 }
    }, useFilters, useGlobalFilter, useSortBy, usePagination);

    const { globalFilter, pageIndex, pageSize } = state;

    return (
        <div>
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
                         }} style={{width:'50px'}}/>
                </span>
                &nbsp;&nbsp;&nbsp;
                <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
                    {
                        [25,50,100].map(pageSize => (
                            <option key={pageSize} value={pageSize}>Show { pageSize }</option>
                        ))
                    }
                </select>
                &nbsp;&nbsp;&nbsp;
                <button onClick={()=>{ gotoPage(0) }} disabled={!canPreviousPage}>First</button>
                &nbsp;&nbsp;&nbsp;
                <button onClick={()=>{ previousPage() }} disabled={!canPreviousPage} >Previous</button>
                &nbsp;&nbsp;&nbsp;
                <button onClick={()=>{ nextPage() }} disabled={!canNextPage}>Next</button>
                &nbsp;&nbsp;&nbsp;
                <button onClick={()=>{ gotoPage(pageCount - 1) }} disabled={!canNextPage}>Last</button>
            </div>
            {/* <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} /> */}
            <Table striped bordered hover {...getTableProps()} size="sm">
                <thead>
                    {// Loop over the header rows
                        headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {// Loop over the headers in each row
                                    headerGroup.headers.map(column => {
                                        const { key, colSpan, role, title, onClick, style } = { ...column.getHeaderProps(column.getSortByToggleProps()) };
                                        return (
                                            <th key={key} colSpan={colSpan} role={role}>
                                                <div onClick={(e)=>{ onClick(e) }} title={title} style={style}>
                                                    {column.render('Header')}
                                                    <SortIcon isSorted={column.isSorted} isSortedDesc={column.isSortedDesc} />
                                                </div>
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
                                                <td {...cell.getCellProps()}>
                                                    {// Render the cell contents
                                                        cell.render('Cell')}
                                                </td>
                                            )
                                        })}
                                </tr>
                            )
                        })}
                </tbody>
                <thead>
                    {
                        footerGroups.map(footerGroup => (
                            <tr {...footerGroup.getFooterGroupProps()}>
                                {
                                    footerGroup.headers.map(column => (
                                        <th {...column.getFooterProps()}>
                                            { column.render('Footer')}
                                        </th>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </thead>
            </Table>
        </div>
    )

}

export default ReactTable;