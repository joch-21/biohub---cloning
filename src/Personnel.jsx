import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Personnel.css';

import { FiSearch, FiFileText, FiSlash, FiUserPlus, FiCamera, FiX } from 'react-icons/fi';

import AvatarImg from './assets/avatar.jpg';

export default function Personnel() {
  const navigate = useNavigate();

  const personnelData = [
    {
      id: 'SFC-EMP-001',
      name: 'Jack Ting Ting Jie',
      email: 'jacktingjie1085@gmail.com',
      role: 'Admin / System Manager',
      department: 'Software Design / Swinburne',
      status: 'Active',
      lastActive: '21 Sep 2026',
    },
    {
      id: 'SFC-EMP-002',
      name: 'Jack Ting Ting Jie',
      email: 'jacktingjie1085@gmail.com',
      role: 'Admin / System Manager',
      department: 'Software Design / Swinburne',
      status: 'Active',
      lastActive: '21 Sep 2026',
    },
    {
      id: 'SFC-EMP-003',
      name: 'Jack Ting Ting Jie',
      email: 'jacktingjie1085@gmail.com',
      role: 'Admin / System Manager',
      department: 'Software Design / Swinburne',
      status: 'Active',
      lastActive: '21 Sep 2026',
    },
    {
      id: 'SFC-EMP-004',
      name: 'Jack Ting Ting Jie',
      email: 'jacktingjie1085@gmail.com',
      role: 'Admin / System Manager',
      department: 'Software Design / Swinburne',
      status: 'Active',
      lastActive: '21 Sep 2026',
    },
    {
      id: 'SFC-EMP-005',
      name: 'Jack Ting Ting Jie',
      email: 'jacktingjie1085@gmail.com',
      role: 'Admin / System Manager',
      department: 'Software Design / Swinburne',
      status: 'Active',
      lastActive: '21 Sep 2026',
    },
    {
      id: 'SFC-EMP-006',
      name: 'Jack Ting Ting Jie',
      email: 'jacktingjie1085@gmail.com',
      role: 'Admin / System Manager',
      department: 'Software Design / Swinburne',
      status: 'Active',
      lastActive: '21 Sep 2026',
    },
    {
      id: 'SFC-EMP-007',
      name: 'Jack Ting Ting Jie',
      email: 'jacktingjie1085@gmail.com',
      role: 'Admin / System Manager',
      department: 'Software Design / Swinburne',
      status: 'Active',
      lastActive: '21 Sep 2026',
    },
    {
      id: 'SFC-EMP-008',
      name: 'Jack Ting Ting Jie',
      email: 'jacktingjie1085@gmail.com',
      role: 'Admin / System Manager',
      department: 'Software Design / Swinburne',
      status: 'Active',
      lastActive: '21 Sep 2026',
    },
    {
      id: 'SFC-EMP-008',
      name: 'Jack Ting Ting Jie',
      email: 'jacktingjie1085@gmail.com',
      role: 'Admin / System Manager',
      department: 'Software Design / Swinburne',
      status: 'Active',
      lastActive: '21 Sep 2026',
    },
    {
      id: 'SFC-EMP-008',
      name: 'Jack Ting Ting Jie',
      email: 'jacktingjie1085@gmail.com',
      role: 'Admin / System Manager',
      department: 'Software Design / Swinburne',
      status: 'Active',
      lastActive: '21 Sep 2026',
    },
    {
      id: 'SFC-EMP-008',
      name: 'Jack Ting Ting Jie',
      email: 'jacktingjie1085@gmail.com',
      role: 'Admin / System Manager',
      department: 'Software Design / Swinburne',
      status: 'Active',
      lastActive: '21 Sep 2026',
    },
    {
      id: 'SFC-EMP-008',
      name: 'Jack Ting Ting Jie',
      email: 'jacktingjie1085@gmail.com',
      role: 'Admin / System Manager',
      department: 'Software Design / Swinburne',
      status: 'Active',
      lastActive: '21 Sep 2026',
    },
    {
      id: 'SFC-EMP-008',
      name: 'Jack Ting Ting Jie',
      email: 'jacktingjie1085@gmail.com',
      role: 'Admin / System Manager',
      department: 'Software Design / Swinburne',
      status: 'Active',
      lastActive: '21 Sep 2026',
    },
    {
      id: 'SFC-BSS-000',
      name: 'Dr. Jordon Chua Hung Zhek',
      email: 'chuajordon@sarawakforestry.com',
      role: 'Admin / System Manager',
      department: 'PMO/BSA / Swinburne',
      status: 'Active',
      lastActive: '28 Sep 2026',
    },
    {
      id: 'SFC-BSS-001',
      name: 'Dr. Azeem Razeed Bin Razak',
      email: 'azeemrazak@sarawakforestry.com',
      role: 'Admin / System Manager',
      department: 'PMO / Swinburne',
      status: 'Active',
      lastActive: '28 Sep 2026',
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState('Admin');
  const tabs = ['Admin', 'Botanist', 'Guide', 'Visitor'];

  //Save Image Preview URL
  const [avatarPreview, setAvatarPreview] = useState(null);

  //hide file input
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 生成本地临时预览链接
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  // 点击相机按钮或占位框时，触发文件选择框
  const handleTriggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const  viewUser = () => {
    navigate('./personnel/view');
  }

  return (
    <div className="personnel-page-content">

      {/* 搜索与过滤区块 (Search Block) */}
      <div className="search-filter-container">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search ID, Name, Department..." 
            className="search-input"
          />
        </div>

        <div className="filter-dropdown-wrapper">
          <select className="filter-select">
            <option value="">Select Department / Unit</option>
            <option value="software">Software Design / Swinburne</option>
          </select>
        </div>

        <div className="filter-dropdown-wrapper">
          <select className="filter-select">
            <option value="">Select Status / Role</option>
            <option value="active">Active</option>
          </select>
        </div>

        <div className="result-count">
          Showing All Result (6)
        </div>
      </div>

      {/* 标签栏与添加人员按钮同行显示 */}
      <div className="action-bar-container">
        <div className="filter-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              /* 2. 动态判断当前 tab 是否等于选中的 activeTab，是则加上 'active' 类名 */
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              /* 3. 点击时将当前 tab 名称设为激活状态 */
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 添加人员按钮 */}
        <button className="add-personnel-btn" onClick={() => setIsModalOpen(true)}>
          <FiUserPlus className="add-icon" />
          <span>Add User</span>
        </button>
      </div>

      {/* 表格区块 (Table Block) */}
      <div className="personnel-table-container">
        <table className="personnel-table">
          <thead>
            <tr>
              <th>Personnel ID</th>
              <th>Photo</th>
              <th>Name & Email</th>
              <th>Role / Position</th>
              <th>Department / Unit</th>
              <th>Status</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {personnelData.map((item, index) => (
              <tr key={index}>
                <td className="font-semibold">{item.id}</td>
                <td>
                  <img src={AvatarImg} alt="Avatar" className="table-avatar" />
                </td>
                <td>
                  <div className="name-email-cell">
                    <span className="user-name">{item.name}</span>
                    <span className="user-email">{item.email}</span>
                  </div>
                </td>
                <td>{item.role}</td>
                <td>{item.department}</td>
                <td>
                  <span className="status-badge">{item.status}</span>
                </td>
                <td>{item.lastActive}</td>
                <td>
                  <div className="action-buttons">
                    <Link to="/personnel/view" className="action-btn green" title="Edit/View">
                      <FiFileText />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*Add New User Modal*/}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          {/* e.stopPropagation() 阻止点击弹窗内部时触发外部 overlay 的关闭逻辑 */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* 弹窗头部 */}
            <div className="modal-header">
              <h2>Add New User</h2>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <FiX />
              </button>
            </div>

            {/* 弹窗主体布局 */}
            <div className="modal-body">
              {/* 左侧头像上传占位 */}
              <div 
                className="avatar-upload-box" 
                onClick={handleTriggerUpload}
                style={{
                  backgroundImage: avatarPreview ? `url(${avatarPreview})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* 隐藏的真实 file input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />

                <button type="button" className="camera-btn">
                  <FiCamera />
                </button>
              </div>

              {/* 右侧表单输入区域 */}
              <div className="modal-form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="John" />
                </div>

                <div className="form-group">
                  <label>Identification Number (NRIC)</label>
                  <input type="text" placeholder="991231-13-9999" />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="John@sarawakforestry.my" />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" placeholder="+60 12 3456 7890" />
                </div>

                <div className="form-group full-width">
                  <label>Role</label>
                  <input type="text" placeholder="Conservationist" />
                </div>
              </div>
            </div>

            {/* 弹窗底部保存按钮 */}
            <div className="modal-footer">
              <button 
                type="button" 
                className="save-btn" 
                onClick={() => setIsModalOpen(false)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}