import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import Header from './Header';
import './MainLayout.css';

import { BiCctv } from 'react-icons/bi';
import { BsQrCodeScan } from 'react-icons/bs';
import { FiGrid, FiArrowUp } from 'react-icons/fi';
import { GoPerson } from 'react-icons/go';
import { PiTreeDuotone } from 'react-icons/pi';
import { TbFolderCheck, TbPresentationAnalytics } from 'react-icons/tb';
import LogoImg from './assets/leaves.png';

export default function MainLayout() {

    const location = useLocation();
    const mainContentRef = useRef(null);
    const [showScrollBtn, setShowScrollBtn] = useState(false);

    useEffect(() => {
    const mainElement = mainContentRef.current;
    if (!mainElement) return;

    const handleScroll = () => {
      // 滚动超过 200px 时显示按钮，否则隐藏
      if (mainElement.scrollTop > 100) {
        setShowScrollBtn(true);
      } else {
        setShowScrollBtn(false);
      }
    };

    mainElement.addEventListener('scroll', handleScroll);
    return () => mainElement.removeEventListener('scroll', handleScroll);
  }, []);

    // 点击直达网页最顶部
    const scrollToTop = () => {
        if (mainContentRef.current) {
        mainContentRef.current.scrollTo({
            top: 0,
            behavior: 'smooth' // 如果想瞬移改为 'auto' 即可
        });
        }
    };

    const getHeaderTitle = () => {
        switch (location.pathname) {
            case '/dashboard':
                return 'Dashboard';
            case '/personnel':
                return 'User Management';
            case '/personnel/view':
                return 'Personnel Management / View Edit Personnel';
            case '/qr':
                return 'QR Generator';
            case '/Map':
                return 'Spatial Map';
            case '/Iot':
                return 'IOT Statistics';
            case '/BioRecords': //was /approvals, changed to /BioRecords to match the new route 
                return 'Bio Records';
            case '/Reports':
                return 'Reports';
            default:
                return 'NiahBio Hub';
        }
    }

    return (
        <div className="dashboard-layout-container">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="logo-icon-wrapper">
                        <img src={LogoImg} alt="NiahBio Logo" className="logo-img" />
                    </div>
                    <a href="/Dashboard" > 
                        <div className="logo-text">
                            <span className="brand-name">NiahBio</span>
                            <span className="brand-sub">Hub</span>
                        </div>
                    </a>
                    
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <FiGrid className="nav-icon" />
                        <span className="nav-label">Dashboard</span>
                    </NavLink>

                    <NavLink to="/BioRecords" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <TbFolderCheck className="nav-icon" />
                        <span className="nav-label">Bio Records</span>
                    </NavLink>

                    <NavLink to="/QRGenerator" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <BsQrCodeScan className="nav-icon" />
                        <span className="nav-label">QR Generator</span>
                    </NavLink>

                    <NavLink to="/Map" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <PiTreeDuotone className="nav-icon" />
                        <span className="nav-label">Spatial Map</span>
                    </NavLink>

                    <NavLink to="/Iot" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <BiCctv className="nav-icon" />
                        <span className="nav-label">IOT Statistics</span>
                    </NavLink>

                    <NavLink to="/Reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <TbPresentationAnalytics className="nav-icon" />
                        <span className="nav-label">Reports</span>
                    </NavLink>

                    <NavLink to="/personnel" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <GoPerson className="nav-icon" />
                        <span className="nav-label">User Management</span>
                    </NavLink>
                </nav>
            </aside>

            <main className="main-content-area" ref={mainContentRef}>
                <Header title={getHeaderTitle()}/>

                <div className="page-content-wrapper">
                    <Outlet /> 
                </div>

                {/* 🌟 使用 Tailwind CSS 打造的白色小球置顶按钮 */}
                {showScrollBtn && (
                <button
                    onClick={scrollToTop}
                    title="Back to top"
                    className="fixed bottom-10 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg border border-gray-100 transition-all duration-300 hover:bg-gray-50 hover:scale-110 active:scale-95 cursor-pointer"
                >
                    <FiArrowUp className="text-xl text-gray-800" />
                </button>
                )}

            </main>
        </div>
    );
}