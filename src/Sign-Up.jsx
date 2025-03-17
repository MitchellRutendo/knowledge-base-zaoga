import * as React from 'react';

import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';

export default function SignUp() {
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
        
      }
    `}
  </style>
    <main className='form-container'>
        <div className='header'>
            <img src='images__3_-removebg-preview.png' alt='Logo' style={{ width: '40px', display: 'block', margin: '0 auto' }} />
            <Typography level='h4' component='h1' sx={{ marginTop: '10px', fontSize: '18px', color: '#fff' }}>
                Welcome to ZAOGA FIF Knowledge-Base!
            </Typography>

      
        </div>
            <div className='form-content'>
          <Typography level="h4" component="h1">
            <b>Create Your Account</b>
          </Typography>
          <Typography level="body-sm" sx={{marginTop: '20px' }}>Sign up to get started.</Typography>
       
        <FormControl>
          <FormLabel>Full Name</FormLabel>
          <Input
            name="name"
            type="text"
            placeholder="John Doe"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            type="email"
            placeholder="johndoe@email.com"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            name="password"
            type="password"
            placeholder="password"
          />
        </FormControl>
        <Button sx={{ width: '100%', padding: '10px', backgroundColor: '#28a745', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}>
            Sign Up
            </Button>
        <Typography
          endDecorator={<Link href="/login">Log in</Link>}
          sx={{ fontSize: 'sm', alignSelf: 'center' }}
        >
          Already have an account?
        </Typography>
        </div>
    </main>
    </> 
  );
}
