import { Box, useTheme, Typography, CircularProgress } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch("http://localhost:8081/faqs");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Response is not JSON");
        }
        
        const data = await response.json();
        setFaqs(data);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  if (loading) {
    return (
      <Box m="20px" display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m="20px">
        <Header title="FAQ" subtitle="Frequently Asked Questions Page" />
        <Typography color={colors.redAccent[500]} variant="h5" textAlign="center" mt={4}>
          Error loading FAQs: {error}
        </Typography>
      </Box>
    );
  }

  if (faqs.length === 0) {
    return (
      <Box m="20px">
        <Header title="FAQ" subtitle="Frequently Asked Questions Page" />
        <Typography color={colors.greenAccent[500]} variant="h5" textAlign="center" mt={4}>
          No FAQs available yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header title="FAQ" subtitle="Frequently Asked Questions Page" />
      {faqs.map((faq) => (
        <Accordion key={faq.id} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.greenAccent[500]} variant="h5">
              {faq.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {faq.answer || "No answer available."}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default FAQ;