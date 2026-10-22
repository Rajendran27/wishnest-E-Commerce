import React from 'react'
import { Link } from 'react-router-dom'

const Error = () => {
  return (
    <div>
        <h2>404 - Page Not Found</h2>
        <p>Sorry, The Page you Looking for Doesn't Exist</p>
        <Link to="/">Back to home page</Link>
    </div>
  )
}

export default Error