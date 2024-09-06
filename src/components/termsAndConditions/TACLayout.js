import React from 'react'
import { NavLink } from 'react-router-dom';

function TACLayout() {
  return (
    <>
      <>
        <div className='d-flex-col justify-content-center'>
          <h2> Terms and Conditions of Starrik</h2>
          <div className='d-flex justify-content-around col-8 mx-auto my-4'>
            <NavLink to={"/terms-and-conditions/user"}> User Terms</NavLink>
            <NavLink to={"/terms-and-conditions/rider"}> Rider Terms</NavLink>
          </div>
        </div>
      </>
    </>
  );
}

export default TACLayout