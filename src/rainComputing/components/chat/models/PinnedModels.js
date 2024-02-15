import { useChat } from "rainComputing/contextProviders/ChatProvider"
import {
  getPinnedMsg,
  pinMessage,
  unpinMessage,
} from "rainComputing/helpers/backend_helper"
import React, { useEffect, useState } from "react"
import { Card, Dropdown, DropdownToggle, Modal } from "reactstrap"
import moment from "moment"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import AttachmentViewer from "../AttachmentViewer"
import PropTypes from "prop-types"
import { DivIcon } from "leaflet"
import { log } from "logrocket"
import avatar from "assets/images/avatar-defult.jpg"

const PinnedModels = ({ handleLocateMessage }) => {
  const { currentRoom: currentChat, setMessages, messages } = useChat()
  const [pinModal, setPinModal] = useState(false)
  const [pinnedMsg, setPinnedMsg] = useState([])

  const handleClick = messageId => {
    handleLocateMessage(messageId)
    setPinModal(false)
  }

  const currentChats = currentChat?.groupMembers.map(i => i?.id)

  const getSender = id => currentChats?.find(i => i?._id === id?.sender)

  const tog_scroll = () => {
    setPinModal(!pinModal)
  }
  useEffect(() => {
    if (pinModal) {
      const PinnedMessage = async () => {
        const payload = { groupId: currentChat?._id }
        const res = await getPinnedMsg(payload)
        if (res.success) {
          setMessages(
            messages?.map(m =>
              m?._id === currentChat?._id ? res?.pinMessages : m
            )
          )
          setPinnedMsg(res?.pinMessages)
        }
      }
      PinnedMessage()
    }
  }, [pinModal])

  const handleUnpinMessage = async msgId => {
    const payload = { Id: msgId }
    const res = await unpinMessage(payload)
    if (res.success) {
      const updatedMessages = messages.map(msg => {
        if (msg._id === res.message._id) {
          return {
            ...msg,
            isPinned: false,
          }
        }
        return msg // return the original message object if it doesn't match the unpinned message
      })
      setMessages(updatedMessages) // update the messages array with the updatedMessages
    }
  }

  const text = {
    color: "#0000F9",
  }

  return (
    <div>
      <Modal
        isOpen={pinModal}
        size="lg"
        toggle={() => {
          tog_scroll()
        }}
        // scrollable={true}
      >
        <div className="modal-header ">
          <h5 className="modal-title mt-0">
            <i className="mdi mdi-pin-outline mdi-rotate-315 text-danger px-2"></i>
            Pinned Message
          </h5>
          <button
            type="button"
            onClick={() => setPinModal(false)}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        {pinnedMsg?.length > 0 ? (
          <div>
            <div className="card">
              <div
                className="d-flex justify-content-center py-3"
                style={{ backgroundColor: "#ededed" }}
              >
                <div className="w-75" style={{ backgroundColor: "#f0f1f2" }}>
                  {pinnedMsg &&
                    pinnedMsg?.map((msg, m) => (
                      <div className="" key={m}>
                        <div
                          className="card border-secondary border border-1 rounded-2"
                          style={{ borderRadius: "5px" }}
                        >
                          <div
                            className="d-flex justify-content-between px-2"
                            style={{ backgroundcolor: "#a4a7ab" }}
                          >
                            <div className="">
                              {/* <i class="bi bi-person-circle fs-1" style={{ color: "#3987ed" }}></i> */}
                              <p className="rouded-circle text-primary text pt-1 ">
                                <img
                                  className="avatar-sm me-2 rounded-circle "
                                  src={
                                    getSender(msg)?.profilePic
                                      ? getSender(msg)?.profilePic
                                      : avatar
                                  }
                                ></img>
                                {getSender(msg)?.firstname}{" "}
                                {getSender(msg)?.lastname}
                              </p>
                            </div>
                            <div className="">
                              <i
                                className="bi bi-x-lg bi-rotate-315 text-danger"
                                title="Unpin"
                                onClick={() => handleUnpinMessage(msg?._id)}
                                style={{ cursor: "pointer" }}
                              ></i>
                            </div>
                          </div>
                          <div
                            className="text-wrap px-2 py-2 "
                            onClick={() => handleClick(msg._id)}
                          >
                            <div className="conversation-name">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  {/* <p className="text pt-1" style={text}>{getSender(msg)?.firstname} {getSender(msg)?.lastname}</p> */}
                                </div>
                              </div>
                            </div>
                            <div
                              className=" border border-success p-2 mb-2 border-opacity-25  rounded-2"
                              style={{ borderColor: "#dbdbdb" }}
                            >
                              {msg.isAttachment ? (
                                <>
                                  <AttachmentViewer
                                    attachments={msg.attachments}
                                  />
                                  <p>
                                    <div
                                      style={{
                                        wordBreak: "break-word fs-1S mx-2",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-line",
                                        
                                      }}
                                      dangerouslySetInnerHTML={{
                                        __html: msg?.messageData,
                                      }}
                                    />
                                  </p>
                                </>
                              ) : (
                                <div
                                  style={{
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                    whiteSpace: "pre-line",
                                    
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html: msg?.messageData,
                                  }}
                                />
                              )}
                            </div>
                            <p className="chat-time">
                              <i className="bx bx-comment-check align-middle" />
                              <i class="bi bi-alarm aliiddlgn-me me-2" />
                              {/* <i className="bx bx-time-five aliiddlgn-me me-1" /> */}
                              {moment(msg.createdAt).format("DD-MM-YY HH:mm")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="d-flex justify-content-center py-3 ">
            You dont have a Pinned Messages !
          </p>
        )}
      </Modal>
      <Dropdown isOpen={pinModal} toggle={tog_scroll}>
        <DropdownToggle className="btn nav-btn" tag="i">
          <i
            className="mdi mdi-pin-outline mdi-rotate-315"
            onClick={() => {
              tog_scroll()
            }}
          />
        </DropdownToggle>
      </Dropdown>
    </div>
  )
}
PinnedModels.propTypes = {
  handleLocateMessage: PropTypes.func,
}
export default PinnedModels
