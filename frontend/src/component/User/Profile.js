import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import { Link } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const { user, loading } = useSelector((state) => state.user);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${user?.name || "User"}'s Profile`} />

          <div className="profileContainer">

            {/* LEFT SIDE */}
            <div>
              <h1>My Profile</h1>

              <img
                src={user?.avatar?.url}
                alt={user?.name || "Profile"}
              />

              <Link to="/me/update">
                Edit Profile
              </Link>
            </div>

            {/* RIGHT SIDE */}
            <div>

              <div>
                <h4>Full Name</h4>
                <p>{user?.name || "Not available"}</p>
              </div>

              <div>
                <h4>Email</h4>
                <p>{user?.email || "Not available"}</p>
              </div>

              <div>
                <h4>Joined On</h4>
                <p>
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Not available"}
                </p>
              </div>

              <div>
                <Link to="/orders">
                  My Orders
                </Link>

                <Link to="/password/update">
                  Change Password
                </Link>
              </div>

            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Profile;