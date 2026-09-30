import React, { useState, useEffect, useRef } from 'react';
import { MdSupervisedUserCircle } from "react-icons/md";
import { IoLogOutSharp } from "react-icons/io5";
import AvatarImg from './assets/avatar.jpg';
import { useNavigate } from 'react-router-dom';
import './Header.css';

import {MdPostAdd } from "react-icons/md";

export default function Header({ title }){
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
    navigate('/login');
  };

    useEffect(() => {
        function handleClickOutside(event) {
            if(dropdownRef.current && !dropdownRef.current.contains(event.target)){
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    return(
        <header className="top-header">
            <div className="header-title">
                <h1>{title}</h1>
            </div>

            {/* 用户区域容器，加上相对定位 */}
            <div className="header-profile" ref={dropdownRef}>
                {/* 点击头像切换状态 */}
                <img 
                    src={AvatarImg} 
                    alt="User Avatar" 
                    className="avatar-img" 
                    onClick={() => setIsOpen(!isOpen)}
                />

                {/* 弹窗主体：根据 isOpen 状态条件渲染 */}
                {isOpen && (
                    <div className="profile-dropdown-box">
                        <div className="profile-user-info">
                            <img src={AvatarImg} alt="avatar" className="dropdown-avatar" />
                            <div>
                                <div className="dropdown-name">Jack Ting</div>
                                <div className="dropdown-handle">@jackting5688</div>
                            </div>
                        </div>
                        
                        <div className="dropdown-link">
                            View your account
                        </div>
                        
                        <hr className="dropdown-divider" />
                        
                        <div className="dropdown-menu-item">
                            <MdSupervisedUserCircle className='dropdown-icon'/>
                            <span>Change Account</span>
                        </div>
                        <div className="dropdown-menu-item" onClick={handleLogout}>
                            <IoLogOutSharp className='dropdown-icon'/>
                            <span>Logout</span>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}