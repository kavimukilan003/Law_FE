import React, { useState } from "react"
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap"

const UserDropdown = () => {
  const [open, setOpen] = useState(false)
  return (
    <Dropdown
      isOpen={open}
      toggle={() => setOpen(!open)}
      className="float-end me-2"
    >
      <DropdownToggle tag="i" className="text-muted">
        <i className="mdi mdi-dots-horizontal font-size-18 btn" />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem href="#">Action</DropdownItem>
        <DropdownItem href="#">Another action</DropdownItem>
        <DropdownItem href="#">Something else</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export default UserDropdown
