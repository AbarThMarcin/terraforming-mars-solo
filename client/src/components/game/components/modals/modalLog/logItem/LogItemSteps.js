import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { getResIconForLog } from '../../../../../../data/log'

const LogItemSteps = ({ steps, setResizeBox }) => {
   const [expanded, setExpanded] = useState(true)
   const refDetails = useRef()

   function handleClickUpdate() {
      const el = refDetails.current
      if (expanded) {
         el.style.height = '0px'
         setExpanded(false)
         setResizeBox((prev) => !prev)
      } else {
         el.style.height = el.scrollHeight + 'px'
         setExpanded(true)
         setResizeBox((prev) => !prev)
      }
   }

   return (
      <div className="steps">
         <div className="steps-title pointer" onClick={handleClickUpdate}>
            <span>STEPS</span>
            <div className="arrows">
               <FontAwesomeIcon icon={expanded ? faAngleDown : faAngleLeft} />
            </div>
         </div>

         <div ref={refDetails} className="steps-list">
            {steps.length > 0 ? (
               steps.map((step, idx) => (
                  <div key={idx} className="step">
                     <div className="step-itemIcon"></div>
                     <div className="step-desc">
                        <div className="icons">
                           {step.singleActionIconName &&
                              (typeof step.singleActionIconName === 'string' ? (
                                 <img src={getResIconForLog(step.singleActionIconName)} className="center" alt="prodBg_icon" />
                              ) : (
                                 <>
                                    <img src={getResIconForLog(step.singleActionIconName[0])} className="center" alt="prodBg_icon" />
                                    <img src={getResIconForLog(step.singleActionIconName[1])} className="center" alt="res_icon" />
                                 </>
                              ))}
                           {/*<div className={`value ${step.singleActionValue < 0 ? 'negative' : ''}`}>{step.singleActionValue !== 1 && step.singleActionValue}</div>*/}
                           <div className={`value ${step.singleActionValue < 0 ? 'negative' : ''}`}>{step.singleActionValue}</div>
                        </div>
                        <div style={{ color: step.singleActionIconName ? '' : 'rgb(170, 170, 255)', marginLeft: step.singleActionIconName ? '0' : '-10%' }}>
                           {step.singleActionName}
                        </div>
                     </div>
                  </div>
               ))
            ) : (
               <div className="step" style={{ paddingLeft: '0.8%', color: '#777' }}>
                  NO STEPS
               </div>
            )}
         </div>
      </div>
   )
}

export default LogItemSteps
