import { takeEvery, fork, put, all, call } from "redux-saga/effects"

//Account Redux states
import { REGISTER_USER, USER_REGISTER } from "./actionTypes"
import { registerUserSuccessful, registerUserFailed } from "./actions"

import { postRegister } from "../../../helpers/backend_helper"

// Is user register successfull then direct plot user in redux.
function* registerUser({ payload: { user } }) {
  try {
    // if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
    //   const response = yield call(
    //     fireBaseBackend.registerUser,
    //     user.email,
    //     user.password
    //   )
    //   yield put(registerUserSuccessful(response))
    // } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
    //   const response = yield call(postJwtRegister, "/post-jwt-register", user)
    //   yield put(registerUserSuccessful(response))
    // } else

    const response = yield call(postRegister, user)
    yield put(registerUserSuccessful(response))
  } catch (error) {
    yield put(registerUserFailed(error))
  }
}

export function* watchUserRegister() {
  yield takeEvery(REGISTER_USER, registerUser)
}

function* accountSaga() {
  yield all([fork(watchUserRegister)])
}

export default accountSaga
