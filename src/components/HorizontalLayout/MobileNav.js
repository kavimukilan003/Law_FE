import ProfileMenu from "components/CommonForBoth/TopbarDropdown/ProfileMenu"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import React, { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import "../HorizontalLayout/mobileNav.css"
import rainlglogo from "assets/images/raincom_Logo1.png"
import NotificationDropdown from "components/CommonForBoth/TopbarDropdown/NotificationDropdown"
import Reminders from "rainComputing/pages/reminder"
import DocketMenu from "rainComputing/pages/docket/DocketMenu"
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledTooltip } from "reactstrap"


const MobileNav = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [subDomainOpen, setSubDomainOpen] = useState(false);
  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ")
  }
  const [modal_scroll, setmodal_scroll] = useState(false)

  const { currentAttorney } = useUser()
  const { currentUser } = useUser()
  const tog_scroll = () => {
    setmodal_scroll(!modal_scroll)
  }
  const toggleSubDomainOpen = () => {
    setSubDomainOpen(!subDomainOpen);
  };
  const handleIconClick = () => {
    window.open(currentAttorney?.subdomain, '_blank');
  };

  const handleSubDomainClick = () => {
    const subdomain = currentAttorney?.subdomain;
    const url = subdomain ? (subdomain.startsWith("https://") ? subdomain : `https://${subdomain}`) : null;

    if (url) {
      window.open(url, '_blank');
    } else {
      console.error("Invalid subdomain or subdomain is missing.");
    }
  };

  const handleDomainClick = (domainName) => {
    const url = domainName ? (domainName.startsWith("https://") ? domainName : `https://${domainName}`) : null;
    window.open(url, '_blank');
  };

  return (
    <div>
      {isMobile && (
        <div className="">
          <ul id="" className=" ul  " style={{ zIndex: 300 }}>
            <li id="" className="">
              <Link to="/" className="ul1">
                Home
              </Link>
            </li>
            <li id="" className="">
              <Link to="/chat-rc" className="ul1">
                {" "}
                ChatPro<sup>TM</sup>
              </Link>
            </li>
            {!currentUser && (
              <li id="" className="">
                <Link to="/help" className="ul1">
                  Help
                </Link>
              </li>
            )}
            {currentUser && currentAttorney?.status === "approved" && (
              <li id="" className="">
                <Link to="/req-user" className="ul1">
                  Requests
                </Link>
              </li>
            )}
            {currentUser && !currentAttorney && (
              <li id="">
                <Link to="/appointment-status " className=" ul1">
                  {" "}
                  Connection
                </Link>
              </li>
            )}
            {currentUser && currentAttorney?.status === "approved" && (
              <li className="ul1">
                <DocketMenu />
              </li>
            )}
          </ul>
        </div>
      )}
      <div className=" flex-container ">
        <div className="  ">
          <button
            onClick={() => setIsMobile(!isMobile)}
            className="border-0 bg-transparent"
          >
            {isMobile ? (
              <div className="burger-bar show"></div>
            ) : (
              <div className="burger-bar"></div>
            )}
          </button>
          <Link to="/" className="logo logo-dark">
            <span className="logo-sm">
              {/* <img src={rainlglogo} alt="" height="22" /> */}
            </span>
          </Link>{" "}
        </div>

        <div className="d-flex ">
          <div className="mt-4" id="domainTooltip">
            <i
              className="bx bx-link-external"
              id="atticon"
              onClick={toggleSubDomainOpen}
              target="_blank"
              style={{ cursor: "pointer",float: "right" }}

            />
            <UncontrolledTooltip
              placement="bottom"
              target="domainTooltip"
            >
              Domains
            </UncontrolledTooltip>
            <Dropdown
              isOpen={subDomainOpen}
              toggle={toggleSubDomainOpen}
              className="float-end me-2"
            >
              <DropdownToggle className="btn nav-btn" tag="i"></DropdownToggle>
              <DropdownMenu className="custom-dropdown-menu"
                style={{
                  whiteSpace: "break-spaces",
                  overflow: "hidden",
                  wordWrap: "break-word",
                }}
              >
                {currentAttorney?.subdomain &&
                  <DropdownItem
                    className="border-bottom px-3 py-3 domain-items"
                    onClick={() => handleSubDomainClick()}
                  >
                    {currentAttorney?.subdomain}
                  </DropdownItem>}
                {currentUser?.domains ? (
                  currentUser.domains.map((user, i) => (
                    <div
                      className="border-bottom px-3 py-3 domain-item"
                      key={i}
                      onClick={() => handleDomainClick(user?.name)}
                      style={{ cursor: 'pointer' }}
                    >
                      {user?.name}
                    </div>
                  ))
                ) : (
                  <p>No domains available</p>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
          <div> {currentUser && <NotificationDropdown />}</div>
          <div className="mt-3 p-1">
            {" "}
            {currentUser && (
              <Reminders
                toggle={tog_scroll}
                open={modal_scroll}
                setOpen={setmodal_scroll}
              />
            )}
          </div>
          <div>
            {" "}
            <ProfileMenu />
          </div>{" "}
        </div>
      </div>
    </div>
  )
}

export default MobileNav
