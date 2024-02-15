import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import moment from "moment"
import { getSenderNameById } from "rainComputing/helpers/backend_helper"
import ChatLoader from "./ChatLoader"

const PrivateMsg = props => {
  const { sender, messageData, createdAt, groupId, isVoiceMessage ,isAttachment} =
    props?.notification
  const [senderName, setSenderName] = useState(sender)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const getSenderName = async () => {
      const senderRes = await getSenderNameById({
        sender,
      })
      const senderData = senderRes?.senderDetails[0]?.sender
      setSenderName(`${senderData?.firstname} ${senderData?.lastname}`)
      setIsLoading(false)
    }
    getSenderName()
  }, [sender])
  return (
    <>
      {isLoading ? (
        <ChatLoader />
      ) : (
        <Link
          to={`/chat-rc?p_id=${groupId}`}
          className="text-reset notification-item"
        >
          <div className="d-flex">
            <div className="avatar-xs me-3">
              <span className="avatar-title bg-primary rounded-circle font-size-16">
                <i className="bx bx-chat" />
              </span>
            </div>
            <div className="flex-grow-1">
              <div className="font-size-11 text-muted">
                <p className="mb-1">{` New messages from ${senderName}`}</p>
                <p className="text-primary"><div
                          style={{
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            whiteSpace: "pre-line",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: messageData,
                          }}
                        /></p>
                {isVoiceMessage && (
                  <p className="text-primary">New voice message</p>
                )}
                {isAttachment && (
                  <p className="text-primary">New Document</p>
                )}
                <p className="mb-0">
                  <i className="mdi mdi-clock-outline" />{" "}
                  {moment(createdAt).format("DD-MM-YY hh:mm")}
                </p>
              </div>
            </div>
          </div>
        </Link>
      )}
    </>
  )
}
PrivateMsg.propTypes = {
  notification: PropTypes.any,
}
export default PrivateMsg
