import React from 'react';
import logo from '../../assets/images/logo.svg';
import './MainFooterSection.css';

const MainFooterSection = () => {
  const footerColumns = [
    {
      title: 'Made with ❤️ by @ Ashutosh Koli',
      links: []
    },
    
    {
      title: 'Status',
      links: ['Documentation', 'Roadmap', 'Pricing']
    },
    {
      title: 'Discord',
      links: ['GitHub repository', 'Twitter', 'LinkedIn', 'OSS Friends']
    },
    {
      title: 'About',
      links: ['Contact', 'Terms of Service', 'PrivacyPolicy']
    }
  ];

  return (
    <footer className="mainFooter">
        <nav className="MainNav"></nav>
      <div className="mainFooter__container">
              <div className="MainNav__logo">
              <div><img src={logo} alt="Triangle" /></div> <div><h2>FormBot</h2></div>
              </div>
        {footerColumns.map((column, index) => (
          <div key={index} className="mainFooter__column">
            <h3 className="mainFooter__title">{column.title}</h3>
            {column.links.length > 0 && (
              <ul className="mainFooter__list">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="mainFooter__item">
                    <a href="#" className="mainFooter__link">{link}</a>
                
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <p>&copy; 2025 Ashutosh Koli. All rights reserved.</p>
    </footer>
  );
};

export default MainFooterSection;