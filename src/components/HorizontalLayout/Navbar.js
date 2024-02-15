import PropTypes from "prop-types"
import React, { useState, useEffect } from "react"
import { Row, Col, Collapse } from "reactstrap"
import { Link, withRouter } from "react-router-dom"
import PDF from "assets/guide/guide.pdf"

//i18n
import { withTranslation } from "react-i18next"

import { connect } from "react-redux"

import { useUser } from "rainComputing/contextProviders/UserProvider"

const Navbar = props => {
  const { currentAttorney } = useUser()
  const { currentUser } = useUser()

  useEffect(() => {
    var matchingMenuItem = null
    var ul = document.getElementById("navigation")
    var items = ul.getElementsByTagName("a")
    for (var i = 0; i < items.length; ++i) {
      if (props.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i]
        break
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem)
    }
  })
  function activateParentDropdown(item) {
    item.classList.add("active")
    const parent = item.parentElement
    if (parent) {
      parent.classList.add("active") // li
      const parent2 = parent.parentElement
      parent2.classList.add("active") // li
      const parent3 = parent2.parentElement
      if (parent3) {
        parent3.classList.add("active") // li
        const parent4 = parent3.parentElement
        if (parent4) {
          parent4.classList.add("active") // li
          const parent5 = parent4.parentElement
          if (parent5) {
            parent5.classList.add("active") // li
            const parent6 = parent5.parentElement
            if (parent6) {
              parent6.classList.add("active") // li
            }
          }
        }
      }
    }
    return false
  }

  return (
    <React.Fragment>
      <div className="topnav">
        <div className="container-fluid">
          <nav
            className="navbar navbar-light navbar-expand-lg topnav-menu"
            id="navigation"
          >
            <Collapse
              isOpen={props.leftMenu}
              className="navbar-collapse"
              id="topnav-menu-content"
            >
              <ul className="navbar-nav text-white">
                <li className="nav-item dropdown">
                  <Link className="nav-link dropdown-toggle arrow-none" to="/">
                    <i className="bx bx-home-circle me-2"></i>
                    {props.t("Home")} {props.menuOpen}
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle arrow-none"
                    to="/chat-rc"
                  >
                    <i className="bx bxl-messenger me-2"></i>
                    {props.t("Chat")} {props.menuOpen}
                  </Link>
                </li>
                {currentAttorney && currentAttorney?.status === "approved" && (
                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle arrow-none"
                      to="/req-user"
                    >
                      <i className="bx bx-git-pull-request me-2"></i>
                      {props.t("Requests")} {props.menuOpen}
                    </Link>
                  </li>
                )}
                
                 {currentUser && !currentAttorney && (
                 <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle arrow-none"
                      to="/appointment-status"
                    >
                      <i className="mdi mdi-connection me-2"></i>
                      {props.t("Connection")} {props.menuOpen}
                    </Link>
                  </li>
                   )} 
                   <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle arrow-none"
                      to="/help"
                    >
                      <i className="mdi mdi-help me-2"></i>
                      {props.t("Help")} {props.menuOpen}
                    </Link>

                  </li>
                   {/* <li className=" dropdown">
                    <a href={PDF}  download="guide.pdf"
                      className="nav-link dropdown-toggle arrow-none"
                     
                    >
                      <i className="mdi mdi-download "></i>
                      
                    </a>

                  </li> */}

              </ul>
            </Collapse>
          </nav>
        </div>
      </div>
    </React.Fragment> 
  )
}

Navbar.propTypes = {
  leftMenu: PropTypes.any,
  location: PropTypes.any,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
}

const mapStatetoProps = state => {
  const { leftMenu } = state.Layout
  return { leftMenu }
}

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(Navbar))
)
