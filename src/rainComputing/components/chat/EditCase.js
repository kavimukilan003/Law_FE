import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import toastr from "toastr"
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import { getAllUsers, updateCase } from "rainComputing/helpers/backend_helper"

const EditCase = ({
  open,
  setOpen,
  toggleOpen,
  currentCase,
  getAllCases,
  allCases,
  setAllCases,
  getSubGroups,
}) => {
  const { currentUser } = useUser()
  const [contacts, setContacts] = useState([])
  const [caseName, setCaseName] = useState("")
  const [caseId, setCaseId] = useState("")
  const [serialNumber, setSerialNumber] = useState("")
  const [caseMembers, setCaseMembers] = useState([])
  const [searchText, setSearchText] = useState("")
  const [loading, setloading] = useState(false)
  const [threadIdCondition, setThreadIdCondition] = useState(
    currentCase?.threadIdCondition
  )
  const [emailMembers, setEmailMembers] = useState([])

  // useEffect(() => {
  //   // Save the threadIdCondition to local storage whenever it changes
  //   localStorage.setItem("threadIdCondition", threadIdCondition)
  // }, [threadIdCondition])

  // Initialize with a default condition
  toastr.options = {
    progressBar: true,
    closeButton: true,
  }

  /*Closing Modal */
  const handleClose = () => {
    setThreadIdCondition(currentCase?.threadIdCondition)
    setOpen(false)
  }

  const isDisabled = () => {
    if (!caseName || !caseId || caseMembers?.length < 1) return true
    return false
  }

  const handleAddingGroupMembers = contact => {
    if (caseMembers.some(member => member?._id === contact._id)) {
      const membersAfterRemove = caseMembers.filter(m => m._id !== contact._id)

      setCaseMembers(membersAfterRemove)
    } else {
      setCaseMembers([...caseMembers, contact])
    }
  }

  const handleEveryOne = () => {
    setThreadIdCondition("EveryOne")
    const structuredMembers = caseMembers?.map(m => m?._id)
    setEmailMembers(structuredMembers)
  }

  const handleGroupMembers = () => {
    setThreadIdCondition("GroupMembers")
    setEmailMembers(currentCase?.admins)
  }

  const handleUpdatingCase = async () => {
    setloading(true)
    const structuredMembers = caseMembers?.map(m => m?._id)
    const payLoad = {
      id: currentCase?._id,
      caseId,
      caseName,
      serialNumber,
      members: structuredMembers,
      admin: currentUser?.userID,
      threadIdCondition,
    }
    const res = await updateCase(payLoad)
    if (res.success) {
      toastr.success(
        `Case ${res?.caseId} has been updated successfully`,
        "Success"
      )
      setAllCases(
        allCases.map(i => (i._id === currentCase?._id ? res?.updatedCase : i))
      )
      setOpen(false)
    } else {
      toastr.error(`Failed to update case due to ${res?.msg}`, "Failed!!!")
    }
    setloading(false)
  }

  useEffect(() => {
    const handleFetchingContacts = async () => {
      if (searchText === "") {
        setContacts([])
      } else {
        const contactRes = await getAllUsers({
          userID: currentUser.userID,
          searchText,
        })
        if (contactRes.success) {
          setContacts(contactRes.users)
        } else {
          toastr.error(
            `Failed to fetch contacts ${contactRes?.msg}`,
            "Failed on fetching contacts"
          )
          setContacts([])
        }
      }
    }
    handleFetchingContacts()
  }, [searchText])

  useEffect(() => {
    if (currentCase) {
      setCaseId(currentCase?.caseId)
      setCaseName(currentCase?.caseName)
      setSerialNumber(currentCase?.serialNumber)
      setCaseMembers(
        currentCase?.caseMembers.map(m => {
          const { id } = m
          return {
            _id: id?._id,
            firstname: id?.firstname,
            lastname: id?.lastname,
            email: id?.email,
          }
        })
      )
    }
    return () => {
      setCaseName("")
      setCaseId("")
      setSerialNumber("")
      setCaseMembers([])
    }
  }, [currentCase])

  return (
    <>
      <Modal
        isOpen={open}
        toggle={toggleOpen}
        centered={true}
        size="lg"
        backdrop={"static"}
      >
        <ModalBody>
          <div className="d-flex gap-3 align-items-center">
            <i
              className="mdi mdi-keyboard-backspace mdi-24px pointer"
              onClick={() => handleClose()}
            />
            <span className="fw-medium">Manage Case {currentCase?.caseId}</span>
          </div>
          <Row>
            <label
              htmlFor="example-text-input"
              className="col-md-5 col-lg-2 col-form-label"
            >
              Case name
            </label>
            <div className="col-md-8">
              <input
                className="form-control"
                type="text"
                id="example-text-input"
                placeholder="Case Anonymous"
                value={caseName}
                name="caseName"
                onChange={e => setCaseName(e.target.value)}
              />
            </div>
          </Row>
          <Row className="my-md-3">
            <label
              htmlFor="caseid"
              className="col-md-5 col-lg-2 col-form-label"
            >
              Case Id
            </label>
            <div className="col-md-8">
              <input
                className="form-control"
                type="text"
                id="caseid"
                placeholder="xxxx-xxxx"
                value={caseId}
                onChange={e => setCaseId(e.target.value)}
              />
            </div>
          </Row>
          <Row className="my-md-3">
            <label
              htmlFor="caseid"
              className="col-md-5 col-lg-2 col-form-label"
            >
              Serial Number
            </label>
            <div className="col-md-8">
              <input
                className="form-control"
                type="text"
                placeholder="xxxx-xxxx"
                value={serialNumber}
                onChange={e => setSerialNumber(e.target.value)}
              />
            </div>
          </Row>

          <Row className="my-3">
            <label
              htmlFor="user-search-text"
              className="col-md-3 col-lg-2 col-form-label"
            >
              Select members
            </label>
            <div className="col-md-8">
              <input
                className="form-control"
                type="text"
                id="user-search-text"
                placeholder="Search by name,email"
                value={searchText}
                name="searchText"
                onChange={e => setSearchText(e.target.value)}
              />
            </div>
          </Row>
          <Row className="my-3">
            <label
              htmlFor="user-search-text"
              className="col-md-3 col-lg-2 col-form-label"
            >
              Email to Chat
            </label>
            <div className="col-md-8 mt-2">
              <div className=" form-check-inline">
                <input
                  className=""
                  type="radio"
                  id="everyone-radio"
                  name="threadIdCondition"
                  checked={threadIdCondition === "EveryOne"}
                  onChange={handleEveryOne}
                />
                <label>EveryOne</label>
              </div>
              <div className="form-check-inline">
                <input
                  className=""
                  type="radio"
                  id="admins-radio"
                  name="threadIdCondition"
                  checked={threadIdCondition === "GroupMembers"}
                  onChange={handleGroupMembers}
                />
                <label className="form-check-label" htmlFor="admins-radio">
                  Group Members
                </label>
              </div>
            </div>
          </Row>

          <Row>
            <Col xs={6} className="px-3 border-end border-info">
              <span className="text-muted">Members</span>
              <div className="d-flex flex-wrap gap-2 my-2">
                {contacts &&
                  contacts
                    .filter(f => !caseMembers.some(g => g?._id === f?._id))
                    .map((contact, c) => (
                      <Button
                        key={c}
                        color="light"
                        className="btn mx-1 mb-2"
                        onClick={() => handleAddingGroupMembers(contact)}
                      >
                        <div className="d-flex justify-content-between ">
                          <div>
                            {" "}
                            {contact.firstname} {contact.lastname}{" "}
                          </div>
                          {contact?.attorneyStatus === "approved" && (
                            <div>
                              {" "}
                              <i className="fas fa-star text-warning"></i>
                            </div>
                          )}
                        </div>

                        <div className="font-size-0 text-body ">
                          {contact.email}
                        </div>
                      </Button>
                    ))}
              </div>
            </Col>
            <Col xs={6} className="px-3">
              <span className="text-muted">Case Members</span>
              <div className="d-flex flex-wrap gap-2 my-2">
                <Button color="success" className="btn mx-1 mb-2">
                  <div className="d-flex ">
                    {currentUser?.firstname} {currentUser?.lastname}
                  </div>

                  <div className="font-size-0 text-body ">
                    {currentUser?.email}
                  </div>
                </Button>
                {caseMembers &&
                  caseMembers
                    .filter(a => a?._id !== currentUser?.userID)
                    .map((member, m) => (
                      <Button
                        key={m}
                        color="success"
                        className="btn mx-1 mb-2"
                        onClick={() => handleAddingGroupMembers(member)}
                      >
                        <div className="d-flex justify-content-between">
                          <div>
                            {" "}
                            {member?.firstname + " " + member?.lastname}
                          </div>
                          {member?.attorneyStatus === "approved" && (
                            <div>
                              {" "}
                              <i className="fas fa-star text-warning"></i>
                            </div>
                          )}
                        </div>

                        <div className="font-size-0 text-body ">
                          {member?.email}
                        </div>
                      </Button>
                    ))}
              </div>
            </Col>
          </Row>

          <Row>
            <div className="modal-footer">
              {!loading && (
                <button
                  type="button"
                  onClick={() => {
                    handleClose()
                  }}
                  className="btn btn-secondary "
                  data-dismiss="modal"
                >
                  Close
                </button>
              )}
              {loading ? (
                <button type="button" className="btn btn-dark ">
                  <i className="bx bx-loader bx-spin font-size-16 align-middle me-2"></i>{" "}
                  Loading
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleUpdatingCase()}
                  disabled={isDisabled()}
                >
                  Update Case
                </button>
              )}
            </div>
          </Row>
        </ModalBody>
      </Modal>
    </>
  )
}

EditCase.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  toggleOpen: PropTypes.func,
  setAllCases: PropTypes.func,
  allCases: PropTypes.func,
  getAllCases: PropTypes.any,
  getSubGroups: PropTypes.any,
  currentCase: PropTypes.object,
}
export default React.memo(EditCase)
