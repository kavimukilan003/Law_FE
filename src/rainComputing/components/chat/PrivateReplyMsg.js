import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import moment from "moment"
import { getSenderNameById } from "rainComputing/helpers/backend_helper"
import ChatLoader from "./ChatLoader"
import { useQuery } from "rainComputing/helpers/hooks/useQuery"

const PrivateReplyMsg = props => {
  const { sender, replies, createdAt, groupId ,_id} = props?.notification
  const [senderName, setSenderName] = useState(sender)
  const [isLoading, setIsLoading] = useState(true)
  const Replymsg = replies.filter(reply => reply.replyMsg)[replies.length - 1]?.replyMsg;
  const replymsgId = replies.filter((reply) => reply?._id)[replies.length - 1]?._id



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
          to={`/chat-rc?rp_id=${groupId}&msg_id=${_id}&reply_id=${replymsgId}`}
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
                <p className="mb-1 text-danger">{` New Reply messages from ${senderName}`}</p>
                <p className="text-primary"><div
                          style={{
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            whiteSpace: "pre-line",
                          }}
                          dangerouslySetInnerHTML={{
                            __html:Replymsg,
                          }}
                        /></p>
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
PrivateReplyMsg.propTypes = {
  notification: PropTypes.any,
}
export default PrivateReplyMsg
