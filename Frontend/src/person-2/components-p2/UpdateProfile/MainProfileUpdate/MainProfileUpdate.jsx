import React, { useState } from 'react';
import './MainProfileUpdate.css';

const MainProfileUpdate = () => {
  const [countries] = useState([
    { 
      name: 'India', 
      states: [
        { name: 'Delhi', cities: ['New Delhi', 'South Delhi', 'North Delhi'] },
        { name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur'] },
        { name: 'Karnataka', cities: ['Bengaluru', 'Mysuru', 'Hubli'] }
      ]
    },
    { 
      name: 'United States', 
      states: [
        { name: 'California', cities: ['Los Angeles', 'San Francisco', 'San Diego'] },
        { name: 'New York', cities: ['New York City', 'Buffalo', 'Rochester'] },
        { name: 'Texas', cities: ['Houston', 'Dallas', 'Austin'] }
      ]
    },
    { 
      name: 'Canada', 
      states: [
        { name: 'Ontario', cities: ['Toronto', 'Ottawa', 'Hamilton'] },
        { name: 'Quebec', cities: ['Montreal', 'Quebec City', 'Gatineau'] },
        { name: 'British Columbia', cities: ['Vancouver', 'Victoria', 'Kelowna'] }
      ]
    },
    { 
      name: 'United Kingdom', 
      states: [
        { name: 'England', cities: ['London', 'Manchester', 'Birmingham'] },
        { name: 'Scotland', cities: ['Edinburgh', 'Glasgow', 'Aberdeen'] },
        { name: 'Wales', cities: ['Cardiff', 'Swansea', 'Newport'] }
      ]
    },
    { 
      name: 'Australia', 
      states: [
        { name: 'New South Wales', cities: ['Sydney', 'Newcastle', 'Wollongong'] },
        { name: 'Victoria', cities: ['Melbourne', 'Geelong', 'Ballarat'] },
        { name: 'Queensland', cities: ['Brisbane', 'Gold Coast', 'Cairns'] }
      ]
    },
    { 
      name: 'Germany', 
      states: [
        { name: 'Berlin', cities: ['Berlin'] },
        { name: 'Bavaria', cities: ['Munich', 'Nuremberg', 'Augsburg'] },
        { name: 'Hesse', cities: ['Frankfurt', 'Wiesbaden', 'Kassel'] }
      ]
    },
    { 
      name: 'France', 
      states: [
        { name: 'Île-de-France', cities: ['Paris', 'Versailles', 'Boulogne-Billancourt'] },
        { name: 'Auvergne-Rhône-Alpes', cities: ['Lyon', 'Clermont-Ferrand', 'Grenoble'] },
        { name: 'Provence-Alpes-Côte d\'Azur', cities: ['Marseille', 'Nice', 'Toulon'] }
      ]
    },
  ]);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    const selectedCountryData = countries.find(c => c.name === country);
    if (selectedCountryData) {
      setStates(selectedCountryData.states);
    } else {
      setStates([]);
    }
    setSelectedState('');
    setCities([]);
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    const selectedStateData = states.find(s => s.name === state);
    if (selectedStateData) {
      setCities(selectedStateData.cities);
    } else {
      setCities([]);
    }
  };

  return (
    <div className='MainProfileUpdate-container'>
      <div className="MainProfileUpdate-header">
        Update Details Here
      </div>
      <form className='address-detail-container'>
        <div className="name-update">
          <span>Name:</span>
          <input type="text" placeholder='Enter New Name' />
        </div>

        <div className="bio-update">
          <span>Bio:</span>
          <textarea placeholder='Enter New Bio'></textarea>
        </div>

        <div className="update-profile-type">
          <span>Profile Type:</span>
          <select name="Profile Type" id="">
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>

        <div className="update-mobile-no">
          <span>Mobile No:</span>
          <input type="number" placeholder='Enter New Mobile No' />
        </div>

        <div className="update-gender">
          <span>Gender:</span>
          <select name="Gender" id="">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="update-address">
          <span>Address</span>
          <div className="address-differentiate">
            <div className="Address-line-one">
              <span>Address Line 1:</span>
              <input type="text" placeholder='Room No/House/Building/Apartment' />
            </div>
            <div className="Address-line-two">
              <span>Address Line 2:</span>
              <input type="text" placeholder='Street/Locality' />
            </div>
            <div className="address-country">
              <span>Country:</span>
              <select name="Country" id="" value={selectedCountry} onChange={handleCountryChange}>
                <option value="">Select a country</option>
                {countries.map((country, index) => (
                  <option key={index} value={country.name}>{country.name}</option>
                ))}
              </select>
            </div>
            <div className="address-state">
              <span>State:</span>
              <select name="State" id="" value={selectedState} onChange={handleStateChange}>
                <option value="">Select a state</option>
                {states.map((state, index) => (
                  <option key={index} value={state.name}>{state.name}</option>
                ))}
              </select>
            </div>
            <div className="address-city">
              <span>City:</span>
              <select name="City" id="">
                <option value="">Select a city</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <button>Update</button>
      </form>
    </div>
  );
};

export default MainProfileUpdate;
