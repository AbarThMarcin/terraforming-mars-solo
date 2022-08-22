import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { TABS } from '../../App'
import { useContext } from 'react'
import { SettingsContext, SoundContext } from '../../App'

const BtnGoBack = ({
   type,
   setType,
   filterPlayers,
   season,
   corp,
   setCorp,
   userValue,
   music,
   soundCopy,
}) => {
   const navigate = useNavigate()
   const { settings } = useContext(SettingsContext)
   const { sound } = useContext(SoundContext)

   const handleClickGoBack = () => {
      sound.btnGeneralClick.play()
      if (!type || type === TABS.GENERAL_STATISTICS || type === TABS.GENERAL_ACHIEVEMENTS) {
         if (music) {
            music.volume(settings.musicVolume)
            Object.keys(soundCopy).forEach((key) => soundCopy[key].volume(settings.gameVolume))
         }
         navigate('/')
      } else {
         if (corp !== 'ALL CORPORATIONS') {
            const newCorp = 'ALL CORPORATIONS'
            setCorp(newCorp)
            filterPlayers(season, userValue, newCorp)
         }
         setType(TABS.GENERAL_STATISTICS)
      }
   }

   return (
      <div className="go-back pointer" onClick={handleClickGoBack}>
         <FontAwesomeIcon icon={faAngleLeft} />
      </div>
   )
}

export default BtnGoBack
