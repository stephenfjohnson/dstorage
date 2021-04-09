import React from 'react';
import hospital from '../hospital.png';

const Navbar = ({ account }) => {
  return (
    <nav className="navbar navbar-dark bg-dark p-0 text-monospace">
      <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="/" target="_blank" rel="noopener noreferrer">
        <img src={hospital} width="30" height="30" className="align-top mr-2" alt="" />
        Hospital File
      </a>
      <ul className="navbar-nav px-3">
        <b className="text-white">{account}</b>
      </ul>
    </nav>
  );
};

export default Navbar;
