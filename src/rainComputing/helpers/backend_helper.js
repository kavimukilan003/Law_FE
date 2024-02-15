import { del, get, post, put } from "./api_helper"
import { SERVER_URL } from "./configuration"
const BASE_URL = `${SERVER_URL}/api`

const getAllAttorneys = payload => post(`${BASE_URL}/user/allAttorney`, payload)

const getAttorneysCount = payload =>
  post(`${BASE_URL}/user/attorneyCount`, payload)

const getAllUsers = payload => post(`${BASE_URL}/user/allUser`, payload)
const notifySound = payload => post(`${BASE_URL}/user/notifySound`, payload)
const notificationSound = payload => post(`${BASE_URL}/user/notification-sound`, payload)
const getAllChatRooms = payload =>
  post(`${BASE_URL}/pchat/getAllChatRoomByUserId`, payload)

const createChatRoom = payload =>
  post(`${BASE_URL}/pchat/createChatRoom`, payload)

const getRoomMessages = payload =>
  post(`${BASE_URL}/pchat/getRoomMessages`, payload)
  // const sentMessageEmail = payload => post(`${BASE_URL}/message/sendmessagemail`, payload)
const userRegisteration = payload => post(`${BASE_URL}/user/register`, payload)
const userLogin = payload => post(`${BASE_URL}/user/login`, payload)
const userUpdate = payload => put(`${BASE_URL}/user/edit`, payload)
const findMe = () => get(`${BASE_URL}/user/whoiam`)
const logoutUser = () => get(`${BASE_URL}/user/logout`)
const registerAttorney = payload =>
  post(`${BASE_URL}/attorney/register`, payload)
const attorneyDetailsUpdate = payload =>
  put(`${BASE_URL}/attorney/attorneyUpdate`, payload)
const messageUpdate = payload => post(`${BASE_URL}/message/updateMsg`, payload)
const getAttorneyByUserID = payload =>
  post(`${BASE_URL}/attorney/getByUserId`, payload)
const getFirmsByAttorneyID = payload =>
  post(`${BASE_URL}/firm/getFirmByAttorneyId`, payload)
const registerFirm = payload => post(`${BASE_URL}/firm/register`, payload)
const getAllRegAttorneys = payload =>
  post(`${BASE_URL}/attorney/getAllAttorney`, payload)
const regAttorneyDetails = payload =>
  post(`${BASE_URL}/attorney/regAttorneyDetails`, payload)
const regScheduleDates = payload => post(`${BASE_URL}/attorney/create`, payload)
const regAttorneyUpdate = payload =>
  put(`${BASE_URL}/attorney/updateSchedule`, payload)
const attorneyInvite = payload =>
  post(`${BASE_URL}/attorney/inviteAttorney`, payload)

const addNewUser = payload => put(`${BASE_URL}/pchat/addtoGroup`, payload)
//Removing the User from Group
const deleteUser = payload =>
  put(`${BASE_URL}/pchat/removeGroupmember`, payload)
//Deleting the Group
const deleteGroup = payload => put(`${BASE_URL}/pchat/deleteChat`, payload)

const getFirmbyId = payload => post(`${BASE_URL}/firm/getFirmById`, payload)

const addFirmMember = payload => put(`${BASE_URL}/firm/addtofirm`, payload)
const removeFirmMember = payload =>
  put(`${BASE_URL}/firm/removefirmmember`, payload)

const verifyUserEmail = payload => post(`${BASE_URL}/user/verifyEmail`, payload)

const updatePassword = payload =>
  put(`${BASE_URL}/user/changepassword`, payload)

const setForgettingPassword = payload =>
  post(`${BASE_URL}/user/verifyForgetPassword`, payload)

const setResetPassword = payload =>
  post(`${BASE_URL}/user/forgetPassword`, payload)

const getSubgroups = payload =>
  post(`${BASE_URL}/subgroup/getByParentRoom`, payload)

const createNewCase = payload => post(`${BASE_URL}/case/create`, payload)
const getTrademarkSearchDetails = payload =>
  post(`${BASE_URL}/case/searchCasebySno`, payload)
const getCasesByUserId = payload =>
  post(`${BASE_URL}/case/getByUserId`, payload)

const getGroupsByUserIdandCaseId = payload =>
  post(`${BASE_URL}/group/getByUserandCaseId`, payload)
const getMessageById = payload =>
  post(`${BASE_URL}/message/getmsgById`, payload)
const getPinnedMsg = payload =>
  post(`${BASE_URL}/message/getPinnedMsg`, payload)
const deleteLastMsg = payload => post(`${BASE_URL}/message/deletemsg`, payload)

const getMessagesByUserIdandGroupId = payload =>
  post(`${BASE_URL}/message/get`, payload)

const postReplies = payload => post(`${BASE_URL}/message/reply`, payload)
const pinMessage = payload => post(`${BASE_URL}/message/pinnedmsgById`, payload)
const unpinMessage = payload =>
  post(`${BASE_URL}/message/unpinnedmsgById`, payload)

const createOnevsOneChat = payload =>
  post(`${BASE_URL}/group/createChat`, payload)

  const getRecentMessages = payload => post(`${BASE_URL}/group/getAllMessages`, payload)

const getOnevsOneChat = payload => post(`${BASE_URL}/group/getChat`, payload)

const getFileFromGFS = ({ id }, config) =>
  get(`${SERVER_URL}/file/${id}`, config)
const profilePicUpdate = payload =>
  put(`${BASE_URL}/user/profilePicUpdate`, payload)
const profilePicRemove = payload =>
  post(`${BASE_URL}/user/profilePicRemove`, payload)

//Admin
const adminLogin = payload => post(`${BASE_URL}/admin/adminLogin`, payload)
const allUsersList = () => get(`${BASE_URL}/admin/allUsersList`)
const allAttorneysList = () => get(`${BASE_URL}/admin/allAttorneysList`)
const allFirmsList = () => get(`${BASE_URL}/admin/allFirmsList`)
const allPaymentData = () => get(`${BASE_URL}/admin/allPaymentDetails`)
const allCasesData = () => get(`${BASE_URL}/admin/allCaseDetails`)
const getCasesById = payload => post(`${BASE_URL}/admin/getCaseById`, payload)
const removeUser = payload => put(`${BASE_URL}/admin/removeUser`, payload)
const removeAttorney = payload =>
  put(`${BASE_URL}/admin/removeAttorney`, payload)
const allReqAttorneyList = () => get(`${BASE_URL}/admin/allReqAttorneyList`)
const attorneyStatusUpdate = payload =>
  put(`${BASE_URL}/admin/attorneyStatus`, payload)
const adminLogout = () => get(`${BASE_URL}/admin/signOut`)
const getUserById = payload => post(`${BASE_URL}/admin/getUserById`, payload)

const createSubgroup = payload => post(`${BASE_URL}/group/createGroup`, payload)

const updateSubgroup = payload => post(`${BASE_URL}/group/updateGroup`, payload)
const updateCase = payload => post(`${BASE_URL}/case/updateCase`, payload)
const caseIdbySubCase = payload => post(`${BASE_URL}/case/caseIdbySubCase`, payload)
const getAllSubCases = payload => post(`${BASE_URL}/case/allSubCases`, payload)
const createEvent = payload => post(`${BASE_URL}/event/create`, payload)
const eventUpdate = payload => post(`${BASE_URL}/event/eventUpdate`, payload)
const getEventById = payload => post(`${BASE_URL}/event/getEventdata`, payload)
const getIntervalById = payload =>
  post(`${BASE_URL}/interval/getIntervalData`, payload)
const getEventsByCaseId = payload =>
  post(`${BASE_URL}/interval/getCaseIdByEvents`, payload)
const createCaseEvent = payload => post(`${BASE_URL}/case/createEvent`, payload)
const createCaseInterval = payload =>
  post(`${BASE_URL}/interval/eventCaseCreate`, payload)
const intervalIdUpdate = payload =>
  post(`${BASE_URL}/interval/intervalIdUpdate`, payload)
const getIntervalByIdActive = payload =>
  post(`${BASE_URL}/interval/intervalIdActive`, payload)
const getintervalIdDetails = payload =>
  post(`${BASE_URL}/interval/getintervalIdData`, payload)
const getCaseIdByIntervals = payload =>
  post(`${BASE_URL}/interval/getCaseIdIntervals`, payload) 
const getAllResponseTexts = payload =>
  get(`${BASE_URL}/interval/getAllResponseTexts`, payload)
const getAllEvent = payload =>
  post(`${BASE_URL}/event/getAllCaseEvent`, payload)
const allCompletedCases = payload =>
  post(`${BASE_URL}/case/allcompletedGroup`, payload)
const addAdmin = payload => post(`${BASE_URL}/case/addAdmin`, payload)
const removeAdmin = payload => post(`${BASE_URL}/case/removeAdmin`, payload)
const completedCase = payload =>
  post(`${BASE_URL}/case/completedGroup`, payload)
const LeaveGroup = payload => post(`${BASE_URL}/case/leaveGroup`, payload)
const getCounts = payload => post(`${BASE_URL}/bff/getCounts`, payload)
const getCaseFiles = payload => post(`${BASE_URL}/message/getFiles`, payload)
const sentEmail = payload => post(`${BASE_URL}/message/mailChat`, payload)
const userNotes = payload => post(`${BASE_URL}/message/notes`, payload)
const getSenderNameById = payload =>
  post(`${BASE_URL}/message/getsendernameById`, payload)
const getGroupNameById = payload =>
  post(`${BASE_URL}/message/getgroupnameById`, payload)

//Appoinments

const appointmentRequest = payload =>
  post(`${BASE_URL}/appointment/appointmentrequest`, payload)
const getAllAppointmentRequestById = payload =>
  post(`${BASE_URL}/appointment/getAllAppointmentRequestByUserId`, payload)

const appointmentStatusUpdate = payload =>
  put(`${BASE_URL}/appointment/appointmentStatus`, payload)

const appointmentUserStatus = payload =>
  post(`${BASE_URL}/appointment/getAppointmentStatusById`, payload)

const getPaymentId = payload =>
  post(`${BASE_URL}/payment/getPaymentId`, payload)

const createReminder = payload => post(`${BASE_URL}/remainder/create`, payload)
const getGroupIdReminders = payload => post(`${BASE_URL}/remainder/getGroupIdByReminder`, payload)

const getReminder = payload =>
  post(`${BASE_URL}/remainder/getreminder`, payload)
const getAllReminders = payload =>
  post(`${BASE_URL}/remainder/getAllReminders`, payload)
const createCommenReminders = payload =>
  post(`${BASE_URL}/remainder/createReminders`, payload)
const getReminderSelf = payload =>
  post(`${BASE_URL}/remainder/getreminderself`, payload)
const removeReminder = payload =>
  put(`${BASE_URL}/remainder/removeReminder`, payload)
const UpdateReminder = payload =>
  put(`${BASE_URL}/remainder/updateReminder`, payload)
  const updateGroup = payload => post(`${BASE_URL}/group/updateGroup`, payload)
  const createDomains = payload => post(`${BASE_URL}/user/createdomains`, payload)
  const   updateDomains= payload => post(`${BASE_URL}/user/updatedomains`, payload)
  const   deleteDomains= payload => post(`${BASE_URL}/user/deletedomains`, payload)
  
export {
  getAllAttorneys,
  getAttorneysCount,
  UpdateReminder,
  getAllUsers,
  allCompletedCases,
  completedCase,
  LeaveGroup,
  attorneyDetailsUpdate,
  messageUpdate,
  getAllChatRooms,
  createChatRoom,
  getRoomMessages,
  userRegisteration,
  userLogin,
  // sentMessageEmail,
  regScheduleDates,
  regAttorneyUpdate,
  userUpdate,
  findMe,
  logoutUser,
  removeReminder,
  registerAttorney,
  getAttorneyByUserID,
  getFirmsByAttorneyID,
  registerFirm,
  getAllRegAttorneys,
  regAttorneyDetails,
  addNewUser,
  deleteUser,
  deleteGroup,
  getFirmbyId,
  addFirmMember,
  removeFirmMember,
  verifyUserEmail,
  setForgettingPassword,
  setResetPassword,
  getSubgroups,
  createNewCase,
  getCasesByUserId,
  getGroupsByUserIdandCaseId,
  getPinnedMsg,
  getMessagesByUserIdandGroupId,
  getFileFromGFS,
  createOnevsOneChat,
  getOnevsOneChat,
  profilePicUpdate,
  adminLogin,
  adminLogout,
  getUserById,
  allUsersList,
  getCasesById,
  allAttorneysList,
  allFirmsList,
  allPaymentData,
  allCasesData,
  removeUser,
  addAdmin,
  removeAdmin,
  removeAttorney,
  allReqAttorneyList,
  attorneyStatusUpdate,
  createSubgroup,
  updateSubgroup,
  updateCase,
  createEvent,
  eventUpdate,
  getEventById,
  getIntervalById,
  getEventsByCaseId,
  createCaseEvent,
  getAllResponseTexts,
  createCaseInterval,
  getAllEvent,
  getCounts,
  getCaseFiles,
  appointmentRequest,
  getAllAppointmentRequestById,
  appointmentStatusUpdate,
  appointmentUserStatus,
  getPaymentId,
  getMessageById,
  deleteLastMsg,
  postReplies,
  sentEmail,
  getSenderNameById,
  getGroupNameById,
  pinMessage,
  unpinMessage,
  userNotes,
  updatePassword,
  attorneyInvite,
  createReminder,
  getReminder,
  getReminderSelf,
  getAllReminders,
  createCommenReminders,
  getTrademarkSearchDetails,
  getGroupIdReminders,
  updateGroup,
  getCaseIdByIntervals,
  getintervalIdDetails,
  getIntervalByIdActive,
  intervalIdUpdate,
  profilePicRemove,
  notifySound,
  notificationSound,
  caseIdbySubCase,
  getAllSubCases,
  createDomains,
    updateDomains,
    deleteDomains,
    getRecentMessages
}
