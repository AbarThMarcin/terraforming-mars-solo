import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeMute, faVolumeHigh } from '@fortawesome/free-solid-svg-icons'

const BtnMusic = ({ isMusicPlaying, setIsMusicPlaying }) => {
   return (
      <div className="btn-music-container pointer" onClick={() => setIsMusicPlaying((prev) => !prev)}>
         {isMusicPlaying ? <FontAwesomeIcon icon={faVolumeHigh} /> : <FontAwesomeIcon icon={faVolumeMute} />}
      </div>
   )
}

export default BtnMusic
