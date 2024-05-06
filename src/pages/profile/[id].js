import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { GrSubtract } from 'react-icons/gr'
import { FaEdit } from 'react-icons/fa'
import Header from '../../components/home/Header'

const Profile = () => {
    const auth = useSelector(state => state.auth)
    const { id } = useParams()
    const [loading, setLoading] = useState(false)

    const [avt, setAvt] = useState('')
    const [username, setUserName] = useState('')
    const [address, setAddress] = useState('')
    const [gender, setGender] = useState('')
    const [dob, setDob] = useState('')

    const inputRef = useRef()
    const addressRef = useRef()

    const [avtChange, setAvtChange] = useState(false)

    const changeAvatar = (e) => {
        const file = e.target.files[0]
        setAvtChange(true)
        setAvt(file)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    const handleChangeAddress = (e) => {

    }

    useEffect(() => {
        if(parseInt(id) === auth.user.id) {
            setAvt(auth.user.avatar)
            setUserName(auth.user.username)
            setGender(auth.user.gender)
        }
    },[id, auth])

  return (
    <div className="user-profile-container mt-24">
        <Header />
            <div className="">
                <div className="user-header">
                    <h2 className="header-title">Profile</h2>
                    <p className="header-description">Account information</p>
                </div>
            </div>
            <div className="profile-container flex">
                <div className="col l-3 m-3 c-12 profile-user-avt">
                    <div>
                        <img
                            src={avtChange ? URL.createObjectURL(avt) : avt}
                            alt="" />
                        <input type="file" size="60" onChange={changeAvatar} ref={inputRef} />
                        <button className='select-img' onClick={() => inputRef.current.click()}>Change</button>
                        <span>Maximum file size: 1 MB <br /> Format: .JPEG, .PNG</span>
                    </div>
                    <div className='user__sidebar_menu'>
                        <h3><GrSubtract/>Account</h3>
                        <ul>
                            <li><Link to={`/profile/${auth.user.id}`} className='sidebar__option-menu active'>Account Information</Link></li>
                            <li><Link to={'/security/password'} className='sidebar__option-menu'>Account security</Link></li>
                        </ul>
                    </div>
                </div>
               
                <div className="col l-6 m-6 c-12 user-infor-wrapper">
                    <div className='heading__form__user__infor'>
                        <h4>Your information</h4>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="user-infor-field">
                            <label>ID</label>
                            <input type="text" id="user-id" value={auth.user.id} disabled/>
                        </div>

                        <div className="user-infor-field">
                            <label>Username</label>
                            <input type="text" id="user-name"
                                value={username} onChange={e => setUserName(e.target.value)} />
                        </div>

                        <div className="user-infor-field">
                            <label>Email</label>
                            <input type="text" id="user-email" value={auth.user.email || ''} disabled/>
                        </div>

                        <div className="user-infor-field">
                            <label>Phone</label>
                            <div className='user__field__group'>
                                <a href='#!' className='region-number'>
                                    +84
                                </a>
                                <input type="text" id="user-phone" value={auth.user.phone || ''} disabled/>
                            </div>
                          
                        </div>

                        <div className="user-infor-field">
                            <label>Address</label>
                            <div className="user__field__group">
                                <input type="text" id="user-address" value='' disabled/> 
                                
                                <a href="#!" className="edit-field-icon"
                                    onClick={handleChangeAddress}>
                                    <FaEdit style={{ color: '#9e9e9e', cursor: 'pointer' }} />
                                </a>
                                <div className="address-form" ref={addressRef}>
                                    
                                </div>
                            </div>
                        </div>

                        <div className="user-infor-field">
                            <label>Gender</label>
                            <div id="user-gender">
                                <div className="user-gender-item">
                                    <input type="radio" name="gender" value="male" id="male" checked={gender === "male" ? true : false}
                                        onChange={(e) => setGender(e.target.value)} />
                                    <label htmlFor="male">Nam</label>
                                </div>
                                <div className="user-gender-item">
                                    <input type="radio" name="gender" value="female" id="female" checked={gender === "female" ? true : false}
                                        onChange={(e) => setGender(e.target.value)} />
                                    <label htmlFor="female">Nữ</label>
                                </div>
                                <div className="user-gender-item">
                                    <input type="radio" name="gender" value="other" id="other" checked={gender === "other" ? true : false}
                                        onChange={(e) => setGender(e.target.value)} />
                                    <label htmlFor="other">Khác</label>
                                </div>
                            </div>
                        </div>

                        <div className="user-infor-field">
                            <label htmlFor="">Ngày sinh</label>
                            <input type="date" value={dob} onChange={e => setDob(e.target.value)} />
                        </div>
                        <div className="user-infor-field">
                            <label>Date created</label>
                            <div id="user-created-time">{new Date(auth.user.createdAt).toLocaleDateString()}</div>
                        </div>

                        <button type="submit" className="save-btn">Save</button>
                    </form>
                </div>
                
            </div> 
        </div>
    )
}

export default Profile
