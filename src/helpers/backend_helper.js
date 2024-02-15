import axios from "axios"
import { del, get, post, put } from "./api_helper"
import * as url from "./url_helper"

const getAttorneysData = () => get(url.GET_ATTORNEYS_DATA)

// Login Method
const postLogin = data => post(url.POST_USER_LOGIN, data)

const postRegister = data => post(url.POST_USER_REGISTER, data)
const getAllAttorneys = (page, limit, searchText) =>
  post(url.GET_ALL_ATTORNEYS_DATA, page, limit, searchText)

const getAttorneysCount = searchText =>
  post(url.GET_ATTORNEYSCOUNT_DATA, searchText)

//is update AttorneyDetails by id

const getAttorneyByID = data => post(url.GET_ATTORNEY_BY_ID,data);

//Profile  Update 
const putProfileUpdate = data => put(url.PUT_USER_UPDATE,data);

export {
  getAttorneysData,
  postRegister,
  postLogin,
  getAllAttorneys,
  getAttorneysCount,
  getAttorneyByID,
  putProfileUpdate,
}
