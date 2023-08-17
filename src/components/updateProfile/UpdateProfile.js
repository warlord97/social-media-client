import React, { useEffect, useState } from "react";
import "./UpdateProfile.scss";
import { useSelector, useDispatch } from "react-redux";
import {
  setLoading,
  showToast,
  updateMyProfile,
} from "../../redux/slices/appConfigSlice";
import { useNavigate } from "react-router-dom";
import { KEY_ACCESS_TOKEN, removeItem } from "../../utils/localStorageManager";
import { axiosClient } from "../../utils/axiosClient";
import { TOAST_FAILURE, TOAST_SUCCESS } from "../../App";
import dummyImg from "../../assets/user.png";

function UpdateProfile() {
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [userImg, setUserImg] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setName(myProfile?.name || "");
    setBio(myProfile?.bio || "");
    setUserImg(myProfile?.avatar?.url);
  }, [myProfile]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setUserImg(fileReader.result);
      }
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(
      updateMyProfile({
        name,
        bio,
        userImg,
      })
    );
  }

  function handleDeleteConfirm() {
    setShowDeleteConfirm(true);
  }

  function handleDeleteCancel() {
    setShowDeleteConfirm(false);
  }

  async function handleDeleteAccount() {
    try {
      dispatch(setLoading(true));
      await axiosClient.delete("/user/deleteProfile");
      dispatch(setLoading(false));
      dispatch(
        showToast({
          type: TOAST_SUCCESS,
          message: " User Deleted Successfully!'",
        })
      );
      removeItem(KEY_ACCESS_TOKEN);
      navigate("/signup");
    } catch (error) {
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: error,
        })
      );
    }
  }

  return (
    <div className="UpdateProfile">
      <div className="container">
        <div className="left-part">
          <div className="input-user-img">
            <label htmlFor="inputImg" className="label-img">
              <img src={userImg ? userImg : dummyImg} alt={name} />
            </label>
            <input
              className="inputImg"
              id="inputImg"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="right-part">
          <form onSubmit={handleSubmit}>
            <input
              value={name}
              type="text"
              placeholder="Your Name"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              value={bio}
              type="text"
              placeholder="Your Bio"
              onChange={(e) => setBio(e.target.value)}
            />
            <input
              type="submit"
              className="btn-primary"
              onClick={handleSubmit}
            />
          </form>
          <button
            className="delete-account btn-secondary"
            onClick={handleDeleteConfirm}
          >
            Delete Account
          </button>
          {showDeleteConfirm && (
            <div className="delete-confirm-overlay">
              <div className="delete-confirm">
                <p>Are you sure you want to delete your account ?</p>
                <div className="inside-button">
                  <button
                    className="btn-secondary"
                    onClick={handleDeleteAccount}
                  >
                    Yes
                  </button>
                  <button className="btn-primary" onClick={handleDeleteCancel}>
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;
