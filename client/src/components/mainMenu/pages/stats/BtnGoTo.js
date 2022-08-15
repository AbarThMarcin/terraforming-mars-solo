const BtnGoTo = ({ text, action, styles }) => {
   return (
      <div className="btn-goto pointer" style={styles} onClick={() => action()}>
         <span>{text}</span>
      </div>
   )
}

export default BtnGoTo
