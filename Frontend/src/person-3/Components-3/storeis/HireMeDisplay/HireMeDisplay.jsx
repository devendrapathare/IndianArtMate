import React, { useContext, useEffect } from 'react';
import './HireMeDisplay.css';
import Hire_me from '../../Hire_me';
import { HireContext } from '../../../../person-2/context/HireContext/HIreContext';

const HireMeDisplay = () => {
  const { fetchHiring,fetchHiringData } = useContext(HireContext);

  // Map through fetchHiring and include _id
  const projectOwnerDetails = fetchHiring.map(item => {
    const owner = item.ProjectOwnerDetails[0];
    return owner ? { ...owner, _id: item._id, hiringState: item.hiringState } : null; // Include hiringState in the returned object
  }).filter(Boolean); // Filter out any null values

  // Filter out owners whose hiringState is "Accepted"
  const filteredOwners = projectOwnerDetails.filter(owner => owner.hiringState !== "Accepted");

  useEffect(() => {
    fetchHiringData()
}, [fetchHiringData])


  console.log("fetdhhd", fetchHiring);
  
  return (
    <div className="HireMeDisplay-container">
      <div>
        <h1>Hire me</h1>
      </div>
      <hr />
      <div>
        {filteredOwners.length > 0 ? (
          filteredOwners.map((owner) => (
            <Hire_me key={owner._id} hireId={owner._id} profilePic={owner.profilePic} userName={owner.userName} respectors={owner.respectors} />
          ))
        ) : (
          <div>You Dont Have any Hire Request Now.</div>
        )}
      </div>
    </div>
  );
}

export default HireMeDisplay;
