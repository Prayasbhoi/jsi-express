const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.set("views", path.join(__dirname, "views", "registrar"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/home", (req, res) => {
  const index = path.join(__dirname, "./views/index.html");
  res.sendFile(index);
});

app.get("/", (req, res) => {
  const loginPage = path.join(__dirname, "./views/login/index.html");
  res.sendFile(loginPage);
});

app.get("/register", async (req, res) => {
  const registerPage = path.join(__dirname, "./views/register/index.html");
  res.sendFile(registerPage);
});

app.post("/register", async (req, res) => {
  const data = req.body;

  const newUser = {
    full_name: data.full_name,
    email: data.email,
    password: data.password,
  };

  const filePath = path.join(__dirname, "data", "users.json");
  const fileData = fs.readFileSync(filePath);
  const storedUsers = JSON.parse(fileData);

  const checkUser = async () => {
    for (let existingUser of storedUsers) {
      if (newUser.email === existingUser.email) {
        console.log("Error");
        return 1;
      }
    }
    return 0;
  };

  if (await checkUser()) {
    res.send("<script>alert('User already exists with this email');</script>");
  } else {
    storedUsers.push(newUser);
    fs.writeFileSync(filePath, JSON.stringify(storedUsers));
    res.redirect("/");
  }
});

app.post("/login", async (req, res) => {
  const user = req.body;
  console.log(user);
  const filePath = path.join(__dirname, "data", "users.json");
  const fileData = fs.readFileSync(filePath);
  const storedUsers = JSON.parse(fileData);

  const checkUser = async () => {
    for (let existingUser of storedUsers) {
      if (
        user.username === existingUser.username &&
        user.password === existingUser.password
      ) {
        return 1;
      }
    }
    return 0;
  };

  if (await checkUser()) {
    res.redirect("/home");
  } else {
    res.send("<script>alert('Username or password do not match');</script>");
    res.redirect("/home");
  }
});

app.get("/create", (req, res) => {
  const createCase = path.join(__dirname, "./views/registrar/create-case.html");
  res.sendFile(createCase);
});

app.post("/create", (req, res) => {
  const caseDetails = req.body;
  const filePath = path.join(__dirname, "data", "case.json");
  const fileData = fs.readFileSync(filePath);
  const storedCases = JSON.parse(fileData);
  storedCases.push(caseDetails);
  fs.writeFileSync(filePath, JSON.stringify(storedCases));
  res.redirect("/home");
});

app.get("/list-cases", (req, res) => {
  const filePath = path.join(__dirname, "data", "case.json");
  const fileData = fs.readFileSync(filePath);
  const storedCases = JSON.parse(fileData);

  res.render("case-view", { storedCases: storedCases });
});

app.post("/list-cases", (req, res) => {
  const caseNumber = req.body.Casenumber;
  const filePath = path.join(__dirname, "data", "case.json");
  const fileData = fs.readFileSync(filePath);
  const storedCases = JSON.parse(fileData);

  var newCase = [];

  for (const cases of storedCases) {
    if (caseNumber == cases.Casenumber) {
      newCase.push(cases);
    }
  }

  res.render("case-view", { storedCases: newCase });
});

app.listen(3000);
