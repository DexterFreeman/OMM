import React from 'react'

const NavbarComponent = () => {
  return (
    <header className='nav-bar'>
        <h1 className='nav-bar__title'>
            Online Meeting Manager
        </h1>
        <a>Github</a>
        <a>Dissertation</a>
        <a className='nav-bar__about'>About me</a>
    </header>
  )
}

export default NavbarComponent