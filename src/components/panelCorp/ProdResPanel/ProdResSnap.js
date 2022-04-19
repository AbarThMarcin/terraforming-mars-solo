const ProdResSnap = ({ prod, res, icon }) => {
   return (
      <div className='prod-res-snap-container'>
         <div className="prod-snap">{prod}</div>
         <div className="res-snap">
            <div className="res-snap-icon">{icon}</div>
            <div className="res-snap-value">{res}</div>
         </div>
      </div>
   )
}

export default ProdResSnap
