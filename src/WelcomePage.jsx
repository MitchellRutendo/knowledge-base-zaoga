import React from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import Grid from '@mui/joy/Grid';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import { SiAnydesk } from "react-icons/si";
import { DiOnedrive } from "react-icons/di";
import { PiMicrosoftOutlookLogoFill } from "react-icons/pi";
import { FaMicrosoft, FaGlobe, FaPrint } from 'react-icons/fa';
import AppBar from '@mui/material/AppBar'; // Use Material-UI AppBar
import Toolbar from '@mui/material/Toolbar'; // Use Material-UI Toolbar
import IconButton from '@mui/material/IconButton'; // Use Material-UI IconButton
import AccountCircle from '@mui/icons-material/AccountCircle';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Use Material-UI ThemeProvider
import { CssVarsProvider, extendTheme } from '@mui/joy/styles'; // Use Joy UI CssVarsProvider

export default function WelcomePage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login'); // Redirect to login page
  };

  const handleSignup = () => {
    navigate('/signup'); // Redirect to signup page
  };

  // Material-UI theme configuration
  const materialTheme = createTheme({
    palette: {
      primary: {
        main: '#0078d4', // Primary color for AppBar
      },
      background: {
        default: '#b0e0e6', // Background color for the page
      },
    },
  });

  // Joy UI theme configuration
  const joyTheme = extendTheme({
    colorSchemes: {
      light: {
        palette: {
          primary: {
            solidBg: '#0078d4', // Primary color for buttons
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={materialTheme}>
      <CssVarsProvider theme={joyTheme}>
        <div style={styles.container}>
          {/* AppBar */}
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" style={styles.logo}>
                ZAOGA FIFM
              </Typography>
              <div style={styles.spacer} />
              <Link href="/about" style={styles.navLink}>About</Link>
              <Link href="/contact" style={styles.navLink}>Contact</Link>
              <IconButton color="inherit" onClick={handleSignup}>
                <AccountCircle />
              </IconButton>
            </Toolbar>
          </AppBar>

          {/* Header Section */}
          <div style={styles.header}>
            <Typography level="h4" style={styles.headerText}>
              Welcome to ZAOGA FIFM Support
            </Typography>
            <Typography level="body1" style={styles.subHeaderText}>
              Please sign in so we may serve you better
            </Typography>
            <Button
              variant="solid"
              color="primary"
              style={styles.signInButton}
              onClick={handleLogin}
            >
              Sign in
            </Button>
          </div>

          {/* Help Section */}
          <div style={styles.section}>
            <Typography level="h5" style={styles.sectionTitle}>
              How can we help you?
            </Typography>
            <Grid container spacing={2}>
              {[
                { name: 'Outlook', icon: <PiMicrosoftOutlookLogoFill size={24} /> },
                { name: 'OneDrive', icon: <DiOnedrive size={24} /> },
                { name: 'Anydesk', icon: <SiAnydesk size={24} /> },
                { name: 'Printer', icon: <FaPrint size={24} /> },
                { name: 'Network Issues', icon: <FaGlobe size={24} /> },
              ].map((item, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Card variant="outlined" style={styles.card}>
                    <CardContent style={styles.cardContent}>
                      {item.icon}
                      <Typography level="body2" style={styles.cardText}>
                        {item.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>

          {/* Trending Topics Section */}
          <div style={styles.section}>
            <Typography level="h5" style={styles.sectionTitle}>
              Trending topics
            </Typography>
            <Grid container spacing={2}>
              {[
                {
                  name: 'Microsoft 365',
                  icon: <FaMicrosoft size={24} />,
                  subtopics: ['Install Microsoft 365', 'Manage your subscriptions'],
                },
                {
                  name: 'Microsoft Account',
                  icon: <FaMicrosoft size={24} />,
                  subtopics: ['Sign in to your account', 'Change password'],
                },
                {
                  name: 'Activation',
                  icon: <FaMicrosoft size={24} />,
                  subtopics: ['Activate Office', 'Activate Windows'],
                },
                {
                  name: 'Windows & Devices',
                  icon: <FaMicrosoft size={24} />,
                  subtopics: ['Windows 11 requirements', 'Windows support'],
                },
              ].map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card variant="outlined" style={styles.card}>
                    <CardContent style={styles.cardContent}>
                      {item.icon}
                      <Typography level="body1" style={styles.cardText}>
                        {item.name}
                      </Typography>
                      <ul style={styles.subtopics}>
                        {item.subtopics.map((subtopic, i) => (
                          <li key={i} style={styles.subtopicItem}>
                            <Typography level="body2">{subtopic}</Typography>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>

          {/* Footer Section */}
          <div style={styles.footer}>
            <Typography level="body2">
              ENG US | 18:33 | 19/3/2025
            </Typography>
          </div>
        </div>
      </CssVarsProvider>
    </ThemeProvider>
  );
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  logo: {
    flexGrow: 1,
    fontWeight: 'bold',
    color: '#fff',
  },
  spacer: {
    flexGrow: 1,
  },
  navLink: {
    color: '#fff',
    margin: '0 10px',
    textDecoration: 'none',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  headerText: {
    color: '#0078d4',
    fontWeight: 'bold',
  },
  subHeaderText: {
    color: '#666',
    margin: '10px 0',
  },
  signInButton: {
    marginTop: '10px',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    color: '#0078d4',
    marginBottom: '20px',
  },
  card: {
    textAlign: 'center',
    borderRadius: '8px',
    padding: '10px',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  cardText: {
    color: '#333',
  },
  subtopics: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  subtopicItem: {
    margin: '5px 0',
  },
  footer: {
    textAlign: 'center',
    marginTop: '40px',
    color: '#666',
  },
};