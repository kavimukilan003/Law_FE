import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import moment from "moment"
import { getGroupNameById } from "rainComputing/helpers/backend_helper"
import ChatLoader from "./ChatLoader"

const GroupReplyMsg = props => {
  const { groupId, replies,createdAt, caseId ,_id} = props?.notification
  const [isLoading, setIsLoading] = useState(true)
  const [caseName, setCaseName] = useState(caseId)
  const Replymsg = replies.filter(reply => reply.replyMsg)[replies.length - 1]?.replyMsg;
  const groupReplymsgId = replies.filter(reply => reply.replyMsg)[replies.length - 1]?._id;
  useEffect(() => {
    const getGroupName = async () => {
      const groupRes = await getGroupNameById({ caseId })
      const groupData = groupRes?.caseDetails[0]?.caseId
      setCaseName(`${groupData?.caseName}`)
      setIsLoading(false)
    }
    getGroupName()
  }, [caseId])
  const chatRoomId = `/chat-rc?rg_id=${groupId}&rc_id=${caseId}&msg_id=${_id}&reply_id=${groupReplymsgId}`
  return (
    <>
      {" "}
      {isLoading ? (
        <ChatLoader />
      ) : (
        <Link
          to={chatRoomId}
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
                <p className="mb-1 text-danger">{` New Reply messages from ${caseName}`}</p>
                <p className="text-primary"><div
                          style={{
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            whiteSpace: "pre-line",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: Replymsg,
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
GroupReplyMsg.propTypes = {
  notification: PropTypes.any,
}
export default GroupReplyMsg
