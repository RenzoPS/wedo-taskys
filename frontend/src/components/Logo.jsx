import { memo } from "react"

const Logo = memo(function Logo() {
  return (
    <div className="logo">
      <div className="logo-icon">
        <div className="logo-lines">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </div>
    </div>
  )
})

export default Logo
