import React, { useEffect, useState } from "react"
import { Card, CardBody, CardText, CardTitle, Modal } from "reactstrap"
import {
  getReminderSelf,
  removeReminder,
} from "rainComputing/helpers/backend_helper"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import toastr from "toastr"
import { useToggle } from "rainComputing/helpers/hooks/useToggle"
import DeleteModal from "components/Common/DeleteModal"

const SelfReminder = () => {
  const [selfReminder, setSelfReminder] = useState()
  const [removeData, setRemoveData] = useState()

  const { currentUser } = useUser()
  const {
    toggleOpen: selfReminderDeleteModalOpen,
    setToggleOpen: setReminderDeleteModalOpen,
    toggleIt: toggleSelfReminderDeleteModal,
  } = useToggle(false)

  useEffect(() => {
    if (currentUser) {
      const getReminderData = async () => {
        const res = await getReminderSelf({
          currentUserID: currentUser?.userID,
        })
        if (res.success) {
          setSelfReminder(res?.reminders)
        }
      }
      getReminderData()
    }
  }, [currentUser])

  const handleRemove = async () => {
    const payload = {
      reminderId: removeData?._id,
    }
    const res = await removeReminder(payload)
    if (res.success) {
      toastr.success(`You have reminder remove  successfully`, "Success")
      setSelfReminder(prevState =>
        prevState.filter(reminder => reminder._id !== removeData._id)
      )
      setReminderDeleteModalOpen(false)
    }
  }

  const handleDelete = selfRemind => {
    setRemoveData(selfRemind)
    setReminderDeleteModalOpen(true)
  }
  return (
    <div className="modal-body">
      <DeleteModal
        show={selfReminderDeleteModalOpen}
        onDeleteClick={handleRemove}
        confirmText="Yes,Remove"
        cancelText="Cancel"
        onCloseClick={toggleSelfReminderDeleteModal}
      />

      {selfReminder?.length > 0 ? (
        <>
          {" "}
          {selfReminder?.map((selfRemind, k) => (
            <div key={k}>
              <Card>
                <CardBody>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    style={{ width: "20px" }}
                    onClick={() => {
                      handleDelete(selfRemind)
                    }}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <CardTitle className="mt-0">
                    Title :{selfRemind?.title}
                  </CardTitle>
                  <CardText>
                    {" "}
                    Message Data :{selfRemind?.messageId?.messageData}
                  </CardText>
                  <CardText className="text-primary">
                    {" "}
                    Date :{selfRemind?.date}
                  </CardText>
                  <CardText className="text-primary">
                    {" "}
                    Time :{selfRemind?.time}
                  </CardText>{" "}
                </CardBody>
              </Card>
            </div>
          ))}{" "}
        </>
      ) : (
        <p>No Reminders</p>
      )}
    </div>
  )
}

export default SelfReminder
