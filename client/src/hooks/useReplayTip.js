import { useState } from 'react'

const useReplayTip = () => {
   const [showReplayTip, setShowReplayTip] = useState(false)
   const [replayTipTop, setReplayTipTop] = useState(0)
   const [replayTipLeft, setReplayTipLeft] = useState(0)

   return { showReplayTip, setShowReplayTip, replayTipTop, setReplayTipTop, replayTipLeft, setReplayTipLeft }
}

export default useReplayTip
