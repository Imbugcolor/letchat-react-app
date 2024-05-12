import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { GrSubtract } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../redux/actions/profile.action";
import { formatInputDate } from "../../utils/dateFormat";
import { GLOBALTYPES } from "../../redux/types/global.type";

const EditProfile = () => {
  const auth = useSelector((state) => state.auth);
  const [avt, setAvt] = useState("");
  const [username, setUserName] = useState("");
  const [fullname, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [bio, setBio] = useState("");
  const [isUpdateBio, setIsUpdateBio] = useState(false);
  const [messageInputError, setMessageInputError] = useState(false);
  const [canSaved, setCanSaved] = useState(false);
  const [avtChange, setAvtChange] = useState(false);
  const [load, setLoad] = useState(false);

  const inputRef = useRef();
  const bioInputRef = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.user) {
      setAvt(auth.user.avatar);
      setUserName(auth.user.username);
      setFullName(auth.user.fullname);
      setGender(auth.user.gender);
      setDob(formatInputDate(new Date(auth.user.dateOfBirth)));
      setBio(auth.user.bio ? auth.user.bio : "");
    }
  }, [auth]);

  const handleUpdateBio = (e) => {
    setIsUpdateBio(true);
    bioInputRef.current.focus();
  };

  const handleChangeInput = (e) => {
    setCanSaved(true);
    setBio(e.target.value);
  };

  const validate = () => {
    const msg = {};

    if (!dob || new Date(dob) > new Date()) {
      msg.dob = "*Invalid Date";
    }

    setMessageInputError(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;

    setLoad(true);
    const data = {
      fullname,
      gender,
      dateOfBirth: dob,
      bio,
    };
    dispatch(updateProfile({ auth, data }));
    setLoad(false);

    setCanSaved(false);
  };

  return (
    <div className="profile-container flex mt-24">
      <div className="col l-3 m-3 c-12 profile-user-avt">
        <div>
          <img src={avtChange ? URL.createObjectURL(avt) : avt} alt="" />
          <button
            className="select-img"
            onClick={() =>
              dispatch({
                type: GLOBALTYPES.MODAL,
                payload: { uploadProfile: true },
              })
            }
          >
            Change
          </button>
          <span>
            Maximum file size: 1 MB <br /> Format: .JPEG, .PNG
          </span>
        </div>
        <div className="user__sidebar_menu">
          <h3>
            <GrSubtract />
            Account
          </h3>
          <ul>
            <li>
              <Link
                to={`/profile/${auth.user?.id}`}
                className="sidebar__option-menu active"
              >
                Account Information
              </Link>
            </li>
            <li>
              <Link to={"/security/password"} className="sidebar__option-menu">
                Account security
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="col l-6 m-6 c-12 user-infor-wrapper">
        <div className="heading__form__user__infor">
          <h4>Your information</h4>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="user-infor-field">
            <label>ID</label>
            <span>{auth.user?.id}</span>
          </div>

          <div className="user-infor-field">
            <label>Username</label>
            <span>{username}</span>
          </div>

          <div className="user-infor-field">
            <label>Fullname</label>
            <input
              type="text"
              id="full-name"
              value={fullname}
              onChange={(e) => {
                setFullName(e.target.value);
                setCanSaved(true);
              }}
            />
          </div>

          <div className="user-infor-field">
            <label>Email</label>
            <span>{auth.user?.email}</span>
          </div>

          <div className="user-infor-field">
            <label>Phone</label>
            <div className="user__field__group">{auth.user?.phone}</div>
          </div>

          <div className="user-infor-field">
            <label>Bio</label>
            <div className="user__field__group">
              <input
                type="text"
                id="user-address"
                value={bio}
                disabled={!isUpdateBio}
                ref={bioInputRef}
                onChange={handleChangeInput}
              />

              <a
                href="#!"
                className="edit-field-icon"
                onClick={handleUpdateBio}
              >
                <FaEdit style={{ color: "#9e9e9e", cursor: "pointer" }} />
              </a>
            </div>
          </div>

          <div className="user-infor-field">
            <label>Gender</label>
            <div id="user-gender">
              <div className="user-gender-item">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  id="male"
                  checked={gender === "male" ? true : false}
                  onChange={(e) => {
                    setGender(e.target.value);
                    setCanSaved(true);
                  }}
                />
                <label htmlFor="male">Male</label>
              </div>
              <div className="user-gender-item">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  id="female"
                  checked={gender === "female" ? true : false}
                  onChange={(e) => {
                    setGender(e.target.value);
                    setCanSaved(true);
                  }}
                />
                <label htmlFor="female">Female</label>
              </div>
              <div className="user-gender-item">
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  id="other"
                  checked={gender === "other" ? true : false}
                  onChange={(e) => {
                    setGender(e.target.value);
                    setCanSaved(true);
                  }}
                />
                <label htmlFor="other">Other</label>
              </div>
            </div>
          </div>

          <div className="user-infor-field">
            <label htmlFor="">Date of birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => {
                setDob(e.target.value);
                setCanSaved(true);
              }}
            />
            <span className="text-red-500 font-light block">
              {messageInputError.dob}
            </span>
          </div>
          <div className="user-infor-field">
            <label>Date joined</label>
            <div id="user-created-time">
              {new Date(auth.user?.createdAt).toLocaleDateString()}
            </div>
          </div>

          <button
            type="submit"
            className={`save-btn ${canSaved ? "bg-slate-950" : "bg-slate-300"}`}
            disabled={!canSaved}
          >
            {load ? (
              <>
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 me-3 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
                Loading...
              </>
            ) : (
              "Save"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
