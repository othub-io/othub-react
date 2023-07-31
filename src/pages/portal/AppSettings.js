import React, { useContext, useState } from 'react'
import '../../css/portal/Request.css' // Import the CSS file for styling (see Step 3)
import { AccountContext } from '../../AccountContext'
import Loading from '../../Loading'

const AppSettings = () => {
  const { chain_id, account } = useContext(AccountContext)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    try {

        setIsLoading(true)
        

        setIsLoading(false)
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <Loading />
    )
  }

  return ( 
    <div></div>
  )
}

export default AppSettings