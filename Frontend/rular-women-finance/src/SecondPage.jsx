import React from 'react'

function SecondPage() {
  return (
   <div className="login-container">

  <div className="login-box">

    <h2>{isLogin ? 'Login' : 'Register'}</h2>

    {!isLogin && (
      <input
        type="text"
        placeholder="Enter your name"
      />
    )}

    <input
      type="email"
      placeholder="Enter your email"
    />

    <input
      type="password"
      placeholder="Enter your password"
    />

    {!isLogin && (
      <input
        type="password"
        placeholder="Confirm password"
      />
    )}

    <button className="submit-btn">
      {isLogin ? 'Login' : 'Register'}
    </button>

    <p>
      {isLogin
        ? "Don't have an account?"
        : 'Already have an account?'}
    </p>

    <button
      className="switch-btn"
      onClick={() => setIsLogin(!isLogin)}
    >
      {isLogin ? 'Register' : 'Login'}
    </button>

  </div>

</div>
  )
}

export default SecondPage