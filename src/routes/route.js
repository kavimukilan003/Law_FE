import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { Route, Redirect } from "react-router-dom"
import { useUser } from "rainComputing/contextProviders/UserProvider"

const Authmiddleware = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  ...rest
}) => {
  const { currentUser } = useUser()

  return (
    <Route
      {...rest}
      render={props => {
        if (isAuthProtected && !localStorage.getItem("authUser")) {
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          )
        }

        if (!isAuthProtected && currentUser) {
          return (
            <Redirect
              to={{ pathname: "/", state: { from: props.location } }}
            />
          )
        }
        return (
          <Layout>
            <Component {...props} />
          </Layout>
        )
      }}
    />
  )
}
Authmiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
}

export default Authmiddleware
