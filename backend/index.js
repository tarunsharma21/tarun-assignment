const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
require('./db/config')
const User = require("./db/User");
const Product = require('./db/product');

const Jwt = require('jsonwebtoken');
const jwtKey = 'e-comm';

const app = express();

app.use(express.json());
app.use(cors());
app.post('/register', async (req, resp) => {
    // resp.send("api in progress")
    let user = new User(req.body);
    let result = await user.save()
    // resp.send(result);
    Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
            resp.send({ result: "something went wrong,Please try after sometimes" })
        }
        resp.send({ result, auth: token })
    })
})
// const connectDB = async () => {
//     mongoose.connect('mongodb://127.0.0.1:27017/e-comm')
//     const productSchema = new mongoose.Schema({});
//     const product = mongoose.model('product', productSchema);
//     const data = await product.find();
//     console.warn(data);
// }
// connectDB();
app.post("/login", async (req, resp) => {
    console.log(req.body)
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    resp.send({ result: "something went wrong,Please try after sometimes" })
                }
                resp.send({ user, auth: token })
            })
        } else {
            resp.send({ result: "No user Found" })
        }
    } else {
        resp.send({ result: "No user found" })
    }

})

app.post("/add-product", verifyToken, async (req, resp) => {
    let product = new Product(req.body);
    let result = await product.save();
    resp.send(result)
});

app.get("/products", async (req, resp) => {
    let products = await Product.find();
    if (products.length > 0) {
        resp.send(products)
    } else {
        resp.send({ result: "No Products found" })
    }
})

app.delete("/product/:id", async (req, resp) => {
    const result = await Product.deleteOne({ _id: req.params.id })
    resp.send(result);
})

app.get("/product/:id", async (req, resp) => {
    let result = await Product.findOne({ _id: req.params.id });
    if (result) {
        resp.send(result)
    } else {
        resp.send({ result: "No Record Found" })
    }
})

app.put("/product/:id", async (req, resp) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    resp.send(result);
})
app.get("/search/:key", verifyToken, async (req, resp) => {
    let result = await Product.find({
        "$or": [
            { name: { $regex: req.params.key } },
            { company: { $regex: req.params.key } },
            { category: { $regex: req.params.key } }
        ]
    });
    resp.send(result)
})

function verifyToken(req, resp, next) {
    let token = req.headers['authorization'];
    if (token) {
        token = token.split(' ')[1]
        console.warn("middleware called if", token)
        Jwt.verify(token, jwtKey, (err, valid) => {
            if (err) {
                resp.status(401).send({ result: "please provide valid token" })
            } else {
                next();
            }
        })
    } else {
        resp.status(403).send({ result: "please add token with headers" })
    }

}

app.listen(5000);