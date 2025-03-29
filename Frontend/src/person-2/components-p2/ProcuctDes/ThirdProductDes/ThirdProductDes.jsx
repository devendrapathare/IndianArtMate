import React, { useState } from 'react';
import './ThirdProductDes.css';

const ThirdProductDes = ({description}) => {
    // const [isExpanded, setIsExpanded] = useState(false);

    // const toggleExpand = () => {
    //     setIsExpanded(!isExpanded);
    // };

    
    // const maxLength = 300;

    return (
        <div className='ThirdProductDes-container'>
            <p>About this Art</p>
            <div className="add-dis">
                <p>{description}</p>
                {/* {isExpanded ? description : `${description.substring(0, maxLength)}...`} */}
            </div>
            {/* <div className="toggle-button-container">
                <h3 className="toggle-button" onClick={toggleExpand}>
                    {isExpanded ? 'Read Less ▲' : 'Read More ▼'}
                </h3>
            </div> */}
        </div>
    );
}

export default ThirdProductDes;
