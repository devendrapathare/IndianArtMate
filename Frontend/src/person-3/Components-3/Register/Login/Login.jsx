import React, { useState } from 'react';
import './Login.css';
import { assets } from '../../../../assets/assets';
import GenderCheckbox from '../../../../person-2/components-p2/GenderCheckbox/GenderCheckbox';
import UseSignup from '../../../../person-2/hooks/UseSignup/UseSignup';
import { useNavigate } from 'react-router-dom';
import UseLogin from '../../../../person-2/hooks/UseLogin/UseLogin';

const Login = ({ setshowLogin }) => {
    const [currState, setcurrState] = useState('Login');
    const [data, setdata] = useState({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: ""
    });

    const [loginData, setloginData] = useState({
        userName: "",
        password: ""
    });

    const onChangehandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        if (currState === "Sign Up") {
            setdata(prev => ({ ...prev, [name]: value }));
        } else if (currState === "Login") {
            setloginData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCheckboxChange = (gender) => {
        setdata({ ...data, gender });
    };

    const navigate = useNavigate();
    const { signup } = UseSignup();
    const { loading, login } = UseLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currState === "Sign Up") {
                await signup(data, setshowLogin);
            } else if (currState === "Login") {
                const user = await login(loginData, setshowLogin);
                if (user) {
                    // Redirect to profile page after login
                    navigate(`/profilePage/${user._id}`);
                }
            }
        } catch (error) {
            console.error("Operation failed:", error);
        }
    };

    return (
        <div className='login-popup'>
            <form onSubmit={handleSubmit} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img
                        onClick={() => setshowLogin(false)}
                        src={assets.closeIcon}
                        alt="Close"
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Sign Up" ? (
                        <>
                            <input
                                name='userName'
                                onChange={onChangehandler}
                                value={data.userName}
                                type="text"
                                placeholder='Enter username'
                                required
                            />
                            <input
                                name='email'
                                onChange={onChangehandler}
                                value={data.email}
                                type="email"
                                placeholder='Enter Email'
                                required
                            />
                            <input
                                name='password'
                                onChange={onChangehandler}
                                value={data.password}
                                type="password"
                                placeholder='Password'
                                required
                            />
                            <input
                                name='confirmPassword'
                                onChange={onChangehandler}
                                value={data.confirmPassword}
                                type="password"
                                placeholder='Confirm Password'
                                required
                            />
                            <GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={data.gender} />
                        </>
                    ) : (
                        <>
                            <input
                                name='userName'
                                onChange={onChangehandler}
                                value={loginData.userName}
                                type="text"
                                placeholder='Enter username or email'
                                required
                            />
                            <input
                                name='password'
                                onChange={onChangehandler}
                                value={loginData.password}
                                type="password"
                                placeholder='Password'
                                required
                            />
                        </>
                    )}
                </div>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & Privacy Policy</p>
                </div>
                <button type='submit'>{currState === "Sign Up" ? "Create Account" : "Login"}</button>
                {currState === "Login" ? (
                    <p>Create A New Account? <span onClick={() => setcurrState("Sign Up")}>Click Here</span></p>
                ) : (
                    <p>Already Have an Account? <span onClick={() => setcurrState("Login")}>Login Here</span></p>
                )}
            </form>
        </div>
    );
}

export default Login;
