import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col,TabContent, Nav, NavItem, NavLink, UncontrolledTooltip } from "reactstrap"
import SimpleBar from "simplebar-react"
import { withTranslation } from "react-i18next"
import { useNotifications } from "rainComputing/contextProviders/NotificationsProvider"
import PrivateMsg from "rainComputing/components/chat/PrivateMsg"
import GroupMsg from "rainComputing/components/chat/GroupMsg"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import ChatLoader from "rainComputing/components/chat/ChatLoader"
import PrivateReplyMsg from "rainComputing/components/chat/PrivateReplyMsg"
import GroupReplyMsg from "rainComputing/components/chat/GroupReplyMsg"
import classNames from "classnames";
import { getRecentMessages } from "rainComputing/helpers/backend_helper"
const NotificationDropdown = (props) => {
  const { currentUser, setCurrentUser } = useUser();
  const { notifications, setNotifications } = useNotifications();
  const[recentNotifications,setRecentNotifications] = useState([])
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = (tab) => {
    console.log("tab:", tab)
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
  useEffect(() => {
    // Check if there are new notifications
    if (currentUser?.isNotifySound) {
      const newNotifications = notifications.filter((notify) => !notify.playedSound);
      if (newNotifications.length > 0) {
        // Play the audio notification for each new notification
        newNotifications.forEach((notify) => {
          const audioElement = new Audio(currentUser?.notificationSound);
          audioElement.play();
          // Update the notification to mark it as played
          notify.playedSound = true;
        });
        // setNotificationsInLocalStorage(notifications);
        // To trigger re-render and update the notifications array in state
        setNotifications([...notifications]);
      }
    }
  }, [currentUser?.isNotifySound, notifications]);
  // const setNotificationsInLocalStorage = (notifications) => {
  //   try {
  //     // const notificationsWithFlags = notifications.map((notification) => ({
  //     //   ...notification,
  //     //   isNew: true, // Add your boolean flag here, set to true by default
  //     // }));
  //     // Convert the notifications array to a JSON string
  //     const notificationsJSON = JSON.stringify(notifications);
  //     // Store the JSON string in local storage under a specific key
  //     localStorage.setItem("notifications", notificationsJSON);
  //   } catch (error) {
  //     console.error("Error saving notifications to local storage:", error);
  //   }
  // };
  // const previousNotifications = JSON.parse(localStorage.getItem("notifications"));
  const toggleDropdown = () => {
    setMenu(!menu);
  };

  const getAllRecentMessages = async() => {
    const payload = {
      userId: currentUser?.userID
    }
    const res = await getRecentMessages(payload)
    if(res.success){
      setRecentNotifications(res?.chats)
    }
  }
  useEffect(()=> {
    getAllRecentMessages()
  },[currentUser,notifications])
 
  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="dropdown d-inline-block"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon"
          tag="button"
          id="page-header-notifications-dropdown"
          
        >
          {currentUser && <i className="bx bx-bell" id="notificationTooltip"/>}
          <UncontrolledTooltip
          placement="bottom"
          target="notificationTooltip"
        >
          Notification
        </UncontrolledTooltip>
          {notifications.length > 0 && (
            <span className="badge bg-danger rounded-pill">
              {notifications.length}
            </span>
          )}
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
          <i className="px-2 py-1 bx bx-x close-icon d-flex justify-content-end"
            style={{ cursor: "pointer", fontSize: "12px", position: "absolute", right: "2px", top: "30px", }}
            onClick={toggleDropdown}>
          </i>
          <Nav pills justified>
            <NavItem>
              <NavLink
                className={classNames({
                  active: activeTab === "1",
                })}
                onClick={() => {
                  toggleTab("1");
                }}
              >
                {props.t("UnRead Messages")}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classNames({
                  active: activeTab === "2",
                })}
                onClick={() => {
                  toggleTab("2");
                }}
              >
                {props.t("Recent Messages")}
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab} className="py-1">
            {activeTab === "1" &&
              (notifications.length === 0 ? (
                <div className="d-flex justify-content-center py-2">
                  <span>No Messages</span>
                </div>
              ) : (
                loading ? (
                  <ChatLoader />
                ) : (
                  notifications.length > 0 && (
                    <SimpleBar style={{ height: "230px" }}>
                      <div>
                        <div className="p-3">
                          <Row className="align-items-center">
                            <Col>
                              <h6 className="m-0"> {props.t("Notifications")} </h6>
                            </Col>
                            <div className="col-auto">
                              <a href="/chat-rc" className="small">
                                {" "}
                                View All
                              </a>
                            </div>
                          </Row>
                        </div>
                        {notifications.map((notify, i) => {
                          if (notify.isReply && !notify.caseId) {
                            return <PrivateReplyMsg notification={notify} key={i} />;
                          } else if (notify.isReply && notify.caseId) {
                            return <GroupReplyMsg notification={notify} key={i} />;
                          } else if (notify.caseId) {
                            return <GroupMsg notification={notify} key={i} />;
                          } else {
                            return (
                              <div className="text-reset notification-item" key={i}>
                                <PrivateMsg notification={notify} key={i} />
                              </div>
                            );
                          }
                        })}
                      </div>
                    </SimpleBar>
                  )
                )
              ))
            }
            {activeTab === "2" &&
              (notifications.length < 0 ? (
                <div className="d-flex justify-content-center py-2">
                  <span>No Messages</span>
                </div>
              ) : (
                loading ? (
                  <ChatLoader />
                ) : (
                  recentNotifications && (
                    <SimpleBar style={{ height: "230px" }}>
                      <div>
                        <div className="p-3">
                          <Row className="align-items-center">
                            <Col>
                              <h6 className="m-0"> {props.t("Notifications")} </h6>
                            </Col>
                            <div className="col-auto">
                              <a href="/chat-rc" className="small">
                                {" "}
                                View All
                              </a>
                            </div>
                          </Row>
                        </div>
                        {recentNotifications.map((notify, i) => {
                          if (notify.isReply && !notify.caseId) {
                            return <PrivateReplyMsg notification={notify} key={i} />;
                          } else if (notify.isReply && notify.caseId) {
                            return <GroupReplyMsg notification={notify} key={i} />;
                          } else if (notify.caseId) {
                            return <GroupMsg notification={notify} key={i} />;
                          } else {
                            return (
                              <div className="text-reset notification-item" key={i}>
                                <PrivateMsg notification={notify} key={i} />
                              </div>
                            );
                          }
                        })}
                      </div>
                    </SimpleBar>
                  ))
              )
              )}
          </TabContent>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};
export default withTranslation()(NotificationDropdown)
NotificationDropdown.propTypes = {
  t: PropTypes.any,
}