import React, { useEffect, useState } from 'react'
import PropTypes from "prop-types"
import { useChat } from 'rainComputing/contextProviders/ChatProvider';
import { getMessagesByUserIdandGroupId } from 'rainComputing/helpers/backend_helper';
import { useUser } from 'rainComputing/contextProviders/UserProvider';
import moment from 'moment';

const LinksModel = ({ setLinksModelOpen, handleLocateMessage }) => {
  const [messages, setMessages] = useState([])
  const [locatefilemessageId, setLocateFileMessageId] = useState()
  const { currentUser } = useUser()
  const { currentRoom: currentChat } = useChat()

  const handlegetlinkmessages = async () => {
    if (currentChat?.isGroup) {
      const payload = {
        caseId: currentChat?.caseId,
        userId: currentUser?.userID,
      }
      const res = await getMessagesByUserIdandGroupId(payload)
      if (res.success) {
        setMessages(res.groupMessages)
      } else {
        //   console.log("Failed to fetch Group message", res)
        //   setNoNewMessage(res.groupMessages)
      }
    } else {
      const payload = {
        groupId: currentChat?._id,
        userId: currentUser?.userID,
      }
      const res = await getMessagesByUserIdandGroupId(payload)
      if (res.success) {
        setMessages(res.groupMessages)
      } else {
        //   console.log("Failed to fetch Group message", res)
        //   setNoNewMessage(res.groupMessages)
      }
    }
  }

  const handleClick = (id) => {
    setLinksModelOpen(false)
    setLocateFileMessageId(id)
  }

  useEffect(() => {
    if (locatefilemessageId) {
      handleLocateMessage(locatefilemessageId)
    }
  }, [locatefilemessageId])

  useEffect(() => {
    handlegetlinkmessages()
  }, [])
  const regex = /<a href="([^"]+)"/;

  const filteredMessages = messages.filter(message => {
    const messageData = message.messageData;

    return regex.test(messageData);
  });
  console.log("filteredMessages", filteredMessages)
  return (
    <div>
      {filteredMessages?.length > 0 ? (
        <div>
          {filteredMessages.map((links, i) => (
            <div key={i} className='border-bottom border-black'
              style={{ cursor: "pointer" }}
              onClick={() => handleClick(links?._id)}
            >
              <div key={i}
                className='pt-2'
                style={{
                  whiteSpace: "break-spaces",
                  overflow: "hidden",
                  wordWrap: "break-word",
                }}
                dangerouslySetInnerHTML={{
                  __html: links?.messageData,
                }}

              />
              <p key={i}
                className='d-flex justify-content-end'>
                {moment(links.createdAt).format("DD-MM-YY HH:mm")}
              </p>

            </div>
          ))}
        </div>
      ) : (
        <div className="d-flex justify-content-center">
          <p>You Dont have a any links</p>
        </div>
      )}
    </div>
  )
}

LinksModel.propTypes = {
  setLinksModelOpen: PropTypes.func,
  handleLocateMessage: PropTypes.any,
}

export default LinksModel