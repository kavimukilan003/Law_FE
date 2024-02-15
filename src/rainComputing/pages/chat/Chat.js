import React, {
  useEffect,
  useState,
  Suspense,
  lazy,
  useCallback,
  useRef,
} from "react"
import { MetaTags } from "react-meta-tags"
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Form,
  FormGroup,
  InputGroup,
  UncontrolledDropdown,
  Modal,
  ModalHeader,
} from "reactstrap"
import PerfectScrollbar from "react-perfect-scrollbar"

import fileDownload from "js-file-download"
import "react-perfect-scrollbar/dist/css/styles.css"
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import profile from "assets/images/avatar-defult.jpg"
import UserDropdown from "rainComputing/components/chat/UserDropdown"
import classNames from "classnames"
import ChatboxSettingDropdown from "rainComputing/components/chat/ChatboxSettingDropdown"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import TextareaAutosize from "react-textarea-autosize"
import {
  createOnevsOneChat,
  getAllUsers,
  getCasesByUserId,
  getCounts,
  getGroupsByUserIdandCaseId,
  getMessagesByUserIdandGroupId,
  getOnevsOneChat,
  getMessageById,
  updateCase,
  deleteLastMsg,
  sentEmail,
  pinMessage,
  getCaseFiles,
  completedCase,
  getPinnedMsg,
  updateGroup,
  getAllSubCases,
  caseIdbySubCase,
  // sentMessageEmail,
} from "rainComputing/helpers/backend_helper"
import { Link } from "react-router-dom"
import { indexOf, isEmpty, map, now, set } from "lodash"
import DynamicModel from "rainComputing/components/modals/DynamicModal"
import { useToggle } from "rainComputing/helpers/hooks/useToggle"
import DynamicSuspense from "rainComputing/components/loader/DynamicSuspense"
import { initialNewCaseValues } from "rainComputing/helpers/initialFormValues"
import CaseGrid from "rainComputing/components/chat/CaseGrid"
import useAccordian from "rainComputing/helpers/hooks/useAccordian"
import SubgroupBar from "rainComputing/components/chat/SubgroupBar"
import { useChat } from "rainComputing/contextProviders/ChatProvider"
import moment from "moment"
import axios from "axios"
import { SERVER_URL } from "rainComputing/helpers/configuration"
import AttachmentViewer from "rainComputing/components/chat/AttachmentViewer"
import NoChat from "rainComputing/components/chat/NoChat"
import DeleteModal from "rainComputing/components/modals/DeleteModal"
import { useNotifications } from "rainComputing/contextProviders/NotificationsProvider"
import { useQuery } from "rainComputing/helpers/hooks/useQuery"
import ChatLoader from "rainComputing/components/chat/ChatLoader"
import EditCase from "rainComputing/components/chat/EditCase"
import { Mention, MentionsInput } from "react-mentions"
import { useDropzone } from "react-dropzone"
// import ForwardMsg from "rainComputing/components/chat/ForwardMsg"
import copy from "copy-to-clipboard"
import PinnedModels from "rainComputing/components/chat/models/PinnedModels"
import ReplyMsgModal from "rainComputing/components/chat/models/ReplyMsgModal"
import ChatRemainder from "rainComputing/components/chat/ChatRemainder"
import Reminders from "../reminder"
import { getFileFromGFS } from "rainComputing/helpers/backend_helper"
import Calender from "../Calendar/Calendar"
import RecordRTC from "recordrtc"
import VoiceMessage from "rainComputing/components/audio"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import EditMessageModel from "rainComputing/components/chat/models/EditMessageModel"
import CompletedCaseModel from "rainComputing/components/chat/models/CompletedCaseModel"
import "react-quill/dist/quill.snow.css"
import Quill from "quill"
import card from "../chat/card.css"
import "quill-mention"
import ReactQuillInput from "rainComputing/components/ReactQuill/ReactQuill"
import { log } from "logrocket"
import CaseFilesGrid from "rainComputing/components/chat/CaseFilesGrid"
import LinksModel from "rainComputing/components/chat/models/LinksModel"
import ReplyMessageComponent from "rainComputing/components/chat/ReplyMessage"
import { Search } from "react-bootstrap-table2-toolkit"

const CreateCase = lazy(() =>
  import("rainComputing/components/chat/CreateCase")
)
const SubGroups = lazy(() => import("rainComputing/components/chat/SubGroups"))

//Chat left sidebar nav items
const sidebarNavItems = ["Chat", "Case", "Contact"]

const initialPageCount = {
  chats: 3,
  cases: 3,
  users: 3,
}

const ChatRc = () => {
  let query = useQuery()
  const { currentUser } = useUser()
  const {
    toggleOpen: newCaseModelOpen,
    setToggleOpen: setNewCaseModelOpen,
    toggleIt: toggleNewCaseModelOpen,
  } = useToggle(false)
  // const {
  //   toggleOpen: completeCaseModelOpen,
  //   setToggleOpen: setCompleteCaseModelOpen,
  //   toggleIt: toggleCompleteCaseModelOpen,
  // } = useToggle(false)
  const {
    toggleOpen: remainderModelOpen,
    setToggleOpen: setRemainderModelOpen,
    toggleIt: toggleremainderModelOpen,
  } = useToggle(false)
  const {
    toggleOpen: CalendarModelOpen,
    setToggleOpen: setCalendarModelOpen,
    toggleIt: toggleCalendarModelOpen,
  } = useToggle(false)
  const {
    toggleOpen: subGroupModelOpen,
    setToggleOpen: setSubGroupModelOpen,
    toggleIt: togglesubGroupModelOpen,
  } = useToggle(false)
  const {
    toggleOpen: chatSettingOpen,
    setToggleOpen: setChatSettingOpen,
    toggleIt: toggleChatSettingOpen,
  } = useToggle(false)
  const {
    toggleOpen: groupIdOpen,
    setToggleOpen: setGroupIdOpen,
    toggleIt: toggleGroupIdOpen,
  } = useToggle(false)
  const {
    toggleOpen: caseSortingOpen,
    setToggleOpen: setCaseSortingOpen,
    toggleIt: toggleCaseSortingOpen,
  } = useToggle(false)
  const {
    toggleOpen: forwardModalOpen,
    setToggleOpen: setForwardModalOpen,
    toggleIt: toggleForwardModal,
  } = useToggle(false)

  const {
    chats,
    setChats,
    currentRoom: currentChat,
    setCurrentRoom: setCurrentChat,
    getRoomsonEveryMessage,
    handleSendingMessage,
    messages,
    setMessages,
    messageStack,
  } = useChat()

  const { currentAttorney } = useUser()
  const privateChatId = query.get("p_id")
  const privateReplyChatId = query.get("rp_id")
  const groupChatId = query.get("g_id")
  const caseChatId = query.get("c_id")
  const groupReplyChatId = query.get("rg_id")
  const caseReplyChatId = query.get("rc_id")
  const replymsgId = query.get("reply_id")
  const msgId = query.get("msg_id")
  const { notifications, setNotifications } = useNotifications()
  const [forwardMessages, setForwardMessages] = useState([])
  const { activeAccordian, handleSettingActiveAccordion } = useAccordian(-1)
  const {
    toggleOpen: caseDeleteModalOpen,
    setToggleOpen: setCaseDeleteModalOpen,
    toggleIt: toggleCaseDeleteModal,
  } = useToggle(false)
  const {
    toggleOpen: chatDeleteModalOpen,
    setToggleOpen: setChatDeleteModalOpen,
    toggleIt: toggleChatDeleteModal,
  } = useToggle(false)
  const {
    toggleOpen: MsgDeleteModalOpen,
    setToggleOpen: setMsgDeleteModalOpen,
    toggleIt: toggleMsgDeleteModal,
  } = useToggle(false)
  const {
    toggleOpen: completedCaseDelete,
    setToggleOpen: setCompletedCaseDelete,
    toggleIt: toggleCompleteCaseDeleteModelOpen,
  } = useToggle(false)
  const {
    toggleOpen: caseEditModalOpen,
    setToggleOpen: setCaseEditModalOpen,
    toggleIt: toggleCaseEditModal,
  } = useToggle(false)
  const {
    toggleOpen: messageEditModalOpen,
    setToggleOpen: setMessageEditModalOpen,
    toggleIt: toggleMessageEditModal,
  } = useToggle(false)
  const {
    toggleOpen: rplyMessageModalOpen,
    setToggleOpen: setReplyMsgModalOpen,
    toggleIt: toggleReplyMessageModal,
  } = useToggle(false)
  const {
    toggleOpen: filesModelOpen,
    setToggleOpen: setFilesModelOpen,
    toggleIt: toggleFilesModelOpen,
  } = useToggle(false)
  const {
    toggleOpen: linksModelOpen,
    setToggleOpen: setLinksModelOpen,
    toggleIt: toggleLinksModelOpen,
  } = useToggle(false)
  // const {
  //   toggleOpen: subdomainModelOpen,
  //   setToggleOpen: setsubdomainModelOpen,
  //   toggleIt: togglesubdomainModelOpen,
  // } = useToggle(false)

  const MESSAGE_CHUNK_SIZE = 50

  const [isChatScroll, setIsChatScroll] = useState(false)
  const [messageBox, setMessageBox] = useState(null)
  const [pageLoader, setPageLoader] = useState(true)
  const [chatLoader, setChatLoader] = useState(true)
  const [activeTab, setactiveTab] = useState(() => {
    const storedActiveTab = sessionStorage.getItem("activeTab")
    return storedActiveTab || "1"
  })
  const [contacts, setContacts] = useState([])
  const [contactsLoading, setContactsLoading] = useState(false)
  const [newCase, setNewCase] = useState(initialNewCaseValues)
  const [allCases, setAllCases] = useState([])
  const [allSubCases, setAllSubCases] = useState([])
  const [caseLoading, setCaseLoading] = useState(true)
  const [currentCase, setCurrentCase] = useState(null)
  const [allgroups, setAllgroups] = useState([])
  const [receivers, setReceivers] = useState([])
  const [isAttachment, setIsAttachment] = useState(false)
  const [isVoiceMessage, setIsVoiceMessage] = useState(false)
  const [recorder, setRecorder] = useState([])
  const [allFiles, setAllFiles] = useState([])
  const [allVoicemsg, setAllVoicemsg] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [totalPages, setTotalPages] = useState(initialPageCount)
  const [contactPage, setContactPage] = useState(1)
  const [casePage, setCasePage] = useState(1)
  const [search_Menu, setsearch_Menu] = useState(false)
  const [searchMessageText, setSearchMessagesText] = useState("")
  const [searchedMessages, setSearchedMessages] = useState([])
  const [mentionsArray, setMentionsArray] = useState([])
  const [curReplyMessageId, setCurReplyMessageId] = useState(null)
  const [curEditMessageId, setCurEditMessageId] = useState("")
  const [curReminderMessageId, setCurReminderMessageId] = useState(null)
  const [isDeleteMsg, setIsDeleteMsg] = useState(false)
  const [emailModal, setEmailModal] = useState(false)
  const [email, setEmail] = useState("")
  const [searchIndex, setSearchIndex] = useState(0)
  const [pinModal, setPinModal] = useState(false)
  const [pinnedMsg, setPinnedMsg] = useState("")
  const [getpinnedMsg, setGetPinnedMsg] = useState("")
  const [msgDelete, setMsgDelete] = useState()
  const containerRef = useRef(null)
  const [prevHeight, setPrevHeight] = useState(0)
  const [visibleMessages, setVisibleMessages] = useState([])
  const [blobURL, setBlobURL] = useState(null)
  const [isSearchTextCleared, setIsSearchTextCleared] = useState(false)
  const [filteredChats, setFilteredChats] = useState(chats)
  const [duration, setDuration] = useState(0)
  const [durationIntervalId, setDurationIntervalId] = useState(null)
  const [caseFile, setCaseFile] = useState([])
  const [modal_scroll, setmodal_scroll] = useState(false)
  const [curMessage, setcurMessage] = useState("")
  const [currentChatDelete, setCurrentChatDelete] = useState()
  const [sortedChats, setSortedChats] = useState([])
  const [deleteMessage, setDeleteMessage] = useState()
  const [nonewmessage, setNoNewMessage] = useState([])
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [inputBoxHeight, setInputBoxHeight] = useState("100%");
  const [subject, setSubject] = useState('');
  const [searchTextError, setSearchTextError] = useState("");
  const toggleFullScreen = () => {
    if (isFullScreen) {
      setInputBoxHeight("100%");
    } else {
      setInputBoxHeight("80vh"); // You can adjust the height as needed
    }
    setIsFullScreen(!isFullScreen);
  };
  // When the user changes the active tab, save it to localStorage
  const handleTabChange = newActiveTab => {
    setactiveTab(newActiveTab)
  }

  useEffect(() => {
    sessionStorage.setItem("activeTab", activeTab)
  }, [activeTab])
  // Call the function to set the active tab when the page loads

  // const handleFullScreenView = () => {
  //   setIsFullScreen(!isFullScreen)
  // }
  const [isQuill, setIsQuill] = useState(false)
  const toggle_Quill = () => {
    setIsQuill(!isQuill)
  }

  const handleCancel = () => {
    setAllVoicemsg([])
    setIsVoiceMessage(false)
    setRecorder([])
    setBlobURL(null)
  }

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        const newRecorder = RecordRTC(stream, { type: "audio" })
        newRecorder.startRecording()
        setRecorder(newRecorder)
        // Start updating duration every second
        const intervalId = setInterval(() => {
          setDuration(duration => duration + 1)
        }, 1000)
        setDuration(0)
        setDurationIntervalId(intervalId)
      })
      .catch(err => console.log(err))
    setBlobURL(null)
    setDuration(0)
  }

  // Stop recording
  const stopRecording = () => {
    if (recorder && recorder.state === "recording") {
      recorder.stopRecording(() => {
        const blob = recorder.getBlob()
        const url = URL.createObjectURL(blob)
        setBlobURL(url)
        setIsVoiceMessage(true)
        // send the recorded message as a message here using a messaging API
      })
    }
    // Clear duration interval
    clearInterval(durationIntervalId)
    setDurationIntervalId(null)
  }

  const regex = /<a href="([^"]+)"/

  const filteredMessages = messages.filter(message => {
    const messageData = message.messageData

    return regex.test(messageData)
  })

  useEffect(() => {
    return () => {
      // Clean up the duration interval on component unmount
      clearInterval(durationIntervalId)
    }
  }, [])
  const handleScroll = event => {
    if (event && event.currentTarget) {
      const { scrollTop, clientHeight, scrollHeight } = event.currentTarget

      if (scrollTop === 0) {
        setPrevHeight(scrollHeight)
        const additionalMessages = Math.min(
          messages.length - visibleMessages.length,
          MESSAGE_CHUNK_SIZE
        )
        setVisibleMessages(prevVisibleMessages =>
          messages.slice(-prevVisibleMessages.length - additionalMessages)
        )

        if (visibleMessages.length < messages.length) {
          event.currentTarget.scrollTop = clientHeight
        } else if (scrollTop + clientHeight === scrollHeight) {
          // User has scrolled to the bottom, scroll to bottom automatically
          event.currentTarget.scrollTop = scrollHeight
        }
      }
    }
  }

  // const scrollToBottom = () => {
  //   if (containerRef.current) {
  //     containerRef.current.scrollTop = containerRef.current.scrollHeight

  //     containerRef.current.scrollIntoView({ behavior: "auto", block: "end" })
  //   }
  // }

  const scrollToBottom = () => {
    containerRef.current?.scrollTo({
      left: 0,
      top: containerRef.current.scrollHeight,
      behavior: "auto", // Changing behavior to "auto" will cause the scrolling to happen instantly
    })
  }

  // useEffect(() => {
  //   scrollToBottom();
  // }, []);
  // useEffect(() => {
  //   scrollToBottom()
  // }, [messages, currentChat])

  const handlerefreshemail = async () => {
    setChatLoader(true)
    const payload = {
      groupId: currentChat?._id,
      userId: currentUser?.userID,
    }
    const res = await getMessagesByUserIdandGroupId(payload)
    if (res.success) {
      setMessages(res.groupMessages)
      const timer = setTimeout(() => {
        scrollToBottom()
      }, 500)
      return () => clearTimeout(timer)
    } else {
      console.log("Failed to fetch Group message", res)
      setNoNewMessage(res.groupMessages)
     
          
    }
    setChatLoader(false)
  }
  // useEffect(() => {
  //   if (nonewmessage) {
  //     const timer = setTimeout(() => {
  //       scrollToBottom()
  //     }, 500)
  //     return () => clearTimeout(timer)
  //   }
  // }, [messages])
  const filterChats = async () => {
    if (searchText !== "") {
      const filteredChats = chats?.filter(chat =>
        chat.groupMembers.some(
          member =>
            member.id?.firstname
              ?.toLowerCase()
              .includes(searchText.toLowerCase()) ||
            member.id?.lastname
              ?.toLowerCase()
              .includes(searchText.toLowerCase()) ||
            member.id?.email?.toLowerCase().includes(searchText.toLowerCase())
        )
      )
      setFilteredChats(filteredChats)
      setChats(filteredChats)
      setIsSearchTextCleared(false)
    } else {
      if (!isSearchTextCleared) {
        await ongetAllChatRooms() // Call the function to get all chats
        setIsSearchTextCleared(true)
      }
    }
  }
  useEffect(() => {
    if (searchText === "") {
      setIsSearchTextCleared(true)
    }
    filterChats()
  }, [searchText])

  // useEffect(() => {
  //   if (messages && visibleMessages?.length < messages?.length) {
  //     const tempHeight = containerRef?.current?.scrollHeight - prevHeight
  //     containerRef?.current?.scrollTo({ top: tempHeight, behavior: "auto" }) // Use "auto" instead of "smooth"
  //   }
  // }, [visibleMessages?.length, messages])
  useEffect(() => {
    setVisibleMessages(messages.slice(-49))
    if (replymsgId) {
      Locate()
    } else {
      const timer = setTimeout(() => {
        scrollToBottom()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [messages?.length])

  //Toaster settings
  toastr.options = {
    progressBar: true,
    closeButton: true,
  }

  //Handle Body Scrolling
  isChatScroll ? disableBodyScroll(document) : enableBodyScroll(document)

  // const depMessages = visibleMessages?.slice()

  // //Scroll to messages bottom on load & message arrives

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (!isEmpty(visibleMessages)) {
  //       scrollToBottom()
  //     }
  //   }, 500)
  //   return () => clearTimeout(timer)
  // }, [depMessages])

  //Toggle Active tab in chat-left-side
  const toggleTab = tab => {
    if (activeTab !== tab) {
      setactiveTab(tab)
      handleTabChange(tab)
      setCurrentChat(null)
      setSearchText("")
      if (searchText === "") {
        ongetAllCases({ isSet: false })
      }
    }
  }
  //copy group Id
  const copyToClipboard = () => {
    copy(`[Thread Id: ${currentChat?.threadId}]`)
    // alert(`You have copied "${currentChat?._id}"`);
  }
  const copyToemail = () => {
    copy(`rpmongotest@gmail.com`)
    // alert(`You have copied "${currentChat?._id}"`);
  }

  //Toggle Chat Box Menus
  const toggleSearch = () => {
    setsearch_Menu(!search_Menu)
  }
  //PinnedMessage
  const tog_scroll = () => {
    setPinModal(!pinModal)
    setmodal_scroll(!modal_scroll)
  }
  //Getting Notofication Count
  const getNotificationCount = id => {
    const notiCount = notifications.filter(c => c.groupId === id)
    return notiCount ? notiCount.length : 0
  }
  //Getting Notofication for Case
  const notifyCountforCase = id => {
    const notiCount = notifications.find(c => c.caseId === id)
    return notiCount ? true : false
  }

  const handleForwardMessage = async msgId => {
    setChatLoader(true)
    const payload = {
      msgId: msgId,
    }
    const res = await getMessageById(payload)
    if (res.success) {
      setForwardMessages(res.Msg)
      //setcurMessage(res.messageData)
    } else {
      console.log("Failed to fetch message", res)
    }
    //setcurMessage(res.messageData)
    setChatLoader(false)
  }
  //Getting all 1vs1 chats
  // useEffect(() => {
  //   const updatedSortedChats = chats
  //     .map(chat => {
  //       const notificationCount = getNotificationCount(chat._id)
  //       const recentChat =
  //         chat.notification &&
  //         chat.notification.updatedAt &&
  //         new Date(chat.notification.updatedAt)
  //       return {
  //         chat,
  //         notificationCount,
  //         recentChat,
  //       }
  //     })
  //     .sort((a, b) => {
  //       if (a.recentChat && b.recentChat) {
  //         return b.recentChat - a.recentChat // Sort by time in descending order based on recentChat's updatedAt field
  //       } else if (a.recentChat) {
  //         return -1 // a has a recent chat, but b doesn't, so a should be placed above b
  //       } else if (b.recentChat) {
  //         return 1 // b has a recent chat, but a doesn't, so b should be placed above a
  //       } else {
  //         return b.notificationCount - a.notificationCount // Sort by notification count
  //       }
  //     })
  //   setSortedChats(updatedSortedChats)
  // }, [chats, notifications])

  const ongetAllChatRooms = async () => {
    const chatRoomsRes = await getOnevsOneChat({ userId: currentUser.userID })
    if (chatRoomsRes.success) {
      // const updatedChats = chatRoomsRes.groups.map(chat => {
      //   const notification = notifications.find(n => n.groupId === chat._id)
      //   return {
      //     ...chat,
      //     notification,
      //   }
      // })

      // updatedChats.sort((a, b) => {
      //   if (a.notification && b.notification) {
      //     return (
      //       new Date(b.notification.updatedAt) -
      //       new Date(a.notification.updatedAt)
      //     )
      //   } else if (a.notification) {
      //     return -1 // Move chat with notification to the top
      //   } else if (b.notification) {
      //     return 1 // Move chat with notification to the top
      //   } else {
      //     return 0 // No notifications for both chats, maintain order
      //   }
      // })

      setChats(chatRoomsRes.groups)
      // setCurrentChat(updatedChats[0])
      // if (chats.length < 1) {
      //   setactiveTab("3")
      // }
    } else {
      setChats([])
    }
    setChatLoader(false)
  }

  useEffect(() => {
    ongetAllChatRooms();
    ongetAllCases({ isSet: false });
  }, [messages,notifications])

  //Creating New ChatRoom
  const handleCreateChatRoom = async id => {
    setPageLoader(true)
    const payload = {
      members: [currentUser?.userID, id],
    }
    const createdChatRes = await createOnevsOneChat(payload)
    if (createdChatRes.success) {
      // toastr.success(`Chat has been created successfully`, "Success")
      await ongetAllChatRooms()
      setCurrentChat(createdChatRes.group)
      setactiveTab("1")
    } else {
      // toastr.error(`Failed to create chat`, "Failed!!!")
      console.log("Failed to create 1vs1 chat ", createdChatRes)
    }
    setPageLoader(false)
  }

  //Getting 1vs1 chat name
  const getChatName = members => {
    const chatMember = members.filter(
      member => member.id?._id !== currentUser.userID
    )
    if (chatMember.length > 0)
      return chatMember[0].id?.firstname + " " + chatMember[0].id?.lastname
    return "Guest Chat"
  }

  //Getting 1vs1 chat name
  const getChatEmail = members => {
    const chatMember = members.find(
      member => member.id?._id !== currentUser.userID
    )
    if (chatMember) return chatMember.id?.email
    return "Guest Chat"
  }

  //getting 1vs1 chat profilePic
  const getChatProfilePic = members => {
    const chatMember = members.filter(
      member => member.id?._id !== currentUser.userID
    )
    if (chatMember.length > 0)
      return chatMember[0].id?.profilePic
        ? chatMember[0].id?.profilePic
        : profile

    return profile
  }

  //getting 1vs1 chat sender name
  const getSenderOneChat = senderId => {
    const chatMember = currentChat?.groupMembers.find(
      member => member.id?._id === senderId
    )
    if (chatMember)
      return chatMember.id?.firstname + " " + chatMember.id?.lastname
    return senderId
  }
  //Getting all the cases
  const ongetAllCases = async ({ isSet = false, isSearch = false }) => {
    
    const allCasesRes = await getCasesByUserId({
      userId: currentUser.userID,
      page: isSearch ? 1 : casePage,
      searchText,
    })

    if (allCasesRes.success) {
      // Filter out cases that are not subcases
      // const filteredCases = allCasesRes.cases.filter(ca => !ca.isSubcase)

      // Sort the filtered cases array by createdAt in descending order
      // const sortedCases = allCasesRes.cases.sort(
      //   (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      // )

      setAllCases(allCasesRes.cases)

      // if (isSet) {
      //   setCurrentCase(sortedCases[0])
      // }
    } else {
      setAllCases([])
      setCurrentCase(null)
      setAllgroups(null)
    }

 
  }

  // const onGetAllSubCases = async () => {
  //   const payload = {
  //     isSubcase: true,
  //   }
  //   const res = await getAllSubCases(payload)
  //   if (res.success) {
  //     setAllSubCases(res?.allsubCases)
  //   }
  // }
  // useEffect(() => {
  //   onGetAllSubCases()
  // }, [])
  //Fetching user,case,group count
  const ongetCounts = async () => {
    const countRes = await getCounts({ userId: currentUser?.userID })
    if (countRes?.success) {
      const limit = 50
      const { userCount, chatCount, caseCount } = countRes
      setTotalPages({
        ...totalPages,
        chats: Math.ceil(chatCount / limit),
        users: Math.ceil(userCount / limit),
        cases: Math.ceil(caseCount / limit),
      })
    }
  }

  //Viewing Message
  const prettifyMsg = comment => {
    let regex = /@\[.+?\]\(.+?\)/gm
    let displayRegex = /@\[.+?\]/g
    let idRegex = /\(.+?\)/g
    let matches = comment?.match(regex)
    let arr = []
    matches &&
      matches.forEach(m => {
        let id = m.match(idRegex)[0].replace("(", "").replace(")", "")
        let display = m.match(displayRegex)[0].replace("[", "").replace("]", "")

        arr.push({ id: id, display: display })
      })
    let newComment = comment?.split(regex)
    let output = ""
    for (let i = 0; i < newComment?.length; i++) {
      const c = newComment[i]
      if (i === newComment?.length - 1) {
        output += c
      } else {
        output += c + `${arr[i].display}`
      }
    }
    return output
  }

  //Fetching Contacts
  const onGetContacts = async ({ isSearch = false }) => {
    if (searchText === "") {
      await onGetEmailContacts()
    } else {
      setContactsLoading(true)
      const userRes = await getAllUsers({
        userID: currentUser.userID,
        page: isSearch ? 1 : contactPage,
        searchText,
      })
      if (userRes.success) {
        if (!isSearch) {
          setContacts([...contacts, ...userRes.users])
        } else {
          setContacts(userRes?.users)
        }
      } else {
        setContacts([])
      }
      setContactsLoading(false)
    }
  }
  //send message to email
  // const onSendMessageEmail = async (msg) => {
  //   const membersEmail = currentCase?.caseMembers.map((member) => member?.id?.email);
  //   const payLoad = {
  //     messageData: msg?.messageData,
  //     chatRoomId: currentChat?._id,
  //     caseName: currentCase?.caseName ? currentCase?.caseName : "PrivateChat",
  //     groupName: currentChat?.isGroup
  //       ? currentChat?.groupName
  //       : getChatName(currentChat?.groupMembers),
  //     membersEmail: membersEmail
  //   }
  //   const mailRes = await sentMessageEmail(payLoad)
  //   toastr.success(`Mail has been Send successfully`, "Success")
  //   setEmail(mailRes.true)
  // }

  const onGetEmailContacts = async () => {
    const userRes = await getAllUsers({
      userID: currentUser.userID,
      email: currentUser?.email,
    })
    if (userRes.success) {
      setContacts([...userRes.users])
    } else {
      setContacts(userRes?.users)
    }
  }
  useEffect(() => {
    if (activeTab === "3" && searchText === "") {
      // Call onGetEmailContacts and clear searchText
      onGetEmailContacts()
      setSearchText("")
    }
  }, [activeTab, searchText])
  //Selecting current case
  const onSelectingCase = cas => {
    setCurrentCase(cas)
    setAllVoicemsg([])
    setIsVoiceMessage(false)
    setRecorder([])
    setBlobURL(null)
    setAllFiles([])
  }

  //pinned Message
  const onPinnedMessage = async msgid => {
    const payload = { Id: msgid }
    const res = await pinMessage(payload)
    if (res.success) {
      const updatedMessages = messages.map(msg => {
        if (msg._id === res.message._id) {
          return {
            ...msg,
            isPinned: true,
          }
        } else {
          return msg
        }
      })
      setMessages(updatedMessages)
      setPinnedMsg(res.message)
    }
  }
  //Deleting Case
  const onDeletingCase = async () => {
    const payload = {
      id: currentCase?._id,
      deleteIt: true,
    }
    const res = await updateCase(payload)
    if (res.success) {
      toastr.success(
        `Case ${res?.caseId} has been Deleted successfully`,
        "Success"
      )
      setCurrentCase(null)
      setCurrentChat(null)
      await ongetAllChatRooms()
      await ongetAllCases({ isSet: false })
    } else {
      toastr.error("Failed to delete case", "Failed!!!")
    }
    setCaseDeleteModalOpen(false)
  }

  const handleCaseDelete = () => {
    setCaseDeleteModalOpen(true)
  }

  // Deleting Chat
  const onDeletingChat = async () => {
    const payload = {
      groupId: currentChatDelete,
      deleteIt: true,
    }
    const res = await updateGroup(payload)
    if (res.success) {
      setCurrentChat(null)
      await ongetAllChatRooms()
      toastr.success(`Chat has been Deleted successfully`, "Success")
      setCurrentChatDelete(null)
    } else {
      toastr.error("Failed to delete chat", "Failed!!!")
    }
    setChatDeleteModalOpen(false)
  }
  const handleChatDelete = id => {
    setChatDeleteModalOpen(true), setCurrentChatDelete(id)
  }

  //Deleting Last Message
  const onDeletingMsg = async () => {
    const payload = {
      id: msgDelete?._id,
      deleteIt: true,
      createdAt: msgDelete.createdAt,
    }
    const res = await deleteLastMsg(payload)
    if (res.success) {
      const payload = {
        groupId: currentChat._id,
        userId: currentUser.userID,
      }
      setDeleteMessage(res)
      setIsDeleteMsg(true)
      toastr.success(`Message  has been Deleted successfully`, "Success")
      //setDelMsg()
      const res1 = await getMessagesByUserIdandGroupId(payload)
      if (res1.success) {
        setMessages(res1.groupMessages)
      }
    } else {
      toastr.error("Unable to delete Message after 10 min", "Failed!!!")
    }
    setMsgDeleteModalOpen(false)
  }
  const handleDelete = msg => {
    setMsgDelete(msg)
    setMsgDeleteModalOpen(true)
  }
  //Textbox empty or spaces
  const isEmptyOrSpaces = () => {
    if (isAttachment || isVoiceMessage) {
      return false;
    }
    const isNullOrWhitespace = curMessage === null || curMessage.trim() === '';
    const hasNonWhitespaceContent = curMessage !== null && curMessage.replace(/<[^>]*>/g, '').trim().length > 0;
    return isNullOrWhitespace || !hasNonWhitespaceContent;
  };


  const toggle_emailModal = () => {
    setEmailModal(!emailModal)
    document.body.classList.add("no_padding")
  }
  useEffect(() => {
    if (isVoiceMessage === true) {
      setAllVoicemsg([recorder])
    }
  }, [recorder, isVoiceMessage])

  //Sending Message
  const handleSendMessage = async (rID) => {
    setLoading(true)
    if (isEmptyOrSpaces()) {
      console.log("You can't send empty message")
    } else if (curMessage.length > 1000) {
      toastr.error("Message should be exactly 1000 characters", "Error");
    }
    else {
      let voiceMessageId = []
      let attachmentsId = []
      let payLoad = {
        rID,
        caseId: currentCase?._id,
        groupId: currentChat?._id,
        sender: currentUser?.userID,
        receivers,
        subject: subject,
        messageData: curMessage,
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
      await handleSendingMessage(payLoad)
      setAllFiles([])
      setAllVoicemsg([])
      setcurMessage("")
      setSubject("")
      setIsAttachment(false)
      setIsVoiceMessage(false)
      setRecorder([])
      setBlobURL(null)
      // await ongetAllChatRooms()
      // await ongetAllCases({ isSet: false })
    }
    setLoading(false)
    // setReplyMsgModalOpen(false)
  }
  const { getRootProps, getInputProps } = useDropzone({
    accept:
      ".png, .jpg, .jpeg,.pdf,.doc,.xls,.docx,.xlsx,.zip,.mp3,.webm,.ogg,.wav ",
    onDrop: acceptedFiles => {
      setAllFiles(
        acceptedFiles.map(allFiles =>
          Object.assign(allFiles, {
            preview: URL.createObjectURL(allFiles),
          })
        )
      )
      // const updatedVoicemsg = recorder.map(allVoicemsg => Object.assign(allVoicemsg, {
      //   preview: URL.createObjectURL(allVoicemsg),
      // }));
      // setAllVoicemsg(updatedVoicemsg);
      // setRecorder(updatedVoicemsg);
    },
  })

  // Copy Paste Function

  const allowedFileTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/pdf",
    "application/msword",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/x-zip-compressed",
    "audio/mpeg",
    "audio/webm",
    "audio/ogg",
    "audio/wav",
  ];

  const handlePaste = (event) => {
    const clipboardData = event.clipboardData || window.clipboardData;
    const items = clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (allowedFileTypes.includes(item.type)) {
        const blob = item.getAsFile();
        const originalFileName =
          item.kind === "file"
            ? item.getAsFile().name
            : `pasted-file.${blob.type.split("/")[1]}`;
        const fileSizeInMB = blob.size / (1024 * 1024); // Convert bytes to megabytes

        if (fileSizeInMB <= 25) {
          const file = new File([blob], originalFileName, {
            type: blob.type,
          });
          setAllFiles((prevFiles) => [
            ...prevFiles,
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            }),
          ]);
        } else {
          toastr.error("File size should be 25 MB or less", "Error");
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  const onChange = (content, delta, source, editor) => {
    // Remove <p> tags from the content
    const strippedContent = content.replace(/<p><\/p>/gi, "")

    setcurMessage(strippedContent)
  }

  //Detecting Enter key Press in textbox
  const onKeyPress = event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      // handleSendMessage()
    }
  }

  //Getting sender name
  const getMemberName = id => {
    const caseArray = [...allCases, ...allSubCases] // Combine all cases and subcases
    const memberName = caseArray
      .find(cas => cas._id === currentCase?._id)
      ?.caseMembers?.find(member => member?.id?._id === id)

    if (memberName) {
      return memberName?.id?.firstname + " " + memberName?.id?.lastname
    }
    return id
  }

  //Scrolling to bottom of message
  // const scrollToBottom = () => {
  //   if (messageBox) {
  //     messageBox.scrollTop = messageBox.scrollHeight + messageBox?.offsetHeight
  //   }
  // }
  // useEffect(()=>{
  //   if(containerRef.current){
  //     containerRef.current.scrollTop = containerRef.current.scrollHeight;
  //   }
  // },[messages])
  // useEffect(() => {
  //   if (messageBox) {
  //     messageBox.scrollTop = messageBox.scrollHeight
  //   }
  // }, [messageBox?.scrollHeight])

  //Handling File change
  const handleFileChange = e => {
    const selectedFiles = Array.from(e.target.files);

    // Check individual file sizes and display an error for files exceeding 25 MB
    const exceedingFiles = selectedFiles.filter(file => file.size > 25 * 1024 * 1024);

    if (exceedingFiles.length > 0) {
      // Display warning message for each exceeding file
      exceedingFiles.forEach(file => {
        toastr.error(`File "${file.name}" exceeds the maximum size of 25 megabytes.`, "Warning");
      });
      return;
    }
    if (selectedFiles.length + allFiles.length > 10) {
      // Display warning message here
      toastr.error("You can select a maximum of 10 files.", "Warning");
      return;
    }

    const updatedFiles = [...allFiles, ...selectedFiles];
    setAllFiles(updatedFiles);
  };

  const handleFileRemove = fileName => {
    const updatedFiles = allFiles.filter(file => file.name !== fileName)
    setAllFiles(updatedFiles)
  }

  //Fetching SubGroups
  const onGettingSubgroups = async () => {
    setChatLoader(true)
    const payLoad = {
      caseId: currentCase._id,
      userId: currentUser.userID,
    }
    const subGroupsRes = await getGroupsByUserIdandCaseId(payLoad)
    if (subGroupsRes.success) {
      setAllgroups(subGroupsRes.groups)
      setCurrentChat(subGroupsRes.groups[0])
    }
    setChatLoader(false)
  }

  const handleFetchFiles = async () => {
    let payload = {};
    if (currentCase && currentCase._id) {
      payload = { caseId: currentCase._id };
    } else if (currentChat && currentChat._id) {
      payload = { groupId: currentChat._id };
    }
    try {
      const filesRes = await getCaseFiles(payload)
      if (filesRes.success && filesRes?.files?.length > 0) {
        const updatedFiles = filesRes.files.map(file => {
          const sendAt = moment(file.time).format("DD-MM-YY HH:mm")
          return { ...file, time: sendAt, isDownloading: true }
        })
        setCaseFile(updatedFiles)
      } else {
        setCaseFile([])
      }
    } catch (error) {
      console.error(`Error fetching case files: ${error}`)
      setCaseFile([])
    }
  }

  useEffect(() => {
    handleFetchFiles()
  }, [currentCase, currentChat]) // Add currentCase as a dependency

  // Archive Chat
  const onArchievingChat = async () => {
    setChatLoader(true)
    // Get chat transcript
    const doc = new jsPDF()
    const header = [
      ["Sender", "Message", "Time", "Group Name", "Case Name", "Attachments"],
    ]
    let rows = []
    const caseName = currentCase?.caseName ?? "-"
    const groupName = currentChat?.isGroup
      ? currentChat?.groupName
      : getChatName(currentChat?.groupMembers)
    messages.forEach(m => {
      const sender = m?.caseId
        ? getMemberName(m?.sender)
        : getSenderOneChat(m?.sender)
      const message = m?.messageData
      const time = moment(m?.createdAt).format("DD-MM-YY HH:mm")
      const attachments =
        m.isAttachment && m.attachments[0].id
          ? { url: `${SERVER_URL}/file/${m.attachments[0].id}` }
          : "-"
      const tempRow = [
        sender,
        message,
        time,
        groupName,
        caseName,
        attachments?.url,
        typeof attachments === "object" && attachments?.url
          ? {
            url: attachments.url,
            content: "View Attachment",
          }
          : "-",
      ]
      rows.push(tempRow)
    })
    autoTable(doc, {
      bodyStyles: { valign: "top" },
      margin: { top: 30 },
      head: header,
      body: rows,
      theme: "grid",
      columnStyles: {
        0: { cellWidth: 30, cellHeight: 50 },
        1: { cellWidth: 30, cellHeight: 50 },
        2: { cellWidth: 20, cellHeight: 50 },
        3: { cellWidth: 20, cellHeight: 50 },
        4: { cellWidth: 20, cellHeight: 50 },
        5: { halign: "center", cellWidth: 90 },
        5: {
          // halign: "center",
          cellWidth: 100,
          // valign: "middle",
          fillColor: [250, 250, 250],
          textColor: [0, 0, 0],
          fontSize: 8,
        },
      },
      headStyles: {
        fillColor: [0, 0, 230],
        fontSize: 12,
        fontStyle: "bold",
        font: "courier",
        halign: "center",
      },
      willDrawCell: data => {
        if (
          data.section === "body" &&
          data.column.index === 5 &&
          data.cell.raw !== "-"
        ) {
          data.doc.setFillColor("green")
          data.doc.setTextColor("black")
        }
      },
      didDrawPage: data => {
        doc.setFontSize(20)
        doc.setTextColor(40)
        doc.text(
          `${currentCase?.caseName ?? "Private Chat"} - ${groupName}`,
          data.settings.margin.left,
          20
        )
      },
    })
    const chatDocName = `${currentCase?.caseName ?? "Private Chat"
      } - ${groupName} - ${moment(Date.now()).format("DD-MM-YY HH:mm")}`
    const chatDocBlob = doc.output("blob")
    const zip = new JSZip()
    zip.file(`${chatDocName}.pdf`, chatDocBlob)
    const caseFolder = zip.folder(currentCase?.caseName ?? "Private Chat")
    // Loop through each case file and add it to the ZIP file
    for (const file of caseFile) {
      try {
        // Fetch the file from MongoDB
        const res = await fetch(`${SERVER_URL}/file/${file.id}`)
        const blob = await res.blob()
        caseFolder.file(file.name, blob)
      } catch (err) {
        console.error(`Error fetching case file ${file.name}: ${err}`)
      }
    }
    // Generate the ZIP file and download it
    zip
      .generateAsync({ type: "blob" })
      .then(content => {
        try {
          // Create a URL for the ZIP blob
          const zipURL = window.URL.createObjectURL(content)
          // Create an <a> element with the URL and download attributes
          const downloadLink = document.createElement("a")
          downloadLink.href = zipURL
          downloadLink.download = `${chatDocName} + Case Files.zip`
          // Simulate a click on the download link to trigger the download
          document.body.appendChild(downloadLink)
          downloadLink.click()
          // Clean up the <a> element and the URL object
          document.body.removeChild(downloadLink)
          window.URL.revokeObjectURL(zipURL)
        } catch (err) {
          console.error(`Error creating download link: ${err}`)
        }
      })
      .catch(err => {
        console.error(`Error generating ZIP file: ${err}`)
      })
    setChatLoader(false)
  }
  //Handle sending email
  const onSendEmail = async () => {
    const payLoad = {
      mail: email,
      chatRoomId: currentChat?._id,
      caseName: currentCase?.caseName ? currentCase?.caseName : "PrivateChat",
      groupName: currentChat?.isGroup
        ? currentChat?.groupName
        : getChatName(currentChat?.groupMembers),
    }
    const mailRes = await sentEmail(payLoad)
    toastr.success(`Mail has been Send successfully`, "Success")
    setEmail(mailRes.true)
    setEmailModal(false)
  }

  //Contacts infiniteScroll
  const handleContactScroll = t => {
    if (
      t.clientHeight + t.scrollTop + 1 >= t.scrollHeight &&
      contactPage <= totalPages?.users
    ) {
      setContactPage(contactPage + 1)
    }
  }

  //Cases infiniteScroll
  const handleCaseScroll = t => {
    if (
      t.clientHeight + t.scrollTop + 1 >= t.scrollHeight &&
      casePage <= totalPages?.cases
    ) {
      setCasePage(casePage + 1)
    }
  }
  //Message ScrollintoView
  const handleShow = () => {
    setSearchIndex(searchIndex + 1)
  }
  const handleShowTop = () => {
    setSearchIndex(searchIndex - 1)
  }

  //Message search
  // useEffect(() => {
  //   if (searchMessageText) {
  //     setSearchedMessages(
  //       visibleMessages?.filter(m =>
  //         m?.messageData.toLowerCase().includes(searchMessageText.toLowerCase())
  //       )
  //     )
  //   } else {
  //     setSearchedMessages([])
  //   }
  //   return () => {
  //     setSearchedMessages([])
  //   }
  // }, [searchMessageText])

  // Latest Search

  useEffect(() => {
    if (searchMessageText) {
      setSearchedMessages(
        messages?.filter(m =>
          m?.messageData.toLowerCase().includes(searchMessageText.toLowerCase()) ||
          (searchMessageText.length === 8 && moment(m.createdAt).format("DD-MM-YY").includes(searchMessageText.toLowerCase()))
        )
      )
    } else if (!searchText) {
      setSearchedMessages([])
      setsearch_Menu(false)
      setSearchMessagesText("") // Clear searchMessageText
      const timer = setTimeout(() => {
        scrollToBottom()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [searchMessageText, searchText, searchIndex, currentChat])
  useEffect(() => {
    if (searchText) {
      setsearch_Menu(true)
      setSearchMessagesText(searchText)
      setSearchedMessages(
        messages?.filter(m =>
          m?.messageData.toLowerCase().includes(searchText.toLowerCase())
        )
      )
    } else if (!isSearchTextCleared) {
      setsearch_Menu(false)
      setSearchedMessages([])
      setSearchMessagesText("")
      setCurrentChat(null) // Clear searchMessageText
    }
  }, [
    searchText,
    searchIndex,
    searchMessageText,
    isSearchTextCleared,
    currentChat,
    messages,
  ])
  useEffect(() => {
    if (searchedMessages?.length > 0 && searchIndex >= 0) {
      const elementid = searchedMessages[searchIndex]?._id
      const messageElem = document.getElementById(elementid)
      if (messageElem) {
        messageElem.scrollIntoView({ behavior: "auto" })
      }
    } else {
      setSearchIndex(0)
    }
  }, [
    searchedMessages,
    searchIndex,
    currentChat,
    searchMessageText,
    searchText,
  ])

  // useEffect(() => {
  //   if (searchMessageText) {
  //     setSearchedMessages(
  //       messages?.filter(m =>
  //         m?.messageData.toLowerCase().includes(searchMessageText.toLowerCase())
  //       )
  //     )
  //   } else {
  //     setSearchedMessages([])
  //   }
  //   return () => {
  //     setSearchedMessages([])
  //   }
  // }, [searchMessageText])

  const handleFileDownload = async ({ id, filename }) => {
    getFileFromGFS(
      { id },
      {
        responseType: "blob",
      }
    ).then(res => {
      fileDownload(res, filename)
    })
  }

  // useEffect(() => {
  //   if (searchedMessages?.length > 0) {
  //     const elementid = searchedMessages[0]?._id
  //     document.getElementById(elementid)?.scrollIntoView(false)
  //   } else {
  //     setSearchIndex(0)
  //   }
  // }, [searchedMessages])

  //Text Convert into Link URL
  const stringFormatter = txt => {
    if (txt.includes("http" || "www")) {
      const firstIndex = txt.indexOf("http")
      const linkEnd = txt.indexOf(" ", firstIndex) //find the end of link
      const firstTextSection = txt.slice(0, firstIndex)
      const linkSection = txt.slice(
        firstIndex,
        linkEnd !== -1 ? linkEnd : txt.length
      )
      const secondSection = txt.slice(linkEnd !== -1 ? linkEnd : txt.length)
      return (
        <p>
          {firstTextSection}{" "}
          <a href={linkSection} target="_blank" rel="noreferrer">
            {linkSection}
          </a>
          {secondSection}
        </p>
      )
    } else {
      return <p>{txt}</p>
    }
  }

  useEffect(() => {
    if (searchIndex >= 0) {
      const elementid = searchedMessages[searchIndex]?._id
      document.getElementById(elementid)?.scrollIntoView(false)
    }
  }, [searchIndex])

  //Resetting page whiule changing Tab
  useEffect(() => {
    setContactPage(1)
    setCasePage(1)
    // if (activeTab === "3") onGetContacts({ isSearch: true })
    // if (activeTab === "2") ongetAllCases({ isSearch: true })
  }, [activeTab])

  //SideEffect for setting isAttachment
  useEffect(() => {
    if (Array.from(allFiles)?.length > 0) {
      setIsAttachment(true)
    } else {
      setIsAttachment(false)
    }
  }, [allFiles])
  useEffect(() => {
    if (Array.from(recorder)?.length > 0) {
      setIsVoiceMessage(true)
    } else {
      setIsVoiceMessage(false)
    }
  }, [recorder])

  //SideEffect for fetching Subgroups after case selected
  useEffect(() => {
    if (currentCase) {
      onGettingSubgroups()
    }
  }, [currentCase])

  useEffect(() => {
    if (currentChat) {
      setRecorder([])
      setcurMessage("")
      setMentionsArray(
        currentChat.groupMembers
          .filter(m => m?.id?._id) // filter out members with null IDs
          .map(m => ({
            id: m?.id?._id,
            display: m?.id?.firstname + " " + m?.id?.lastname,
          }))
      )
      setReceivers(
        currentChat.groupMembers
          .filter(m => m?.id?._id && m.id?._id !== currentUser.userID) // filter out members with null IDs and current user
          .map(r => r.id?._id)
      )
      // const filteredNotifications1 = notifications?.filter(
      //   n =>{
      //   const a = n?.groupId !== currentChat?._id
      //    return  a
      // }
      // )
      // console.log("FN1:",filteredNotifications1)
      // const filteredNotifications = filteredNotifications1?.filter(
      //   n =>{
      //     const b = n?.currentChat?._id !== currentChat?._id
      //     console.log("b ",n?.currentChat?._id,currentChat?._id)
      //    return  b
      // }
      // )
      // console.log("FN:",filteredNotifications)

      // setNotifications(filteredNotifications)
      setNotifications(
        notifications.filter(n => n.groupId !== currentChat?._id)
      )

      const onGettingGroupMessages = async () => {
        setChatLoader(true)
        const payload = {
          groupId: currentChat?._id,
          userId: currentUser?.userID,
        }
        const res = await getMessagesByUserIdandGroupId(payload)
        if (res.success) {
          setMessages(res.groupMessages)
        } else {
          console.log("Failed to fetch Group message", res)
        }
        setChatLoader(false)
      }
      onGettingGroupMessages()
    }
  }, [currentChat])

  //SideEffect while contact page changes
  useEffect(() => {
    if (
      activeTab === "3" &&
      contactPage !== 1 &&
      contactPage <= totalPages?.users
    ) {
      onGetContacts({ isSearch: false })
    }
    if (activeTab === "3" && contactPage === 1) {
      onGetContacts({ isSearch: true })
    }
  }, [contactPage])

  //SideEffect while case page changes
  useEffect(() => {
    if (activeTab === "2" && casePage !== 1 && casePage <= totalPages?.cases) {
      // onGetContacts({ isSearch: false })
      ongetAllCases({ isSearch: false })
    }
    if (activeTab === "3" && casePage === 1) {
      // onGetContacts({ isSearch: true })
      ongetAllCases({ isSearch: true })
    }
  }, [casePage])

  useEffect(() => {
    if (searchText === "") {
      if (activeTab === "3") setContactPage(1)
      if (activeTab === "2") setCasePage(1)
    }
    if (activeTab === "3") {
      onGetContacts({ isSearch: true })
    }
    if (activeTab === "2") {
      ongetAllCases({ isSet: true, isSearch: true })
    }
  }, [searchText])

  useEffect(() => {
    const userid = query.get("uid")
    if (userid && userid !== currentUser?.userID) {
      const onCreateOneonOneChat = async () => {
        await handleCreateChatRoom(userid)
      }
      onCreateOneonOneChat()
    }
    const handleAllAsyncReq = async () => {
      setPageLoader(true)
      await ongetCounts()
      await ongetAllChatRooms()
      setPageLoader(false)
      // await onGetContacts({ isSearch: false })
      await ongetAllCases({ isSet: false, isSearch: false })
    }
    handleAllAsyncReq()

    return () => {
      setChats([])
      setCurrentChat(null)
      setMessages([])
    }
  }, [])

  useEffect(() => {
    if (privateChatId && !pageLoader) {
      const tempChat = chats?.find(ch => ch?._id === privateChatId)
      setactiveTab("1")
      setCurrentChat(tempChat)
    }
  }, [privateChatId, pageLoader])
  useEffect(() => {
    if (privateReplyChatId && !pageLoader) {
      const tempChat = chats?.find(ch => ch?._id === privateReplyChatId)
      setactiveTab("1")
      setCurrentChat(tempChat)
    }
  }, [privateReplyChatId, pageLoader])

  useEffect(() => {
    if (groupReplyChatId && caseReplyChatId && !pageLoader) {
      const groupChat = allgroups?.find(gch => gch?._id === groupReplyChatId)
      const tempCase = allCases?.find(c => c?._id === caseReplyChatId)
      setactiveTab("2")
      setCurrentCase(tempCase)
      setCurrentChat(groupChat)
    }
  }, [groupReplyChatId, pageLoader, caseReplyChatId])
  useEffect(() => {
    if (groupChatId && caseChatId && !pageLoader) {
      const groupChat = allgroups?.find(gch => gch?._id === groupChatId)
      const tempCase = allCases?.find(c => c?._id === caseChatId)
      setactiveTab("2")
      setCurrentCase(tempCase)
      setCurrentChat(groupChat)
    }
  }, [groupChatId, pageLoader, caseChatId,])
  // useEffect(() => {
  //   if (groupChatId && caseChatId && !pageLoader && !caseLoading) {
  //     const groupChat = allgroups?.find(gch => gch?._id === groupChatId)
  //     const tempCase = allSubCases?.find(c => c?._id === caseChatId)
  //     setactiveTab("2")
  //     setCurrentCase(tempCase)
  //     setCurrentChat(groupChat)
  //   }
  // }, [groupChatId, pageLoader, caseChatId, caseLoading])

  const handlecreatedAt = () => {
    const sortedCases = [...allCases].sort((a, b) => {
      const dateA = new Date(a.createdAt)
      const dateB = new Date(b.createdAt)
      return dateB - dateA // Compare date objects in descending order
    })
    setAllCases(sortedCases) // Update the component state with the sorted allCases array
  }
  const handlecaseName = () => {
    const sortedCases = [...allCases].sort((a, b) => {
      const caseNameA = a.caseName.toUpperCase() // Convert case names to uppercase for case-insensitive sorting
      const caseNameB = b.caseName.toUpperCase()

      if (caseNameA < caseNameB) {
        return -1
      }
      if (caseNameA > caseNameB) {
        return 1
      }
      return 0
    })
    setAllCases(sortedCases) // Update the component state with
    // Use the sortedCases array for further processing
  }

  const handleCaseId = () => {
    const sortedCases = [...allCases].sort((a, b) => {
      const caseNameA = a.caseId.toUpperCase() // Convert case names to uppercase for case-insensitive sorting
      const caseNameB = b.caseId.toUpperCase()

      if (caseNameA < caseNameB) {
        return -1
      }
      if (caseNameA > caseNameB) {
        return 1
      }
      return 0
    })
    setAllCases(sortedCases)
  }
  const handleCompletedCase = async () => {
    const payload = {
      caseId: currentCase?._id,
    }
    const res = await completedCase(payload)
    if (res.success) {
      setCurrentChat(null)
      await ongetAllCases({ isSet: false })
      toastr.success(`case completed  successfully`, "Success")
    }
    setCompletedCaseDelete(false)
  }
  const handleCaseCompleted = () => {
    setCompletedCaseDelete(true)
  }
  const handleLocateMessage = messageId => {
    const message = [...messages, ...visibleMessages].find(
      msg => msg._id === messageId
    )
    if (message) {
      // Scroll to the message if found
      const messageElem = document.getElementById(message._id)
      if (messageElem) {
        messageElem.scrollIntoView({ behavior: "auto" })
        messageElem.classList.add("highlighted")
        messageElem.style.backgroundColor = "#FFD700"
      }
    }
  }
  const Locate = () => {
    const message = [...messages, ...visibleMessages].find(
      msg => msg._id === msgId
    )
    if (message) {
      const messageElem = document.getElementById(message._id)
      if (messageElem) {
        messageElem.scrollIntoView({ behavior: "auto" })
      }
    }
  }
  useEffect(() => {
    if (replymsgId) {
      setTimeout(() => {
        Locate()
      }, 0)
    }
  })
  const handleReplyModalOpen = () => {
    setAllFiles([])
    setAllVoicemsg([])
    setIsAttachment(false)
    setIsVoiceMessage(false)
    setRecorder([])
    setBlobURL(null)
  }

  const handleSelectingChat = (chat) => {
    setCurrentCase(null)
    setCurrentChat(chat)
    setAllFiles([])
    setAllVoicemsg([])
    setIsAttachment(false)
    setIsVoiceMessage(false)
    setRecorder([])
    setBlobURL(null)
  }

  return (
    <div className="page-contents " style={{ marginTop: 100 }}>
      <>
        {pageLoader ? (
          <Row>
            <Col xs="12">
              <div className="text-center my-3">
                <Link to="#" className="text-success">
                  <i className="bx bx-hourglass bx-spin me-2" />
                  Loading. . .
                </Link>
              </div>
            </Col>
          </Row>
        ) : (
          <>
            {/*modal for Email*/}
            <Modal
              isOpen={emailModal}
              centered
              data-toggle="modal"
              toggle={() => {
                toggle_emailModal()
              }}
            >
              <div>
                <ModalHeader
                  className="border-bottom-0"
                  toggle={() => {
                    setEmailModal(!emailModal)
                  }}
                ></ModalHeader>
              </div>
              <div className="modal-body">
                <div className="text-center mb-4">
                  <div className="avatar-md mx-auto mb-4">
                    <div className="avatar-title bg-light  rounded-circle text-primary h1">
                      <i className="mdi mdi-email-open"></i>
                    </div>
                  </div>

                  <div className="row justify-content-center">
                    <div className="col-xl-10">
                      <h4 className="text-primary">Email !</h4>
                      <div className="input-group rounded bg-light">
                        <Input
                          type="email"
                          className="form-control bg-transparent border-0"
                          placeholder="Enter Email address"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                        />
                        <Button
                          color="primary"
                          type="button"
                          id="button-addon2"
                          onClick={() => onSendEmail()}
                        >
                          <i className="bx bxs-paper-plane"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
            {/* Model for Remainder*/}
            <DynamicModel
              open={remainderModelOpen}
              toggle={toggleremainderModelOpen}
              size="md"
              modalTitle="NEW REMINDER"
              footer={false}
            >
              <DynamicSuspense>
                <ChatRemainder
                  setModalOpen={setRemainderModelOpen}
                  curMessageId={curReminderMessageId?._id}
                />
              </DynamicSuspense>
            </DynamicModel>
            <DynamicModel
              open={CalendarModelOpen}
              toggle={toggleCalendarModelOpen}
              size="xl"
              footer={false}
            >
              <DynamicSuspense>
                <Calender
                  setcalendarModalOpen={setCalendarModelOpen}
                  groupId={currentChat?._id}
                  caseId={currentChat?.caseId}
                />
              </DynamicSuspense>
            </DynamicModel>
            {/* Model for creating case*/}
            <DynamicModel
              open={newCaseModelOpen}
              toggle={toggleNewCaseModelOpen}
              size="lg"
              modalTitle="New Case"
              footer={false}
            >
              <DynamicSuspense>
                <CreateCase
                  formValues={newCase}
                  setFormValues={setNewCase}
                  contacts={contacts}
                  setModalOpen={setNewCaseModelOpen}
                  getAllCases={ongetAllCases}
                />
              </DynamicSuspense>
            </DynamicModel>
            {/* <DynamicModel
              open={completeCaseModelOpen}
              toggle={toggleCompleteCaseModelOpen}
              size="md"
              modalTitle="Completed Case"
              footer={false}
            >
              <DynamicSuspense>
                <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                  <CompletedCaseModel setModalOpen={setCompleteCaseModelOpen} />
                </div>
              </DynamicSuspense>
            </DynamicModel> */}

            {/* Model for creating subgroup */}
            {allgroups && (
              <DynamicModel
                open={subGroupModelOpen}
                toggle={togglesubGroupModelOpen}
                modalTitle="Subgroup Setting"
                modalSubtitle={`You have ${allgroups.filter(a => !a.isParent)?.length || 0
                  } subgroups`}
                footer={true}
                size="lg"
              >
                <DynamicSuspense>
                  <SubGroups
                    currentCaseId={currentCase?._id}
                    caseMembers={currentCase?.caseMembers}
                    groups={allgroups.filter(a => !a.isParent)}
                    getSubGroups={onGettingSubgroups}
                  />
                </DynamicSuspense>
              </DynamicModel>
            )}

            <DynamicModel
              open={filesModelOpen}
              toggle={toggleFilesModelOpen}
              size="xl"
              modalTitle="Shared Files"
              isClose={true}
            >
              <CaseFilesGrid groupId={currentChat?._id} caseId={currentCase?._id} setFilesModelOpen={setFilesModelOpen} handleLocateMessage={handleLocateMessage} />
            </DynamicModel>
            <DynamicModel
              open={linksModelOpen}
              toggle={toggleLinksModelOpen}
              size="lg"
              modalTitle="Links"
              isClose={true}
            >
              <LinksModel setLinksModelOpen={setLinksModelOpen} handleLocateMessage={handleLocateMessage} />
            </DynamicModel>
            {/* <DynamicModel
              open={subdomainModelOpen}
              toggle={togglesubdomainModelOpen}
              size="lg"
              modalTitle="subdomain details"
              isClose={true}
            >
              <SubDomainDetails />
            </DynamicModel> */}
            {/* Modal for Editing Case*/}
            {currentCase && (
              <EditCase
                open={caseEditModalOpen}
                setOpen={setCaseEditModalOpen}
                toggleOpen={toggleCaseEditModal}
                currentCase={currentCase}
                getAllCases={ongetAllCases}
                getSubGroups={onGettingSubgroups}
                allCases={allCases}
                setAllCases={setAllCases}
              />
            )}

            <EditMessageModel
              open={messageEditModalOpen}
              setOpen={setMessageEditModalOpen}
              toggleOpen={toggleMessageEditModal}
              curMessageId={curEditMessageId}
              curEditMessageId={curEditMessageId}
              msgData={curEditMessageId?.messageData}
              currentChat={currentChat}
              currentCase={currentCase}
              getChatName={getChatName}
              subject={subject}
              setSubject={setSubject}
              setAllFiles={setAllFiles}
            />

            <ReplyMsgModal
              open={rplyMessageModalOpen}
              setOpen={setReplyMsgModalOpen}
              toggleOpen={toggleReplyMessageModal}
              curMessageId={curReplyMessageId}
              receivers={receivers}
              currentChat={currentChat}
              currentCase={currentCase}
              caseId={currentCase?._id}
              getChatName={getChatName}
              curMessage={curMessage}
              setcurMessage={setcurMessage}
              handleFileChange={handleFileChange}
              setAllFiles={setAllFiles}
              allFiles={allFiles}
              handleFileRemove={handleFileRemove}
              recorder={recorder}
              setRecorder={setRecorder}
              startRecording={startRecording}
              stopRecording={stopRecording}
              allVoicemsg={allVoicemsg}
              setAllVoicemsg={setAllVoicemsg}
              isAttachment={isAttachment}
              blobURL={blobURL}
              duration={duration}
              isVoiceMessage={isVoiceMessage}
              durationIntervalId={durationIntervalId}
              setDurationIntervalId={setDurationIntervalId}
              setBlobURL={setBlobURL}
              setIsAttachment={setIsAttachment}
              setIsVoiceMessage={setIsVoiceMessage}
              setDuration={setDuration}
              subject={subject}
              setSubject={setSubject}
              handleSendingMessage={handleSendingMessage}
              setReplyMsgModalOpen={setReplyMsgModalOpen}
              ongetAllChatRooms={ongetAllChatRooms}
              ongetAllCases={ongetAllCases}
              setLoading={setLoading}
            />
            {/* {contacts && (
              <ForwardMsg
                open={forwardModalOpen}
                setOpen={setForwardModalOpen}
                toggleOpen={toggleForwardModal}
                currentMsg={forwardMessages}
              />
            )} */}

            {/* Modal for deleting Case*/}
            <DeleteModal
              show={caseDeleteModalOpen}
              onDeleteClick={() => onDeletingCase()}
              confirmText="Yes,Remove"
              cancelText="Cancel"
              onCloseClick={toggleCaseDeleteModal}
            />

            <DeleteModal
              show={chatDeleteModalOpen}
              onDeleteClick={() => onDeletingChat()}
              confirmText="Yes,Remove"
              cancelText="Cancel"
              onCloseClick={toggleChatDeleteModal}
            />

            <DeleteModal
              show={MsgDeleteModalOpen}
              onDeleteClick={onDeletingMsg}
              confirmText="Yes,Remove"
              cancelText="Cancel"
              onCloseClick={toggleMsgDeleteModal}
            />

            <DeleteModal
              show={completedCaseDelete}
              onDeleteClick={handleCompletedCase}
              confirmText="Yes,Remove"
              cancelText="Cancel"
              onCloseClick={toggleCompleteCaseDeleteModelOpen}
            />

            <MetaTags>
              <title>Chat RC</title>
            </MetaTags>

            <Row>
              <Col xs="12" lg="4">
                <div className="pb-2 px-2 border-bottom">
                  <Link className="d-flex" to="/profile">
                    <div className="align-self-center me-3">
                      <img
                        src={
                          currentUser?.profilePic
                            ? currentUser?.profilePic
                            : profile
                        }
                        className="avatar-sm rounded-circle"
                        alt=""
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="font-size-14 mt-0 mb-1">
                        {currentUser?.firstname + " " + currentUser?.lastname}
                      </h5>
                      <p className="text-muted mb-0">
                        <i className="mdi mdi-circle text-success align-middle me-1" />
                        Active
                      </p>
                    </div>
                    {/* <UserDropdown /> */}
                  </Link>
                </div>
                {activeTab !== "1" && (
                  <div className="mx-2 mt-2  border-bottom">
                    <input
                      className={`form-control ${searchText.length > 20 ? 'is-invalid' : ''}`}
                      type="text"
                      id="user-search-text"
                      placeholder="Search here"
                      value={searchText}
                      name="searchText"
                      onChange={(e) => setSearchText(e.target.value.slice(0, 20))}
                    />
                    {searchText.length > 20 && (
                      <div className="invalid-feedback">Search text cannot exceed 20 characters</div>
                    )}
                  </div>
                )}
                {activeTab === "1" && (
                  <div className="mx-2 mt-2  border-bottom">
                    <input
                      className={`form-control ${searchText.length > 20 ? 'is-invalid' : ''}`}
                      type="text"
                      id="user-search-text"
                      placeholder="Search here"
                      value={searchText}
                      name="searchText"
                      onChange={(e) => {
                        setSearchText(e.target.value.slice(0, 20));
                        setIsSearchTextCleared(false);
                      }}
                    />
                    {searchText.length > 20 && (
                      <div className="invalid-feedback">Search text cannot exceed 20 characters</div>
                    )}
                  </div>
                )}

                <div className="my-1 px-2" style={{ paddingBottom: "60px" }}>
                  <Nav pills justified>
                    {sidebarNavItems.map((navItem, n) => (
                      <NavItem key={n}>
                        <NavLink
                          className={classNames({
                            active: activeTab === JSON.stringify(n + 1),
                          })}
                          onClick={() => {
                            toggleTab(JSON.stringify(n + 1))
                          }}
                        >
                          {navItem}
                          {navItem === "Chat"}
                        </NavLink>
                      </NavItem>
                    ))}
                  </Nav>
                  <TabContent activeTab={activeTab} className="py-1">
                    <TabPane tabId="1">
                      <ul className="list-unstyled chat-list" id="recent-list">
                        <PerfectScrollbar style={{ height: "500px" }}>
                          {chats.map(chat => (
                            <li
                              key={chat._id}
                              className={
                                currentChat && currentChat._id === chat._id
                                  ? "active"
                                  : ""
                              }
                            >
                              <Link
                                to="#"
                                onClick={() => {
                                  handleSelectingChat(chat)
                                }}
                              >
                                <div className="d-flex">
                                  <div className="align-self-center me-3">
                                    <img
                                      src={
                                        chat.isGroup
                                          ? profile
                                          : getChatProfilePic(
                                            chat.groupMembers
                                          )
                                      }
                                      className="rounded-circle avatar-sm"
                                      alt=""
                                      style={{ objectFit: "cover" }}
                                    />
                                  </div>

                                  <div className="flex-grow-1 overflow-hidden align-self-center">
                                    <h5 className="text-truncate font-size-14 mb-1">
                                      {chat.isGroup
                                        ? chat.groupName
                                        : getChatName(chat.groupMembers)}
                                    </h5>
                                    <p className="font-size-12 mb-1 text-primary">
                                      {getChatEmail(chat?.groupMembers)}
                                    </p>
                                  </div>
                                  <div className="font-size-11">
                                    <div>
                                      {moment(chat.updatedAt).format(
                                        "DD-MM-YY HH:mm"
                                      )}
                                    </div>
                                    {getNotificationCount(chat._id) > 0 && (
                                      <div className="badge bg-danger font-size-14 my-1">
                                        {getNotificationCount(chat._id)}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </PerfectScrollbar>
                      </ul>
                    </TabPane>
                    <TabPane tabId="2">
                      <div className="d-flex gap-2 my-2">
                        <button
                          type="button"
                          className="btn btn-info btn-rounded mb-2 col-6"
                          onClick={() => setNewCaseModelOpen(true)}
                        >
                          Create case
                          <i className="bx bx-pencil font-size-16 align-middle me-2 mx-2"></i>
                        </button>

                        <div className="d-flex justify-content-center align-items-center">
                          <Dropdown
                            isOpen={caseSortingOpen}
                            toggle={() =>
                              toggleCaseSortingOpen(!caseSortingOpen)
                            }
                          >
                            <DropdownToggle
                              className="btn nav-btn d-flex"
                              tag="i"
                            >
                              <div className="d-flex justify-content-center align-items-center gap-2 ">
                                <i
                                  className="mdi mdi-sort-variant font-size-24 mr-2"
                                  title="Filter"
                                />
                                <label className="mb-0  font-size-16">
                                  Sort By
                                </label>
                              </div>
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem onClick={handleCaseId}>
                                Case Id
                              </DropdownItem>
                              <DropdownItem onClick={handlecaseName}>
                                Case Name
                              </DropdownItem>
                              <DropdownItem onClick={handlecreatedAt}>
                                Case Date
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                        {/* {allCases.some(group =>
                          group.admins.includes(currentUser?.userID)
                        ) && (
                          <i
                            className="bx bx-check-circle w-16 m-4 pl-5 font-size-16 ml-2"
                            style={{
                              cursor: "pointer",
                              // backgroundColor: "#556ee6",
                            }}
                            title="Completed Case"
                            onClick={() => setCompleteCaseModelOpen(true)}
                          ></i>
                        )} */}
                      </div>

                    
                        <PerfectScrollbar style={{ height: "500px" }}>
                          <ul className="list-unstyled chat-list">
                            {allCases
                              .map(caseData => ({
                                caseData,
                                notifyCount: notifyCountforCase(caseData._id),
                              }))

                              .map(
                                (
                                  { caseData, notifyCount },
                                  index // Define the 'index' variable here
                                ) => (
                                  <CaseGrid
                                    caseData={caseData}
                                    index={index}
                                    key={index}
                                    active={activeAccordian}
                                    onAccordionButtonClick={
                                      handleSettingActiveAccordion
                                    }
                                    handleSelectingCase={onSelectingCase}
                                    selected={
                                      currentCase?._id === caseData?._id
                                    }
                                    notifyCountforCase={notifyCountforCase}
                                    ongetAllCases={ongetAllCases}
                                    filteredMessages={filteredMessages}
                                  />
                                )
                              )}
                          </ul>
                        </PerfectScrollbar>
                     
                    </TabPane>
                    <TabPane tabId="3">
                      <div className="my-2">
                        {contactsLoading ? (
                          <ChatLoader />
                        ) : (
                          <PerfectScrollbar
                            style={{ height: "500px" }}
                            onScroll={e => handleContactScroll(e?.target)}
                          >
                            {searchText === "" && <p>Suggestions :</p>}
                            {contacts &&
                              contacts.map((contact, i) => (
                                <ul key={i} className="list-unstyled chat-list">
                                  <li>
                                    <Link
                                      to="#"
                                      onClick={() => {
                                        setCurrentCase(null)
                                        handleCreateChatRoom(contact._id)
                                      }}
                                    >
                                      <div className="d-flex justify-content-between">
                                        <div className="align-self-center d-flex align-items-center me-3">
                                          <img
                                            src={
                                              contact?.profilePic
                                                ? contact?.profilePic
                                                : profile
                                            }
                                            className="avatar-xs rounded-circle"
                                            alt=""
                                            style={{ objectFit: "cover" }}
                                          />
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden align-self-center me-3">
                                          <h5 className="text-truncate font-size-14 mb-1">
                                            {contact.firstname}{" "}
                                            {contact.lastname}
                                            { }
                                          </h5>
                                          <p className="font-size-12 mb-1 text-primary ">
                                            {contact.email}
                                          </p>
                                        </div>
                                        <i className="font-size-24 bx bxl-messenger me-2" />
                                      </div>
                                    </Link>
                                  </li>
                                </ul>
                              ))}
                          </PerfectScrollbar>
                        )}
                      </div>
                    </TabPane>
                  </TabContent>
                </div>
              </Col>
              <Col xs="12" lg="8" className="align-self-center">
                <div className="w-100 ">
                  {currentChat ? (
                    chatLoader ? (
                      <Row>
                        <Col xs="12">
                          <Card className="">
                            <div className="text-center my-3 text-success align-self-center col-12 col-lg-8">
                              <i className="bx bx-hourglass bx-spin me-2" />
                              Loading. . .
                            </div>
                          </Card>
                        </Col>
                      </Row>
                    ) : (
                      <Card className="chat-card ">
                        <div className="py-2 px-3 border-bottom">
                          <Row>
                            <Col md="4" xs="8">
                              <h5 className="font-size-15 mb-1 text-sm-primary">
                                {currentChat.isGroup
                                  ? currentCase?.caseName || "Case Chat"
                                  : getChatName(currentChat.groupMembers)}
                              </h5>
                              <h5 className="font-size-12 mb-1 text-primary">
                                {!currentChat.isGroup &&
                                  getChatEmail(currentChat.groupMembers)}
                              </h5>
                              {currentChat?.isGroup && (
                                <span
                                  style={{
                                    color: currentChat?.color
                                      ? currentChat?.color
                                      : "#0000FF",
                                  }}
                                >
                                  {currentChat?.groupName}
                                </span>
                              )}
                            </Col>
                          </Row>
                          <Row>
                            <Col md="12" xs="3">
                              <ul className="list-inline user-chat-nav d-flex justify-content-sm-end text-end mb-0">
                                {currentChat?.isGroup && (
                                  <li
                                    className="list-inline-item "
                                    title="Refresh to get Email "
                                  >
                                    <Dropdown toggle={handlerefreshemail}>
                                      <DropdownToggle
                                        className="btn nav-btn"
                                        tag="i"
                                      >
                                        <i class="bi bi-arrow-clockwise"></i>
                                      </DropdownToggle>
                                    </Dropdown>
                                  </li>
                                )}
                                {currentChat?.isGroup && (
                                  <li
                                    className="list-inline-item "
                                    title="Send Email "
                                  >
                                    <Dropdown
                                      isOpen={groupIdOpen}
                                      toggle={() => toggleGroupIdOpen(!open)}
                                    >
                                      <DropdownToggle
                                        className="btn nav-btn"
                                        tag="i"
                                      >
                                        <i className="bx bx-info-circle" />
                                      </DropdownToggle>

                                      <DropdownMenu>
                                        <DropdownItem>
                                          <span
                                            style={{
                                              color: currentChat?.color
                                                ? currentChat?.color
                                                : "#0000FF",
                                            }}
                                          >
                                            <h6 className="fw-bold">
                                              Email{" "}
                                              <i
                                                className="bx bx-copy ms-2"
                                                onClick={copyToemail}
                                              />
                                            </h6>
                                            {`rpmongotest@gmail.com`}
                                          </span>
                                        </DropdownItem>
                                        <DropdownItem className="mt-4">
                                          <span
                                            style={{
                                              color: currentChat?.color
                                                ? currentChat?.color
                                                : "#0000FF",
                                            }}
                                          >
                                            <h6 className="fw-bold">
                                              Thread ID{" "}
                                              <i
                                                className="bx bx-copy ms-2"
                                                onClick={copyToClipboard}
                                              />
                                            </h6>
                                            {`[Thread Id: ${currentChat?.threadId}]`}
                                          </span>
                                        </DropdownItem>
                                      </DropdownMenu>
                                    </Dropdown>
                                  </li>
                                )}
                                {/* {!currentChat?.isGroup && */}
                                {/* <li className="list-inline-item">
                                  <Dropdown
                                    toggle={() =>
                                      togglesubdomainModelOpen(true)
                                    }
                                  >
                                    <DropdownToggle
                                      className="btn nav-btn"
                                      tag="i"
                                    >
                                      <i
                                        className="bi bi-subtract"
                                        title="SubDomain Details"
                                      />
                                    </DropdownToggle>
                                  </Dropdown>
                                </li> */}

                                <li className="list-inline-item">
                                  <Dropdown
                                    toggle={() => toggleLinksModelOpen(true)}
                                  >
                                    <DropdownToggle
                                      className="btn nav-btn"
                                      tag="i"
                                    >
                                      <i className="bi bi-link" title="Links" />
                                    </DropdownToggle>
                                  </Dropdown>
                                </li>
                                {/* // } */}

                                <li className="list-inline-item">
                                  <Dropdown
                                    toggle={() => toggleFilesModelOpen(true)}
                                  >
                                    <DropdownToggle
                                      className="btn nav-btn"
                                      tag="i"
                                    >
                                      <i
                                        className="bi bi-files"
                                        title="Shared Files"
                                      />
                                    </DropdownToggle>
                                  </Dropdown>
                                </li>

                                <li className="list-inline-item ">
                                  <Dropdown
                                    toggle={() => toggleCalendarModelOpen(true)}
                                  >
                                    <DropdownToggle
                                      className="btn nav-btn"
                                      tag="i"
                                    >
                                      <i
                                        className="bi bi-calendar"
                                        title="Reminder"
                                      />
                                    </DropdownToggle>
                                  </Dropdown>
                                </li>
                                <li
                                  className="list-inline-item d-sm-flex"
                                  title="Pinned Messages"
                                >
                                  <Dropdown
                                    isOpen={pinModal}
                                    toggle={tog_scroll}
                                  >
                                    <PinnedModels
                                      handleLocateMessage={handleLocateMessage}
                                      closeModal={() => setPinModal(false)}
                                    />
                                  </Dropdown>
                                </li>
                                <li
                                  className="list-inline-item"
                                  title="Search Messages"
                                >
                                  <Dropdown
                                    isOpen={search_Menu}
                                    toggle={toggleSearch}
                                  >
                                    <DropdownToggle
                                      className="btn nav-btn"
                                      tag="i"
                                    >
                                      <i className="bx bx-search-alt-2" />
                                    </DropdownToggle>
                                    <DropdownMenu className="dropdown-menu-md">
                                      {searchMessageText &&
                                        searchedMessages?.length > 1 ? (
                                        <span className="ps-3 fw-bold">
                                          {searchedMessages?.length} results
                                          found
                                          <i
                                            className="mdi mdi-chevron-down-circle-outline mdi-18px ps-4 text-primary"
                                            onClick={() => handleShow()}
                                          />
                                          <i
                                            className="mdi mdi-chevron-up-circle-outline mdi-18px ps-2 text-primary"
                                            onClick={() => handleShowTop()}
                                          />
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                      <InputGroup>
                                        <Input
                                          type="text"
                                          className={`form-control ${searchTextError ? 'is-invalid' : ''}`}
                                          placeholder="Message & DD-MM-YY"
                                          aria-label="Recipient's username"
                                          value={searchMessageText}
                                          onChange={(e) => {
                                            const text = e.target.value;
                                            if (text.length <= 20) {
                                              setSearchMessagesText(text);
                                              setSearchTextError("");
                                            } else {
                                              setSearchTextError("Search text cannot exceed 20 characters");
                                            }
                                          }}
                                        />
                                        <Button color="primary" type="submit">
                                          <i className="mdi mdi-magnify" />
                                        </Button>
                                      </InputGroup>
                                      {searchTextError && (
                                        <div className="invalid-feedback">{searchTextError}</div>
                                      )}
                                    </DropdownMenu>
                                  </Dropdown>
                                </li>
                                <li
                                  className="list-inline-item align-middle"
                                  title="Manage Case"
                                >
                                  <Dropdown
                                    isOpen={chatSettingOpen}
                                    toggle={() => toggleChatSettingOpen(!open)}
                                    className="float-end me-2"
                                  >
                                    {" "}
                                    {currentCase?.admins?.includes(
                                      currentUser?.userID
                                    ) ? (
                                      <DropdownToggle
                                        className="btn nav-btn"
                                        tag="i"
                                      >
                                        <div>
                                          <i className="bx bx-cog" />
                                        </div>
                                      </DropdownToggle>
                                    ) : (

                                      currentChat &&
                                      currentChat?.admins?.includes(
                                        currentUser?.userID
                                      ) && (
                                        <div className="conversation-name">
                                          <DropdownToggle
                                            className="btn nav-btn"
                                            tag="i"
                                          >
                                            <div>
                                              <i className="bx bx-cog" />
                                            </div>
                                          </DropdownToggle>
                                        </div>
                                      )

                                    )}
                                    {currentCase?.admins?.includes(
                                      currentUser?.userID
                                    ) ? (
                                      <DropdownMenu>
                                        <DropdownItem
                                          href="#"
                                          onClick={() => onArchievingChat()}
                                        >
                                          <i
                                            className="bi bi-archive"
                                            style={{
                                              fontSize: "15px",
                                              fontWeight: "bold",
                                              cursor: "pointer",
                                            }}
                                          ></i>
                                          {" "}
                                          Archive Chat
                                        </DropdownItem>
                                        <DropdownItem
                                          href="#"
                                          onClick={() =>
                                            setCaseEditModalOpen(true)
                                          }
                                        ><i
                                          className="bi bi-pen"
                                          style={{
                                            fontSize: "15px",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                          }}
                                        ></i>
                                          {" "}
                                          Manage Case
                                        </DropdownItem>
                                        <DropdownItem
                                          href="#"
                                          onClick={() =>
                                            toggle_emailModal(true)
                                          }
                                        ><i
                                          className="bi bi-envelope"
                                          style={{
                                            fontSize: "15px",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                            color: "black"
                                          }}
                                        ></i>
                                          {" "}
                                          Email
                                        </DropdownItem>
                                        <DropdownItem
                                          href="#"
                                          onClick={() => handleCaseDelete()}
                                        ><i
                                          className="bi bi-trash"
                                          style={{
                                            fontSize: "15px",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                          }}
                                        ></i>
                                          {" "}
                                          Delete case
                                        </DropdownItem>
                                        <DropdownItem
                                          href="#"
                                          onClick={() => handleCaseCompleted()}
                                        ><i
                                          className="bi bi-check-circle"
                                          style={{
                                            fontSize: "15px",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                          }}
                                        ></i>
                                          {" "}
                                          Completed case
                                        </DropdownItem>
                                      </DropdownMenu>
                                    ) : (
                                      currentChat &&
                                      currentChat?.admins?.includes(
                                        currentUser?.userID
                                      ) && (
                                        <DropdownMenu>
                                          <DropdownItem
                                            href="#"
                                            onClick={() => onArchievingChat()}
                                          ><i
                                            className="bi bi-archive"
                                            style={{
                                              fontSize: "15px",
                                              fontWeight: "bold",
                                              cursor: "pointer",
                                            }}
                                          ></i>
                                            {" "}
                                            Archive Chat
                                          </DropdownItem>
                                          <DropdownItem
                                            href="#"
                                            onClick={() =>
                                              toggle_emailModal(true)
                                            }
                                          ><i
                                            className="bi bi-envelope"
                                            style={{
                                              fontSize: "15px",
                                              fontWeight: "bold",
                                              cursor: "pointer",
                                              color: "black"
                                            }}
                                          ></i>
                                            {" "}
                                            Email
                                          </DropdownItem>
                                          <DropdownItem
                                            href="#"
                                            onClick={() =>
                                              handleChatDelete(currentChat?._id)
                                            }
                                          ><i
                                            className="bi bi-trash"
                                            style={{
                                              fontSize: "15px",
                                              fontWeight: "bold",
                                              cursor: "pointer",
                                            }}
                                          ></i>
                                            {" "}
                                            Delete chat
                                          </DropdownItem>
                                        </DropdownMenu>
                                      )
                                    )}
                                  </Dropdown>
                                </li>
                              </ul>
                            </Col>
                          </Row>
                        </div>

                        <div className="chat-conversation px-3 py-1">
                          <ul className="list-unstyled">
                            <div
                              ref={containerRef}
                              onScroll={event => handleScroll(event)}
                              style={
                                messages.length <= 5
                                  ? {
                                    height: "40vh",
                                    overflowY: "scroll",
                                  }
                                  : {
                                    height: "80vh",
                                    overflowY: "scroll",
                                  }
                              }
                            >
                              {messages.map((msg, m) => (
                                <li
                                  key={"test_k" + m}
                                  className={
                                    msg.sender === currentUser.userID
                                      ? "right"
                                      : ""
                                  }
                                >
                                  <div
                                    className="conversation-list"
                                    id={msg?._id}
                                    style={{
                                      maxWidth: "80%",
                                      color:
                                        searchedMessages?.includes(msg) &&
                                        "white",
                                      backgroundColor:
                                        searchedMessages?.includes(msg) &&
                                        "black",
                                    }}
                                  >
                                    <UncontrolledDropdown>
                                      <DropdownToggle
                                        href="#"
                                        className="btn nav-btn  "
                                        tag="i"
                                      >
                                        <i className="bx bx-dots-vertical-rounded" />
                                      </DropdownToggle>
                                      <DropdownMenu>
                                        {/* <DropdownItem
                                                href="#"
                                                onClick={() =>
                                                  handleForwardMessage(
                                                    msg._id
                                                  ) && setForwardModalOpen(true)
                                                }
                                              >
                                                Forward
                                              </DropdownItem> */}
                                        <DropdownItem
                                          href="#"
                                          onClick={() => {
                                            setCurReplyMessageId(msg)
                                            setReplyMsgModalOpen(true)
                                            handleReplyModalOpen()
                                          }}
                                        ><i
                                          className="bi bi-reply"
                                          style={{
                                            fontSize: "15px",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                          }}
                                        // id="replyTooltip"
                                        >
                                          </i>
                                          {" "}
                                          Reply
                                        </DropdownItem>
                                        {msg?.sender === currentUser.userID && (
                                          <DropdownItem
                                            href="#"
                                            onClick={() => {
                                              setCurEditMessageId(msg)
                                              setMessageEditModalOpen(true)
                                            }}
                                          ><i
                                            className="bi bi-pen"
                                            style={{
                                              fontSize: "15px",
                                              fontWeight: "bold",
                                              cursor: "pointer",
                                            }}
                                          // id="editTooltip"
                                          ></i>
                                            {" "}
                                            Edit
                                          </DropdownItem>
                                        )}
                                        <DropdownItem
                                          href="#"
                                          onClick={() => {
                                            onPinnedMessage(msg)
                                          }}
                                        ><i
                                          className="bi bi-pin-angle"
                                          style={{
                                            fontSize: "15px",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                          }}
                                        // id="pinTooltip"
                                        ></i>
                                          {" "}
                                          Pin
                                        </DropdownItem>
                                        <DropdownItem
                                          href="#"
                                          onClick={() => {
                                            setCurReminderMessageId(msg)
                                            setRemainderModelOpen(true)
                                          }}
                                        ><i
                                          className="bi bi-alarm"
                                          style={{
                                            fontSize: "15px",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                          }}
                                        // id="reminderTooltip"
                                        ></i>
                                          {" "}
                                          Reminder
                                        </DropdownItem>
                                        <DropdownItem
                                          href="#"
                                          onClick={() => {
                                            msg.sender === currentUser.userID
                                              ? handleDelete(msg)
                                              : toastr.info(
                                                "Unable to  delete other's message"
                                              )
                                          }}
                                        ><i
                                          className="bi bi-trash"
                                          style={{
                                            fontSize: "15px",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                          }}
                                          id="deleteTooltip"
                                        ></i>
                                          {" "}
                                          Delete
                                        </DropdownItem>
                                        {/* <DropdownItem
                                            href="#"
                                            onClick={() => {
                                              msg.sender === currentUser.userID
                                                ? onSendMessageEmail(msg)
                                                : toastr.info(
                                                    "Unable to  Send  other's message"
                                                  )
                                            }}
                                          >
                                            Send Email
                                          </DropdownItem> */}
                                      </DropdownMenu>
                                    </UncontrolledDropdown>
                                    <div
                                      className="ctext-wrap "
                                      style={{
                                        backgroundColor:
                                          msg.sender == currentUser.userID &&
                                            currentChat?.color
                                            ? currentChat?.color + "33"
                                            : "#00EE00" + "33",
                                      }}
                                    >
                                      <ReplyMessageComponent
                                        rID={msg.rID}
                                        messages={messages}
                                        handleLocateMessage={handleLocateMessage}
                                        currentChat={currentChat}
                                        getMemberName={getMemberName}
                                        getSenderOneChat={getSenderOneChat}
                                      />
                                      {msg?.rID && <p className="pt-3 fw-bolder mdi mdi-reply">Replies :</p>}

                                      {/* {msg.isForward ? (
                                              <div className=" mdi mdi-forward">
                                                Forwarded:
                                              </div>
                                            ) : (
                                              <div className="conversation-name">
                                                {" "}
                                              </div>
                                            )} */}
                                      <div>
                                        {msg?.isPinned ? (
                                          <div>
                                            <i className="mdi mdi-pin-outline mdi-rotate-315 text-danger"></i>
                                          </div>
                                        ) : (
                                          <div className="conversation-name">
                                            {" "}
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        {msg?.isEdit ? (
                                          <div>
                                            <p className="text-primary">
                                              Edited
                                            </p>
                                          </div>
                                        ) : (
                                          <div className="conversation-name">
                                            {" "}
                                          </div>
                                        )}
                                      </div>
                                      <div className="conversation-name">
                                        {currentChat.isGroup
                                          ? getMemberName(msg.sender)
                                          : getSenderOneChat(msg.sender)}
                                      </div>

                                      <div className="mb-1">
                                        {msg.isAttachment ? (
                                          <>
                                            <div
                                              style={{
                                                whiteSpace: "break-spaces",
                                              }}
                                              dangerouslySetInnerHTML={{
                                                __html: msg?.messageData,
                                              }}
                                            />
                                            <AttachmentViewer
                                              attachments={msg.attachments}
                                              text={msg.messageData}
                                            />

                                            <div
                                              className="mt-1"
                                              style={{
                                                whiteSpace: "break-spaces",
                                              }}
                                            >
                                              {/* {stringFormatter(
                                                        msg.messageData
                                                      )} */}
                                            </div>
                                          </>
                                        ) : (

                                          // <div
                                          //   style={{
                                          //     whiteSpace: "break-spaces",
                                          //   }}
                                          // >
                                          //   {stringFormatter(
                                          //     prettifyMsg(msg.messageData)
                                          //   )}

                                          // </div>
                                          <>
                                            {msg?.subject &&
                                              <div>
                                                <p className="fw-bolder">Subject : {msg?.subject}</p>
                                              </div>
                                            }
                                            <div
                                              style={{
                                                whiteSpace: "break-spaces",
                                              }}
                                              dangerouslySetInnerHTML={{
                                                __html: msg?.messageData,
                                              }}
                                            />
                                          </>
                                        )}
                                      </div>
                                      {msg?.isVoiceMessage && (
                                        <div>
                                          <VoiceMessage msg={msg} />
                                        </div>
                                      )}
                                      <p className="chat-time mb-0">
                                        <i className="bx bx-comment-check align-middle me-1" />
                                        {/* <i className="bx bx-time-five align-middle me-1" /> */}
                                        {msg.isEdit
                                          ? moment(msg.updatedAt).format(
                                            "DD-MM-YY HH:mm"
                                          )
                                          : moment(msg.createdAt).format(
                                            "DD-MM-YY HH:mm"
                                          )}
                                        {/* {msg?.replies?.map((r, i) => (
                                          <div
                                            key={i}
                                            className=" mdi mdi-reply m-2"
                                          >
                                            Replies:
                                            <div className="conversation-name">
                                              {currentChat.isGroup
                                                ? getMemberName(r?.sender)
                                                : getSenderOneChat(r?.sender)}
                                            </div>
                                            <div
                                              style={{
                                                whiteSpace: "break-spaces",
                                              }}
                                              dangerouslySetInnerHTML={{
                                                __html: r?.replyMsg,
                                              }}
                                              // Check if _id is equal to replyMsgId and apply style if true
                                              {...(r?._id === replymsgId && {
                                                style: {
                                                  backgroundColor: "#e6e9f0",
                                                },
                                              })}
                                            />
                                          </div>
                                        ))} */}
                                      </p>
                                      {/* <p className=" mt-2" > Reply :{msg?.replies?.replyMsg}</p> */}
                                    </div>
                                  </div>
                                </li>
                              ))}
                              {messageStack?.length > 0 &&
                                messageStack.map((msg, m) => (
                                  <li key={"test_k" + m} className="right">
                                    <div className="conversation-list">
                                      <div
                                        className="ctext-wrap "
                                        style={{
                                          backgroundColor:
                                            msg.sender == currentUser.userID &&
                                              currentChat?.color
                                              ? currentChat?.color + "33"
                                              : "#00EE00" + "33",
                                        }}
                                      >
                                        <div className="conversation-name">
                                          {currentUser?.firstname +
                                            currentUser?.lastname}
                                        </div>
                                        {msg?.subject &&
                                          <div className="mb-1">
                                            <p className="fw-bolder">Subject : {msg.subject}</p>
                                          </div>
                                        }
                                        <div className="mb-1">
                                          {msg.messageData}
                                        </div>
                                        <p className="chat-time mb-0">
                                          <i className="bx bx-loader bx-spin  align-middle me-1" />
                                          {moment(msg.createdAt).format(
                                            "DD-MM-YY HH:mm"
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                            </div>
                          </ul>
                        </div>

                        {currentChat?.isGroup && (
                          <SubgroupBar
                            groups={allgroups}
                            selectedGroup={currentChat} ute
                            setSelectedgroup={setCurrentChat}
                            openSubGroupmodel={setSubGroupModelOpen}
                            currentCase={currentCase}
                            notifyCount={getNotificationCount}
                          />
                        )}
                        {isFullScreen ? (
                          <>
                            <div
                              className={`border border-2 border-primary rounded-4 p-2 chat-input-section ${isFullScreen ? "full-screen" : ""
                                }`}
                            // style={{border: "4px solid #9BAADD"}}
                            >
                              <div className="row">
                                <div className="col">
                                  <div className="position-relative">
                                    {recorder &&
                                      recorder.state === "recording" ? (
                                      <div className="d-flex justify-content-center">
                                        <i
                                          className="mdi mdi-microphone font-size-18 text-primary"
                                          style={{
                                            height: "30px",
                                            paddingLeft: "10px",
                                          }}
                                        ></i>
                                        <p className="text-primary mt-1 font-size-12"
                                          style={{
                                            height: "10px",
                                            paddingRight: "50px",
                                          }}>
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
                                                height: "30px",
                                                paddingLeft: "10px",
                                              }}
                                              src={blobURL}
                                              controls="controls"
                                            ></audio>
                                            <i className="bi bi-trash text-danger"
                                              onClick={() => handleCancel()}
                                              style={{
                                                position: "absolute",
                                                right: "870px",
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
                                                          class="badge badge-soft-primary font-size-13"
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
                                                value={curMessage}
                                                onChange={onChange}
                                                mentionsArray={mentionsArray}
                                                isQuill={isQuill}
                                                onKeyPress={onKeyPress}
                                                currentChat={currentChat}
                                                currentCase={currentCase}
                                                getChatName={getChatName}
                                                isEmptyOrSpaces={
                                                  isEmptyOrSpaces
                                                }
                                                inputBoxHeight={inputBoxHeight}
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

                              <div>
                                <div
                                  className=" col-auto d-flex justify-content-end  gap-2 "
                                  style={{
                                    position: "absolute",
                                    right: "20px",
                                    top: "670px",
                                  }}
                                >
                                  {recorder &&
                                    recorder.state === "recording" ? (
                                    <></>
                                  ) : (
                                    <div>
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
                                            color: "#556EE6",
                                            fontSize: "16px",
                                            cursor: "pointer",
                                          }}
                                        ></i>
                                      </label>
                                      <i
                                        className="bi bi-fullscreen-exit"
                                        onClick={toggleFullScreen}
                                        style={{
                                          color: "#556EE6",
                                          fontSize: "16px",
                                          cursor: "pointer",
                                        }}
                                        title={
                                          isFullScreen
                                            ? "Exit Full Screen"
                                            : "Enter Full Screen"
                                        }
                                      ></i>
                                    </div>
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
                                      className="mdi mdi-microphone font-size-20 text-primary me-2"
                                      title="Start Recording"
                                      onClick={startRecording}
                                      disabled={recorder?.state == "recording"}
                                      style={{
                                        cursor: "pointer",
                                        paddingTop: "6px",
                                      }}
                                    ></i>
                                  )}

                                  {recorder?.state !== "recording" && (
                                    <div>
                                      {loading ? (
                                        <button
                                          type="button"
                                          className="btn btn-primary btn-rounded chat-send"
                                          color="primary"
                                          style={{
                                            cursor: "not-allowed",
                                          }}
                                        >
                                          <i className="bx bx-loader-alt bx-spin font-size-20 align-middle"></i>
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          className="btn btn-primary btn-rounded chat-send"
                                          color="primary"
                                          onClick={() => handleSendMessage()}
                                          disabled={isEmptyOrSpaces()}
                                        >
                                          <i className="mdi mdi-send"></i>
                                        </button>
                                      )}
                                    </div>
                                  )}

                                  <div
                                    style={{
                                      position: "absolute",
                                      right: "133px",
                                      top: "5px",
                                    }}
                                  >
                                    <i
                                      className="bi bi-type"
                                      onClick={() => {
                                        toggle_Quill()
                                      }}
                                      style={{
                                        color: "blue",
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                      }}
                                      title={
                                        isQuill
                                          ? "Show Formatting"
                                          : "Hide Formatting"
                                      }
                                    ></i>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
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
                                                height: "30px",
                                                paddingLeft: "10px",
                                              }}
                                              src={blobURL}
                                              controls="controls"
                                            ></audio>
                                            <i className="bi bi-trash text-danger"
                                              onClick={() => handleCancel()}
                                              style={{
                                                position: "absolute",
                                                right: "470px",
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
                                                value={curMessage}
                                                onChange={onChange}
                                                mentionsArray={mentionsArray}
                                                isQuill={isQuill}
                                                onKeyPress={onKeyPress}
                                                currentChat={currentChat}
                                                currentCase={currentCase}
                                                getChatName={getChatName}
                                                isEmptyOrSpaces={
                                                  isEmptyOrSpaces
                                                }
                                                inputBoxHeight={inputBoxHeight}
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

                            <div>
                              <div
                                className="col-auto d-flex justify-content-end  gap-2 "
                                style={{
                                  position: "absolute",
                                  right: "19px",
                                  bottom: "30px",
                                }}
                              >
                                {recorder && recorder.state === "recording" ? (
                                  <></>
                                ) : (
                                  <div>
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
                                          color: "#556EE6",
                                          fontSize: "16px",
                                          cursor: "pointer",
                                        }}
                                      ></i>
                                    </label>
                                    <i
                                      className="bi bi-arrows-fullscreen"
                                      onClick={toggleFullScreen}
                                      style={{
                                        color: "#556EE6",
                                        fontSize: "16px",
                                        cursor: "pointer",
                                      }}
                                      title={
                                        isFullScreen
                                          ? "Exit Full Screen"
                                          : "Enter Full Screen"
                                      }
                                    ></i>
                                  </div>
                                )}
                                {recorder && recorder.state === "recording" ? (
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
                                    className="mdi mdi-microphone font-size-20 text-primary me-2"
                                    title="Start Recording"
                                    onClick={startRecording}
                                    disabled={recorder?.state == "recording"}
                                    style={{
                                      cursor: "pointer",
                                      paddingTop: "6px",
                                    }}
                                  ></i>
                                )}

                                {recorder?.state !== "recording" && (
                                  <div>
                                    {loading ? (
                                      <button
                                        type="button"
                                        className="btn btn-primary btn-rounded chat-send"
                                        color="primary"
                                        style={{
                                          cursor: "not-allowed",
                                        }}
                                      >
                                        <i className="bx bx-loader-alt bx-spin font-size-20 align-middle"></i>
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        className="btn btn-primary btn-rounded chat-send"
                                        color="primary"
                                        onClick={() => handleSendMessage()}
                                        disabled={isEmptyOrSpaces()}
                                      >
                                        <i className="mdi mdi-send"></i>
                                      </button>
                                    )}
                                  </div>
                                )}

                                <div
                                  style={{
                                    position: "absolute",
                                    right: "133px",
                                    top: "5px",
                                  }}
                                >
                                  <i
                                    className="bi bi-type"
                                    onClick={() => {
                                      toggle_Quill()
                                    }}
                                    style={{
                                      color: "blue",
                                      fontSize: "20px",
                                      fontWeight: "bold",
                                      cursor: "pointer",
                                    }}
                                    title={
                                      isQuill
                                        ? "Show Formatting"
                                        : "Hide Formatting"
                                    }
                                  ></i>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        <br />
                        <br />
                        <br />
                        <br />

                      </Card>
                    )
                  ) : (
                    <NoChat />
                  )}
                </div>
              </Col>
            </Row>
          </>
        )}
      </>
    </div>
  )
}
export default ChatRc
