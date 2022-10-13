require("dotenv").config();
const db = require("../db/pg.js");
const val = require("validator");
const crypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function createUser(user) {
  let res = "";
  if (
    val.isEmpty(user.name) ||
    val.isEmpty(user.email) ||
    val.isEmpty(user.password)
  ) {
    return (res = { message: "Please fill all require fields" });
  }
  if (user.password.length < 3) {
    return (res = {
      message: "Please use password at least with 4 digits/symbols",
    });
  }
  if (!val.isEmail(user.email)) {
    return (res = { message: "Im not sure that this is Email. Please Check" });
  }
  const users = await db.query("select * from users where email=$1", [
    user.email,
  ]);
  if (users.rows.length > 0) return (res = { message: "Email already exist" });

  const hash = await crypt.hash(user.password, 8);
  const query = {
    text: "insert into users (name,email,password,access_lvl) values ($1,$2,$3,$4) returning id",
    values: [user.name, user.email, hash, 1],
  };
  res = await db.query(query);
  const newUser = await generateAuthToken(res.rows[0]);
  return newUser;
}

async function updateUserName(user, name) {
  if (name === undefined) {
    return new Error("Please Insert Any Name You like for yourself");
  }
  try {
    const userCredentials = user.id;
    console.log(userCredentials);
    const query = {
      text: "Update users set name=$1 where id=$2 returning *;",
      values: [name, userCredentials],
    };
    const res = await db.query(query);
    return res;
  } catch (e) {
    throw new Error(e);
  }
}

async function updateUserPassword(user, oldPassword, newPassword) {
  if (oldPassword === undefined || newPassword === undefined) {
    return { text: "Please user filed for old and new passwords" };
  }
  const pwd = await db.query("select password from users where id=$1", [
    user.id,
  ]);
  const compare = await crypt.compare(oldPassword, pwd.rows[0].password);
  console.log(compare);
  if (!compare) {
    return { text: "Old password Didnt match. Check it Please" };
  }
  try {
    const password = await crypt.hash(newPassword, 8);
    const query = {
      text: "Update users set password=$1 where id=$2 returning *;",
      values: [password, user.id],
    };
    const res = await db.query(query);
    if (res.rowCount === 1) {
      return { text: "Password Succssesfuly changed" };
    } else {
      return {
        text: "Oops! Looks like an problem here. Try again one more time",
      };
    }
  } catch (e) {
    throw new Error(e);
  }
}

async function findUserProfile(user) {
  if (user.email === undefined || user.name === undefined) {
    return { text: "Please Choose how to find your User" };
  }
  try {
    const query = {
      text: "Select id,tokens from users where email=$1 AND name=$2",
      values: [user.email, user.name],
    };
    const res = await db.query(query);
    // console.log(response)
    return res.rows[0];
  } catch (e) {
    throw new Error(e);
  }
}

async function findUserById(id) {
  try {
    const query = {
      text: "Select id,name from users where id=$1",
      values: [id],
    };
    const res = await db.query(query);
    // console.log(response)
    return res;
  } catch (e) {
    throw new Error(e);
  }
}

async function deleteUser(user) {
  if (user.id === undefined) {
    return {
      text: "user is undefined. please Check everythings one more time.",
    };
  }
  try {
    const query = {
      text: "Delete from users where id=$1;",
      values: [user.id],
    };
    const res = await db.query(query);
    // console.log(res)
    if (res.rowCount > 0) {
      let usr = {
        text: "Successfuly delete user",
      };
      return usr;
    } else {
      return { text: "Hmmm... Looks like this user dont exist" };
    }
  } catch (e) {
    throw new Error(e);
  }
}

async function generateAuthToken(user) {
  const token = await jwt.sign({ id: user.id.toString() }, process.env.JWT_KEY);
  const updateUser = await db.query(
    "update users set tokens=$1 where id=$2 returning id,name,email,tokens",
    ["{" + token + "}", user.id]
  );
  return updateUser.rows[0];
}

module.exports = {
  updateUserName,
  updateUserPassword,
  findUserProfile,
  deleteUser,
  createUser,
  findUserById,
  generateAuthToken,
};
