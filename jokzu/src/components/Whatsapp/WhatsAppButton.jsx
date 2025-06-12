import React from 'react';
import './WhatsAppButton.css';
import wtsp from '../../assets/img/wtsp.png';

const WhatsAppButton = () => {
    const handleSubmit = () => {
        window.location.href = 'https://wa.me/+212617468598';
    };

    return (
      
            <img className="whatsapp-btn" onClick={handleSubmit} src={wtsp} alt="WhatsApp" />
  
    );
};

export default WhatsAppButton;
