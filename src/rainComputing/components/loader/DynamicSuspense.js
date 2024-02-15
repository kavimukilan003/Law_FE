import React, { Suspense } from "react"
import PropTypes from "prop-types"
import { Spinner } from "reactstrap"

const DynamicSuspense = ({ children }) => {
  return (
    <Suspense fallback={<Spinner className="ms-2" color="info" />}>
      {children}
    </Suspense>
  )
}

DynamicSuspense.propTypes = {
  children: PropTypes.any,
}

export default DynamicSuspense
