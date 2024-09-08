import React, { useState } from 'react';
import './Story.css';
import { artistProfile } from '../../../assets/assets'; // Assuming artistProfile is an array of artist objects

const Strory = () => {
  const story = [
    'A traditional watercolor artist from Rajasthan discovered a passion for art while helping with mural paintings. Their vibrant and intricate patterns capture the essence of Rajasthani culture.',
    'An emerging artist from Delhi started with street art and murals, focusing on social issues to raise awareness through powerful visuals, transforming their neighborhood with inspirational art.',
    'Known for modern abstract sculptures, an artist combines classical techniques with contemporary designs. Their sculptures evoke deep emotions and challenge conventional art forms, exhibited in prestigious art fairs worldwide.',
    'A textile artist from Mumbai specializes in handwoven fabrics and intricate embroidery. Their unique approach revives traditional crafts with a fresh perspective, earning recognition in the world of textile arts.',
    'A painter from Varanasi captures the city’s spiritual and architectural beauty in stunning artworks. Their paintings of the ghats and temples pay tribute to the rich cultural heritage of their hometown.',
    'A ceramic artist from Jaipur creates handcrafted pottery inspired by traditional Indian motifs. Their elegant vases and intricate tiles reflect a deep appreciation for the art of ceramics and craftsmanship.',
    'A digital artist from Bangalore merges technology with traditional art forms to create captivating visual experiences. Their digital installations explore themes of identity and connection, pushing the boundaries of modern art.',
    'A mural artist from Chennai is known for large-scale public art projects that beautify urban spaces. Their vibrant murals feature nature and community life, transforming dull walls into colorful expressions of local culture.'
  ];

  // State to manage visibility
  const [isExpanded, setIsExpanded] = useState(false);

  // Story data based on whether all stories are visible
  const storyData = artistProfile.slice(0, 6).map((profile, index) => ({
    id: profile.id,
    img: profile.image,
    artistName: profile.name,
    storyText: story[index],
  }));

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className='Stories-section'>
        {storyData.slice(0, isExpanded ? storyData.length : 4).map((data) => (
          <div className="story-cards" key={data.id}>
            <div className="story-card">
              <div className="left-section">
                <img src={data.img} alt={`Story by ${data.artistName}`} />
              </div>
              <div className="right-section">
                <p><strong>{data.artistName}</strong></p>
                <p>{data.storyText}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="btn">
          <button onClick={handleToggle}>
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        </div>
      </div>
    </>
  );
}

export default Strory;
