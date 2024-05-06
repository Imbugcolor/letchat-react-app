import React, { useState } from "react";

const Password = () => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [verifyPassword, setVerifyPassword] = useState('')

    const [validatePasswordMsg, setValidatePasswordMsg] = useState('')

    const validate = () => {
        const msg = {}
        if(!currentPassword) {
            msg.current = "*Chưa nhập mật khẩu hiện tại "
        }

        if(!newPassword) {
            msg.new = "*Chưa nhập mật khẩu mới"
        } else if (newPassword === currentPassword) {
            msg.new = "*Không được trùng với mật khẩu hiện tại"
        } else if (newPassword.length < 6) {
            msg.new = '*Mật khẩu phải có độ dài tối thiểu 6 ký tự'
        } else if (newPassword.match(/^(?=.*\s)/)) {
            msg.new = '*Mật khẩu không được chứa khoảng cách'
        } else if (!newPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)) {
            msg.new = '*Mật khẩu phải chứa chữ cái in hoa, chữ cái thường và chữ số'
        }

        if(!verifyPassword) {
            msg.verify = "*Xác nhận mật khẩu là bắt buộc"
        } else if (verifyPassword !== newPassword) {
            msg.verify = "*Xác nhận mật khẩu không chính xác"
        }

        setValidatePasswordMsg(msg)
        if(Object.keys(msg).length > 0) return false
        return true
    }
    const handleChangePassword = () => {

    }
    
  return (
    <div className="col l-3 m-3 c-12 change-password">
      <div className="change-password-wrapper">
        <h4 className="change-password-heading">Password</h4>
        <div className="change-password-input-wrapper">
          <div className="password-input-item">
            <label htmlFor="user-current-password">Current password</label>
            <input
              type="password"
              id="user-current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <span style={{ color: "red", fontSize: "13px", display: "block" }}>
              {validatePasswordMsg.current}
            </span>
          </div>
          <div className="password-input-item">
            <label htmlFor="user-new-password">New password</label>
            <input
              type="password"
              id="user-new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span style={{ color: "red", fontSize: "13px", display: "block" }}>
              {validatePasswordMsg.new}
            </span>
          </div>
          <div className="password-input-item">
            <label htmlFor="user-verify-password">Confirm password</label>
            <input
              type="password"
              id="user-verify-password"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
            />
            <span style={{ color: "red", fontSize: "13px", display: "block" }}>
              {validatePasswordMsg.verify}
            </span>
          </div>
          <button
            className="change-password-btn"
            onClick={handleChangePassword}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Password;
