import React from 'react'

import logo from '../assets/logo.svg'

export const NavBar = () => {
    return (
        <div className='flex flex-row justify-between items-center p-3 bg-[rgba(246,188,255,0.09)] shadow-md backdrop-blur-lg'>
            <img src={logo} className='w-10 h-10' />
            <h1 className='text-3xl font-black tracking-wider'>Breeth</h1>
            <h1>Breeth</h1>
        </div>
    )
}
