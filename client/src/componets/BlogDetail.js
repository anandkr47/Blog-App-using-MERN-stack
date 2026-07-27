import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import config from "../config";

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

const BlogDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [inputs, setInputs] = useState({ title: "", desc: "" });
  const [blog, setBlog] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const fetchDetails = useCallback(async () => {
    try {
      const res = await axios.get(`${config.BASE_URL}/api/blogs/${id}`);
      // ApiResponse wrapper -> { data: { blog } }
      const b = res.data && res.data.data && res.data.data.blog;
      if (b) {
        setBlog(b);
        setInputs({ title: b.title || "", desc: b.desc || "" });
      }
    } catch (err) {
      console.error("Failed to fetch blog details:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${config.BASE_URL}/api/blogs/update/${id}`, {
        title: inputs.title,
        desc: inputs.desc,
      });
      navigate("/myBlogs");
    } catch (err) {
      console.error("Failed to update blog:", err);
    } finally {
      setSaving(false);
    }
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
        {!blog ? (
          <Box sx={{ textAlign: "center", py: 14 }}>
            <CircularProgress sx={{ color: "#C1440E" }} />
            <Typography
              sx={{
                mt: 2,
                fontFamily: "'DM Sans', sans-serif",
                color: "#6b665f",
              }}
            >
              Loading story…
            </Typography>
          </Box>
        ) : (
          <>
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
              Edit Story
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
              Refine your words.
            </Typography>

            {blog.img && (
              <Box
                component="img"
                src={blog.img}
                alt={blog.title}
                sx={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  borderRadius: "18px",
                  mb: 3,
                  border: "1px solid rgba(31,31,31,0.08)",
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}

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
                value={inputs.title}
                onChange={handleChange}
                required
                sx={fieldSx}
              />

              <Typography sx={labelSx}>Description</Typography>
              <TextField
                fullWidth
                name="desc"
                value={inputs.desc}
                onChange={handleChange}
                required
                multiline
                minRows={8}
                sx={fieldSx}
              />

              <Box sx={{ display: "flex", gap: 1.5, mt: 4 }}>
                <Button
                  type="submit"
                  disabled={saving}
                  sx={{
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
                  {saving ? "Saving…" : "Save changes"}
                </Button>
                <Button
                  onClick={() => navigate("/myBlogs")}
                  sx={{
                    px: 3.5,
                    py: 1.3,
                    borderRadius: "12px",
                    textTransform: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 15,
                    color: "#6b665f",
                    border: "1px solid rgba(31,31,31,0.15)",
                    "&:hover": { backgroundColor: "rgba(31,31,31,0.04)" },
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default BlogDetail;
