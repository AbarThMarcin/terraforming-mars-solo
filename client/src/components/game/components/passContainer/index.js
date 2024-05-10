import { useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext, UserContext } from '../../../game'
import { getCorpLogoMini } from '../../../../data/corporations'
import AnimProdRes from '../animations/AnimProdRes'
import passContBg from '../../../../assets/images/other/passContBg.svg'
import { motion, AnimatePresence } from 'framer-motion'
import TotalVP from './TotalVP'
import { SettingsContext, SoundContext } from '../../../../App'
import { CONFIRMATION_TEXT, MATCH_TYPES } from '../../../../data/app'
import { useActionPass } from '../../../../hooks/useActionPass'

const PassContainer = () => {
   const { modals, setModals } = useContext(ModalsContext)
   const { statePlayer } = useContext(StatePlayerContext)
   const { stateGame } = useContext(StateGameContext)
   const { settings } = useContext(SettingsContext)
   const { type } = useContext(UserContext)
   const { sound } = useContext(SoundContext)
   const logo = getCorpLogoMini(statePlayer.corporation?.name)

   const { onYesFunc } = useActionPass()

   const handleClickPassBtn = () => {
      sound.btnGeneralClick.play()
      setModals((prev) => ({
         ...prev,
         modalConf: {
            text: CONFIRMATION_TEXT.PASS,
            onYes: onYesFunc,
            onNo: () => setModals((prev) => ({ ...prev, confirmation: false })),
         },
         confirmation: true,
      }))
   }

   return (
      <>
         {/* Animation */}
         {modals.animation && (
            <>
               {modals.animationData.productionIn.type !== null && <AnimProdRes type="prod-in" />}
               {modals.animationData.productionOut.type !== null && <AnimProdRes type="prod-out" />}
               {modals.animationData.resourcesIn.type !== null && <AnimProdRes type="res-in" />}
               {modals.animationData.resourcesOut.type !== null && <AnimProdRes type="res-out" />}
            </>
         )}
         {/* Button */}
         <AnimatePresence>
            {!stateGame.phaseDraft && !stateGame.phasePlaceTile && !stateGame.phaseViewGameState && !stateGame.phaseCorporation && !modals.animation && (
               <motion.div
                  key="keyBtnPass"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className={`btn-pass${type !== MATCH_TYPES.REPLAY ? ' pointer' : ''}`}
                  onClick={() => {
                     if (type === MATCH_TYPES.REPLAY) return
                     handleClickPassBtn()
                  }}
               >
                  <span>PASS</span>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Background */}
         <img className="full-size" src={passContBg} alt="pass_container_background" />
         {/* Corp Name */}
         <div className="corp-name">{statePlayer.corporation?.name}</div>
         {/* Corp Logo */}
         <div className="logo">{statePlayer.corporation && <img src={logo} alt={`logo_${statePlayer.corporation.name}`} />}</div>
         {/* You text */}
         <div className="you-text">YOU</div>
         {/* TR */}
         <div className="tr">{stateGame.tr}</div>
         {/* TOTAL POINTS */}
         {settings.showTotVP && <TotalVP />}
      </>
   )
}

export default PassContainer
