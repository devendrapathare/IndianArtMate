import React, { useState } from 'react';
import './ThirdProductDes.css';

const ThirdProductDes = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const text = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt repellendus dignissimos deleniti sint rerum ratione unde error consequuntur, reiciendis inventore reprehenderit ipsa adipisci vel pariatur amet repellat voluptates doloribus quod architecto alias rem atque. Nulla exercitationem dolor a amet! Omnis, vitae. Quas ullam, quisquam quod quis accusamus, repellat tenetur consectetur quo fuga iusto odio debitis aut officiis officia quia. Minus delectus aperiam repellendus ab unde cum necessitatibus, veritatis ex deleniti consequatur nam eos, eius, explicabo libero dicta beatae nulla. Vero aut ullam natus ea consequatur dolores porro, et commodi quos fuga fugit tempora quis, autem perferendis quia ducimus nesciunt similique alias dolorum cum. Ex doloribus odit asperiores enim, obcaecati eveniet nostrum omnis, ea nemo unde harum repudiandae commodi quas minima fugit doloremque alias quis totam incidunt reprehenderit dolorem mollitia modi. Modi dignissimos nobis impedit tempore ipsum? Earum repudiandae cum aspernatur repellat commodi in temporibus excepturi saepe suscipit facere hic minus voluptas nobis culpa ex labore esse alias, fugiat unde explicabo. `;
    
    const maxLength = 300;

    return (
        <div className='ThirdProductDes-container'>
            <p>About this Art</p>
            <div className="add-dis">
                {isExpanded ? text : `${text.substring(0, maxLength)}...`}
            </div>
            <div className="toggle-button-container">
                <h3 className="toggle-button" onClick={toggleExpand}>
                    {isExpanded ? 'Read Less ▲' : 'Read More ▼'}
                </h3>
            </div>
        </div>
    );
}

export default ThirdProductDes;
