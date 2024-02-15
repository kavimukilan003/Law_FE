import PropTypes from "prop-types"
import React from "react"
import LogRocket from "logrocket"

import { Switch, BrowserRouter as Router, Route } from "react-router-dom"
import { connect } from "react-redux"

// Import Routes all
import { authProtectedRoutes, publicRoutes, adminRoutes } from "./routes"

// Import all middleware
import Authmiddleware from "./routes/route"

// layouts Format
import VerticalLayout from "./components/VerticalLayout/"
import HorizontalLayout from "./components/HorizontalLayout/"

import NonAuthLayout from "./components/NonAuthLayout"

// Import scss
import "./assets/scss/theme.scss"

import { ChatProvider } from "rainComputing/contextProviders/ChatProvider"
import { useSocket } from "rainComputing/contextProviders/SocketProvider"
import LandingGrid from "rainComputing/pages/landing/LandingGrid"
import { useUser } from "rainComputing/contextProviders/UserProvider"

const App = () => {
  const { currentUser } = useUser()
  // LogRocket.init("jk2db1/demo", {
  //   dom: {
  //     textSanitizer: true,
  //     inputSanitizer: true,
  //   },
  // })
  // if (currentUser?.userID) {
  //   LogRocket.identify(currentUser?.userID, {
  //     name: currentUser?.firstname + " " + currentUser?.lastname,
  //     email: currentUser?.email,
  //   })
  // }

  const { socket } = useSocket()

  return (
    <ChatProvider socket={socket}>
      {/* <NotificationsProvider> */}
      <React.Fragment>
        <Router>
          <Switch>
            <Route
              path="/"
              exact
              render={props => (
                <HorizontalLayout>
                  <LandingGrid {...props} />
                </HorizontalLayout>
              )}
            />
            {publicRoutes.map((route, idx) => (
              <Authmiddleware
                path={route.path}
                layout={HorizontalLayout}
                component={route.component}
                key={idx}
                isAuthProtected={false}
                exact
              />
            ))}

            {authProtectedRoutes.map((route, idx) => (
              <Authmiddleware
                path={route.path}
                layout={HorizontalLayout}
                component={route.component}
                key={idx}
                isAuthProtected={true}
                exact
              />
            ))}

            {adminRoutes.map((route, idx) => (
              <Authmiddleware
                path={route.path}
                layout={VerticalLayout}
                component={route.component}
                key={idx}
                isAuthProtected={false}
                exact
              />
            ))}
          </Switch>
        </Router>
      </React.Fragment>
      {/* </NotificationsProvider> */}
    </ChatProvider>
  )
}

export default App
