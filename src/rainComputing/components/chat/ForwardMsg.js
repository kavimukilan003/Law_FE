// import React, { useEffect, useState } from "react"
// import PropTypes from "prop-types"
// import toastr from "toastr"
// import axios from "axios"
// import { SERVER_URL } from "rainComputing/helpers/configuration"
// import { Button, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
// import { useUser } from "rainComputing/contextProviders/UserProvider"
// import { useChat } from "rainComputing/contextProviders/ChatProvider"
// import ChatLoader from "rainComputing/components/chat/ChatLoader"
// import AttachmentViewer from "rainComputing/components/chat/AttachmentViewer"
// import { Input, Label } from "reactstrap"
// import {
//   getAllUsers,
//   updateCase,
//   getMessageById,
//   createOnevsOneChat,
//   getOnevsOneChat,
//   getAllChatRooms,
// } from "rainComputing/helpers/backend_helper"

// const ForwardMsg = ({ open, setOpen, toggleOpen, currentMsg }) => {
//   const {
//     chats,
//     setChats,
//     currentRoom: currentChat,
//     setCurrentRoom: setCurrentChat,
//     getRoomsonEveryMessage,
//     handleSendingMessage,
//     messages,
//     setMessages,
//     messageStack,
//   } = useChat()
//   //const [currentChat, setCurrentChat] = useState([])
//   const { currentUser } = useUser()
//   const [contacts, setContacts] = useState([])
//   const [caseName, setCaseName] = useState("")
//   const [caseId, setCaseId] = useState("")
//   const [forwardMembers, setForwardMembers] = useState([])
//   const [forwardMessages, setForwardMessages] = useState([])
//   const [searchText, setSearchText] = useState("")
//   const [loading, setloading] = useState(false)
//   const [pageLoader, setPageLoader] = useState(false)
//   const [chatLoader, setChatLoader] = useState(true)
//   const [allFiles, setAllFiles] = useState([])
//   const [isAttachment, setIsAttachment] = useState(false)
//   //const [isForward, setIsForward] = useState(true)
//   toastr.options = {
//     progressBar: true,
//     closeButton: true,
//   }

//   /*Closing Modal */
//   const handleClose = () => {
//     setOpen(false)
//   }

//   const isDisabled = () => {
//     if (forwardMembers?.length < 1) return true
//     return false
//   }
//   const handleAddingForwardMembers = contact => {
//     if (forwardMembers.some(member => member?._id === contact._id)) {
//       const membersAfterRemove = forwardMembers.filter(
//         m => m._id !== contact._id
//       )

//       setForwardMembers(membersAfterRemove)
//     } else {
//       setForwardMembers([...forwardMembers, contact])
//     }
//     console.log("fmem", forwardMembers)
//   }

//   useEffect(() => {
//     const handleFetchingContacts = async () => {
//       if (searchText === "") {
//         setContacts([])
//       } else {
//         const contactRes = await getAllUsers({
//           userID: currentUser.userID,
//           searchText,
//         })
//         if (contactRes.success) {
//           setContacts(contactRes.users)
//           console.log("contact", contactRes)
//         } else {
//           toastr.error(
//             `Failed to fetch contacts ${contactRes?.msg}`,
//             "Failed on fetching contacts"
//           )
//           setContacts([])
//         }
//       }
//     }
//     handleFetchingContacts()
//   }, [searchText])

//   //Creating New ChatRoom
//   const handleCreateChatRoom = async id => {
//     const payload = {
//       members: [currentUser?.userID, id],
//     }
//     const createdChatRes = await createOnevsOneChat(payload)
//     if (createdChatRes.success) {
//       await ongetAllChatRooms()
//       setCurrentChat(createdChatRes.group)
//     } else {
//       console.log("Failed to create 1vs1 chat ", createdChatRes)
//     }
//   }
//   const handleForwardSendMessage = async rec => {
//     let fcurrChat = ""
//     fcurrChat = chats?.find(i => i?.groupMembers[1]?.id?._id === rec)
//     fcurrChat
//       ? setCurrentChat(fcurrChat)
//       : (await handleCreateChatRoom(rec)) &&
//         (fcurrChat =
//           chats?.find(i => i?.groupMembers[1]?.id?._id === rec) &&
//           setCurrentChat(fcurrChat))
//     let attachmentsId = []
//     let payLoad = {
//       caseId: currentMsg?.caseId,
//       groupId: fcurrChat?._id,
//       sender: currentUser?.userID,
//       receivers: rec,
//       messageData: currentMsg?.messageData,
//       isAttachment: currentMsg?.isAttachment,
//       isForward: true,
//       //attachments: currentMsg?.isAttachment ? currentMsg?.attachments : "-",
//     }
//     if (currentMsg?.isAttachment) {
//       const formData = new FormData()
//       for (var i = 0; i < allFiles.length; i++) {
//         formData.append("file", allFiles[i])
//       }
//       // formData.append("file", allFiles)
//       const fileUploadRes = await axios.post(`${SERVER_URL}/upload`, formData, {
//         headers: {
//           "Content-Type": `multipart/form-data`,
//         },
//       })
//       const { data } = fileUploadRes
//       if (data.success) {
//         await data.files?.map(file =>
//           attachmentsId.push({
//             type: file.contentType,
//             size: file.size,
//             id: file.id,
//             name: file.originalname,
//             dbName: file.filename,
//             aflag: true,
//           })
//         )
//       } else {
//         // setLoading(false)
//       }
//       //await handleAttachment()
//     }
//     payLoad.attachments = attachmentsId

//     console.log("p", payLoad)
//     handleSendingMessage(payLoad)
//     //setIsForward(true)
//     setAllFiles([])
//     setIsAttachment(false)

//     handleClose()
//   }

//   //SideEffect for setting isAttachment
//   useEffect(() => {
//     if (Array.from(allFiles)?.length > 0) {
//       setIsAttachment(true)
//     } else {
//       setIsAttachment(false)
//     }
//   }, [allFiles])

//   //Handling File change
//   const handleFileChange = e => {
//     setAllFiles(e.target.files)
//   }
//   const handleAttachment = async () => {
//     ;<AttachmentViewer
//       attachments={currentMsg.attachments}
//       text={currentMsg.messageData}
//     />
//   }
//   const ongetAllChatRooms = async () => {
//     const chatRoomsRes = await getOnevsOneChat({
//       userId: currentUser?.userID,
//     })
//     if (chatRoomsRes.success) {
//       setChats(chatRoomsRes.groups)
//       console.log("fchatg", chatRoomsRes)
//       //setCurrentChat(chatRoomsRes.groups[0])
//       if (chatRoomsRes.groups.length < 1) {
//         console.log("Failed to get Chat")
//       }
//     } else {
//       setChats([])
//     }
//     //setChatLoader(false)
//   }
//   //   ongetAllChatRooms
//   // }, [])
//   return (
//     <>
//       <Modal
//         isOpen={open}
//         toggle={toggleOpen}
//         centered={true}
//         size="lg"
//         backdrop={"static"}
//       >
//         <ModalBody>
//           <div className="d-flex gap-3 align-items-center">
//             <i
//               className="mdi mdi-keyboard-backspace mdi-24px pointer"
//               onClick={() => handleClose()}
//             />
//             <span className="fw-medium">Forward Message</span>
//           </div>

//           <Row className="my-3">
//             <label
//               htmlFor="user-search-text"
//               className="col-md-3 col-lg-2 col-form-label"
//             >
//               Select members
//             </label>
//             <div className="col-md-8">
//               <input
//                 className="form-control"
//                 type="text"
//                 id="user-search-text"
//                 placeholder="Search by name,email"
//                 value={searchText}
//                 name="searchText"
//                 onChange={e => setSearchText(e.target.value)}
//               />
//             </div>
//           </Row>
//           <Row>
//             <Col xs={6} className="px-3 border-end border-info">
//               <span className="text-muted">Forward To:</span>
//               <div className="d-flex flex-wrap gap-2 my-2">
//                 {contacts &&
//                   contacts
//                     .filter(f => !forwardMembers.some(g => g?._id === f?._id))
//                     .map((contact, c) => (
//                       <Button
//                         key={c}
//                         color="light"
//                         className="btn mx-1 mb-2"
//                         onClick={() => {
//                           {
//                             forwardMembers.length < 1
//                               ? handleAddingForwardMembers(contact)
//                               : null
//                           }
//                         }}
//                       >
//                         <div className="d-flex ">
//                           {contact.firstname} {contact.lastname}
//                         </div>

//                         <div className="font-size-0 text-body ">
//                           {contact.email}
//                         </div>
//                       </Button>
//                     ))}
//               </div>
//             </Col>
//             <Col xs={6} className="px-3">
//               <span className="text-muted"> Members to be Forwarded</span>
//               <div className="d-flex flex-wrap gap-2 my-2">
//                 {/* <Button color="success" className="btn mx-1 mb-2">
//                   <div className="d-flex ">
//                     {currentUser?.firstname} {currentUser?.lastname}
//                   </div>

//                   <div className="font-size-0 text-body ">
//                     {currentUser?.email}
//                   </div>
//                 </Button> */}
//                 {forwardMembers &&
//                   forwardMembers
//                     .filter(a => a?._id !== currentUser?.userID)
//                     .map((member, m) => (
//                       <div className="d-flex " key={m}>
//                         {/* {chats?.groupMembers &&
//                           chats?.groupMembers
//                             .filter(a => a?._id === member?._id)
//                             .map(chats, chat => (
//                               <div className="d-flex " key={chat._id}> */}
//                         <Button
//                           color="success"
//                           className="btn mx-1 mb-2"
//                           onClick={() => {
//                             handleAddingForwardMembers(member)
//                           }}
//                         >
//                           <div className="d-flex ">
//                             {member?.firstname + " " + member?.lastname}
//                           </div>

//                           <div className="font-size-0 text-body ">
//                             {member?.email}
//                           </div>
//                         </Button>
//                       </div>
//                     ))}
//                 {/* </div>
//                     ))} */}
//               </div>
//             </Col>
//           </Row>

//           <Row>
//             <div className="chat-input-links">
//               <ul className="list-inline mb-0">
//                 <li className="list-inline-item">
//                   <div>
//                     <Input
//                       type="file"
//                       name="file"
//                       multiple={true}
//                       id="hidden-file"
//                       className="d-none"
//                       accept=".png, .jpg, .jpeg,.pdf,.doc,.xls,.docx,.xlsx,.zip"
//                       onChange={e => {
//                         handleFileChange(e)
//                       }}
//                     />

//                     {/* <Label htmlFor="hidden-file" style={{ margin: 0 }}>
//                       <i
//                         className="mdi mdi-attachment mdi-rotate-315"
//                         style={{
//                           color: "#556EE6",
//                           fontSize: 16,
//                         }}
//                       />
//                     </Label> */}
//                   </div>
//                 </li>
//               </ul>
//             </div>
//             <div className="modal-footer">
//               {Array.from(allFiles)?.length > 0 && (
//                 <div className="d-flex gap-2 flex-wrap mt-2 ">
//                   {Array.from(allFiles)?.map((att, a) => (
//                     <span
//                       className="badge badge-soft-primary font-size-13"
//                       key={a}
//                     >
//                       {att.name}
//                     </span>
//                   ))}
//                 </div>
//               )}
//               {!loading && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     handleClose()
//                   }}
//                   className="btn btn-secondary "
//                   data-dismiss="modal"
//                 >
//                   Close
//                 </button>
//               )}
//               {loading ? (
//                 <button type="button" className="btn btn-dark ">
//                   <i className="bx bx-loader bx-spin font-size-16 align-middle me-2"></i>{" "}
//                   Loading
//                 </button>
//               ) : (
//                 <div className="btn btn-dark ">
//                   {forwardMembers &&
//                     forwardMembers
//                       .filter(a => a?._id !== currentUser?.userID)
//                       .map((member, m) => (
//                         <button
//                           key={m}
//                           type="button"
//                           className="btn btn-primary"
//                           onClick={() => handleForwardSendMessage(member?._id)}
//                           disabled={isDisabled()}
//                         >
//                           Forward Message
//                         </button>
//                       ))}
//                 </div>
//               )}
//             </div>
//           </Row>
//         </ModalBody>
//       </Modal>
//     </>
//   )
// }

// ForwardMsg.propTypes = {
//   open: PropTypes.bool,
//   setOpen: PropTypes.func,
//   toggleOpen: PropTypes.func,
//   currentMsg: PropTypes.object,
// }
// export default React.memo(ForwardMsg)
