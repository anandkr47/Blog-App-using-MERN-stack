import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";

// A deterministic warm accent per author so avatars/placeholders feel
// intentional and consistent, never random.
const ACCENTS = [
  ["#C1440E", "#F2A65A"],
  ["#7A5C3E", "#D9A566"],
  ["#2E5E4E", "#7FB69E"],
  ["#3B3B58", "#8E8ECB"],
  ["#8A2D3B", "#E08497"],
  ["#1F4E5F", "#5FA8B8"],
];
const accentFor = (name = "") => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return ACCENTS[h % ACCENTS.length];
};

const Blog = ({ title, desc, img, user, isUser, id, date }) => {
  const navigate = useNavigate();
  const [broken, setBroken] = useState(false);
  const [from, to] = accentFor(user);

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/myBlogs/${id}`);
  };
  const deleteRequest = async () => {
    const res = await axios
      .delete(`${config.BASE_URL}/api/blogs/${id}`)
      .catch((err) => console.log(err));
    return res && res.data;
  };
  const handleDelete = (e) => {
    e.stopPropagation();
    deleteRequest()
      .then(() => navigate("/"))
      .then(() => navigate("/blogs"));
  };

  return (
    <Card
      elevation={0}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: "18px",
        overflow: "hidden",
        bgcolor: "#ffffff",
        border: "1px solid rgba(31,31,31,0.08)",
        boxShadow: "0 1px 2px rgba(31,31,31,0.04)",
        transition:
          "transform .35s cubic-bezier(.2,.7,.2,1), box-shadow .35s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 24px 48px -18px rgba(31,31,31,0.28)",
        },
        "&:hover .blog-media": { transform: "scale(1.06)" },
      }}
    >
      {/* Cover */}
      <Box sx={{ position: "relative", overflow: "hidden", height: 210 }}>
        {img && !broken ? (
          <CardMedia
            component="img"
            image={img}
            alt={title || "blog cover"}
            className="blog-media"
            onError={() => setBroken(true)}
            sx={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              transition: "transform .5s cubic-bezier(.2,.7,.2,1)",
            }}
          />
        ) : (
          <Box
            className="blog-media"
            sx={{
              height: "100%",
              width: "100%",
              background: `linear-gradient(135deg, ${from}, ${to})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform .5s cubic-bezier(.2,.7,.2,1)",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 900,
                fontSize: 64,
                color: "rgba(255,255,255,.85)",
              }}
            >
              {title ? title.charAt(0).toUpperCase() : "✎"}
            </Typography>
          </Box>
        )}
        {/* scrim */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.28) 100%)",
          }}
        />
        {date && (
          <Chip
            label={date}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              bgcolor: "rgba(255,255,255,0.92)",
              color: "#1f1f1f",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: ".02em",
              backdropFilter: "blur(4px)",
            }}
          />
        )}
        {isUser && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              gap: 0.5,
            }}
          >
            <Tooltip title="Edit">
              <IconButton
                onClick={handleEdit}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.92)",
                  "&:hover": { bgcolor: "#fff" },
                }}
              >
                <ModeEditOutlineIcon sx={{ fontSize: 18, color: "#C1440E" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                onClick={handleDelete}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.92)",
                  "&:hover": { bgcolor: "#fff" },
                }}
              >
                <DeleteForeverIcon sx={{ fontSize: 18, color: "#8A2D3B" }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      {/* Body */}
      <CardContent
        sx={{
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          "&:last-child": { pb: 2.5 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1.5 }}>
          <Avatar
            sx={{
              width: 34,
              height: 34,
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              background: `linear-gradient(135deg, ${from}, ${to})`,
            }}
          >
            {user ? user.charAt(0).toUpperCase() : "?"}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: 13.5,
                color: "#1f1f1f",
                lineHeight: 1.1,
              }}
              noWrap
            >
              {user || "Anonymous"}
            </Typography>
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11.5,
                color: "#8a8580",
                letterSpacing: ".06em",
                textTransform: "uppercase",
              }}
            >
              Author
            </Typography>
          </Box>
        </Box>

        <Typography
          component="h3"
          sx={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 600,
            fontSize: 21,
            lineHeight: 1.2,
            color: "#171717",
            mb: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14.5,
            lineHeight: 1.6,
            color: "#5c5852",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: 2,
          }}
        >
          {desc}
        </Typography>

        <Box
          onClick={() => navigate(`/myBlogs/${id}`)}
          sx={{
            mt: "auto",
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            alignSelf: "flex-start",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: 13.5,
            color: "#C1440E",
            transition: "gap .2s ease",
            "&:hover": { gap: "10px" },
          }}
        >
          Read story
          <ArrowOutwardIcon sx={{ fontSize: 16 }} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default Blog;
