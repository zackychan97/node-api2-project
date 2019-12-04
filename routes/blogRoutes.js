const express = require('express');
const router = express.Router();
const Posts = require('../data/db.js');

router.use(express.json());

// GET REQUESTS BELOW

// 1. all posts

router.get('/', (req, res) => {
    Posts.find()
        .then(post => {
            res.status(200).json(post);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: 'Post info not retrieved.' })
        })
})

// 2. post by id

router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            if (post.length !== 0){
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'The post with the id desired does not exist'})
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: 'The post info cannot be retrieved, sorry bud.' })
        })
})


// 3. find comments relevant to a post id

router.get('/:id/comments', (req, res) => {
    Posts.findPostComments(req.params.id)
        .then(comments => {
            if (comments.length !== 0) {
                res.status(200).json(comments);
            } else {
                res.status(404).json({ message: 'The post with the id desired does not exist' })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: 'The comments info cannot be retrieved, sorry bud.' })
        })
})

// POST REQUESTS BELOW

// 1. Post a global post

router.post('/', (req, res) => {
    const postInfo = req.body;
    if (!postInfo.title || !postInfo.contents) {
        res.send(400).json({ message: 'Please provide title and contents' })
    } else {
        Posts.insert(postInfo)
            .then(transcribe => {
                res.status(201).json(transcribe)
            })
            .catch(() => {
                res.status(500).json({ errorMessage: 'There was an error posting to database' })
            })
    }
})

// 2. Post comment to specific blog post by id

router.post('/:id/comments', (req, res) => {
    const id = req.params.id
    const commentInfo = req.body
    Posts.findById(id)
    if (!id) {
        res.status(404).json({ message: 'Post with desired id does not exist, sorry bud.' })
    } else if (!commentInfo) {
        res.status(400).json({ errorMessage: 'Please provide us info to post for comment' })
    } else {
        Posts.insertComment(commentInfo)
            .then(comment => {
                res.status(201).json(comment)
            })
            .catch(() => {
                res.status(500).json({ errorMessage: 'There was an error while saving the comment to database.' })
            })
    }
})


// PUT REQUESTS BELOW

// 1. put to the blog post by id, sort of editing post

router.put('/:id', (req, res) => {
    const id = req.params.id
    const postInfo = req.body

    Posts.findById(id)
        .then(transcribe => {
            if (!transcribe) {
                res.status(404).json({ message: 'The post with the desired id does not exist' })
            }
        })
        if (!postInfo.title || !postInfo.contents) {
            res.status(400).json({ message: 'Please give the title and contents if you wish to put (edit)' })
        } else {
            Posts.update(id, postInfo)
                .then(postInfo => {
                    res.status(200).json({ message: 'Success! Cheers.', postInfo })
                })
                .catch(() => {
                    res.status(500).json({ errorMessage: 'The post info cannot be modified, database error, sorry mate' })
                })
        }
})

module.exports = router;