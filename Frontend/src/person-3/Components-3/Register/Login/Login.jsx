import React, { useState } from 'react';
import './Login.css';
import { closeI } from '../../../../assets/assets';

const Login = ({ setshowLogin }) => {

    const [currState, setcurrState] = useState('Login');
    const [data, setdata] = useState({
        email: "",
        password: "",
        confirm_password: ""
    });
    const [error, setError] = useState("");

    const onChangehandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setdata(data => ({ ...data, [name]: value }));
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);

        return password.length >= minLength && hasUppercase && hasLowercase && hasDigit;
    };

    const onLogin = (event) => {
        event.preventDefault();

        if (currState === "Sign Up") {
            if (!validatePassword(data.password)) {
                setError("Password must be at least 8 characters long, with one uppercase letter, one lowercase letter, and one digit.");
                return;
            }
            if (data.password !== data.confirm_password) {
                setError("Passwords do not match.");
                return;
            }
        }

        setError(""); 
        console.log('Form data:', data);
        alert(`${currState === "Sign Up" ? "Account created" : "Logged in"} successfully!`);
        setshowLogin(false);
    };

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img
                        onClick={() => setshowLogin(false)}
                        src={closeI}
                        alt="Close"
                        style={{ cursor: 'pointer' }} 
                    />
                </div>
                <div className="login-popup-inputs">
                    <div>
                        <input
                            name='email'
                            onChange={onChangehandler}
                            value={data.email}
                            type="email"
                            placeholder='Email'
                            required
                        />
                    </div>
                    <div>
                        <input
                            name='password'
                            onChange={onChangehandler}
                            value={data.password}
                            type="password"
                            placeholder='Password'
                            required
                        />
                    </div>
                    {currState === "Sign Up" && (
                        <div>
                            <input
                                name='confirm_password'
                                onChange={onChangehandler}
                                value={data.confirm_password}
                                type="password"
                                placeholder='Confirm Password'
                                required
                            />
                        </div>
                    )}
                </div>
                {error && <div className="login-popup-error">{error}</div>}
                <button type='submit'>{currState === "Sign Up" ? "Create Account" : "Login"}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & Privacy Policy</p>
                </div>
                {currState === "Login"
                    ? <p>Create A New Account? <span onClick={() => setcurrState("Sign Up")}>Click Here</span></p>
                    : <p>Already Have an Account? <span onClick={() => setcurrState("Login")}>Login Here</span></p>}
            </form>
        </div>
    );
}

export default Login;
