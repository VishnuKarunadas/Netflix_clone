import { useState } from 'react'
import './Login.css'
import logo from '../../assets/logo.png'
import {login, signup} from '../../firebase'
import netflix_spinner from '../../assets/netflix_spinner.gif'

const Login = () => {

  const [signState, setSignState] = useState("Sign In");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 


  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  const user_auth = async (e) => {
    e.preventDefault();
    setError(""); // Reset the error message

    // Basic validation
    if (signState === "Sign In") {
      if (!email || !password) {
        setError("Please fill in both email and password.");
        return;
      }
      if (!validateEmail(email)) {
        setError("Please enter a valid email.");
        return;
      }
    } else {
      if (!name || !email || !password) {
        setError("Please fill in all fields.");
        return;
      }
      if (!validateEmail(email)) {
        setError("Please enter a valid email.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
    }

    setLoading(true);
    try {
      if (signState === "Sign In") {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    loading ? <div className="login-spinner">
      <img src={netflix_spinner} alt="Loading..." />
    </div> :
      <div className='login'>
        <img src={logo} className='login-logo' alt="Logo" />
        <div className='login-form'>
          
          <form onSubmit={user_auth}>
            {signState === "Sign Up" ? <>
              <h1>Create Account</h1>
              <input value={name} onChange={(e) => { setName(e.target.value) }}
                type='text' placeholder='Your name' />
            </> : <> <h1>Login</h1> </>}

            <input value={email} onChange={(e) => { setEmail(e.target.value) }}
              type="email" placeholder='Email' />
            <input value={password} onChange={(e) => { setPassword(e.target.value) }}
              type="password" placeholder='Password' />
               {error && <div className="error-message" style={{color:'red'}}>{error}</div>}
            
            <button type='submit'>{signState}</button>

           

            <div className='form-help'>
              <div className='remember'>
                <input type="checkbox" />
                <label htmlFor="">Remember Me</label>
              </div>
              <p>Need Help?</p>
            </div>
          </form>

          <div className='form-switch'>
            {signState === "Sign In" ?
              <p>New to Netflix? <span onClick={() => { setSignState("Sign Up") }}>Sign Up Now</span></p>
              : <p>Already have an account? <span onClick={() => { setSignState("Sign In") }}>Sign In Now</span></p>
            }
          </div>
        </div>
      </div>
  );
}

export default Login;
