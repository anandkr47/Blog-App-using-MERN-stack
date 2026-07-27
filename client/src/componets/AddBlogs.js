import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import config from "../config";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import placeholderImg from "../../src/placeholder.jpg";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    fontFamily: "'DM Sans', sans-serif",
    backgroundColor: "#faf8f4",
    "& fieldset": { borderColor: "rgba(31,31,31,0.12)" },
    "&:hover fieldset": { borderColor: "rgba(31,31,31,0.28)" },
    "&.Mui-focused fieldset": { borderColor: "#C1440E", borderWidth: "1.5px" },
  },
};
const labelSx = {
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 600,
  fontSize: 13,
  letterSpacing: ".04em",
  textTransform: "uppercase",
  color: "#8a8580",
  mb: 1,
  mt: 2.5,
};

const AddBlogs = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ title: "", description: "", imageURL: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const sendRequest = async () => {
    const res = await axios
      .post(`${config.BASE_URL}/api/blogs/add`, {
        title: inputs.title,
        desc: inputs.description,
        img: inputs.imageURL.trim() === "" ? placeholderImg : inputs.imageURL,
        user: localStorage.getItem("userId"),
      })
      .catch((err) => console.log(err));
    return res && res.data && res.data.data;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    sendRequest()
      .then(() => navigate("/blogs"))
      .finally(() => setLoading(false));
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        background:
          "radial-gradient(1000px 500px at 80% -10%, #f6ede0 0%, rgba(246,237,224,0) 60%), #faf8f4",
        py: { xs: 5, md: 8 },
      }}
    >
      <Container maxWidth="md">
        <Typography
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: ".28em",
            textTransform: "uppercase",
            color: "#C1440E",
            mb: 1,
          }}
        >
          New Story
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 600,
            fontSize: { xs: 34, md: 46 },
            lineHeight: 1.05,
            color: "#171717",
            mb: 4,
          }}
        >
          Write something worth reading.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            bgcolor: "#fff",
            borderRadius: "22px",
            border: "1px solid rgba(31,31,31,0.08)",
            boxShadow: "0 24px 50px -30px rgba(31,31,31,0.22)",
            p: { xs: 3, md: 4.5 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography sx={labelSx}>Title</Typography>
          <TextField
            fullWidth
            name="title"
            placeholder="A compelling headline"
            onChange={handleChange}
            value={inputs.title}
            required
            sx={fieldSx}
          />

          <Typography sx={labelSx}>Description</Typography>
          <TextField
            fullWidth
            name="description"
            placeholder="Tell your story…"
            onChange={handleChange}
            value={inputs.description}
            required
            multiline
            minRows={8}
            sx={fieldSx}
          />

          <Typography sx={labelSx}>Cover image URL</Typography>
          <TextField
            fullWidth
            name="imageURL"
            placeholder="https://…  (optional — a cover is generated if empty)"
            onChange={handleChange}
            value={inputs.imageURL}
            sx={fieldSx}
          />

          <Button
            type="submit"
            disabled={loading}
            sx={{
              mt: 4,
              alignSelf: "flex-start",
              px: 4,
              py: 1.3,
              borderRadius: "12px",
              textTransform: "none",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: 15.5,
              color: "#fff",
              background: "linear-gradient(135deg, #C1440E, #E0722F)",
              boxShadow: "0 10px 24px -10px rgba(193,68,14,0.7)",
              "&:hover": {
                background: "linear-gradient(135deg, #a93a0c, #C1440E)",
              },
              "&.Mui-disabled": { color: "rgba(255,255,255,.7)" },
            }}
          >
            {loading ? "Publishing…" : "Publish story"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AddBlogs;
