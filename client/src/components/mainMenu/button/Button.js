import { useRef, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SoundContext } from '../../../App'

const Button = ({ text, path, disabled, action, tipText, loading }) => {
   let navigate = useNavigate()
   const { sound } = useContext(SoundContext)
   const [showTipText, setShowTipText] = useState(false)
   const [tipTop, setTipTop] = useState(0)
   const [tipLeft, setTipLeft] = useState(0)
   const refButton = useRef()

   const handleClickBtn = () => {
      if (disabled) return
      sound.btnGeneralClick.play()
      if (action) action()
      if (path) navigate(path)
   }

   const handleOnMouseOver = (e) => {
      if (!tipText || !disabled || loading) return
      setTipPosition(e)
      setShowTipText(true)
   }

   const handleOnMouseLeave = () => {
      if (!tipText || !disabled || loading) return
      setShowTipText(false)
   }

   const handleOnMouseMove = (e) => {
      if (!tipText || !disabled || loading) return
      setTipPosition(e)
   }

   const setTipPosition = (e) => {
      const height = refButton.current.getBoundingClientRect().height
      const width = refButton.current.getBoundingClientRect().width
      const top = Math.floor(e.clientY - refButton.current.getBoundingClientRect().top)
      const left = Math.floor(e.clientX - refButton.current.getBoundingClientRect().left)

      setTipTop(top)
      setTipLeft(left)

      if (top < -3 || top > height || left < -3 || left > width) setShowTipText(false)
   }

   return (
      <div
         ref={refButton}
         className={`btn-main-menu pointer ${disabled ? 'disabled' : ''}`}
         onClick={handleClickBtn}
         onMouseOver={handleOnMouseOver}
         onMouseLeave={handleOnMouseLeave}
         onMouseMove={handleOnMouseMove}
      >
         {/* Button Text */}
         {text}
         {/* Tip Text */}
         {showTipText && (
            <AnimatePresence>
               <motion.div
                  key="keyTip"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0, delay: 0.2 }}
                  className="tip tip-mainmenu"
                  style={{ top: tipTop, left: tipLeft }}
               >
                  {tipText}
               </motion.div>
            </AnimatePresence>
         )}
      </div>
   )
}

export default Button
