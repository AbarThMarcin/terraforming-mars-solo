import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'

const LogCaption = ({ expanded, setExpanded, menuClicked, setMenuClicked }) => {
   const handleClickExpandAll = () => {
      setExpanded(true)
      setMenuClicked(false)
   }

   const handleClickCollapseAll = () => {
      setExpanded(false)
      setMenuClicked(false)
   }

   const handleClickManualAll = () => {
      setExpanded(null)
      setMenuClicked(false)
   }

   return (
      <div className="log">
         <div className="text">
            <span>LOG</span>
         </div>
         <div className="log-menu">
            <FontAwesomeIcon
               icon={faEllipsis}
               className="menu-icon"
               onClick={(e) => {
                  e.stopPropagation()
                  setMenuClicked((prev) => !prev)
               }}
            />
            <ul className={!menuClicked ? 'hidden' : ''}>
               <li className={expanded === true ? 'selected' : ''} onClick={handleClickExpandAll}>
                  ALWAYS EXPAND ALL
               </li>
               <li className={expanded === false ? 'selected' : ''} onClick={handleClickCollapseAll}>
                  ALWAYS COLLAPSE ALL
               </li>
               <li className={expanded === null ? 'selected' : ''} onClick={handleClickManualAll}>
                  EXPAND / COLLAPSE MANUALLY
               </li>
            </ul>
         </div>
      </div>
   )
}

export default LogCaption
