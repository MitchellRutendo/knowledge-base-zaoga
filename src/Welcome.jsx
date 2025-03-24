import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';

export default function LoginFinal() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');
      setSuccess('');

      // Send login data to the backend
      const response = await axios.post('http://localhost:8081/login', formData);

      if (response.status === 200) {
        setSuccess('Login successful! Redirecting...');
        // Redirect to the homepage after a short delay
        setTimeout(() => {
          navigate('./Homepage'); // Redirect to the homepage
        }, 2000); // 2-second delay before redirection
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  return (
    <>
      <style>
        {`
          body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f5f5f5;
          }
          .form-container {
            width: 400px;
            height: 600px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(244, 243, 245, 0.91);
            overflow: hidden;
          }
          .header {
            background-color: rgb(28, 81, 194);
            padding: 20px;
            text-align: center;
            color: white;
          }
          .form-content {
            padding: 20px;
          }
        `}
      </style>
      <main className="form-container">
        <div className="header">
          <img
            src="images__3_-removebg-preview.png"
            alt="Logo"
            style={{ width: '40px', display: 'block', margin: '0 auto' }}
          />
          <Typography
            level="h4"
            component="h1"
            sx={{ marginTop: '10px', fontSize: '18px', color: '#fff' }}
          >
            Welcome to ZAOGA FIF Knowledge-Base!
          </Typography>
        </div>
        <div className="form-content">
          <Typography level="body-sm" sx={{ marginBottom: '20px' }}>Sign in to continue.</Typography>
          {error && <Typography color="danger" sx={{ marginBottom: '10px' }}>{error}</Typography>}
          {success && <Typography color="success" sx={{ marginBottom: '10px' }}>{success}</Typography>}
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                placeholder="johndoe@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                sx={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                name="password"
                type="password"
                placeholder="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                sx={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </FormControl>
            <Button
              type="submit"
              sx={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#28a745',
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '16px',
                cursor: 'pointer',
                marginTop: '10px',
              }}
            >
              Log in
            </Button>
          </form>
          <Typography
            endDecorator={<Link href="/sign-up">Sign up</Link>}
            sx={{ fontSize: 'sm', alignSelf: 'center', marginTop: '10px', textAlign: 'center' }}
          >
            Don&apos;t have an account?
          </Typography>
        </div>
      </main>
    </>
  );
}