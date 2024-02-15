import { useState } from "react"

const useAccordian = (initialIndex = -1) => {
  const [activeAccordian, setActiveAccordian] = useState(initialIndex)
  const handleSettingActiveAccordion = index => {
    activeAccordian === index
      ? setActiveAccordian(-1)
      : setActiveAccordian(index)
  }
  return { activeAccordian, setActiveAccordian, handleSettingActiveAccordion }
}

export default useAccordian
