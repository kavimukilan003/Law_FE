import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { verifyUserEmail } from "rainComputing/helpers/backend_helper"
import success from "../../../assets/images/success.png"
import "./veriEmail.scss"
import { Card, CardBody } from "reactstrap"

//verificationState 1 - Verifing ,2 - Verification Success, 3- Verification Failed

function useQuery() {
  const { search } = useLocation()
  return React.useMemo(() => new URLSearchParams(search), [search])
}

const VerifyEmailPage = () => {
  const [verifyError, setVerifyError] = useState("")
  const [verificationState, setVerificationState] = useState(1)
  const query = useQuery()
  useEffect(() => {
    const verifyEmailUrl = async () => {
      const res = await verifyUserEmail({ verifyToken: query.get("token") })
      if (res.success) {
        setVerificationState(2)
      } else {
        setVerifyError(res.msg)
        setVerificationState(3)
      }
    }

    verifyEmailUrl()
  }, [])

  return (
    <>
      {verificationState === 1 && (
        <div className="container">
          <h1 className="align-middle">Email Verfication under processs</h1>
        </div>
      )}
      {verificationState === 2 && (
        <div className="container">
          <img src={success} alt="success_img" />
          <Card className="mt-5">
            <CardBody>
              <h1>Email verified successfully</h1>
            </CardBody>
          </Card>
          <Link to="/login">
            <button className="green_btn">Login</button>
          </Link>
        </div>
      )}
      {verificationState === 3 && (
        <div className="container">
          <h1>Email Verfication failed</h1>
          <p>{verifyError}</p>
        </div>
      )}
    </>
  )
}

export default VerifyEmailPage
