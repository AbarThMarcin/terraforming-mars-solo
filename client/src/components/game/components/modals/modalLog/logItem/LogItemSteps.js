import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleLeft } from '@fortawesome/free-solid-svg-icons'

const LogItemSteps = ({ item }) => {
   const [expanded, setExpanded] = useState(true)
   const refDetails = useRef()

   function handleClickUpdate() {
      const el = refDetails.current
      if (expanded) {
         el.style.height = '0px'
         setExpanded(false)
      } else {
         el.style.height = el.scrollHeight + 'px'
         setExpanded(true)
      }
   }

   return (
      <div className="steps">
         <div className="steps-title pointer" onClick={handleClickUpdate}>
            <span>STEPS</span>
            <div className="arrows"><FontAwesomeIcon icon={expanded ? faAngleDown : faAngleLeft} /></div>
         </div>

         {item.details.steps ? (
            <div ref={refDetails} className="steps-list">
               {item.details.steps.map((step, idx) => (
                  <div key={idx} className="step">
                     <div className="step-itemIcon"></div>
                     <div className="step-desc">
                        <div className="icons">
                           {step.singleActionIconName &&
                              (typeof step.singleActionIconName === 'string' ? (
                                 <img src={step.singleActionIconName} className="center" alt="prodBg_icon" />
                              ) : (
                                 <>
                                    <img src={step.singleActionIconName[0]} className="center" alt="prodBg_icon" />
                                    <img src={step.singleActionIconName[1]} className="center" alt="res_icon" />
                                 </>
                              ))}
                           <div className={`value ${step.singleActionValue < 0 ? 'negative' : ''}`}>{step.singleActionValue !== 1 && step.singleActionValue}</div>
                        </div>
                        <span style={{ color: step.singleActionIconName ? '' : 'rgb(170, 170, 255)', marginLeft: step.singleActionIconName ? '0' : '-15%' }}>{step.singleActionName}</span>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className="steps-list">
               <div className="step">NO STEPS</div>
            </div>
         )}
      </div>
   )
}

export default LogItemSteps
