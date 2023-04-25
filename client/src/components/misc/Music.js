import { useState, useEffect, useRef } from 'react'

// #region ------------ ICONS ---------
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeMute, faVolumeHigh, faEllipsis, faForward, faBackward, faForwardStep, faBackwardStep } from '@fortawesome/free-solid-svg-icons'
// #endregion ------------ ICONS ---------

// #region ------- Tracts -------------------------------------------------------
import soundtrack1 from '../../assets/audio/soundtrack1.mp3'
import soundtrack2 from '../../assets/audio/soundtrack2.mp3'
import soundtrack3 from '../../assets/audio/soundtrack3.mp3'
import soundtrack4 from '../../assets/audio/soundtrack4.mp3'
import soundtrack5 from '../../assets/audio/soundtrack5.mp3'
// #endregion ---------------------------------------------------------------

const playlist = [soundtrack1, soundtrack2, soundtrack3, soundtrack4, soundtrack5]

const Music = () => {
   const audioPlayer = useRef()
   const [index, setIndex] = useState(0)
   const [currentSong, setCurrentSong] = useState(playlist[index])
   const [isPlaying, setIsPlaying] = useState(false)

   useEffect(() => {
      if (audioPlayer) {
         audioPlayer.current.src = playlist[index]
         if (isPlaying) audioPlayer.current.play()
      }
   }, [currentSong])

   const togglePlay = () => {
      if (!isPlaying) {
         audioPlayer.current.play()
      } else {
         audioPlayer.current.pause()
      }
      setIsPlaying((prev) => !prev)
   }

   const toggleForward = () => {
      audioPlayer.current.currentTime += 10
   }

   const toggleBackward = () => {
      audioPlayer.current.currentTime -= 10
   }

   const toggleSkipForward = () => {
      if (index >= playlist.length - 1) {
         setIndex(0)
         setCurrentSong(playlist[0])
      } else {
         setIndex((prev) => prev + 1)
         setCurrentSong(playlist[index + 1])
      }
      audioPlayer.current.currentTime = 0
   }

   const toggleSkipBackward = () => {
      if (index > 0) {
         setIndex((prev) => prev - 1)
         setCurrentSong(playlist[index - 1])
      } else {
         setIndex(playlist.length - 1)
         setCurrentSong(playlist[playlist.length - 1])
      }
      audioPlayer.current.currentTime = 0
   }

   return (
      <div className='music-container'>
         <audio src={currentSong} ref={audioPlayer} />
         <FontAwesomeIcon icon={faEllipsis} />
         
         {isPlaying ? (
            <div className='pointer' onClick={togglePlay}><FontAwesomeIcon icon={faVolumeHigh} /></div>
         ) : (
            <div className='pointer' onClick={togglePlay}><FontAwesomeIcon icon={faVolumeMute} /></div>
         )}
         
         <div className='pointer' onClick={toggleForward}><FontAwesomeIcon icon={faForward} /></div>
         <div className='pointer' onClick={toggleBackward}><FontAwesomeIcon icon={faBackward} /></div>
         <div className='pointer' onClick={toggleSkipForward}><FontAwesomeIcon icon={faForwardStep} /></div>
         <div className='pointer' onClick={toggleSkipBackward}><FontAwesomeIcon icon={faBackwardStep} /></div>

      </div>
   )
}

export default Music