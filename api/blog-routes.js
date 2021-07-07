
const express = require("express");
const router = express.Router();
const Posts = require("../data/db");

router.use(express.json());

// Returns all blog posts
router.get("/", (req, res) => {
  Posts.find()
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

// gets a specific blog post
router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then(post => {
      if (post.length !== 0) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

// Finds all comments associated with a blog post
router.get("/:id/comments", (req, res) => {
  Posts.findPostComments(req.params.id)
    .then(comments => {
      if (comments.length !== 0) {
        res.status(200).json(comments);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

// Posts a new blog post
router.post("/", (req, res) => {
  const { title, contents } = req.body;

  // Before the insert is ran, checks if title and contents is in the request
  if (!title || !contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    Posts.insert(req.body)
      .then(post => {
        res.status(201).json({ ...post, ...req.body });
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          error: "There was an error while saving the post to the database."
        });
      });
  }
});

// Posts a new comment to a specific blog post
router.post("/:id/comments", (req, res) => {
  const { text, post_id } = req.body;

  // Checks if the client has passed in text
  if (!text) {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  } else {
    // If texts exists, take the :id that has been passed in, and attempt to locate any posts, if the posts exists, then we can insert the comment into that post, else, returns an error
    Posts.findById(req.params.id)
      .then(post => {
        if (post.length !== 0) {
          // Inserts the comment into the post, and appends the passed in body
          Posts.insertComment(req.body)
            .then(comment => {
              res.status(201).json({ ...comment, ...req.body });
            })
            .catch(error => {
              console.log(error);
              res.status(500).json({
                error:
                  "There was an error while saving the comment to the database"
              });
            });
        } else {
          res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          error: "There was an error while saving the comment to the database"
        });
      });
  }
});

// Deletes a post based upon the id, but needs to return the deleted post object
router.delete("/:id", (req, res) => {
  // First need to grab the object that is passed from the ID
  Posts.findById(req.params.id)
    .then(post => {
      // Checks if the post exists, and copies the information into a deletedPost object that we can return to the user. If the post id does not exists, returns an error message
      if (post.length !== 0) {
        const deletedPost = [...post];

        // Deletes the post, and then logs the copiedData back to the client
        Posts.remove(req.params.id)
          .then(removed => {
            res.status(200).json(deletedPost);
          })
          .catch(error => {
            console.log(error);
            res.status(500).json({ error: "The post could not be removed." });
          });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "The post could not be removed." });
    });
});

router.put("/:id", (req, res) => {
  const { title, contents } = req.body;

  if (!title || !contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    Posts.findById(req.params.id)
      .then(response => {
        // Checks if the response we get back is empty or not
        if (response.length !== 0) {
          Posts.update(req.params.id, req.body)
            .then(updatedPost => {
              res.status(200).json({ ...updatedPost, ...req.body });
            })
            .catch(error => {
              console.log(error);
              res
                .status(500)
                .json({ error: "The post information could not be modified." });
            });
        } else {
          res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
        }
      })
      .catch(error => {
        console.log(error);
        res
          .status(500)
          .json({ error: "The post information could not be modified." });
      });
  }

  // Posts.update(req.params.id, changes)
  // .then(updatedPost => {})
  // .catch(error => {
  //     console.log(error);
  //     res.status(500).json({error: "The post information could not be modified."})
  // });
});

module.exports = router;
