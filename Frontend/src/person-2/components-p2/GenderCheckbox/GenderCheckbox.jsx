import React from 'react'
import './GenderCheckbox.css'

const GenderCheckbox = ({ onCheckboxChange, selectedGender }) => {
    return (
        <div>
            <div className='flex'>
                <div className='form-control'>
                    <label className={`label ${selectedGender === "male" ? "selected" : ""}`}>
                        <span className='label-text'>Male</span>
                        <input
                            type="radio"
                            className='checkbox'
                            checked={selectedGender === "male"}
                            onChange={() => onCheckboxChange("male")}
                            required
                        />
                    </label>
                </div>
                <div className='form-control'>
                    <label className={`label ${selectedGender === "female" ? "selected" : ""}`}>
                        <span className='label-text'>Female</span>
                        <input
                            type="radio"
                            className='checkbox'
                            checked={selectedGender === "female"}
                            onChange={() => onCheckboxChange("female")}
                            required
                        />
                    </label>
                </div>
            </div>
        </div>
    )
}

export default GenderCheckbox
