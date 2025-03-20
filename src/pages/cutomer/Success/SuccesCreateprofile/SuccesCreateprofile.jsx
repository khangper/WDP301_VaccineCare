import React from 'react'
import "./SuccesCreateprofile.css"
import { Link } from 'react-router-dom'
function SuccesCreateprofile() {
  return (
    <div className='SuccessRegis-container'>
      <div className='SuccessRegis-title'>Chúc mừng bạn đã tạo tài khoản cho bé thành công</div>
      <Link to='/'><div className='SuccessRegis-button'>
        Trang chủ
      </div></Link>
    </div>
  )
}

export default SuccesCreateprofile
