import React, { useState } from 'react'
import "./AboutPage.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import step1Image from '../../../../src/assets/Aboutus/Step1.png';
import step2Image from '../../../../src/assets/Aboutus/Step2.png';
import step3Image from '../../../../src/assets/Aboutus/Step3.png';
import step4Image from '../../../../src/assets/Aboutus/Step4.png';
import Aboutintro from '../../../../src/assets/Aboutus/intro.png';
import { Link } from 'react-router-dom';




function AboutPage() {

     

  return (
    <div className='HomePage-Allcontainer'>

        {/* Đặt Lịch */}
        <div className='BookingPage-container'>
            <div className='container'>
                <div className='row'>
                    {/* <div className='col-12'>
                        <div className='AboutusPage-Title'>1. Tổng Quan Về Hệ Thống</div>
                        <div className='AboutusPage-Des'>
                        Hệ thống website quản lý tình trạng tiêm chủng là một nền tảng trực tuyến được thiết kế để giúp phụ huynh và các cơ quan y tế dễ dàng theo dõi lịch tiêm chủng của trẻ em. Với giao diện thân thiện, dễ sử dụng, hệ thống tích hợp đầy đủ các tính năng cần thiết, từ lưu trữ thông tin tiêm chủng đến gửi thông báo nhắc lịch tiêm, giúp đảm bảo không bỏ sót bất kỳ mũi tiêm quan trọng nào.
                        </div>
                        <div className='AboutusPage-Title'>2. Các Tính Năng Nổi Bật</div>
                        <div className='AboutusPage-mục2'>
                        <div className='AboutusPage-litte-Title'>
                        2.1. Quản Lý Thông Tin Tiêm Chủng Cá Nhân
                        </div>
                        <div className='AboutusPage-Des'>
                        Phụ huynh có thể tạo hồ sơ tiêm chủng cho con em mình, bao gồm thông tin cá nhân, lịch sử tiêm chủng và các loại vắc-xin đã được tiêm.<br/>
                        Hệ thống tự động cập nhật và lưu trữ thông tin, giúp phụ huynh dễ dàng truy cập và theo dõi mọi lúc, mọi nơi.
                        </div>
                        </div>
                        <div className='AboutusPage-mục2'>
                        <div className='AboutusPage-litte-Title'>
                        2.2. Nhắc Lịch Tiêm Chủng Tự Động
                        </div>
                        <div className='AboutusPage-Des'>
                        Hệ thống sẽ gửi thông báo qua email, SMS hoặc ứng dụng di động để nhắc nhở phụ huynh về các mũi tiêm sắp đến hạn.<br/>
                        Tính năng này giúp giảm thiểu nguy cơ quên lịch tiêm, đảm bảo trẻ được tiêm chủng đúng thời gian và đủ liều lượng.
                        </div>
                        </div>
                        <div className='AboutusPage-mục2'>
                        <div className='AboutusPage-litte-Title'>
                        2.3. Theo Dõi Lịch Sử Tiêm Chủng
                        </div>
                        <div className='AboutusPage-Des'>
                        Phụ huynh có thể xem lại toàn bộ lịch sử tiêm chủng của con mình, bao gồm các mũi tiêm đã thực hiện và các mũi tiêm còn thiếu.<br/>
                        Hệ thống cung cấp biểu đồ và báo cáo chi tiết, giúp phụ huynh nắm rõ tình trạng tiêm chủng của trẻ.
                        </div>
                        </div>
                        <div className='AboutusPage-Title'>3. Hướng Dẫn Sử Dụng</div>
                        <div className='AboutusPage-Des'>
                        Bước 1: Đăng ký tài khoản trên hệ thống bằng cách cung cấp thông tin cá nhân và thông tin của trẻ.<br/>

Bước 2: Nhập lịch sử tiêm chủng của trẻ (nếu có) hoặc bắt đầu theo dõi từ mũi tiêm đầu tiên.<br/>

Bước 3: Nhận thông báo nhắc lịch tiêm chủng và đặt lịch hẹn tại các cơ sở y tế gần nhất.<br/>

Bước 4: Theo dõi và cập nhật thông tin tiêm chủng thường xuyên để đảm bảo trẻ được tiêm chủng đầy đủ.<br/>
                        </div>
                    </div> */}
                            <div className='container'>
            <div className='col-12'>
                <div className='AboutusPage-Title'>1. Tổng Quan Về Hệ Thống</div>
                <div className='AboutusPage-Des'>
                Hệ thống website quản lý tình trạng tiêm chủng là một nền tảng trực tuyến được thiết kế để giúp phụ huynh và các cơ quan y tế dễ dàng theo dõi lịch tiêm chủng của trẻ em. Với giao diện thân thiện, dễ sử dụng, hệ thống tích hợp đầy đủ các tính năng cần thiết, từ lưu trữ thông tin tiêm chủng đến gửi thông báo nhắc lịch tiêm, giúp đảm bảo không bỏ sót bất kỳ mũi tiêm quan trọng nào.
                </div>
                <div className='AboutusPage-flex1'>
                <img src={Aboutintro} alt='Step 1' className='AboutusPages-Image' />                
                </div>
                <div className='AboutusPage-Title'>2. Các Tính Năng Nổi Bật</div>
                <div className='AboutusPage-mục2'>
                    <div className='AboutusPage-litte-Title'>2.1. Quản Lý Thông Tin Tiêm Chủng Cá Nhân</div>
                    <div className='AboutusPage-Des'>
                        Phụ huynh có thể tạo hồ sơ tiêm chủng cho con em mình, bao gồm thông tin cá nhân, lịch sử tiêm chủng và các loại vắc-xin đã được tiêm.
                    </div>
                </div>
                
                <div className='AboutusPage-mục2'>
                    <div className='AboutusPage-litte-Title'>2.2. Nhắc Lịch Tiêm Chủng Tự Động</div>
                    <div className='AboutusPage-Des'>
                        Hệ thống sẽ gửi thông báo qua email, SMS hoặc ứng dụng di động để nhắc nhở phụ huynh về các mũi tiêm sắp đến hạn.
                    </div>
                </div>
                
                <div className='AboutusPage-mục2'>
                    <div className='AboutusPage-litte-Title'>2.3. Theo Dõi Lịch Sử Tiêm Chủng</div>
                    <div className='AboutusPage-Des'>
                        Phụ huynh có thể xem lại toàn bộ lịch sử tiêm chủng của con mình.
                    </div>
                </div>
                
                <div className='AboutusPage-Title'>3. Hướng Dẫn Sử Dụng</div>
                {/* <div className='AboutusPage-flex'>
                <div className='AboutusPage-Step'>
                    <p>Bước 1: Đăng ký tài khoản trên hệ thống.</p>
                    <img src={step1Image} alt='Step 1' className='AboutusPage-Image' />
                </div>
                <div className='AboutusPage-Step'>
                    <p>Bước 2: Nhập lịch sử tiêm chủng của trẻ.</p>
                    <img src={step2Image} alt='Step 2' className='AboutusPage-Image' />
                </div>
                <div className='AboutusPage-Step'>
                    <p>Bước 3: Nhận thông báo nhắc lịch tiêm chủng.</p>
                    <img src={step3Image} alt='Step 3' className='AboutusPage-Image' />
                </div>
                <div className='AboutusPage-Step'>
                    <p>Bước 4: Theo dõi và cập nhật thông tin tiêm chủng.</p>
                    <img src={step4Image} alt='Step 4' className='AboutusPage-Image' />
                </div>
                </div> */}
                <div className='AboutusPage-flex'>
  <div className='AboutusPage-Step'>
    <p>Bước 1: Đăng ký tài khoản trên hệ thống.</p>
    <img src={step1Image} alt='Step 1' className='AboutusPage-Image' />
  </div>
  <div className='AboutusPage-Step'>
    <p>Bước 2: Nhập lịch sử tiêm chủng của trẻ.</p>
    <img src={step2Image} alt='Step 2' className='AboutusPage-Image' />
  </div>
  <div className='AboutusPage-Step'>
    <p>Bước 3: Nhận thông báo nhắc lịch tiêm chủng.</p>
    <img src={step3Image} alt='Step 3' className='AboutusPage-Image' />
  </div>
  <div className='AboutusPage-Step'>
    <p>Bước 4: Theo dõi và cập nhật thông tin tiêm chủng.</p>
    <img src={step4Image} alt='Step 4' className='AboutusPage-Image' />
  </div>
</div>


            </div>
        </div>
                </div>

            </div>

        </div>

    </div>
  )
}

export default AboutPage
