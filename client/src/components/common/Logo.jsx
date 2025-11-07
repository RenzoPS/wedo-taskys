import { memo } from "react"
import LogoIcon from "./LogoIcon"

const Logo = memo(function Logo() {
  return (
    <div className="logo">
      <LogoIcon size={64} />
    </div>
  )
})

export default Logo
