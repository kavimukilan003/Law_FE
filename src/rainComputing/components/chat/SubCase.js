import React, { useEffect, useState } from "react"
import { Button, Col, Row } from "reactstrap"
import PropTypes from "prop-types"
import { async } from "q"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import { createNewSubCase, getAllUsers } from "rainComputing/helpers/backend_helper"
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
const SubCase = ({ caseId,open,setOpen }) => {
    const history = useHistory()
  const { currentUser } = useUser()
  const [contacts, setContacts] = useState([])
  const [caseName, setCaseName] = useState("")
  const [caseIds, setCaseId] = useState("")
  const [serialNumber, setSerialNumber] = useState("")
  const [caseMembers, setCaseMembers] = useState([])
  const [searchText, setSearchText] = useState("")
  const [loading, setloading] = useState(false)
  const incrementedCaseId = parseInt(caseIds) + 1;
  console.log("caseMembers :",caseMembers)
  const isDisabled = () => {
    if (!caseName || !caseId || caseMembers?.length < 1) return true
    return false
  }
  const handleAddingGroupMembers = contact => {
    if (caseMembers.some(member => member?._id === contact._id)) {
      const membersAfterRemove = caseMembers.filter(m => m.id !== contact._id)

      setCaseMembers(membersAfterRemove)
    } else {
      setCaseMembers([...caseMembers, contact])
    }
  }
  const handleCreateSubCase = async () => {
    const payload = {
      caseId: caseId?._id,
      subCase: [
        {
          caseName:caseName,
          caseId:incrementedCaseId,
          serialNumber:serialNumber,
          caseMembers:caseMembers,
          notifyMembers:currentUser?.userID ,
          admins: currentUser?.userID,
          aflag: true,
          addedBy:currentUser?.userID,
          isCompleted: false
        },
    ]
    }
    const res = await createNewSubCase (payload)
    if(res.success){
        toastr.success(
            `Case  has been created successfully`,
            "Case creation success"
          )
          console.log("res",res)
           history.push(`/chat-rc?g_id=${res?.subCaseId}`)
        //   history.push(`/chat-rc?g_subCase=${res?.SubCase?._id}`)
          setOpen(false)
    }else {
        toastr.error(
          `  Failed to create case `,
          "Case creation failed!!!"
        )
      }
   
  }
  const handleClose = () => {
    setOpen(false)
  }
  useEffect(() => {
    if (caseId) {
      setCaseId(caseId?.caseId)
      setCaseName(caseId?.caseName)
      setSerialNumber(caseId?.serialNumber)
      setCaseMembers(
        caseId?.caseMembers.map(m => {
          const { id } = m
          return {
            id: id?._id,
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
  }, [caseId])
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
  return (
    <>
    
      <Row>
        <label
          htmlFor="example-text-input"
          className="col-md-3 col-lg-2 col-form-label"
        >
          Case name
        </label>
        <div className="col-md-8">
          <input
            className="form-control"
            type="text"
            value={caseName}
            placeholder="Case Anonymous"
            onChange={(e)=>setCaseName(e.target.value)}
          />
        </div>
      </Row>
      <Row className="my-md-3">
        <label
          htmlFor="example-text-input"
          className="col-md-3 col-lg-2 col-form-label"
        >
          Case Id
        </label>
        <div className="col-md-8">
          {/* Display the incremented caseId in the input field */}
          <input className="form-control" type="text"value={incrementedCaseId} placeholder="xxxx-xxxx" onChange={(e)=>setCaseId(e.target.value)}/>
        </div>
      </Row>
      <Row className="my-md-3">
        <label
          htmlFor="example-text-input"
          className="col-md-3 col-lg-2 col-form-label"
        >
          Serial Number
        </label>
        <div className="col-md-8">
          <input
            className="form-control"
            type="text"
            value={serialNumber}
            placeholder="xxxx-xxxx"
            onChange={(e)=>setSerialNumber(e.target.value)}
          />
        </div>
      </Row>
      {/* <Row className="my-md-3">
        <label
          htmlFor="example-text-input"
          className="col-md-3 col-lg-2 col-form-label"
        >
          Event Date
        </label>
        <div className="col-md-8">
          <input
            className="form-control"
            type="date"
            value={caseEventDate}
            name="caseId"
            onChange={e => setCaseEventDate(e.target.value)}
          />
        </div>
      </Row> */}
      {/* <Row className="my-md-3">
        <label
          htmlFor="example-text-input"
          className="col-md-3 col-lg-2 col-form-label"
        >
          Event
        </label>
        <div className="col-md-8">
          <input
            className="form-control"
            type="text"
            placeholder="Enter the event"
            value={caseEvent}
            name="caseId"
            onChange={e => setCaseEvent(e.target.value)}
          />
        </div>
      </Row> */}
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

              <div className="font-size-0 text-body ">{currentUser?.email}</div>
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
                      <div> {member?.firstname + " " + member?.lastname}</div>
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
              onClick={handleClose}
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
              onClick={() => handleCreateSubCase()}
              disabled={isDisabled()}
            >
              Create
            </button>
          )}
         
        </div>
      </Row>
    </>
  )
}
SubCase.propTypes = {
  caseId: PropTypes.object,
  setOpen: PropTypes.func,
  open: PropTypes.func,
}
export default SubCase
