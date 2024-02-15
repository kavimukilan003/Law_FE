import { useUser } from "rainComputing/contextProviders/UserProvider"
import React, { useEffect, useState } from "react"
import { Mention, MentionsInput } from "react-mentions"
import { Col, Modal, Row, UncontrolledTooltip } from "reactstrap"
import PropTypes from "prop-types"
import { messageUpdate } from "rainComputing/helpers/backend_helper"
import { useChat } from "rainComputing/contextProviders/ChatProvider"
import "react-quill/dist/quill.snow.css"
import ReactQuillInput from "rainComputing/components/ReactQuill/ReactQuill"
import toastr from "toastr"
import "toastr/build/toastr.min.css"

const EditMessageModel = ({
  open,
  setOpen,
  toggleOpen,
  curMessageId,
  curEditMessageId,
  currentChat,
  getChatName,
  currentCase,
  subject,
  setSubject,
  setAllFiles
}) => {
  const { setMessages, messages } = useChat()
  const { currentUser } = useUser()
  const [updateMessages, setUpdateMessages] = useState(null)

  const [isQuill, setIsQuill] = useState(false)
  const toggle_Quill = () => {
    setIsQuill(!isQuill)
  }

  const handleUpdateMsgCancel = () => {
    setOpen(false)
  }
  const handleUpdateMessage = async id => {
    const maxLength = 1000; // Set the maximum length

    if (updateMessages.length > maxLength) {
      toastr.error(`Message must be ${maxLength} characters or less`);
      return;
    }
    const payload = {
      _id: id,
      // sender: currentUser?.userID,
      subject: subject,
      messageData: updateMessages,
      createdAt: curEditMessageId.createdAt,
    }
    const res = await messageUpdate(payload)
    if (res?.success) {
      console.log("success :", res?.success)
      toastr.success(`Message  has been Edited successfully`, "Success")
      setMessages(messages?.map(m => (m?._id === id ? res?.updatedMessage : m)))
      setUpdateMessages(curMessageId)
    } else {
      toastr.error("Unable to Edit Message after 10 min", "Failed!!!")
    }
    setOpen(false)
    setSubject("")
  }

  useEffect(() => {
    setUpdateMessages(curMessageId?.messageData)
    setSubject(curMessageId?.subject)
  }, [curMessageId?.messageData, curMessageId?.subject])
  return (
    <>
      <Modal
        size="lg"
        isOpen={open && curMessageId}
        toggle={toggleOpen}
        backdrop="static"
        id="staticBackdrop"
        centered
      >
        <div className="modal-header">
          <button
            onClick={handleUpdateMsgCancel}
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <h5>Edit :</h5>
          <Row>
            <Col>
              <div className="position-relative border border-2 border-primary rounded-4">
                <ReactQuillInput
                  value={updateMessages}
                  onChange={setUpdateMessages}
                  messages={messages}
                  curMessageId={curMessageId}
                  isQuill={isQuill}
                  currentChat={currentChat}
                  getChatName={getChatName}
                  currentCase={currentCase}
                  subject={subject}
                  setSubject={setSubject}
                  setAllFiles={setAllFiles}
                />
              </div>
              <div style={{ position: "absolute", right: "30px", top: "7px" }}>
                <i
                  className="bi bi-type"
                  onClick={() => {
                    toggle_Quill()
                  }}
                  style={{
                    color: "black",
                    fontSize: "20px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  id="typeTooltip"
                ></i>
                {isQuill ?
                  (<UncontrolledTooltip
                    placement="bottom"
                    target="typeTooltip"
                  >
                    Show Formatting
                  </UncontrolledTooltip>
                  ) : (
                    <UncontrolledTooltip
                      placement="bottom"
                      target="typeTooltip"
                    >
                      Hide Formatting
                    </UncontrolledTooltip>)}
              </div>
            </Col>
          </Row>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            onClick={handleUpdateMsgCancel}
            className="btn btn-secondary "
            data-dismiss="modal"
          >
            Close
          </button>

          {updateMessages && updateMessages !== null && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleUpdateMessage(curMessageId?._id)}
            >
              Update
            </button>
          )}
        </div>
      </Modal>
    </>
  )
}

EditMessageModel.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  toggleOpen: PropTypes.func,
  curMessageId: PropTypes.any,
  curEditMessageId: PropTypes.any,
  msgData: PropTypes.array,
  currentChat: PropTypes.any,
  getChatName: PropTypes.any,
  currentCase: PropTypes.any,
  subject: PropTypes.any,
  setSubject: PropTypes.any,
  setAllFiles: PropTypes.any,
}

export default EditMessageModel
