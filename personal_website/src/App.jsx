import React from 'react'
import styles from './style'

const App = () => {
  return (
    <div className="bg-primary w-full overflow-hidden">
      <div className={'${styles.paddingX} $styles.flexCenter}'}>
        <div className={'${styles.boxWidth}'}>
          {/* Navbar */}
        </div>
      </div>

      <div className={'bg-primary ${styles.flexCenter}'}>
        <div className={'${styles.boxWidth}'}>
          {/* hero */}
        </div>
      </div>

      <div className={"bg-primary ${styles.paddingX} ${styles.flexStart}"}>

      </div>
    </div>
  )
}

export default App