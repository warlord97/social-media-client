import React, { useState } from "react";
import "./CreatePost.scss";
import Avatar from "../avatar/Avatar";
import { BsCardImage } from "react-icons/bs";
import { axiosClient } from "../../utils/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, showToast } from "../../redux/slices/appConfigSlice";
import { getUserProfile } from "../../redux/slices/postSlice";
import { TOAST_FAILURE } from "../../App";

function CreatePost() {
  const [postImg, setPostImg] = useState("");
  const dispatch = useDispatch();
  const [caption, setCaption] = useState("");
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);

  function handleImageChange(e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setPostImg(fileReader.result);
      }
    };
  }

  async function handlePostSubmit() {
    try {
      dispatch(setLoading(true));
      const result = await axiosClient.post("/posts", {
        caption,
        postImg,
      });
      dispatch(
        getUserProfile({
          userId: myProfile?._id,
        })
      );
    } catch (error) {
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: error,
        })
      );
    } finally {
      dispatch(setLoading(false));
      setCaption("");
      setPostImg("");
    }
  }

  return (
    <div className="CreatePost">
      <div className="left-part">
        <Avatar src={myProfile?.avatar?.url} />
      </div>
      <div className="right-part">
        <input
          value={caption}
          type="text"
          className="captionInput"
          placeholder="what's on your mind ?"
          onChange={(e) => {
            setCaption(e.target.value);
          }}
        />
        {postImg && (
          <div className="img-container">
            <img className="post-img" src={postImg} alt="post-img" />
          </div>
        )}
        <div className="bottom-part">
          <div className="input-post-img">
            <label htmlFor="inputImg" className="label-img">
              <BsCardImage />
            </label>
            <input
              className="inputImg"
              id="inputImg"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <button className="post-btn btn-primary" onClick={handlePostSubmit}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
