const bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer"),
mongoose = require("mongoose"),
express = require("express"),
app = express();

//App config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//Mongoose model config
let blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
let Blog = mongoose.model("Blog", blogSchema);

//Routes
app.get("/", (req, res) => {
    res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err){
            console.log('error');
        }
        else{
            res.render("index", {blogs: blogs});
        }
    })
});

//New blog post
app.get("/blogs/new", (req,res) => {
    res.render("new");
});

//Create Blog
app.post("/blogs", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog) => {
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});

//Show Blog
app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err) res.redirect("/blogs");
        else res.render("show", {blog: foundBlog});
    })
});

//Edit blog
app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err) res.render("/blogs");
        else res.render("edit", {blog: foundBlog});
    })
});

//Update
app.put("/blogs/:id", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if(err) res.redirect("/blogs");
        else res.redirect("/blogs/" + req.params.id);
    })
})

//Delete
app.delete("/blogs/:id", (req,res) => {
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if(err) res.redirect("/blogs");
        else res.redirect("/blogs");
    })
})

app.listen(3000, () => console.log("Server is running on 3000"));