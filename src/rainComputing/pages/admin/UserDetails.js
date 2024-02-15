import MetaTags from "react-meta-tags"
import React, { useState, useEffect } from "react"
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap"
import { Link } from "react-router-dom"

//Import Breadcrumb
import Breadcrumb from "components/Common/Breadcrumb"
import { useQuery } from "rainComputing/helpers/hooks/useQuery"
import DeleteModal from "rainComputing/components/modals/DeleteModal"
import { useModal } from "rainComputing/helpers/hooks/useModal"
import { getUserById } from "rainComputing/helpers/backend_helper"
import { getPaymentId } from "rainComputing/helpers/backend_helper"
import { success } from "toastr"
import { set } from "lodash"
import { allPaymentData } from "rainComputing/helpers/backend_helper"
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import {
  removeUser,
  getAllUsers,
} from "rainComputing/helpers/backend_helper"
import CaseGroupDetails from "./CGDetails"

const UserDetails = () => {
  const query = useQuery()
  const [modalOpen, setModalOpen, toggleModal] = useModal(false)
  const [getUser, setGetUser] = useState(null)
  const [getPayment, setGetPayment] = useState(null)
  const [paymentData, setPaymentData] = useState([])

  const getUserId = async () => {
    const res = await getUserById({
      userId: query.get("id"),
    })
    if (res.success) {
      setGetUser(res.User)
    }
  }

  useEffect(() => {
    getUserId()
  }, [])

  const getAllPaymentData = async () => {
    const res = await allPaymentData({})
    if (res.success) {
      setPaymentData(res.paymentIntent)
    }
  }

  useEffect(() => {
    getAllPaymentData()
  }, [])
  const getPaymentStatus = p => {
    const Paid = p.find(i => i._id === getUser._id)
    return Paid ? "Paid" : "LA"
  }
  const handleRemovingUser = async () => {
    const payload = {
      userID: [getUser?._id],
    }
    const res = await removeUser(payload)
    if (res.success) {
      toastr.success(`User has been Deactivated successfully`, "Success")

      await getAllUsers()
    } else {
      console.log("Error : ", res?.msg || "error")
    }
    setModalOpen(false)
  }
  return (
    <React.Fragment>
      <DeleteModal
        show={modalOpen}
        onDeleteClick={handleRemovingUser}
        confirmText="Yes,DeActive"
        cancelText="Cancel"
        onCloseClick={toggleModal}
      />
      <div className="page-content">
        <MetaTags>
          <title>User Deatails | RainComputing </title>
        </MetaTags>
        <Container fluid>
          <Link to="/userlist-page">
            <Breadcrumb title="Rain" breadcrumbItem="User Details" />
          </Link>
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <Row>
                    <label className="col-md-5 col-lg-2 col-form-label">
                      User Name
                    </label>
                    <div className="col-md-5 col-lg-2 col-form-label ">
                      <label className="fw-bolder">
                        {getUser?.firstname + " " + getUser?.lastname}
                      </label>
                    </div>
                  </Row>
                  <Row className="my-md-3">
                    <label className="col-md-5 col-lg-2 col-form-label">
                      Email
                    </label>
                    <div className="col-md-5 col-lg-2 col-form-label ">
                      <label className="fw-bolder text-primary">
                        {getUser?.email}
                      </label>
                    </div>
                  </Row>
                  <Row className="my-md-3">
                    <label className="col-md-5 col-lg-2 col-form-label">
                      Payment
                    </label>
                    {paymentData
                      .filter(f => f?.consumerId === query.get("id"))
                      .map((p, i) => (
                        <div
                          className="col-md-5 col-lg-2 col-form-label "
                          key={i}
                        >
                          <label className="fw-bolder fw-bolder">
                            {p?.firstname}
                            {/* {paymentData?.consumerId?.firstname} */}
                            {/* {getPaymentStatus(p)} */}
                          </label>
                        </div>
                      ))}
                    {/* ))} */}
                  </Row>
                  {/* <Row className="my-md-3">
                    <label className="col-md-5 col-lg-2 col-form-label">
                      Activity
                    </label>
                    <div className="col-md-5 col-lg-2 col-form-label ">
                      <label className="fw-bolder fw-bolder"></label>
                    </div>
                  </Row> */}
                  <Row>
                    <div className="modal-footer">
                      <Link to="/userlist-page">
                        <button
                          type="button"
                          // onClick={() => {
                          //   handleClose()
                          // }}
                          className="btn btn-primary "
                          data-dismiss="modal"
                        >
                          Close
                        </button>
                      </Link>

                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                          // setSelectedUser(user)
                          setModalOpen(true)
                        }}
                      >
                        DeActivate
                      </button>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          < CaseGroupDetails />
        </Container>
      </div>
    </React.Fragment>
  )
}

export default UserDetails
