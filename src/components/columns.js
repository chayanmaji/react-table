import {CountryFilter} from './ColumnFilter';


export const COLUMNS = [
    {
        Header: 'Id',
        accessor: 'id',
        disableFilters : true,
        className : 'column-id'
    },
    {
        Header : 'Edit',
        accessor : (originalRow , rowIndex )=>(<div>{rowIndex + 1}</div>),
        disableFilters : true,
        disableSortBy: true,
        className : 'column-edit'
    },
    {
        Header: 'First Name',
        accessor: 'first_name',
        className : 'column-fname'
    },
    {
        Header: 'Last Name',
        accessor: 'last_name',
        className : 'column-lname'
    },
    {
        Header: 'Email',
        accessor: 'email',
        className : 'column-email'
    },
    {
        Header: 'Country',
        accessor: 'country',
        Filter: CountryFilter,
        className : 'column-country'
    },
    {
        Header: 'Phone',
        accessor: 'phone',
        className : 'column-phone'
    },
    {
        Header: 'Address',
        disableFilters : true,
        accessor: ()=>(<div>Address</div>),
        disableSortBy: true
    }
]