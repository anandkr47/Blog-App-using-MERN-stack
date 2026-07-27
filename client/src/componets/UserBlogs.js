import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Container, Skeleton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Blog from "./Blog";
import config from "../config";

const UserBlogs = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const id = localStorage.getItem("userId");

  const sendRequest = async () => {
    const res = await axios
      .get(`${config.BASE_URL}/api/blogs/user/${id}`)
      .catch((err) => console.log(err));
    // ApiResponse wrapper -> { data: { user: { name, blogs: [...] } } }
    return res && res.data && res.data.data;
  };

  useEffect(() => {
    sendRequest()
      .then((data) => setUser(data && data.user))
      .finally(() => setLoading(false));
  }, [id]);

  const blogs = (user && user.blogs) || [];

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        background:
          "radial-gradient(1100px 550px at 15% -10%, #f6ede0 0%, rgba(246,237,224,0) 60%), #faf8f4",
        pb: 10,
      }}
    >
      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 9 }, pb: { xs: 4, md: 6 } }}>
        <Typography
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: ".28em",
            textTransform: "uppercase",
            color: "#C1440E",
            mb: 1.5,
          }}
        >
          Your Desk
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 600,
            fontSize: { xs: 40, md: 60 },
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            color: "#171717",
          }}
        >
          {user && user.name ? `${user.name}'s stories` : "My stories"}
        </Typography>
        <Typography
          sx={{
            mt: 2,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: { xs: 15, md: 17 },
            color: "#6b665f",
          }}
        >
          {blogs.length} {blogs.length === 1 ? "story" : "stories"} published.
        </Typography>
        <Box
          sx={{
            mt: 4,
            height: "1px",
            width: "100%",
            background:
              "linear-gradient(90deg, rgba(31,31,31,0.18), rgba(31,31,31,0))",
          }}
        />
      </Container>

      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: { xs: 2.5, md: 3.5 },
          }}
        >
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <Box
                key={i}
                sx={{
                  borderRadius: "18px",
                  overflow: "hidden",
                  border: "1px solid rgba(31,31,31,0.06)",
                  bgcolor: "#fff",
                }}
              >
                <Skeleton variant="rectangular" height={210} />
                <Box sx={{ p: 2.5 }}>
                  <Skeleton width="55%" height={20} />
                  <Skeleton width="90%" height={30} sx={{ mt: 1 }} />
                  <Skeleton width="100%" />
                </Box>
              </Box>
            ))}

          {!loading &&
            blogs.map((blog) => (
              <Blog
                key={blog._id}
                id={blog._id}
                isUser={true}
                title={blog.title}
                desc={blog.desc}
                img={blog.img}
                user={user.name}
                date={
                  blog.date
                    ? new Date(blog.date).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : undefined
                }
              />
            ))}
        </Box>

        {!loading && blogs.length === 0 && (
          <Box sx={{ textAlign: "center", py: 12 }}>
            <Typography
              sx={{
                fontFamily: "'Fraunces', serif",
                fontSize: 28,
                color: "#171717",
                mb: 1,
              }}
            >
              You haven't written anything yet
            </Typography>
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                color: "#6b665f",
                mb: 3,
              }}
            >
              Your first story is one click away.
            </Typography>
            <Button
              onClick={() => navigate("/blogs/add")}
              sx={{
                px: 3.5,
                py: 1.25,
                borderRadius: "12px",
                textTransform: "none",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                color: "#fff",
                background: "linear-gradient(135deg, #C1440E, #E0722F)",
                "&:hover": {
                  background: "linear-gradient(135deg, #a93a0c, #C1440E)",
                },
              }}
            >
              Write a story
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default UserBlogs;
