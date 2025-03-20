import React from 'react'
import "./SuccessRegis.css"
import { Link } from 'react-router-dom'
function SuccessRegis() {
  return (
    <div className='SuccessRegis-container'>
      <div className='SuccessRegis-title'>Chúc mừng bạn đã đăng ký tài khoản thành công</div>
      <Link to='/'><div className='SuccessRegis-button'>
        Trang chủ
      </div></Link>
    </div>
  )
}

export default SuccessRegis
