import React from 'react';
import { countries } from './Utility';

const ColumnFilter = ({ column }) => {
    const { filterValue, setFilter } = column;

    return (
        <span>
            <input value={filterValue || ''} onChange={(e)=>{ setFilter(e.target.value)}} />
        </span>
    )
}

export const CountryFilter = ({column}) => {
    const { filterValue, setFilter } = column;
    const sortedCountries = countries();

    return (
        <span>
            <select value={filterValue} onChange={(e)=>{ setFilter(e.target.value) }}>
                <option value=""></option>
                {
                    sortedCountries.map((country, index)=>{
                        return (<option key={index} value={country}>{country}</option>)
                    })
                }
            </select>
        </span>
    )
}

export default ColumnFilter;