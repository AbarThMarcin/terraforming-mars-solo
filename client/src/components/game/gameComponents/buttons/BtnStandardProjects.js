import { useContext, useState } from 'react'
import { ModalsContext } from '../../Game'
import btnSPbg from '../../../../assets/images/other/btnSPbg.svg'
import btnSPbgHover from '../../../../assets/images/other/btnSPbgHover.svg'
import { SoundContext } from '../../../../App'

const BtnStandardProjects = () => {
   const [hovered, setHovered] = useState(false)
   const { setModals } = useContext(ModalsContext)
   const { sound } = useContext(SoundContext)

   return (
      <div
         className="btn-standard-projects pointer"
         onClick={() => {
            sound.btnSPorOtherSnap.play()
            setModals((prev) => ({ ...prev, standardProjects: true }))
         }}
         onMouseEnter={() => setHovered(true)}
         onMouseLeave={() => setHovered(false)}
      >
         {hovered ? (
            <img className="full-size" src={btnSPbgHover} alt="SP_btn_background" />
         ) : (
            <img className="full-size" src={btnSPbg} alt="SP_btn_background" />
         )}

         <span className="center">STANDARD PROJECTS</span>
      </div>
   )
}

export default BtnStandardProjects
