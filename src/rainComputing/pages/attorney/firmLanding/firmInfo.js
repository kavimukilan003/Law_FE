import MetaTags from "react-meta-tags"
import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Form,
  Table,
  Modal,
} from "reactstrap"
//Import Breadcrumb
import Breadcrumb from "components/Common/Breadcrumb"
import avatar from "assets/images/avatar-defult.jpg"

import {
  getFirmbyId,
  removeFirmMember,
} from "rainComputing/helpers/backend_helper"
import { useQuery } from "rainComputing/helpers/hooks/useQuery"
import { Link } from "react-router-dom"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import { getAllRegAttorneys } from "rainComputing/helpers/backend_helper"
import { addFirmMember } from "rainComputing/helpers/backend_helper"
import DeleteModal from "rainComputing/components/modals/DeleteModal"
import { useToggle } from "rainComputing/helpers/hooks/useToggle"

const FirmInfo = () => {
  const { toggleOpen, setToggleOpen, toggleIt } = useToggle(false)
  const [loading, setLoading] = useState(false)
  const query = useQuery()
  const [currentFirm, setCurrentFirm] = useState(null)
  const [addMemberModal, setAddMemberModal] = useState(false)
  const { currentAttorney } = useUser()
  const [manageMembers, setManageMembers] = useState([])
  const [members, setMembers] = useState([])
  const [selectedMember, setSelectedMember] = useState(null)

  const getAllFirms = async () => {
    const res = await getFirmbyId({
      firmId: query.get("id"),
    })
    if (res.success) {
      setCurrentFirm(res.firm)
    }
  }

  const getLeadAttorneyName = () => {
    const LeadAttorney = currentFirm?.members.find(
      i => i._id === currentFirm.attorneyId
    )
    return LeadAttorney
      ? LeadAttorney.regUser?.firstname + " " + LeadAttorney.regUser?.lastname
      : "LA"
  }
  const getLeadAttorneyEmail = () => {
    const LeadAttorney = currentFirm?.members.find(
      i => i._id === currentFirm.attorneyId
    )
    return LeadAttorney ? LeadAttorney.regUser?.email : "LA"
  }

  const toggle_addMemberModal = () => {
    setAddMemberModal(!addMemberModal)
    document.body.classList.add("no_padding")
  }
  const handleAddMemberCancel = () => {
    setAddMemberModal(false)
    setManageMembers([])
  }
  const handleSelectFirmMembers = id => {
    if (manageMembers.includes(id)) {
      const membersAfterRemove = manageMembers.filter(m => m !== id)
      setManageMembers(membersAfterRemove)
    } else {
      setManageMembers([...manageMembers, id])
    }
  }
  const handleAddingFirmMembers = async () => {
    if (manageMembers?.length < 1) {
    } else {
      const payload = {
        firmId: currentFirm._id,
        members: manageMembers,
      }
      const updatedFirmRes = await addFirmMember(payload)
      if (updatedFirmRes.success) {
        setManageMembers([])
        await getAllFirms()
      } else {
        console.log("Error : ", updatedFirmRes?.msg || "error")
      }
    }
    setAddMemberModal(false)
  }

  const handleRemovingFirmMembers = async () => {
    const payload = {
      firmId: currentFirm._id,
      members: [selectedMember?._id],
    }
    const res = await removeFirmMember(payload)
    if (res.success) {
      await getAllFirms()
    } else {
      console.log("Error : ", res?.msg || "error")
    }
    setToggleOpen(false)
  }

  useEffect(() => {
    if (currentAttorney?._id) {
      const getAllRegUser = async () => {
        const res = await getAllRegAttorneys({
          attorneyID: currentAttorney._id,
        })
        if (res.success) {
          setMembers(res.attorneys)
        }
      }
      getAllRegUser()
    }
  }, [currentAttorney])

  useEffect(() => {
    getAllFirms()
  }, [])

  return (
    <React.Fragment>
      <DeleteModal
        show={toggleOpen}
        onDeleteClick={handleRemovingFirmMembers}
        confirmText="Yes,Remove"
        cancelText="Cancel"
        onCloseClick={toggleIt}
      />
      <MetaTags>
        <title>Firm | RainComputing </title>
      </MetaTags>
      <div className="page-content">
        <>
          <Modal
            size="lg"
            isOpen={addMemberModal}
            toggle={() => {
              toggle_addMemberModal()
            }}
            backdrop={"static"}
            id="staticBackdrop"
            centered
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="myLargeModalLabel">
                Adding Firm Members
              </h5>
              <button
                onClick={() => {
                  handleAddMemberCancel()
                }}
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Row className="mb-3">
                <p className="col-md-2 text-center mt-1">Select Members</p>
                <div
                  className="col-md-10 px-1 d-flex flex-wrap"
                  style={{ height: "max-content" }}
                >
                  {currentFirm &&
                    members &&
                    members
                      .filter(
                        f => !currentFirm.members.some(g => g._id === f._id)
                      )
                      .map((mem, i) => (
                        <Button
                          key={i}
                          color={
                            manageMembers.includes(mem._id)
                              ? "success"
                              : "light"
                          }
                          className="btn-rounded mx-1 mb-2"
                          onClick={() => handleSelectFirmMembers(mem._id)}
                        >
                          <div className="d-flex ">
                            {mem?.regUser?.firstname} {mem?.regUser?.lastname}
                          </div>
                          <div className="font-size-0 text-body ">
                            {mem?.regUser?.email}
                          </div>
                        </Button>
                      ))}
                </div>
              </Row>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => {
                  handleAddMemberCancel()
                }}
                className="btn btn-secondary "
                data-dismiss="modal"
              >
                Close
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleAddingFirmMembers()}
              >
                Add Member
              </button>
            </div>
          </Modal>
        </>
        <Container fluid>
          <Link to="/firmlanding">
            <Breadcrumb title="Rain" breadcrumbItem="Firm Info" />
          </Link>
          {currentFirm ? (
            <>
              <Row>
                <Col lg="12">
                  <Card>
                    <CardBody>
                      <div className="d-flex">
                        <div className="ms-3">
                          <img
                            src={avatar}
                            alt=""
                            className="avatar-md rounded-circle img-thumbnail"
                          />
                        </div>
                        <div className="flex-grow-1 align-self-center ms-5">
                          <div className="text-muted">
                            <h5 className="mb-3">
                              FIRM NAME : {currentFirm.firmName}
                            </h5>
                            <h5 className="mb-1 font-weight-bold text-primary">
                              {getLeadAttorneyName()}{" "}
                            </h5>
                            <p className="mb-1 text-primary">
                              {getLeadAttorneyEmail()}{" "}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <h4 className="card-title mb-4">Firm Members</h4>
              <Card>
                <CardBody>
                  <Form
                    onSubmit={e => {
                      e.preventDefault()
                      return false
                    }}
                  >
                    {currentAttorney?._id === currentFirm?.attorneyId && (
                      <Row>
                        <Col>
                          <div className="text-sm-end">
                            <Button
                              type="button"
                              color="primary"
                              className="btn-rounded  mb-2 me-2"
                              onClick={() => toggle_addMemberModal()}
                            >
                              <i className="mdi mdi-plus me-1" />
                              Add New Member
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    )}
                    <Row>
                      <Col>
                        <div className="table-responsive">
                          <Table className="table table-striped mb-0">
                            <thead>
                              <tr>
                                <th scope="col">S No</th>
                                <th scope="col">First Name</th>
                                <th scope="col">Last Name</th>
                                <th scope="col">Email</th>
                                {currentAttorney?._id ===
                                  currentFirm?.attorneyId && (
                                  <th scope="col">Action</th>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {currentFirm?.members
                                // .filter(i => i._id !== currentAttorney?._id)
                                .map((member, j) => (
                                  <tr key={j}>
                                    <td> {j + 1} </td>
                                    <td> {member.regUser?.firstname} </td>
                                    <td>{member.regUser?.lastname} </td>
                                    <td> {member.regUser?.email} </td>
                                    {currentAttorney?._id ===
                                      currentFirm?.attorneyId && (
                                      <td>
                                        {member._id !==
                                          currentFirm?.attorneyId && (
                                          <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => {
                                              setSelectedMember(member)
                                              setToggleOpen(true)
                                            }}
                                          >
                                            Remove
                                          </button>
                                        )}
                                      </td>
                                    )}
                                  </tr>
                                ))}
                            </tbody>
                          </Table>
                        </div>
                      </Col>
                    </Row>
                    {/* <Row>
                  <Col md="6">
                  </Col>
                </Row>  */}
                    {/* {loading ? (
                      <button
                        type="button"
                        className="btn btn-dark"
                        style={{ cursor: "not-allowed" }}
                      >
                        <i className="bx bx-loader bx-spin font-size-16 align-middle me-2"></i>
                        Registering...
                      </button>
                    ) : (
                      <Button color="primary" type="submit">
                        Update
                      </Button>
                    )} */}
                  </Form>
                </CardBody>
              </Card>
            </>
          ) : (
            <div>Loading ......</div>
          )}
        </Container>
      </div>
    </React.Fragment>
  )
}

export default FirmInfo
