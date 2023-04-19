import VersionUpdate from '../VersionUpdate'

const ModalVersionsItem = ({ version }) => {
   return (
      <div className="version">
         {/* Date and Version Number */}
         <h3>
            {version.date} (version {version.number})
         </h3>
         {/* Updates */}
         {version.updates.map((update, idx) => (
            <VersionUpdate key={idx} update={update} />
         ))}
      </div>
   )
}

export default ModalVersionsItem
