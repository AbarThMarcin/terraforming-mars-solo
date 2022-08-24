import { VERSIONS } from '../../../data/versions'

const Version = ({ setShowVersions }) => {
   return (
      <div className="version">
         VERSION {VERSIONS[0].number}
         <br />
         <span className="pointer" onClick={() => setShowVersions(true)}>
            SEE ALL UPDATES
         </span>
      </div>
   )
}

export default Version
