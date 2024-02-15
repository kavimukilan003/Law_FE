import PropTypes from "prop-types"
import React from "react"
import { Link } from "react-router-dom"
import { Card, CardBody, Col, UncontrolledTooltip } from "reactstrap"
import { attImages } from "helpers/mockData"
import "./landingcard.scss"

const LandingCard = props => {
  const imgIndex = Math.floor(Math.random() * 8)
  const { user } = props
  return (
    <React.Fragment>
      <Col xl="4" md="6" sm="12">
        <Link to={`/projects-overview?uid=${user._id}`}>

        <Card className="text-center " id="attcard">
          <CardBody>
            <div className="d-flex">
              <div id="attimg">
                <img
                  className="avatar-xl1"
                  src={
                    user?.regUser?.profilePic
                      ? user?.regUser?.profilePic
                      : attImages[imgIndex].url
                  }
                  alt="profile image"
                />
              </div>
              <div id="attdetail">
                <div className="mt-1 mx-3">
                  <h5 id="attname" className="font-size-16 mb-1 text-primary ">
                    {user?.regUser?.firstname} {user?.regUser?.lastname}{" "}
                    {user?.initial}
                  </h5>
                </div>{" "}
                <br></br>
                {user?.firm ? (
                  <p className="mx-3 text-dark" id="attfirm">
                    {user?.firm}
                  </p>
                ) : (
                  <p className="mx-3 text-dark" id="attfirm">
                    {" PATTENT ATTORNEY & LAW"}
                  </p>
                )}
                <p className="mx-3 text-muted">Attorney</p>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <div id="prof"></div>
              <div className="d-flex mx-3">
                <Link to={`/chat-rc`} id={"message" + user._id}>
                  <UncontrolledTooltip
                    placement="bottom"
                    target={"message" + user._id}
                  >
                    Chat
                  </UncontrolledTooltip>
                  <div id="attmenus">
                    <i className="bx bx-message-square-dots" id="atticon" />
                  </div>
                </Link>
              </div>
              <div className="d-flex mx-3">
                <Link
                  to={`/projects-overview?uid=${user._id}`}
                  id={"profile" + user._id}
                >
                  <div id="attmenus">
                    <i className="bx bx-user-circle" id="atticon" />
                  </div>
                </Link>
                <UncontrolledTooltip
                  placement="bottom"
                  target={"profile" + user._id}
                >
                  Profile
                </UncontrolledTooltip>
              </div>
              {user?.domain && (
                <div className="d-flex mx-3">
                  <a
                    href={`https://${user?.domain}`}
                    target="_blank"
                    rel="noreferrer"
                    id={"domain" + user._id}
                  >
                    <div id="attmenus">
                      <i className="bx bx-link-external" id="atticon" />
                    </div>
                  </a>
                  <UncontrolledTooltip
                    placement="bottom"
                    target={"domain" + user._id}
                  >
                    Visit Domain
                  </UncontrolledTooltip>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
        </Link>
      </Col>
    </React.Fragment>
  )
}

LandingCard.propTypes = {
  user: PropTypes.any,
}

export default LandingCard
