import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullname: '', // Fullname field added here
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Dynamically update form fields
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log('Form Data Submitted:', formData); // Debugging log
  
    try {
      setError('');
      setSuccess('');
  
      // Send the form data to the backend API
      const response = await axios.post('http://localhost:8081/signup', formData);
  
      if (response.status === 201) {
        setSuccess('User created successfully!');
        setFormData({ fullname: '', email: '', password: '' }); // Reset form fields
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
            background-color:rgb(250, 253, 253);
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
          <Typography level="h4" component="h1">
            <b>Create Your Account</b>
          </Typography>
          <Typography level="body-sm" sx={{ marginTop: '20px' }}>
            Sign up to get started.
          </Typography>
          {error && <Typography color="danger" sx={{ marginTop: '10px' }}>{error}</Typography>}
          {success && <Typography color="success" sx={{ marginTop: '10px' }}>{success}</Typography>}
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel>Full Name</FormLabel>
              <Input
                name="fullname" // Match name with state key
                type="text"
                placeholder="John Doe"
                value={formData.fullname}
                onChange={handleInputChange}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                placeholder="johndoe@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
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
              Sign Up
            </Button>
          </form>
          <Typography
            endDecorator={<Link href="/">Log in</Link>}
            sx={{ fontSize: 'sm', alignSelf: 'center', marginTop: '10px' }}
          >
            Already have an account?
          </Typography>
        </div>
      </main>
    </>
  );
}
