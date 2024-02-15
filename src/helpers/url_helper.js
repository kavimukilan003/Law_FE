import { SERVER_URL } from "rainComputing/helpers/configuration"

const BASE_URL = `${SERVER_URL}/api`

//REGISTER
export const POST_FAKE_REGISTER = "/post-fake-register"

//LOGIN
export const POST_FAKE_LOGIN = "/post-fake-login"
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login"
export const POST_FAKE_PASSWORD_FORGET = "/fake-forget-pwd"
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd"
export const SOCIAL_LOGIN = "/social-login"

//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile"
export const POST_EDIT_PROFILE = "/post-fake-profile"

//PROJECTS
export const GET_PROJECTS = "/projects"
export const GET_PROJECT_DETAIL = "/project"
export const ADD_NEW_PROJECT = "/add/project"
export const UPDATE_PROJECT = "/update/project"
export const DELETE_PROJECT = "/delete/project"

export const GET_ATTORNEYS_DATA = `${BASE_URL}/user/attorneys`

export const POST_USER_LOGIN = `${BASE_URL}/user/login`
export const POST_USER_REGISTER = `${BASE_URL}/user/register`

export const GET_ALL_ATTORNEYS_DATA = `${BASE_URL}/user/allAttorney`

export const PUT_USER_UPDATE = `${BASE_URL}/user/update`

export const GET_ATTORNEYSCOUNT_DATA = `${BASE_URL}/user/attorneyCount`

export const GET_ATTORNEY_BY_ID = `${BASE_URL}/user/attorneydetails`

export const GET_PRIVATECHAT = `${BASE_URL}/chat/allPrivateMessages`

export const GET_ALLUSER = `${BASE_URL}/user/allUser`
