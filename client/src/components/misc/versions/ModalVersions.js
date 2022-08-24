import { useMemo } from 'react'
import { VERSIONS } from '../../../data/versions'
import ModalVersionsItem from './ModalVersionsItem'

const ModalVersions = ({ setShowVersions }) => {
   const versions = useMemo(() => VERSIONS.reverse(), [])

   return (
      <div className="modal-background" onClick={() => setShowVersions(false)}>
         <div className="versions-container center" onClick={(e) => e.stopPropagation()}>
            {/* Title */}
            <div className="title">UPDATES</div>
            {/* Content */}
            <div className="content">
               {versions.map((version, idx) => (
                  <ModalVersionsItem key={idx} version={version} />
               ))}
            </div>
         </div>
      </div>
   )
}

export default ModalVersions
