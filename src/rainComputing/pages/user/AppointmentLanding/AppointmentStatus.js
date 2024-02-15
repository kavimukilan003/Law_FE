import React, { useEffect, useState } from "react"
import MetaTags from "react-meta-tags"
import {
  Col,
  Container,
  Row,
  Badge,
  Card,
  CardBody,
  UncontrolledTooltip,
} from "reactstrap"
import Breadcrumb from "components/Common/Breadcrumb"
import { Link } from "react-router-dom"
import profile from "assets/images/avatar-defult.jpg"
import { appointmentUserStatus } from "rainComputing/helpers/backend_helper"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import "./AppointmentStatus.css"

const AppointmentCard = () => {
  const [statusUpdate, setStatusUpdate] = useState(null)
  const [pageLoader, setPageLoader] = useState(true)
  const { currentUser } = useUser()

  useEffect(() => {
    const getStatusByUser = async () => {
      setPageLoader(true)
      const res = await appointmentUserStatus({
        userID: currentUser?.userID,
      })
      if (res.success) {
        setStatusUpdate(res.list)
      }
      setPageLoader(false)
    }
    getStatusByUser()
  }, [])

  return (
    <React.Fragment>
      <div className="page-contents" style={{ marginTop: 100 }}>
        {pageLoader ? (
          <Row>
            <Col xs="12">
              <div className="text-center my-3">
                <Link to="#" className="text-success">
                  <i className="bx bx-hourglass bx-spin me-2" />
                  Loading. . .
                </Link>
              </div>
            </Col>
          </Row>
        ) : (
          <>
            <Link to="/">
              <Breadcrumb title="Rain" breadcrumbItem="Appointment Status" />
            </Link>
            {statusUpdate && statusUpdate.length > 0 ? (
              <Row>
                {statusUpdate &&
                  statusUpdate.map((att, i) => (
                    <Col xl="4" md="6" sm="12" key={i}>
                      <Card className="rounded-4">
                        <CardBody>
                          <div className="d-flex">
                            <div className="avatar-md me-4">
                              <span className="avatar-title rounded-circle  bg-light text-danger ">
                                <img
                                  src={
                                    att?.attorney?.regUser?.profilePic
                                      ? att?.attorney?.regUser?.profilePic
                                      : profile
                                  }
                                  className="rounded-circle avatar-md"
                                  alt=""
                                  style={{ objectFit: "cover" }}
                                />
                              </span>
                            </div>

                            <div className="flex-grow-1 overflow-hidden">
                              <h5 className="text-primary font-size-18 my-3">
                                {att?.attorney?.regUser?.firstname}
                                {"  "}
                                {att?.attorney?.regUser?.lastname}
                              </h5>
                              <p className="text-muted font-size-12 ">
                                ATTORNEY
                              </p>
                            </div>
                          </div>
                        </CardBody>
                        <div className="px-4 py-3 border-top d-flex">
                          <div>
                            <div className="d-flex ">
                              <h6 className="mt-1 text-black-50 me-4 font-size-14">
                                Status :
                              </h6>
                              <ul className="list-inline mb-0">
                                <li className=" font-size-14">
                                  <div className="">
                                    {" "}
                                    <Badge
                                      className={`${
                                        att?.appointmentstatus === "approved"
                                          ? "bg-success"
                                          : "bg-warning"
                                      }`}
                                    >
                                      {att?.appointmentstatus}
                                    </Badge>
                                  </div>
                                </li>
                              </ul>
                            </div>
                            <div className="mt-2">
                              <ul className="list-inline mb-0 d-flex">
                                <h6 className="mt-1 text-black-50 me-4 font-size-14 ">
                                  {" "}
                                  Paid :
                                </h6>
                                <div className="flex-grow text-center">
                                  {" "}
                                  <li
                                    className="list-inline-item text-success mt-1 ms-3 "
                                    id="money"
                                  >
                                    {/* <i className="mdi mdi-cash-usd-outline mdi-24px me-2" /> */}
                                    {"$ 200"}
                                  </li>
                                </div>
                              </ul>
                            </div>
                          </div>

                          <div className="flex-grow-1 text-center py-3">
                            {statusUpdate &&
                              att?.appointmentstatus === "approved" && (
                                <Link
                                  to={`/chat-rc?uid=${att?.attorney?.regUser?._id}`}
                                >
                                  <li className="list-inline-item " id="chat">
                                    {/* <i className="mdi mdi-chat-outline mdi-24px me-1" />  */}
                                    <i className="bi bi-chat-right-dots-fill font-size-24 " />
                                    {""}
                                    <UncontrolledTooltip
                                      placement="bottom"
                                      target="chatPro"
                                    >
                                      ChatPro
                                    </UncontrolledTooltip>
                                  </li>
                                </Link>
                              )}
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
              </Row>
            ) : (
              <p className="text-center">
                You Don&apos;t have any Request Attorney
              </p>
            )}
          </>
        )}
      </div>
    </React.Fragment>
  )
}

export default AppointmentCard
