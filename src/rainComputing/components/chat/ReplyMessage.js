import React from 'react';
import PropTypes from "prop-types"
import AttachmentViewer from './AttachmentViewer';
import VoiceMessage from '../audio';
const ReplyMessageComponent = ({ rID, messages, handleLocateMessage, currentChat, getMemberName, getSenderOneChat }) => {
    const stripHtmlTags = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    };
    return (
        <div
            className={rID ? "border rounded bg-light-subtle text-black text-wrap" : ""}
            onClick={() => handleLocateMessage(rID)} style={{ cursor: "pointer" }} >
            <div>
                {rID && messages.map((message) =>
                    message._id === rID ? (
                        <div key={message._id} className='px-2 py-2'>
                            <div className="conversation-name">
                                {currentChat.isGroup
                                    ? getMemberName(message.sender)
                                    : getSenderOneChat(message.sender)}
                            </div>
                            {message.isAttachment === true ? (
                                <div>
                                    <p>{stripHtmlTags(message.messageData)}</p>
                                    <div>
                                        <AttachmentViewer
                                            attachments={message.attachments}
                                            text={message.messageData}
                                        />
                                    </div>
                                </div>
                            ) : (
                                message.messageData ? (
                                    <p>{stripHtmlTags(message.messageData)}</p>
                                ) : (
                                    <div>
                                        <p>{stripHtmlTags(message.messageData)}</p>
                                        <div>
                                            <VoiceMessage msg={message} />
                                        </div>
                                    </div>
                                )
                            )}
                            {/* <p>{stripHtmlTags(message.messageData)}</p> */}
                        </div>
                    ) : null
                )}
            </div>
        </div>
    );
};
ReplyMessageComponent.propTypes = {
    rID: PropTypes.any,
    messages: PropTypes.any,
    handleLocateMessage: PropTypes.func,
    getSenderOneChat: PropTypes.any,
    getMemberName: PropTypes.any,
    currentChat: PropTypes.any,
}
export default ReplyMessageComponent;