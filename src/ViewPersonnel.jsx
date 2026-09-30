import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCamera } from 'react-icons/fi';
import './ViewPersonnel.css';

import PersonnelImg from './assets/nooooo.gif';

export default function ViewPersonnel() {
  const navigate = useNavigate();

  const [avatarPreview, setAvatarPreview] = useState(PersonnelImg);
  const fileInputRef = useRef(null);

  // 模拟人员详细数据[cite: 3]
  const [formData, setFormData] = useState({
    fullName: 'John Doe Eod Nhoj',
    age: '33',
    nric: '950831-13-1235',
    email: 'John@sarawakforestry.my',
    phone: '0123456789',
    role: 'Conservationist',
    addedSince: '31 December 2026',
  });

  // 处理更换图片
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  // 触发文件选择框
  const handleTriggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 处理输入框变动
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 点击 Back 返回人员列表页[cite: 3]
  const handleBack = () => {
    navigate('/personnel');
  };

  // 保存处理
  const handleSave = (e) => {
    e.preventDefault();
    console.log('Saved Data:', formData);
    alert('User Information Updated Successfully!');
    navigate('/personnel');
  };

  return (
    <div className="view-personnel-container">
      <form onSubmit={handleSave} className="view-personnel-form">
        {/* 卡片白盒 */}
        <div className="details-card">
          <h2 className="card-title">Personal Details</h2>

          <div className="card-content-grid">
            {/* 左侧表单字段 */}
            <div className="left-form-fields">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                />
              </div>

              <div className="form-group">
                <label>Age</label>
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Your Age"
                />
              </div>
            </div>

            {/* 右侧头像展示/上传框 */}
            <div 
              className="avatar-preview-box"
              onClick={handleTriggerUpload}
              style={{
                backgroundImage: `url(${avatarPreview})`,
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

              <button type="button" className="avatar-camera-btn">
                <FiCamera />
              </button>
            </div>

            {/* 通栏：Identification Number (NRIC) OR Passport */}
            <div className="form-group full-width">
              <label>Identification Number (NRIC) OR Passport</label>
              <input
                type="text"
                name="nric"
                value={formData.nric}
                onChange={handleChange}
                placeholder="950831-13-1235"
              />
            </div>

            {/* 双列布局：Email Address & Phone Number */}
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="John@sarawakforestry.my"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0123456789"
              />
            </div>

            {/* 双列布局：Role & Added Since */}
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="Conservationist">Conservationist</option>
                <option value="Admin">Admin</option>
                <option value="Botanist">Botanist</option>
                <option value="Guide">Guide</option>
              </select>
            </div>

            <div className="form-group">
              <label>Added Since</label>
              <input
                type="text"
                name="addedSince"
                value={formData.addedSince}
                onChange={handleChange}
                placeholder="31 December 2026"
              />
            </div>
          </div>
        </div>

        {/* 底部按钮操作栏 */}
        <div className="form-actions-bar">
          <button type="button" className="btn-back" onClick={handleBack}>
            Back
          </button>
          <button type="submit" className="btn-save">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}