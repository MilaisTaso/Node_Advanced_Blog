require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));
const mongoose = require('mongoose');
const session = require('express-session');
const env = process.env;

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

// セッション情報
app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 1800000},
}));

//mongoDBとの接続
mongoose.connect(env.MONGO_DB_URI)
.then(() => {
  console.log('Success: Connected to MongoDB');
})
.catch((error) => {
  console.error("Failure: Unconnected to MongoDB");
})

// 登録するデータとモデルの設定
const Schema = mongoose.Schema;
const BlogSchema = new Schema({
  title: String,
  summary: String,
  image: String,
  textBody: String
});

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
});

const BlogModel = mongoose.model("Blog", BlogSchema);
const UserModel = mongoose.model("User", UserSchema);

// ブログ一覧画面
app.get('/', async(req, res) => {
  const allBlogs = await BlogModel.find();
  res.render('index', {allBlogs: allBlogs, session: req.session.userId});
});

// 投稿フォーム
app.get('/blog/create', (req, res) => {
  if(req.session.userId) {
    res.render('blogCreate');
  } else {
    res.redirect('/user/login');
  }
});

//ブログ詳細画面
app.get('/blog/:id', async(req, res) => {
  const singleBlog = await BlogModel.findById(req.params.id);
  res.render('blogRead', {singleBlog: singleBlog, session: req.session.userId});
});

//投稿編集画面
app.get("/blog/update/:id", async(req, res) => {
  const singleBlog = await BlogModel.findById(req.params.id)
  res.render('blogUpdate', {singleBlog});
});

// ブログ投稿アクション
app.post('/blog/create', (req, res) => {
  BlogModel.create(req.body, (error, savedBlogData) => {
    if (error) {
      res.render('error', {message: "/blog/createのエラー"});
    } else {
      res.redirect('/');
    }
  });
});

app.post('/blog/update/:id', (req, res) => {
  BlogModel.updateOne({_id: req.params.id}, req.body).exec((error) => {
    if (error) {
      res.render('error', {message: "/blog/updateのエラー"});
    } else {
      res.redirect("/");
    }
  });
});

// ブログの消去
app.get("/blog/delete/:id", async(req, res) => {
  const singleBlog = await BlogModel.findById(req.params.id);
  res.render('blogDelete', {singleBlog});
});

app.post("/blog/delete/:id", (req, res) => {
  BlogModel.deleteOne({_id: req.params.id}).exec((error) => {
    if (error) {
      res.render("error", {message: "/blog/deleteのエラー"});
    } else {
      res.redirect("/");
    }
  });
});

//ログイン画面
app.get('/user/login', (req, res) => {
  res.render('login');
});

app.post('/user/login', (req, res) => {
  UserModel.findOne({email: req.body.email}, (error, savedUserData) => {
    if (savedUserData) {
      if (req.body.password === savedUserData.password) {
        req.session.userId = savedUserData._id;
        res.redirect("/");
      } else {
        res.render("error", {message: "/user/loginのエラー:パスワードが違います"});
      }
    } else {
      res.render("error", {message: "/user/loginのエラー: ユーザーが存在しません"});
    }
  });
});

// 会員登録
app.get("/user/create", (req, res) => {
  res.render("userCreate");
});

//新規会員登録
app.post("/user/create", (req, res) => {
  UserModel.create(req.body, (error, savedUserData) => {
    if (error) {
      res.render("error", { message: "/user/createのエラー"});
    } else {
      res.redirect("/user/login");
    }
  });
});

//404エラー対応
app.get("*", (req, res) => {
  res.render("error", { message: "ページが存在しません"});
});

//ポートの設定
const port = process.env.PORT || 5001;

app.listen(5001, () => {
  console.log(`Listening on ${port}` );
  console.log(env.MONGO_DB_URI);
});
