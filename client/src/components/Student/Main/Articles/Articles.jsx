import React from "react";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   Container,
//   makeStyles,
// } from "@material-ui/core";
// import Pagination from "@material-ui/lab/Pagination";
import "./Articles.css";
// import { useState, useEffect } from "react";
const Articles = () => {
  // const useStyles = makeStyles((theme) => ({
  //   root: {
  //     "& .Mui-selected": {
  //       backgroundColor: "#0ba360",
  //       color: "#ffffff",
  //     },
  //     "& .Mui-selected:focus": {
  //       backgroundColor: "#0ba360",
  //       color: "#ffffff",
  //     },
  //   },
  // }));
  // const classes = useStyles();
  // const [posts, setPosts] = useState([]);
  // const [page, setPage] = useState(1);
  // const api_key = "11b7cb68c300471a1c8507dd72dcce6f";
  // const loadPosts = async () => {
  //   const res = await fetch(
  //     `http://api.mediastack.com/v1/news?access_key=${api_key}&categories=technology&_page=${page}`,
  //     {
  //       method: "GET",
  //     }
  //   );
  //   const data = await res.json();
  // };
  // useEffect(() => {
  //   props.setSideToggle(false);
  //   loadPosts();
  // }, [page]);
  return (
    <div>
      <div className="jumbotron text-center tab-class">
        <h1 className="text-white text-italic">Articles Coming soon</h1>
        <p className="font-italic">Let's get or acquire some knowledge</p>
      </div>
      {/* <div className="container d-flex">
        <div class="card">
          <div class="date">
            <span>27</span>FEB
          </div>

          <div class="img">
            <h2>Petronas Towers</h2>
          </div>

          <div class="content">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
        <div class="card">
          <div class="date">
            <span>27</span>FEB
          </div>

          <div class="img">
            <h2>Petronas Towers</h2>
          </div>

          <div class="content">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
        <div class="card">
          <div class="date">
            <span>27</span>FEB
          </div>

          <div class="img">
            <h2>Petronas Towers</h2>
          </div>

          <div class="content">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
      </div>
      <Container component={Box} py={3} className="mt-5">
        <Grid container spacing={2}>
          {posts.map((post) => (
            <Grid item sm={3}>
              <div key={post.id} style={{ height: 150 }} classname="card border-outline">
                <CardContent>
                  <Typography variant="h6">
                    {post.id}. {post.name}
                  </Typography>
                </CardContent>
              </div>
            </Grid>
          ))}
        </Grid>
        <Box py={3} display="flex" justifyContent="center">
          <Pagination
            count={13}
            color="red"
            variant="text"
            className={classes.root}
            onChange={(e, value) => setPage(value)}
          />
        </Box>
      </Container> */}
    </div>
  );
};

export default Articles;
