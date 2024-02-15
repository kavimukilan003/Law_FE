import React, { useState } from "react"
import { Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import PropTypes from "prop-types"
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import { createSubgroup } from "rainComputing/helpers/backend_helper"

const CreateSubGroup = ({
  open,
  setOpen,
  toggleOpen,
  caseMembers,
  caseId,
  getSubGroups,
}) => {
  const { currentUser } = useUser()
  const [subGroupName, setSubGroupName] = useState("Private Group")
  const [subGroupMembers, setSubGroupMembers] = useState([])
  const [groupColor, setGroupColor] = useState("#0000ff")

  toastr.options = {
    progressBar: true,
    closeButton: true,
  }
  const handleAddingNewSubgroupMembers = id => {
    if (subGroupMembers.includes(id)) {
      const membersAfterRemove = subGroupMembers.filter(m => m !== id)
      setSubGroupMembers(membersAfterRemove)
    } else {
      setSubGroupMembers([...subGroupMembers, id])
    }
  }

  const getMemberName = id => {
    const memberName = caseMembers?.find(member => member?.id?._id === id)
    if (memberName)
      return memberName?.id?.firstname + " " + memberName?.id?.lastname
    return id
  }

  const handleClose = () => {
    setSubGroupMembers([])
    setOpen(false)
  }

  const handleSubgroupCreation = async () => {
    const payload = {
      admin: currentUser?.userID,
      members: [currentUser?.userID, ...subGroupMembers],
      groupName: subGroupName,
      caseId: caseId,
      color: groupColor,
    }
    const res = await createSubgroup(payload)
    if (res.success) {
      toastr.success(
        `Subgroup ${subGroupName} has been created successfully`,
        "Subgroup creation success"
      )
      await getSubGroups()
      handleClose()
    } else {
      toastr.error(` ${subGroupName} ${res?.msg}`, "Failed to create Subgroup")
    }
  }

  return (
    <Modal
      isOpen={open}
      toggle={toggleOpen}
      centered={true}
      size="lg"
      backdrop={"static"}
    >
      <ModalHeader
        className="text-white "
        style={{ backgroundColor: groupColor }}
      >
        <div className="d-flex text-white gap-2">
          <i
            className="mdi mdi-keyboard-backspace mdi-24px text-white pointer"
            onClick={() => handleClose()}
          />
          <div>
            <input
              className="form-control form-control-sm"
              type="text"
              placeholder="subgroup name"
              value={subGroupName}
              onChange={e => setSubGroupName(e.target.value)}
            />
            <small className="m-0 p-0" style={{ fontSize: 10 }}>
              You have {subGroupMembers?.length + 1 || 1} member
            </small>
          </div>
          <input
            type="color"
            id="favcolor"
            value={groupColor}
            onChange={e => setGroupColor(e.target.value)}
            className="pointer"
          ></input>
        </div>
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col xs={6} className="px-3 border-end border-info">
            <span className="text-muted">Case Member</span>
            <div className="d-flex flex-wrap gap-4 my-2">
              {caseMembers &&
                caseMembers
                  .filter(f => !subGroupMembers.some(g => g === f?.id?._id))
                  .filter(a => a?.id?._id !== currentUser?.userID)
                  .map((member, m) => (
                    <div
                      key={m}
                      className="bg-light px-2 py-1 rounded pointer"
                      onClick={() =>
                        handleAddingNewSubgroupMembers(member?.id?._id)
                      }
                    >
                      <span>
                        {member?.id?.firstname} {member?.id?.lastname}
                      </span>
                      <i className="mdi mdi-plus-circle-outline pt-1 px-1" />
                    </div>
                  ))}
            </div>
          </Col>
          <Col xs={6} className="px-3">
            <span className="text-muted">Subgroup Member</span>
            <div className="d-flex flex-wrap gap-4 my-2">
              <div className="bg-success px-2 py-1 rounded pointer">
                <span>
                  {currentUser?.firstname} {currentUser?.lastname}
                </span>
                <i className="mdi mdi-account-remove-outline pt-1 px-2" />
              </div>
              {subGroupMembers &&
                subGroupMembers.map((member, m) => (
                  <div
                    key={m}
                    className="bg-success px-2 py-1 rounded pointer"
                    onClick={() => handleAddingNewSubgroupMembers(member)}
                  >
                    <span>
                      {getMemberName(member)}
                      {/* {member?.id?.firstname} {member?.id?.lastname} */}
                    </span>
                    <i className="mdi mdi-account-remove-outline pt-1 px-2" />
                  </div>
                ))}
            </div>
          </Col>
        </Row>
        <div className="d-flex justify-content-end my-2">
          <button className="btn btn-secondary" onClick={() => handleClose()}>
            Cancel
          </button>
          <button
            className="btn btn-primary mx-2"
            onClick={() => handleSubgroupCreation()}
            disabled={subGroupMembers?.length < 1}
          >
            Create
          </button>
        </div>
      </ModalBody>
    </Modal>
  )
}

CreateSubGroup.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  toggleOpen: PropTypes.func,
  getSubGroups: PropTypes.any,
  caseMembers: PropTypes.array,
  caseId: PropTypes.any,
}

export default CreateSubGroup
