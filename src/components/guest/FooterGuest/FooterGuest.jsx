import React from 'react'
import "./FooterGuest.css"
import Phone from '../../../assets/Footer/phoneFooter.png'
import location from '../../../assets/Footer/localtionFooterr.png'
import email from '../../../assets/Footer/email.png'
import Facebook from '../../../assets/Footer/Facebook.png'
import twi from '../../../assets/Footer/twi.png'
import youtube from '../../../assets/Footer/youtube.png'
import Line from '../../../assets/Footer/Line.png'
import Basket from '../../../assets/Footer/Basket.png'




function FooterGuest() {
  return (
    <div className='Footer-container'>
        <div className='container'>
            <div className='row'>
                <div className='col-12'>
                    <div className='Footer-input'>
                    <div className="bg-shadow">
        <span className="update-news">Cập nhật tin tức mới nhất</span>
        <input
      type="text"
      className="single-input"
      placeholder="Nhập email"
    />
        <button className="submit-btn">
          <span className="send">Gửi</span>
        </button>
      </div>
                    </div>
                    <div className='Footer-info'>
                      <div className='Footer-intro'>
                      <span className="Footer-protect-health">
          "Chúng tôi đồng hành cùng bạn trên hành trình bảo vệ sức khỏe cho con
          yêu. Mỗi mũi tiêm là một bước tiến nhỏ, nhưng đầy ý nghĩa, giúp con
          lớn lên khỏe mạnh và an toàn. Hãy để chúng tôi giúp bạn quản lý lịch
          tiêm một cách dễ dàng và hiệu quả. Liên hệ với chúng tôi nếu bạn cần
          hỗ trợ – sức khỏe của con, niềm vui của bạn!"
        </span>
        <div className='HomPage-Hotlinelink'>
<img src={Phone} className="Footer-iconPhone" />
        <span className="Footer-phone-number">0374277590</span>

        </div>
        
        <span className="Footer-text-6">Liên hệ 24/7</span>

                      </div>
                      <div className='Footer-location'>
                      <div className="Footer-box-6">
                          <div className="Footer-pic" />
                      </div>
                      <div className='Footer-location-flex'>
                        <div className='Footer-location-flex'>
                            <img src={location} className="Footer-iconPhone" />
                          <div className=''>
                            <div className='Footer-location-office'>Địa chỉ:</div>
                            <div className='Footer-location-9873'>Đại học FPT<br/>Quận 9</div>
                          </div>
                        </div>

                        <div className='Footer-location-flex'>
                            <img src={email} className="Footer-iconPhone" />
                          <div className=''>
                            <div className='Footer-location-office'>Email:</div>
                            <div className='Footer-location-9873'>Vaccinecare@gmail.com</div>
                          </div>
                        </div>


                      </div>
                      </div>

                    </div>


                  <div className='Footer-vector'></div>

                  <div className='Footer-iconContact'>
                     <img src={Facebook} className="Footer-iconPhone" />
                     <img src={twi} className="Footer-iconPhone" />
                     <img src={youtube} className="Footer-iconPhone" />
                     <img src={Line} className="Footer-iconPhone" />
                     <img src={Basket} className="Footer-iconPhone" />
                  </div>
                </div>
            </div>
        </div>

      
    </div>
  )
}

export default FooterGuest
