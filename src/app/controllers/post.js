const express = require("express");
const authMiddleware = require("../middlewares/auth");
const Post = require("../models/post");

const router = express.Router();

router.use(authMiddleware);

// List
router.get("/", async (req, res) => {
    try {
        const post = await Post.find().populate([
            "post"
        ]);
        return res.send({ post });
    } catch (err) {
        return res
            .status(400)
            .send({ error: "Erro ao buscar a lista de posts" });
    }
});

// List by id
router.get("/:postId", async (req, res) => {
    try {
        const post = await Post.findById(
            req.params.postId
        ).populate(["post"]);
        return res.send({ post });
    } catch (err) {
        return res.status(400).send({ error: "Erro ao buscar o post" });
    }
});

// Create
router.post("/", async (req, res) => {
    try {
        const {
            title,
            content,
            image,
            category,
            tags,
        } = req.body;

        const post = await Post.create({
            title,
            content,
            image,
            category,
            tags,
            user: req.userId
        });

        await post.save();

        return res.send({ post });
    } catch (err) {
        return res.status(400).send({ error: "Erro ao criar o post" });
    }
});

// Update
router.put("/:postId", async (req, res) => {
    try {
        const {
            title,
            content,
            image,
            category,
            tags
        } = req.body;

        const post = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                title,
                content,
                image,
                category,
                tags
            },
            { new: true }
        );

        await post.save();

        return res.send({ post });
    } catch (err) {
        return res
            .status(400)
            .send({ error: "Erro ao atualizar o post" });
    }
});

// Delete
router.delete("/:postId", async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.postId);
        return res.send();
    } catch (err) {
        return res.status(400).send({ error: "Erro ao deletar o post" });
    }
});

module.exports = app => {
    app.use("/post", router);
};
