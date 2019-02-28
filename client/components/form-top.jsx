import React from 'react';
import Stars from './stars.jsx';

const Header = (props) => (
  <div className='header'>
    <div><span className="price">${props.info.nightlyPrice}</span> per night</div>
    <div className='reviews'>
      <Stars stars={props.info.stars} /> {props.info.reviews}
    </div>
  </div>
)

export default Header;