import { useState } from 'react';
import { Router, useRouter } from 'next/router'
import ns from '@/styles/Nav.module.css'

const Nav = (props) => {
    const router = useRouter();
    const handleClick = (e) =>{
        e.preventDefault()
        router.push(e.target.href)
    }
    return (
        <>
            <nav className={ns['nav']}>
                <ul>
                    <li><a href='/' onClick={handleClick}>Home</a></li>
                    <li><a href='/userinput' onClick={handleClick}>Input</a></li>
                </ul>
            </nav>
        </>
    );
}

export default Nav;