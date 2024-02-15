import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap"

import { withTranslation } from "react-i18next"
// Redux
import { connect } from "react-redux"
import { withRouter, Link, useHistory, NavLink } from "react-router-dom"

// users
import user1 from "../../../assets/images/avatar-defult.jpg"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import { logoutUser, notifySound } from "rainComputing/helpers/backend_helper"
import { useSocket } from "rainComputing/contextProviders/SocketProvider"
import { useLocation } from "react-router-dom"
import "../TopbarDropdown/login.scss"
import Reminder from "rainComputing/pages/reminder"
import DynamicModel from "rainComputing/components/modals/DynamicModal"
import { useToggle } from "rainComputing/helpers/hooks/useToggle"
import DynamicSuspense from "rainComputing/components/loader/DynamicSuspense"
import CompletedCaseModel from "rainComputing/components/chat/models/CompletedCaseModel"
import NotificationSettings from "./NotificationSettings"

const ProfileMenu = props => {
  // Declare a new state variable, which we'll call "menu"
  const histroy = useHistory()
  const { currentAttorney } = useUser()
  const { currentUser, setCurrentUser } = useUser()
  const { socket } = useSocket()
  const [menu, setMenu] = useState(false)
  const location = useLocation()
  const {
    toggleOpen: completeCaseModelOpen,
    setToggleOpen: setCompleteCaseModelOpen,
    toggleIt: toggleCompleteCaseModelOpen,
  } = useToggle(false)
  const {
    toggleOpen: notificationSettingsModelOpen,
    setToggleOpen: setNotificationSettingsModelOpen,
    toggleIt: toggleNotificationSettingsModelOpen,
  } = useToggle(false)
  const isLoginButton =
    location.pathname.includes("/login") ||
    location.pathname.includes("/register")

  const handleLogout = async () => {
    const res = await logoutUser()
    if (res.success) {
      socket?.emit("close_manually")
      localStorage.removeItem("authUser")
      setCurrentUser(null)
      histroy.push("/login")
    } else {
      console.log("Logout failed")
    }
  }

  const handleCaseCompletedModal = () => {
    setCompleteCaseModelOpen(true)
  }
  const handleNotificationModal = () => {
    setNotificationSettingsModelOpen(true)
  }
  return (
    <React.Fragment>
      <DynamicModel
        open={completeCaseModelOpen}
        toggle={toggleCompleteCaseModelOpen}
        size="lg"
        // modalTitle="Completed Case"
        footer={false}
      >
        <div>
          <h2 className=" text-primary mb-2 px-2">
            Completed Case
            <div
              style={{
                width: "70px",
                height: "3px",
                backgroundColor: "#556EE6",
                borderRadius: "10px",
              }}
            ></div>
          </h2>
        </div>
        <DynamicSuspense>
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            <CompletedCaseModel setModalOpen={setCompleteCaseModelOpen} />
          </div>
        </DynamicSuspense>
      </DynamicModel>
      <DynamicModel
        open={notificationSettingsModelOpen}
        toggle={toggleNotificationSettingsModelOpen}
        size="md"
        modalTitle="Notifiction Settings"
        footer={false}
      >
        <DynamicSuspense>
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            <NotificationSettings
              setModalOpen={setNotificationSettingsModelOpen}
            />
          </div>
        </DynamicSuspense>
      </DynamicModel>
      {currentUser ? (
        <Dropdown
          isOpen={menu}
          toggle={() => setMenu(!menu)}
          className="d-inline-block"
        >
          <DropdownToggle
            className="btn header-item "
            id="page-header-user-dropdown"
            tag="button"
          >
            <img
              className="rounded-circle header-profile-user"
              src={currentUser.profilePic ? currentUser.profilePic : user1}
              alt="profile pic"
              style={{ objectFit: "cover" }}
            />
            <span className="d-none d-xl-inline-block ms-2 me-1 fw-bolder font-size-16">
              {currentUser?.firstname + " " + currentUser?.lastname}
            </span>
            <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <DropdownItem tag="a" href="/profile">
              {" "}
              <i className="bx bx-user font-size-16 align-middle me-1" />
              {props.t("Profile")}{" "}
            </DropdownItem>
            {/* <DropdownItem tag="a" href="/manage_domains">
            <i className="bi bi-gem font-size-16 align-middle me-1"/> {props.t("Manage Domains")}
            </DropdownItem> */}
            {!currentUser?.attorneyStatus ? (
              <DropdownItem tag="a" href="/attorney-signup">
                <i className="bx bx-group font-size-16 align-middle me-1" />
                {props.t("Register as Attorney")}
              </DropdownItem>
            ) : (
              <DropdownItem tag="a" href="/reqattorney">
                <i className="bx bx-group font-size-16 align-middle me-1" />
                {props.t("Attorney")}
                {currentUser?.attorneyStatus === "requested" && (
                  <i className="bx bx-loader  bx-spin font-size-16 align-middle ms-2  text-primary float-end" />
                )}
                {currentUser?.attorneyStatus === "approved" && (
                  <i className="bx bx-comment-error  font-size-16 align-middle ms-2 text-success  float-end" />
                )}
                {currentUser?.attorneyStatus === "rejected" && (
                  <i className="bx bx-x  font-size-16 align-middle ms-2 text-danger float-end" />
                )}
              </DropdownItem>
            )}
           {/* { currentAttorney &&
            <DropdownItem tag="a" href="/premiumPage">
            <i className="bi bi-gem font-size-16 align-middle me-1"/> {props.t("Premium")}
            </DropdownItem>
            } */}
            {/* <DropdownItem tag="a" href="/reminders">
              <i className="bx bx-alarm font-size-16 align-middle me-1" />
              {props.t("Reminders")}
            </DropdownItem> */}
            {/* {currentAttorney && (
              <DropdownItem tag="a" href="/reminderDashboard">
                <i className="bx bx-alarm font-size-16 align-middle me-1" />
                {props.t("Case Reminder")}
              </DropdownItem>
            )} */}
            {/* {currentAttorney && (
              <DropdownItem
                tag="a"
                href="#"
                onClick={() => handleCaseCompletedModal()}
              >
                <i className="bx bx-check-circle font-size-16 align-middle me-1" />
                {props.t("Completed Cases")}
              </DropdownItem>
            )} */}
            {/* <DropdownItem tag="a" onClick={() => handleNotificationModal()}>
              <i className="bx bx-bell font-size-16 align-middle me-1" />
              {props.t("Notification Settings")}
            </DropdownItem> */}
            
            

            <div className="dropdown-divider" />

            <Link
              to="#"
              className="dropdown-item"
              onClick={() => {
                handleLogout()
              }}
            >
              <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
              <span>{props.t("Logout")}</span>
            </Link>
          </DropdownMenu>
        </Dropdown>
      ) : (
        !isLoginButton && (
          <Link to="/login" className="dropdown">
            {/* <i className="bx bx-log-in-circle font-size-20 align-middle me-1 text-primary" /> */}
            <button id="logbtn" type="button">
              <span>{props.t("Login")}</span>
            </button>
          </Link>
        )
      )}
    </React.Fragment>
  )
}

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
}

const mapStatetoProps = state => {
  const { error, success } = state.Profile
  return { error, success }
}

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
)
