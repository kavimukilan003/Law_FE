import MetaTags from "react-meta-tags"
import React, { useState, useEffect } from "react"
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap"
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import DeleteModal from "rainComputing/components/modals/DeleteModal"
import { useModal } from "rainComputing/helpers/hooks/useModal"
import {
  getAllAppointmentRequestById,
  appointmentStatusUpdate,
} from "rainComputing/helpers/backend_helper"
import { getFileFromGFS } from "rainComputing/helpers/backend_helper"
import fileDownload from "js-file-download"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import { Link } from "react-router-dom"
//Import Breadcrumb
import Breadcrumb from "components/Common/Breadcrumb"
import ReqUserAppointmentDetails from "./ReqUserAppDetails"

const RequestUser = () => {
  const { currentAttorney } = useUser()
  const [modalOpen, setModalOpen, toggleModal] = useModal(false)
  const [pageLoader, setPageLoader] = useState(true)
  const [selectedAppointmentReq, setSelectedAppointmentReq] = useState(null)
  toastr.options = {
    progressBar: true,
    closeButton: true,
  }
  const [appointmentReq, setAppointmentReq] = useState([])
  const [refetch, setRefetch] = useState(false)
  const handleFileDownload = async ({ id, filename }) => {
    getFileFromGFS(
      { id },
      {
        responseType: "blob",
      }
    ).then(res => {
      fileDownload(res, filename)
    })
  }

  useEffect(() => {
    onGetAllAppointmentRequest()
  }, [currentAttorney])
  const onGetAllAppointmentRequest = async () => {
    setPageLoader(true)
    const RequestRes = await getAllAppointmentRequestById({
      userID: currentAttorney._id,
    })
    if (RequestRes.success) {
      setAppointmentReq(RequestRes.appointment)
    }
    setPageLoader(false)
  }
  const handleAppointmentAccept = async ({ id }) => {
    const payload = {
      appointmentstatus: "approved",
      appointmentID: id,
    }
    const res = await appointmentStatusUpdate(payload)
    if (res.success) {
      setRefetch(true)
      toastr.success(`Appointment  has been Accepted `, "Success")
      await onGetAllAppointmentRequest()
    } else {
      setRefetch(false)
      toastr.error(`Failed to Accept Appointment `, "Failed!!!")
    }
  }
  const handleAppointmentReject = async ({ id }) => {
    const payload = {
      appointmentstatus: "rejected",
      appointmentID: id,
    }
    const res = await appointmentStatusUpdate(payload)
    if (res.success) {
      setRefetch(true)
      toastr.success(`Appointment  has been Rejected `, "Success")
      await onGetAllAppointmentRequest()
    } else {
      setRefetch(false)
      toastr.error(`Failed to Reject Appointment `, "Failed!!!")
    }
    setModalOpen(false)
  }
  return (
    <React.Fragment>
      <DeleteModal
        show={modalOpen}
        // onDeleteClick={handleAppointmentReject}
        confirmText="Yes,Reject"
        cancelText="Cancel"
        onCloseClick={toggleModal}
      />

      <div className="page-content">
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
            {" "}
            {appointmentReq && appointmentReq.length > 0 ? (
              <Row>
                <Col lg="12">
                  {appointmentReq &&
                    appointmentReq.map(
                      (appointment, i) =>
                        appointment?.appointmentstatus === "requested" && (
                          <Card key={i}>
                            <CardBody>
                              <div>
                                <Row>
                                  <label className="col-md-5 col-lg-2 col-form-label">
                                    User Name
                                  </label>
                                  <div className="col-md-5 col-lg-2 col-form-label ">
                                    <label className="fw-bolder">
                                      {appointment?.User?.firstname +
                                        " " +
                                        appointment?.User?.lastname}
                                    </label>
                                  </div>
                                </Row>
                                <Row>
                                  <label className="col-md-5 col-lg-2 col-form-label">
                                    Email
                                  </label>
                                  <div className="col-md-5 col-lg-2 col-form-label ">
                                    <label className="fw-bolder text-primary">
                                      {appointment?.User?.email}
                                    </label>
                                  </div>
                                </Row>
                                <Row>
                                  <label className="col-md-5 col-lg-2 col-form-label">
                                    Case Details
                                  </label>
                                  <div className="col-md-5  ">
                                    <label className="text-normal">
                                      {appointment?.caseData}
                                    </label>
                                  </div>
                                </Row>
                                {appointment?.isAttachments ? (
                                  <Row>
                                    <label className="col-md-5 col-lg-2 col-form-label">
                                      Case Document
                                    </label>
                                    <div className="col-md-5">
                                      <label>
                                        {appointment?.attachments?.map(
                                          (att, a) => (
                                            <div key={a} className="att_item">
                                              <i
                                                className="mdi mdi-file-document-multiple text-primary mdi-24px"
                                                onClick={() =>
                                                  handleFileDownload({
                                                    id: att?.id,
                                                    filename: att?.name,
                                                  })
                                                }
                                              />
                                            </div>
                                          )
                                        )}
                                      </label>
                                    </div>
                                  </Row>
                                ) : null}

                                <Row>
                                  {/* <div className="text-center mt-3"> */}
                                  <div className="modal-footer">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleAppointmentAccept({
                                          id: appointment?._id,
                                        })
                                      }}
                                      className="btn btn-primary ms-3 w-lg "
                                      data-dismiss="modal"
                                    >
                                      Accept
                                    </button>

                                    <button
                                      type="button"
                                      className="btn btn-danger ms-3 w-lg"
                                      onClick={() => {
                                        // setModalOpen(true)
                                        handleAppointmentReject({
                                          id: appointment?._id,
                                        })
                                      }}
                                    >
                                      Reject
                                    </button>
                                  </div>
                                </Row>
                              </div>
                            </CardBody>
                          </Card>
                        )
                    )}
                  <ReqUserAppointmentDetails refetch={refetch} />
                </Col>
              </Row>
            ) : (
              <p className="text-center">
                You Don&apos;t have any Appointment Request
              </p>
            )}
          </>
        )}
      </div>
    </React.Fragment>
  )
}

export default RequestUser
