import { useState,useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom'

import classes from './AuthForm.module.css';
import AuthContext from '../../store/auth-context';

const AuthForm = () => {
  const history = useHistory();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const authCtx = useContext(AuthContext)

  const emailInputRef= useRef();
  const passwordInputRef= useRef();


  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  const onSubmitHandler=(e)=>{
    e.preventDefault();
    let enteredEmail=  emailInputRef.current.value;
    let enteredPassword= passwordInputRef.current.value;
    
    setLoading(true);
    let url;
    if(isLogin){
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDJHKs_PgIY125T1srwCsPexrbFFkRGC2I'
    } else{
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDJHKs_PgIY125T1srwCsPexrbFFkRGC2I"
    }
    fetch(url,{
      method:'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true
      }),
      headers: {
        'content-type' : 'application/json'
      }
    }).then(res =>{
      setLoading(false);
      if(res.ok){
        return res.json();
      } else{
            return res.json().then(data=>{
              let errorMessage = 'Authentication Failed! '
            // if(data && data.error && data.error.message){
            //   errorMessage = data.error.message
            // }
            
            throw new Error(errorMessage)
        })
      }
    }).then((data) => {
      authCtx.login(data.idToken)
      history.replace('/profile');
    }).catch(
      (err) => {alert(err.message)}
    )
    emailInputRef.current.value="";
    passwordInputRef.current.value="";
  }




return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={onSubmitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input
            type='password' id='password' ref={passwordInputRef} required />
        </div>
        <div className={classes.actions}>
          {!loading && <button type='submit' className={classes.loginBtn} onClick={onSubmitHandler}> 
          {isLogin ? "Log In" : "Create Account"} </button>} 

            {loading && <h2>Submitting Data...</h2>}

           {!loading && <button type='button' className={classes.toggle} onClick={switchAuthModeHandler}>           
          {isLogin ? 'Create new account' : 'Login with existing account'}</button>}
        </div>
      </form>
    </section>
  );
};
export default AuthForm;