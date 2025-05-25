import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from 'react'

import { useAuth } from "react-oidc-context";
import { getUserDetails } from './utils.js'

function App() {
  const auth = useAuth();

   const userSub = getUserDetails()?.sub;
  // const [loading, setLoading] = useState(true)
  // useEffect(() => {
  //   const fetchCookies = async () => {
  //     await fetch('https://....cloudfront.net/api/getSignedCookies',
  //       {
  //         method: 'GET',
  //         credentials: 'include', // Important to include cookies in the request
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     ).then(response => {
  //       console.log(response);
  //       if (response.ok) {
  //         setLoading(false)
  //         return response.json()
  //       } else {
  //         throw new Error('Network response was not ok')
  //       }
  //     })
  //   }

  //   fetchCookies()
  // }, [])

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }


  if (auth.isAuthenticated) return <>
    {/* {loading ? "Loading.." : <img src="https://....cloudfront.net/images/lambda.png" />} */}
     {<img src={`https://d1aqs4jg3mo8v0.cloudfront.net/images/${userSub}/iam.PNG`} />}
  </>

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
    </div>
  );
}

export default App