import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { useRef } from 'react'

const VersionUpdate = ({ update }) => {
   const [expanded, setExpanded] = useState(false)
   const refDesc = useRef()

   function handleClickUpdate() {
      if (!update.description) return
      const el = refDesc.current
      if (expanded) {
         el.style.height = '0px'
         setExpanded(false)
      } else {
         el.style.height = el.scrollHeight + 'px'
         setExpanded(true)
      }
   }

   return (
      <div
         className={`version-update ${update.description && pointer} ${expanded && 'expanded'}`}
         onClick={handleClickUpdate}
      >
         <div className="title-container">
            {/* Hyphen */}
            <div className="hyphen">-</div>
            {/* Title */}
            <div className="title">{update.title}</div>
            {/* Arrows */}
            {update.description && (
               <div className="arrows">
                  {expanded ? (
                     <FontAwesomeIcon icon={faAngleDown} />
                  ) : (
                     <FontAwesomeIcon icon={faAngleLeft} />
                  )}
               </div>
            )}
         </div>
         {/* Description */}
         <p ref={refDesc} className="description">
            {update.description}
         </p>
      </div>
   )
}

export default VersionUpdate
