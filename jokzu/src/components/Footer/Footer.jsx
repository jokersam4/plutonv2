// src/components/Footer/Footer.js
import React, { useContext } from 'react';
import './Footer.css';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin  } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { MdMailOutline } from "react-icons/md";
const Footer = () => {
   const { user , language} = useContext(AuthContext);
  return (
    <footer className="footer">
      <div className="social-media">
        {/* <a href="https://www.facebook.com" className="social-media-icon" target="_blank" rel="noopener noreferrer">
          <FaFacebook />
        </a> */}
        {/* <a href="https://www.twitter.com" className="social-media-icon" target="_blank" rel="noopener noreferrer">
          <FaTwitter />
        </a> */}
        <a href="https://www.instagram.com/pluton_maroc/" className="social-media-icon" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
        { <a href="https://www.linkedin.com" className="social-media-icon" target="_blank" rel="noopener noreferrer">
         <MdMailOutline />
        </a> }
      </div>
      <p className="footer-text">
  &copy; 2025 Pluton  
  {language === 'en' 
    ? " All rights reserved." 
    : language === 'fr' 
    ? " Tous droits réservés." 
    : " جميع الحقوق محفوظة."}
</p>

    </footer>
  );
};

export default Footer;
