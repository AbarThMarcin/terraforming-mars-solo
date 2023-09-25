import { useContext } from 'react'
import { ModalsContext } from '../../../game'
import btnSPbg from '../../../../assets/images/other/btnSPbg.svg'
import { SoundContext } from '../../../../App'

const BtnStandardProjects = () => {
   const { setModals } = useContext(ModalsContext)
   const { sound } = useContext(SoundContext)

   return (
      <div
         className="btn-standard-projects pointer"
         onClick={() => {
            sound.btnSPorOtherSnap.play()
            setModals((prev) => ({ ...prev, standardProjects: true }))
         }}
      >
         <img className="full-size" src={btnSPbg} alt="SP_btn_background" />
         <span className="center">STANDARD PROJECTS</span>
      </div>
   )
}

export default BtnStandardProjects
