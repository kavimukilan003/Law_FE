import React, { useEffect, useState } from "react"
import { Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import PropTypes from "prop-types"
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import { updateSubgroup } from "rainComputing/helpers/backend_helper"
import DeleteModal from "components/Common/DeleteModal"
import { useToggle } from "rainComputing/helpers/hooks/useToggle"

const EditSubGroup = ({
  open,
  setOpen,
  toggleOpen,
  caseMembers,
  getSubGroups,
  subGroup,
  resetSubGroup,
}) => {
  const { currentUser } = useUser()
  const {
    toggleOpen: deleteModalOpen,
    setToggleOpen: setDeleteModalOpen,
    toggleIt: toggleDeleteModalOpen,
  } = useToggle(false)
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
    resetSubGroup(null)
    setSubGroupMembers([])
    setOpen(false)
  }

  const handleSubgroupUpdate = async () => {
    const payload = {
      admin: currentUser?.userID,
      members: [currentUser?.userID, ...subGroupMembers],
      groupName: subGroupName,
      groupId: subGroup?._id,
      color: groupColor,
    }
    const res = await updateSubgroup(payload)
    if (res.success) {
      await getSubGroups()
      toastr.success(
        `${subGroupName} has been updated successfully`,
        "Successfully updated"
      )
      handleClose()
    } else {
      toastr.error(` ${subGroupName} ${res?.msg}`, "Failed to update Subgroup")
    }
  }

  const handleDeleteSubGroup = async () => {
    const payload = {
      groupId: subGroup?._id,
      deleteIt: true,
    }
    const res = await updateSubgroup(payload)
    if (res.success) {
      toastr.success(
        `${res?.groupName} has been deleted successfully`,
        "Successfully Deleted"
      )
      await getSubGroups()
      handleClose()
    } else {
      toastr.error(` ${subGroupName} ${res?.msg}`, "Failed to Delete Subgroup")
    }
  }

  useEffect(() => {
    if (subGroup) {
      const { color, groupName, groupMembers } = subGroup
      color && setGroupColor(color)
      groupName && setSubGroupName(groupName)
      if (groupMembers?.length > 1) {
        const structuredMembers = groupMembers
          .filter(c => c?.id?._id !== currentUser?.userID)
          .map(m => m?.id?._id)
        setSubGroupMembers(structuredMembers)
      }
    }
    return () => {
      resetSubGroup(null)
    }
  }, [])

  return (
    <>
      <DeleteModal
        show={deleteModalOpen}
        onDeleteClick={handleDeleteSubGroup}
        confirmText="Yes,Delete"
        cancelText="Cancel"
        onCloseClick={toggleDeleteModalOpen}
      />
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
            />
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
            <button
              className="btn btn-danger"
              onClick={() => setDeleteModalOpen(true)}
            >
              Delete
            </button>
            <button
              className="btn btn-primary mx-2"
              onClick={() => handleSubgroupUpdate()}
              disabled={subGroupMembers?.length < 1}
            >
              Update
            </button>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

EditSubGroup.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  toggleOpen: PropTypes.func,
  getSubGroups: PropTypes.any,
  caseMembers: PropTypes.array,
  subGroup: PropTypes.any,
  resetSubGroup: PropTypes.func,
}

export default EditSubGroup
