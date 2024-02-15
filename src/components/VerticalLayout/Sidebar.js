import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";
import SidebarContent from "./SidebarContent";

import { Link } from "react-router-dom";

import rain from "../../assets/images/rain-drop.png";
import rainlogo from "../../assets/images/RainCom_Logo.webp";
import rain1logo from "../../assets/images/RainCom_Logo.webp";
import rain1 from "../../assets/images/rain-drop.png";

const Sidebar = props => {

  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="navbar-brand-box">
          <Link to="/admin-page" className="logo logo-dark">
            <span className="logo-sm">
              <img src={rainlogo} alt="" height="40" />
            </span>
            <span className="logo-lg">
              <img src={rain1logo} alt="" height="35" />
            </span>
          </Link>

          <Link to="/admin-page" className="logo logo-light">
            <span className="logo-sm">
              <img src={rain} alt="" height="22" />
            </span>
            <span className="logo-lg">
              <img src={rain1} alt="" height="19" />
            </span>
          </Link>
        </div>
        <div data-simplebar className="h-100">
          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
        </div>
        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  );
};

Sidebar.propTypes = {
  type: PropTypes.string,
};

const mapStatetoProps = state => {
  return {
    layout: state.Layout,
  };
};
export default connect(
  mapStatetoProps,
  {}
)(withRouter(withTranslation()(Sidebar)));
