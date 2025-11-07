
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
export default function Nav(){ const { user, logout } = useContext(AuthContext); const nav = useNavigate(); return (<nav className='bg-indigo-600 text-white py-3'><div className='container flex items-center justify-between'><div><Link to='/' className='font-semibold'>MERN Blog</Link></div><div className='flex items-center gap-3'>{user? (<><span className='text-sm'>Hello, {user.name}</span><button onClick={()=>{logout();nav('/')}} className='bg-indigo-800 px-3 py-1 rounded'>Logout</button></>): (<><Link to='/login' className='text-sm'>Login</Link><Link to='/register' className='text-sm'>Register</Link></>)}</div></div></nav>); }
