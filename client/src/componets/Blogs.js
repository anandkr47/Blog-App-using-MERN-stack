import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Container, Skeleton, Typography } from "@mui/material";
import Blog from "./Blog";
import config from "../config";

const Blogs = () => {
  const [blogs, setBlogs] = useState();
  const [loading, setLoading] = useState(true);

  const sendRequest = async () => {
    const res = await axios
      .get(`${config.BASE_URL}/api/blogs`)
      .catch((err) => console.log(err));
    return res && res.data;
  };

  useEffect(() => {
    sendRequest()
      .then((data) => setBlogs(data && data.blogs))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 600px at 80% -10%, #f6ede0 0%, rgba(246,237,224,0) 60%), #faf8f4",
        pb: 10,
      }}
    >
      {/* Editorial masthead */}
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
          The Journal
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 600,
            fontSize: { xs: 40, md: 64 },
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            color: "#171717",
            maxWidth: 780,
          }}
        >
          Stories, ideas &amp; field notes.
        </Typography>
        <Typography
          sx={{
            mt: 2.5,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: { xs: 15, md: 17 },
            lineHeight: 1.6,
            color: "#6b665f",
            maxWidth: 560,
          }}
        >
          A collection of writing from the community — long reads, quick takes,
          and everything in between.
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

      {/* Grid */}
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
            Array.from({ length: 6 }).map((_, i) => (
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
                  <Skeleton width="80%" />
                </Box>
              </Box>
            ))}

          {!loading &&
            blogs &&
            blogs.map((blog) => (
              <Blog
                key={blog._id}
                id={blog._id}
                isUser={localStorage.getItem("userId") === blog.user._id}
                title={blog.title}
                desc={blog.desc}
                img={blog.img}
                user={blog.user.name}
                date={new Date(blog.date).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              />
            ))}
        </Box>

        {!loading && (!blogs || blogs.length === 0) && (
          <Box
            sx={{
              textAlign: "center",
              py: 12,
              color: "#6b665f",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Fraunces', serif",
                fontSize: 28,
                color: "#171717",
                mb: 1,
              }}
            >
              Nothing here yet
            </Typography>
            <Typography sx={{ fontSize: 15 }}>
              Be the first to publish a story.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Blogs;
