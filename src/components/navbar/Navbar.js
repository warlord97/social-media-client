import "./Navbar.scss";
import { useNavigate } from "react-router-dom";
import Avatar from "../avatar/Avatar";
import { AiOutlineLogout } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, showToast } from "../../redux/slices/appConfigSlice";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, removeItem } from "../../utils/localStorageManager";
import { TOAST_FAILURE, TOAST_SUCCESS } from "../../App";

function Navbar() {
  const navigate = useNavigate();
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
  const dispatch = useDispatch();

  async function handleLogoutClicked() {
    try {
      dispatch(setLoading(true));
      await axiosClient.post("/auth/logout");
      removeItem(KEY_ACCESS_TOKEN);
      navigate("/login");
      dispatch(
        showToast({
          type: TOAST_SUCCESS,
          message: "logged out",
        })
      );
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: "logout failed",
        })
      );
    }
  }
  return (
    <div className="Navbar">
      <div className="container">
        <h1
          className="banner hover-link"
          onClick={() => {
            navigate("/");
          }}
        >
          Social Media
        </h1>
        <div className="right-side">
          <div
            className="profile hover-link"
            onClick={() => {
              navigate(`/profile/${myProfile?._id}`);
            }}
          >
            <Avatar src={myProfile?.avatar?.url} />
          </div>
          <div className="logout hover-link" onClick={handleLogoutClicked}>
            <AiOutlineLogout />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
