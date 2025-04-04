const handleScrollToPosts = () => {
    setshowUploadPost(false);
    
    // Immediate UI feedback - scroll to where posts section should be
    window.scrollTo({
        top: document.querySelector('.profile-feed-section')?.offsetTop - 100 || window.scrollY + 300,
        behavior: 'smooth'
    });
    
    // Then ensure we find the actual element after state updates
    setTimeout(() => {
        const postsElement = document.getElementById('posts');
        if (postsElement) {
            postsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Make the posts section flash briefly to draw attention
            postsElement.style.backgroundColor = 'rgba(123, 157, 224, 0.2)';
            setTimeout(() => {
                postsElement.style.backgroundColor = '';
                postsElement.style.transition = 'background-color 0.5s ease';
            }, 800);
        }
    }, 300);
};

<button onClick={handleScrollToPosts} className="profileIcon-respect-button">Upload</button> 