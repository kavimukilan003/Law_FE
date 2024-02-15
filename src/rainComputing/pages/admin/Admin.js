import React, { useEffect, useState } from "react"
import MetaTags from "react-meta-tags"
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardTitle,
  CardBody,
  Form,
  Table,
} from "reactstrap"
import { Link } from "react-router-dom"
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import RaindropImg from "../../../assets/images/rain-drop.png"
import {
  allUsersList,
  allAttorneysList,
  allFirmsList,
  allReqAttorneyList,
  attorneyStatusUpdate,
} from "rainComputing/helpers/backend_helper"
import PaymentTranaction from "./adminLogin/TransactionDetails"

const Admin = () => {
  const [allUsers, setAllUsers] = useState([])
  const [allAttorneys, setAllAttorneys] = useState([])
  const [allFirms, setAllFirms] = useState([])
  const [allReqAttorney, setAllReqAttorney] = useState([])
  const [selectedReqAttorney, setSelectedReqAttorney] = useState(null)

  const getReqAttorneys = async () => {
    const res = await allReqAttorneyList({})
    if (res.success) {
      setAllReqAttorney(res.reqAttorney)
    }
  }

  const handleApprovedAttorney = async () => {
    const payload = {
      status: "approved",
      attorneyID: [selectedReqAttorney?._id],
      userID: [selectedReqAttorney?._id],
    }
    const res = await attorneyStatusUpdate(payload)
    if (res.success) {
      await getReqAttorneys()
    } else {
      console.log("Error : ", res)
    }
  }

  const handleRejectAttorney = async () => {
    const payload = {
      status: "rejected",
      attorneyID: [selectedReqAttorney?._id],
      userID: [selectedReqAttorney?._id],
    }
    const res = await attorneyStatusUpdate(payload)
    if (res.success) {
      await getReqAttorneys()
    } else {
      console.log("Error : ", res)
    }
  }

  useEffect(() => {
    const getAllUsers = async () => {
      const res = await allUsersList({})
      if (res.success) {
        setAllUsers(res.users)
      }
    }
    getAllUsers()
  }, [])

  useEffect(() => {
    const getAllAttorneys = async () => {
      const res = await allAttorneysList({})
      if (res.success) {
        setAllAttorneys(res.attorneys)
      }
    }
    getAllAttorneys()
  }, [])

  useEffect(() => {
    const getAllFirms = async () => {
      const res = await allFirmsList({})
      if (res.success) {
        setAllFirms(res.firms)
      }
    }
    getAllFirms()
  }, [])

  useEffect(() => {
    getReqAttorneys()
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Admin Page | RainComputing </title>
        </MetaTags>
        <Container fluid>
          <Breadcrumbs title={"Rain"} breadcrumbItem={"Admin Dashboard"} />
          {/* <h5>Admin Dashboard</h5> */}

          <Row>
            <Col xl="4">
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs="7">
                      <div className="text-primary p-3">
                        <h5 className="text-primary">WELCOME ADMIN !</h5>
                        <p>Admin Dashboard</p>
                      </div>
                    </Col>
                    <Col xs="5" className="align-self-center">
                      <img
                        src={RaindropImg}
                        alt=""
                        className="img-fluid avatar-sm"
                      />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <Row>
                    <Col sm="4">
                      <h5 className="font-size-15 mt-4 ms-4">User</h5>
                      <p className="text-muted mb-0 ms-4">{allUsers.length}</p>
                    </Col>

                    <Col sm="8">
                      <div className="pt-4">
                        <Row>
                          <Col xs="6">
                            <h5 className="font-size-15">Attorneys</h5>
                            <p className="text-muted mb-0">
                              {allAttorneys.length}
                            </p>
                          </Col>
                          <Col xs="6">
                            <h5 className="font-size-15">Firms</h5>
                            <p className="text-muted mb-0">{allFirms.length}</p>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col xl="8">
              <Row>
                <Col md="4">
                  <Card className="overflow-hidden p-4">
                    <CardBody>
                      <div className="d-flex">
                        <div className="flex-grow-1">
                          <h5 className="fw-medium mt-2">Users List</h5>
                          <Link to="/userlist-page">
                            <Button
                              color="primary"
                              type="view"
                              className="mt-4"
                            >
                              View
                            </Button>
                          </Link>
                        </div>
                        <div className="avatar-sm rounded-circle bg-primary align-self-top mini-stat-icon">
                          <span className="avatar-title rounded-circle bg-primary">
                            <i
                              className={"bx " + "bx bx-user" + " font-size-24"}
                            ></i>
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4">
                  <Card className="overflow-hidden p-4">
                    <CardBody>
                      <div className="d-flex">
                        <div className="flex-grow-1">
                          <h5 className="fw-medium mt-2">Attorneys</h5>
                          <br/>
                          <Link to="/attorneylist-page">
                            <Button
                              color="primary"
                              type="view"
                              className="mt-4"
                            >
                              View
                            </Button>
                          </Link>
                        </div>
                        <div className="avatar-sm rounded-circle bg-primary align-self-top mini-stat-icon">
                          <span className="avatar-title rounded-circle bg-primary">
                            <i
                              className={
                                "bx" + " bx bx-user-circle " + " font-size-24"
                              }
                            ></i>
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4">
                  <Card className="overflow-hidden p-4">
                    <CardBody>
                      <div className="d-flex">
                        <div className="flex-grow-1">
                          <h5 className="fw-medium mt-2">Cases List</h5>
                          <Link to="/caselist-page">
                            <Button
                              color="primary"
                              type="view"
                              className="mt-4"
                            >
                              View
                            </Button>
                          </Link>
                        </div>
                        <div className="avatar-sm rounded-circle bg-primary align-self-top mini-stat-icon">
                          <span className="avatar-title rounded-circle bg-primary">
                            <i
                              className={
                                "bx" + " bx bx bxs-briefcase " + " font-size-24"
                              }
                            ></i>
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
          <Col xl="12">
            <Row>
              <h5>Requested Attorneys List :</h5>
              {allReqAttorney && allReqAttorney.length > 0 ? (
                <Card>
                  <CardBody>
                    <Form>
                      <Row>
                        <Col>
                          <div className="table-responsive">
                            <Table className="table table-striped mb-0">
                              <thead>
                                <tr>
                                  <th scope="col">S No</th>
                                  <th scope="col">Attorney Name</th>
                                  <th scope="col">Bar Number</th>
                                  <th scope="col">Email</th>
                                  <th scope="col">Action</th>
                                  <th scope="col"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {allReqAttorney.map((attorneys, j) => (
                                  <tr key={j}>
                                    <td>{j + 1} </td>
                                    <td>
                                      {" "}
                                      {attorneys?.regUser?.firstname}{" "}
                                      {attorneys?.regUser?.lastname}
                                    </td>
                                    <td> {attorneys.barNumber}</td>
                                    <td> {attorneys?.regUser?.email}</td>
                                    <td>
                                      <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => {
                                          setSelectedReqAttorney(attorneys)
                                          handleApprovedAttorney(attorneys)
                                        }}
                                      >
                                        Approve
                                      </button>
                                    </td>
                                    <td>
                                      <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => {
                                          setSelectedReqAttorney(attorneys)
                                          handleRejectAttorney(attorneys)
                                        }}
                                      >
                                        Reject
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              ) : (
                <p className="text-center">
                  You Don&apos;t have any Request Attorneys
                </p>
              )}
            </Row>
          </Col>
          <Row>
            <Col xl="12">
              <PaymentTranaction />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Admin
