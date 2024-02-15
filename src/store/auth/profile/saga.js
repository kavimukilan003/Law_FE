import { takeEvery, fork, put, all, call } from "redux-saga/effects"

// Login Redux States

import { profileSuccess, profileError } from "./actions"
 
export function* watchProfile() {
 
}

function* ProfileSaga() {
  yield all([fork(watchProfile)])
}

export default ProfileSaga
