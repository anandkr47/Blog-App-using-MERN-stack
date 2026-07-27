import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../store";
import { useNavigate, useLocation } from "react-router-dom";
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
  "& .MuiInputLabel-root.Mui-focused": { color: "#C1440E" },
};

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSignupButtonPressed } = location.state || {};

  const [inputs, setInputs] = useState({ name: "", email: "", password: "" });
  const [isSignup, setIsSignup] = useState(isSignupButtonPressed || false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    setIsSignup(isSignupButtonPressed || false);
  }, [isSignupButtonPressed]);

  const sendRequest = async (type = "login") => {
    const res = await axios.post(`${config.BASE_URL}/api/users/${type}`, {
      name: inputs.name,
      email: inputs.email,
      password: inputs.password,
    });
    // ApiResponse wrapper -> { data: { user } }
    return res.data && res.data.data;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    sendRequest(isSignup ? "signup" : "login")
      .then((data) => {
        if (!data || !data.user) throw new Error("Unexpected response");
        localStorage.setItem("userId", data.user._id);
        dispatch(authActions.login());
        navigate("/blogs");
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message ||
          (isSignup ? "Could not sign up" : "Invalid email or password");
        setError(msg);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background:
          "radial-gradient(1000px 500px at 20% -10%, #f6ede0 0%, rgba(246,237,224,0) 60%), #faf8f4",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 420,
          bgcolor: "#fff",
          borderRadius: "22px",
          border: "1px solid rgba(31,31,31,0.08)",
          boxShadow: "0 30px 60px -30px rgba(31,31,31,0.25)",
          p: { xs: 3.5, sm: 5 },
        }}
      >
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
          The Journal
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 600,
            fontSize: 34,
            lineHeight: 1.1,
            color: "#171717",
            mb: 0.5,
          }}
        >
          {isSignup ? "Create your account" : "Welcome back"}
        </Typography>
        <Typography
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14.5,
            color: "#6b665f",
            mb: 3.5,
          }}
        >
          {isSignup
            ? "Join the community and start publishing."
            : "Sign in to continue to your stories."}
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, borderRadius: "12px", fontFamily: "'DM Sans', sans-serif" }}
          >
            {error}
          </Alert>
        )}

        {isSignup && (
          <TextField
            fullWidth
            name="name"
            label="Name"
            onChange={handleChange}
            value={inputs.name}
            required
            sx={{ ...fieldSx, mb: 2 }}
          />
        )}
        <TextField
          fullWidth
          name="email"
          label="Email"
          type="email"
          onChange={handleChange}
          value={inputs.email}
          required
          sx={{ ...fieldSx, mb: 2 }}
        />
        <TextField
          fullWidth
          name="password"
          label="Password"
          type="password"
          onChange={handleChange}
          value={inputs.password}
          required
          sx={{ ...fieldSx, mb: 3 }}
        />

        <Button
          type="submit"
          fullWidth
          disabled={loading}
          sx={{
            py: 1.4,
            borderRadius: "12px",
            textTransform: "none",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: 15.5,
            color: "#fff",
            background: "linear-gradient(135deg, #C1440E, #E0722F)",
            boxShadow: "0 10px 24px -10px rgba(193,68,14,0.7)",
            "&:hover": { background: "linear-gradient(135deg, #a93a0c, #C1440E)" },
            "&.Mui-disabled": { color: "rgba(255,255,255,.7)" },
          }}
        >
          {loading ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
        </Button>

        <Box sx={{ textAlign: "center", mt: 2.5 }}>
          <Typography
            component="span"
            sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6b665f" }}
          >
            {isSignup ? "Already have an account?" : "New here?"}{" "}
          </Typography>
          <Box
            component="span"
            onClick={() => {
              setError("");
              setIsSignup((v) => !v);
            }}
            sx={{
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              color: "#C1440E",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {isSignup ? "Sign in" : "Create one"}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
