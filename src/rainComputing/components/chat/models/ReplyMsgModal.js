import React, { useCallback, useEffect, useState } from "react"
import { Mention, MentionsInput } from "react-mentions"
import { Col, Modal, Row } from "reactstrap"
import PropTypes from "prop-types"
import {
  getMessagesByUserIdandGroupId,
  postReplies,
} from "rainComputing/helpers/backend_helper"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import ReactQuillInput from "rainComputing/components/ReactQuill/ReactQuill"
import RecordRTC from "recordrtc"
import axios from "axios"
import { SERVER_URL } from "rainComputing/helpers/configuration"
import toastr from "toastr"
import "toastr/build/toastr.min.css"

const ReplyMsgModal = ({
  open,
  setOpen,
  toggleOpen,
  curMessageId,
  receivers,
  currentChat,
  currentCase,
  caseId,
  getChatName,
  mentionsArray,
  handleSendingMessage,
  ongetAllChatRooms,
  ongetAllCases,
  setAllFiles,
  allFiles,
  handleFileChange,
  handleFileRemove,
  recorder,
  setRecorder,
  setAllVoicemsg,
  allVoicemsg,
  isAttachment,
  blobURL,
  duration,
  isVoiceMessage,
  durationIntervalId,
  setBlobURL,
  setDuration,
  setDurationIntervalId,
  setIsVoiceMessage,
  setIsAttachment,
  startRecording,
  stopRecording,
  subject,
  setSubject,
  setReplyMsgModalOpen,
  setLoading,
}) => {
  const { currentUser } = useUser();
  const [isQuill, setIsQuill] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  const handlereplyMsgCancel = () => {
    setOpen(false)
    setReplyMessage("")
    setAllFiles([])
    setAllVoicemsg([])
    setIsAttachment(false)
    setIsVoiceMessage(false)
    setRecorder([])
    setBlobURL(null)
  };

  const handleCancel = () => {
    setAllVoicemsg([])
    setIsVoiceMessage(false)
    setRecorder([])
    setBlobURL(null)
  }

  const isEmptyOrSpaces = () => {
    if (isAttachment) {
      return false
    } else if (isVoiceMessage) {
      return false
    }
    return replyMessage === null || replyMessage.match(/^ *$/) !== null
  }

  const toggle_Quill = () => {
    setIsQuill(!isQuill);
  };
  useEffect(() => {
    if (Array.from(allFiles)?.length > 0) {
      setIsAttachment(true)
    } else {
      setIsAttachment(false)
    }
  }, [allFiles])

  const handleSendMessage = async (rID) => {
    setLoading(true)
    if (isEmptyOrSpaces()) {
      console.log("You can't send empty message")
    } else if (replyMessage.length > 1000) {
      toastr.error("Message should be exactly 1000 characters", "Error");
    }else {
      let voiceMessageId = []
      let attachmentsId = []
      let payLoad = {
        rID,
        caseId: currentCase?._id,
        groupId: currentChat?._id,
        sender: currentUser?.userID,
        receivers,
        subject: subject,
        messageData: replyMessage,
        isAttachment,
        isVoiceMessage,
        isForward: false,
        maincaseId: currentCase?.maincaseId,
        threadId: currentCase?.threadId,
        // isPinned: false,
      }
      if (isAttachment) {
        const formData = new FormData()
        for (var i = 0; i < allFiles.length; i++) {
          formData.append("file", allFiles[i])
        }
        // formData.append("file", allFiles)
        const fileUploadRes = await axios.post(
          `${SERVER_URL}/upload`,
          formData,
          {
            headers: {
              "Content-Type": `multipart/form-data`,
            },
          }
        )
        const { data } = fileUploadRes
        if (data.success) {
          await data.files?.map(file =>
            attachmentsId.push({
              type: file.contentType,
              size: file.size,
              id: file.id,
              name: file.originalname,
              dbName: file.filename,
              aflag: true,
            })
          )
        } else {
          setLoading(false)
        }
      } else if (isVoiceMessage) {
        const formData = new FormData()

        for (let i = 0; i < allVoicemsg.length; i++) {
          const audioBlob = new Blob([allVoicemsg[i].getBlob()], {
            type: "audio/webm",
          })

          formData.append("file", audioBlob, `audio-${i}.webm`)
        }

        const fileUploadRes = await axios.post(
          `${SERVER_URL}/upload`,
          formData,
          {
            headers: {
              "Content-Type": `multipart/form-data`,
            },
          }
        )

        const { data } = fileUploadRes
        if (data.success) {
          await data?.files?.map(file =>
            voiceMessageId.push({
              type: file?.contentType,
              size: file?.size,
              id: file.id,
              name: file.originalname,
              dbName: file.filename,
              aflag: true,
            })
          )
        } else {
          setLoading(false)
        }
      }
      payLoad.attachments = attachmentsId
      payLoad.voiceMessage = voiceMessageId
      handleSendingMessage(payLoad)
      setReplyMsgModalOpen(false)
      setAllFiles([])
      setAllVoicemsg([])
      setReplyMessage("")
      setSubject("")
      setIsAttachment(false)
      setIsVoiceMessage(false)
      setRecorder([])
      setBlobURL(null)
      await ongetAllChatRooms();
      await ongetAllCases({ isSet: false });
    }
    setLoading(false)
  }

  return (
    <>
      <Modal
        size="lg"
        isOpen={open && curMessageId}
        toggle={toggleOpen}
        backdrop={"static"}
        id="staticBackdrop"

      >
        <div className="modal-header">
          <button
            onClick={() => {
              handlereplyMsgCancel()
            }}
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <h5>Reply :</h5>
          <Row>
            <Col>
              <div class=" chat-input-section border border-2 border-primary rounded-4">
                <div className="row">
                  <div className="col">
                    <div className="position-relative">
                      {recorder &&
                        recorder.state === "recording" ? (
                        <div className="border border-primary d-flex justify-content-center recorder">
                          <i
                            className="d-block d-md-inline mdi mdi-microphone font-size-18 text-primary"
                            style={{
                              height: "30px",
                              paddingLeft: "50px",
                            }}
                          ></i>
                          <p
                            className="text-primary mt-1 font-size-12"
                            style={{
                              height: "10px",
                              paddingRight: "50px",
                            }}
                          >
                            {duration}Secs
                          </p>
                        </div>
                      ) : (
                        <>
                          {blobURL ? (
                            <div className="p-3">
                              <audio
                                className="w-500 w-sm-100"
                                style={{
                                  height: "33px",
                                  paddingLeft: "10px",
                                }}
                                src={blobURL}
                                controls="controls"
                              ></audio>
                              <i className="bi bi-trash text-danger"
                                onClick={() => handleCancel()}
                                style={{
                                  position: "absolute",
                                  right: "400px",
                                  top: "25px",
                                  cursor: "pointer"
                                }}
                                title="Delete"
                              >
                              </i>
                            </div>
                          ) : (
                            <>
                              <div className="p-2 pt-0">
                                {" "}
                                {Array.from(allFiles)?.length >
                                  0 && (
                                    <div class="d-flex gap-2 flex-wrap mt-2">
                                      {Array.from(allFiles)?.map(
                                        (att, a) => (
                                          <span
                                            class="badge badge-soft-primary font-size-13 p-2"
                                            key={a}
                                          >
                                            {att.name}
                                            <i
                                              class="bx bx-x-circle mx-1"
                                              onClick={() =>
                                                handleFileRemove(
                                                  att?.name
                                                )
                                              }
                                              style={{
                                                cursor: "pointer",
                                              }}
                                            />
                                          </span>
                                        )
                                      )}
                                    </div>
                                  )}
                              </div>
                              <div>
                                <ReactQuillInput
                                  mentionsArray={mentionsArray}
                                  value={replyMessage}
                                  onChange={setReplyMessage}
                                  isQuill={isQuill}
                                  currentChat={currentChat}
                                  getChatName={getChatName}
                                  setAllFiles={setAllFiles}
                                  subject={subject}
                                  setSubject={setSubject}
                                />
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ position: "absolute", right: "30px", top: "10px" }}>
                <i
                  className="bi bi-type"
                  onClick={() => {
                    toggle_Quill();
                  }}
                  style={{
                    color: "black",
                    fontSize: "20px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  title={isQuill ? "Show Formatting" : "Hide Formatting"}
                ></i>
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <div style={{ position: "absolute", right: "20px", top: "3px" }}>
                {
                  recorder &&
                    recorder.state === "recording" || allVoicemsg.length > 0 ? (
                    <></>
                  ) : (
                    <>
                      <input
                        type="file"
                        name="file"
                        multiple="true"
                        id="hidden-file"
                        className="d-none"
                        accept=".png, .jpg, .jpeg,.pdf,.doc,.xls,.docx,.xlsx,.zip,.mp3,.webm"
                        onChange={e => handleFileChange(e)}
                      ></input>
                      <label
                        for="hidden-file"
                        style={{ margin: "10px" }}
                      >
                        <i
                          class="mdi mdi-attachment mdi-rotate-315"
                          disabled={
                            recorder?.state === "recording"
                          }
                          title="Attachments"
                          style={{
                            // color: "#556EE6",
                            fontSize: "16px",
                            cursor: "pointer",
                          }}
                        ></i>
                      </label>
                    </>
                  )}
                {recorder &&
                  recorder.state === "recording" ? (
                  <i
                    className="mdi mdi-microphone font-size-20 text-danger me-2"
                    title="Stop Recording"
                    onClick={stopRecording}
                    disabled={recorder?.state == "stopped"}
                    style={{
                      cursor: "pointer",
                      paddingTop: "6px",
                    }}
                  ></i>
                ) : (
                  <i
                    className="mdi mdi-microphone font-size-20  me-2"
                    title="Start Recording"
                    onClick={startRecording}
                    disabled={recorder?.state == "recording"}
                    style={{
                      cursor: "pointer",
                      paddingTop: "6px",
                    }}
                  ></i>
                )}

              </div>
            </Col>
          </Row>
        </div>
        <br />
        <div className="modal-footer">
          <button
            type="button"
            onClick={() => {
              handlereplyMsgCancel()
            }}
            className="btn btn-secondary "
            data-dismiss="modal"
          >
            Close
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleSendMessage(curMessageId?._id)}
            disabled={isEmptyOrSpaces()}
          >
            Send
          </button>
        </div>
      </Modal >
    </>
  );
}

ReplyMsgModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  toggleOpen: PropTypes.func,
  curMessageId: PropTypes.any,
  socket: PropTypes.any,
  receivers: PropTypes.any,
  currentChat: PropTypes.any,
  currentCase: PropTypes.any,
  caseId: PropTypes.any,
  getChatName: PropTypes.any,
  mentionsArray: PropTypes.any,
  handleSendingMessage: PropTypes.any,
  setAllFiles: PropTypes.any,
  allFiles: PropTypes.any,
  handleFileChange: PropTypes.any,
  handleFileRemove: PropTypes.any,
  curMessage: PropTypes.any,
  setcurMessage: PropTypes.any,
  setAllVoicemsg: PropTypes.any,
  setRecorder: PropTypes.any,
  recorder: PropTypes.any,
  allVoicemsg: PropTypes.any,
  isAttachment: PropTypes.any,
  blobURL: PropTypes.any,
  duration: PropTypes.any,
  isVoiceMessage: PropTypes.any,
  startRecording: PropTypes.any,
  stopRecording: PropTypes.any,
  durationIntervalId: PropTypes.any,
  setDurationIntervalId: PropTypes.any,
  setBlobURL: PropTypes.any,
  setIsAttachment: PropTypes.any,
  setIsVoiceMessage: PropTypes.any,
  setDuration: PropTypes.any,
  subject: PropTypes.any,
  setSubject: PropTypes.any,
  setReplyMsgModalOpen: PropTypes.any,
  ongetAllChatRooms: PropTypes.any,
  ongetAllCases: PropTypes.any,
  setLoading: PropTypes.any,
}
export default ReplyMsgModal
