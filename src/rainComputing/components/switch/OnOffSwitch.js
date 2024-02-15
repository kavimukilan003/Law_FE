import React from "react"
import PropTypes from "prop-types"
import Switch from "react-switch"

const OnOffSwitch = ({ isNotificationOn, setNotify }) => {
  const Offsymbol = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          fontSize: 10,
          color: "#fff",
          paddingRight: 2,
        }}
      >
        {" "}
        OFF
      </div>
    )
  }

  const OnSymbol = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          fontSize: 10,
          color: "#fff",
          paddingRight: 2,
        }}
      >
        {" "}
        ON
      </div>
    )
  }
  return (
    <Switch
      uncheckedIcon={<Offsymbol />}
      checkedIcon={<OnSymbol />}
      className="me-1 mb-sm-8 mb-2"
      onColor="#626ed4"
      onChange={() => {
        setNotify()
      }}
      height={18}
      width={50}
      checked={isNotificationOn}
    />
  )
}

OnOffSwitch.propTypes = {
  isNotificationOn: PropTypes.bool,
  setNotify: PropTypes.func,
}

export default OnOffSwitch
