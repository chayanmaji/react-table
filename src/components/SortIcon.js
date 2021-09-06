import React from 'react';
import { BiSortDown, BiSortUp } from "react-icons/bi";

const SortIcon = ({isSorted, isSortedDesc}) => {
    return (
        <span>{ isSorted? (isSortedDesc ? <BiSortDown/> : <BiSortUp/> ) : '' }</span>
    )
}

export default SortIcon;