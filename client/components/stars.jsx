import React from 'react';
// Displays stars based on the provided rating. Displays a total of 5 stars (full, half-full, empty)
const Stars = ({stars}) => {
    var starArr = [];
    var remainder = stars % 1;
    // Adds filled-in stars 
    for (var i = 0; i < Math.floor(stars); i++) {
        starArr.push(<span key={i}><i className="fas fa-star"></i></span>);
    }
    // Adds a full star or a half-star when applicable
    if (remainder > 0.75) {
        starArr.push(<span key={Math.floor(stars)}><i className="fas fa-star"></i></span>);
        stars++;
    } else if (remainder >= 0.25 && remainder <= 0.75) {
        starArr.push(<span key={Math.floor(stars)}><i className="fas fa-star-half-alt"></i></span>);
        stars++;
    }   
    // Adds an empty star 
    for (var j = Math.floor(stars); j < 5; j++) {
        starArr.push(<span key={j}><i className="far fa-star"></i></span>)
    }
    
    return (
        <div>{starArr}</div>
    )
}

export default Stars;
