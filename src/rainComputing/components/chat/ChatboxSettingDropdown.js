import React, { useState } from "react"
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap"

const ChatboxSettingDropdown = () => {
  const [open, setOpen] = useState(false)
  return (
    <Dropdown
      isOpen={open}
      toggle={() => setOpen(!open)}
      className="float-end me-2"
    >
      <DropdownToggle className="btn nav-btn" tag="i">
        <i className="bx bx-cog" />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem href="#">Manage Group</DropdownItem>
        <DropdownItem href="#">DeleteChat</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export default ChatboxSettingDropdown
