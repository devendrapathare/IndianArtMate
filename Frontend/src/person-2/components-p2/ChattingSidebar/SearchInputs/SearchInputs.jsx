import React from 'react'
import './SearchInputs.css'
import { FaSearch } from "react-icons/fa";


const SearchInputs = () => {
    return (
        <form className='SearchInputs-form'>
            <input type="text" placeholder='Search.....' className='SearchInputs-form-input'/>
            <button type='submit'>
                <FaSearch className='SearchInputs-form-Search-icon' />
            </button>

        </form>
    )
}

export default SearchInputs
