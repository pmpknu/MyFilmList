import React, { useState, useEffect } from 'react';
import { Input, Button, Spacer, Card, Link, Divider } from '@nextui-org/react';
import AuthService from '../services/AuthService';
import { EyeSlashFilledIcon, EyeFilledIcon } from '@/styles/Icons';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { login,register } from '../store/slices/userSlice';
import { SignInDto } from '../interfaces/auth/dto/SignInDto';
import { SignUpDto } from '../interfaces/auth/dto/SignUpDto';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const toggleVisibility = () => setIsVisible(!isVisible);

  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    setUsernameError(
      username.length > 0 && (username.length < 3 || username.length > 63)
        ? 'Username must be between 3 and 63 characters'
        : ''
    );
  }, [username]);

  useEffect(() => {
    setEmailError(
      email.length > 0 && (email.length < 3 || email.length > 127)
        ? 'Email must be between 3 and 127 characters'
        : ''
    );
  }, [email]);

  useEffect(() => {
    setPasswordError(
      password.length > 0 && (password.length < 6 || password.length > 127)
        ? 'Password must be between 6 and 127 characters'
        : ''
    );
  }, [password]);

  const handleLogin = async () => {
    try {
      const response = await AuthService.login({ username, password } as SignInDto);
      AuthService.saveToken(response.data.accessToken, response.data.refreshToken);
      dispatch(login(response.data.user));
      setMessage('Login successful!');
      router.push('/');
    } catch (error) {
      setMessage('Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await AuthService.register({ username, email, password } as SignUpDto);
      AuthService.saveToken(response.data.accessToken, response.data.refreshToken);
      dispatch(register(response.data.user));
      setMessage('Registration successful!');
    } catch (error) {
      console.log(error);
      setMessage('Registration failed. Please try again.');
    }
  };

  const toggleRegister = () => {
    setIsRegistering(!isRegistering);
    setMessage('');
  };

  const isSubmitDisabled: boolean | undefined = isRegistering
    ? !username || !email || !password || !!usernameError || !!emailError || !!passwordError
    : !username || !password || !!usernameError || !!passwordError;

  const submitButtonColor: 'default' | 'primary' = isSubmitDisabled ? 'default' : 'primary';

  return (
    <Card style={{ maxWidth: '400px', padding: '20px', marginTop: '50px', margin: 'auto' }}>
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      <Spacer y={1} />
      <Input
        isClearable
        className="max-w-xs"
        label="Username"
        placeholder="Enter your username"
        value={username}
        onClear={() => setUsername('')}
        onChange={(e) => setUsername(e.target.value)}
        isInvalid={usernameError !== ''}
        errorMessage={usernameError}
      />
      <Spacer y={1} />
      {isRegistering && (
        <>
          <Input
            isClearable
            className="max-w-xs"
            label="Email"
            placeholder="Enter your email"
            value={email}
            onClear={() => setEmail('')}
            onChange={(e) => setEmail(e.target.value)}
            isInvalid={emailError !== ''}
            errorMessage={emailError}
          />
          <Spacer y={1} />
        </>
      )}
      <Input
        className="max-w-xs"
        endContent={
          <button
            aria-label="toggle password visibility"
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
          >
            {isVisible ? (
              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        }
        label="Password"
        placeholder="Enter your password"
        type={isVisible ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        isInvalid={passwordError !== ''}
        errorMessage={passwordError}
      />
      <Spacer y={1} />
      <Button
        onClick={isRegistering ? handleRegister : handleLogin}
        disabled={isSubmitDisabled}
        color={submitButtonColor}
        type='submit'
        >
        {isRegistering ? 'Register' : 'Login'}
      </Button>
      <Spacer y={1} />
      <Link onClick={toggleRegister}>
        {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
      </Link>
      <Spacer y={1} />
      {message && (
        <>
          <Divider />
          <Spacer y={1} />
          <p>{message}</p>
        </>
      )}
    </Card>
  );
};

export default LoginPage;
