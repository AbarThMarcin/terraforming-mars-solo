import { VERSIONS } from '../../../data/versions'
import ModalVersionsItem from './ModalVersionsItem'

const ModalVersions = ({ setShowVersions }) => {
   return (
      <div className="modal-background" onClick={() => setShowVersions(false)}>
         <div className="versions-container center" onClick={(e) => e.stopPropagation()}>
            {/* Title */}
            <div className="title">UPDATES</div>
            {/* Content */}
            <div className="content">
               {VERSIONS.map((version, idx) => (
                  <ModalVersionsItem key={idx} version={version} />
               ))}
            </div>
         </div>
      </div>
   )
}

export default ModalVersions
