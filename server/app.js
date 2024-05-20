const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const User = require("./models/user");
const OrphanUsers = require("./models/orphanuser");
const Product = require("./models/product")
const Cart = require("./models/cart")
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const NeedRequest = require("./models/needRequest");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/TenderCare', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Multer storage configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.post('/signup', async (req, res) => {
    try {
        const user = {
            UserId: uuidv4(),
            name: req.body.name,
            email: req.body.email,
            phno: req.body.phno,
            password: req.body.password,
        };

        // Check if the user is already registered.
        const existingUser = await User.findOne({ email: user.email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        // Create User
        await User.create(user)
            .then((user) => {
                res.status(201).json({
                    message: "Registration successful",
                    user,
                });
            })
            .catch((error) => {
                res.status(400).json({
                    message: "Something went wrong",
                });
            });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ code:"SD401",message: 'Invalid email or password' });
    }

    // Compare password
    if (password !== user.password) {
        return res.status(401).json({code:"SD401", message: 'Invalid email or password' });
    }
    const { password: _, ...userWithoutPassword } = user.toObject();

    // Return success response
    res.json(userWithoutPassword);
        // Return success response
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
});

app.get('/cart/:userId', async (req, res) => {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });
    if (cart) {
        res.status(200).send(cart);
    } else {
        res.status(404).send({ message: 'Cart not found' });
    }
});
app.post("/orphangesignup", async (req,res)=>{
    try {
        const orphanUser = {
             instname : req.body.instituteName,
             dir : req.body.director,
             address : req.body.address,
             pincode : req.body.pincode,
             contact : req.body.contact,
             password : req.body.password,
             phno : req.body.phone,
             district : req.body.district,
             emailid : req.body.email,
             regno : req.body.registrationNo,
             licenseno : req.body.licenseNo,
             accreditationno : req.body.accreditationNo,
             mission:req.body.mission,
             vision:req.body.vision,
             description:req.body.description,
             noOfChildren:req.body.numChildren,
             noOfStaff:req.body.numStaffs,
             userId: uuidv4(),
             isActive:false
        };
        // Check if the user is already registered.
        const existingUser = await OrphanUsers.findOne({ email: orphanUser.emailid });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        // Create User
        await OrphanUsers.create(orphanUser)
            .then((orphanUser) => {
                res.status(201).json({
                    message: "Registration successful",
                    orphanUser,
                });
            })
            .catch((error) => {
                res.status(400).json({
                    message: "Something went wrong",
                });
            });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
})
app.post('/loginorphange', async (req, res) => {
    try {
        const { email, password } = req.body;

    // Find user by email
    const user = await OrphanUsers.findOne({ emailid: email });
    if (!user) {
        return res.status(401).json({ code:"SD401",message: 'Invalid email or password' });
    }

    // Compare password
    if (password !== user.password) {
        return res.status(401).json({code:"SD401", message: 'Invalid email or password' });
    }
    const { password: _, ...userWithoutPassword } = user.toObject();

    // Return success response
    res.json(userWithoutPassword);
        // Return success response
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
});

app.get("/getAllOrphange", async (req,res)=>{
    try {
        const products = await OrphanUsers.find();
        res.status(200).json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
})
app.get("/getOrphange/:id", async (req,res)=>{
    const { id } = req.params;
    const orphan = await OrphanUsers.findOne({ _id:id });
    if (orphan) {
        res.status(200).send(orphan);
    } else {
        res.status(404).send({ message: 'Item not found' });
    }
})

app.post('/addProduct', upload.single('image'), async (req, res) => {
    try {
        if (!req.body.name || !req.body.description || !req.body.price || !req.file) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            price: parseFloat(req.body.price),
            image: req.file.filename, // or `req.file.path` if you need the full path
            productId: uuidv4(),
            userId:req.body.userId,
            quantity:req.body.quantity
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully' });
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ message: 'Failed to create product' });
    }
});

// Endpoint for taking pictures using camera
app.post('/take-picture', async (req, res) => {
    // Logic for taking pictures using camera and saving to file system
    try {
        const newProduct = new Product({
            name: req.body.name,
            image: 'path_to_image' // Replace with actual path to image
        });
        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create product' });
    }
});

app.get('/getProducts', async (req, res) => {
    try {
        const { userId } = req.query;
        const products = await Product.find({ userId });
        res.status(200).json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
});
app.get('/getAllProducts', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
});
app.put('/editProduct/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, price, description, quantity, userId } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;

    try {
        const product = await Product.findByIdAndUpdate(id, { name, price, description, quantity, imageUrl, userId }, { new: true });
        res.send(product);
    } catch (error) {
        res.status(400).send({ message: 'Error updating product', error });
    }
});
app.get('/getProduct/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        res.send(product);
    } catch (error) {
        res.status(400).send({ message: 'Error fetching product', error });
    }
});
app.delete('/deleteProduct/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Product.findByIdAndDelete(id);
        res.send({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).send({ message: 'Error deleting product', error });
    }
});


app.post('/cart', async (req, res) => {
    const { userId, productId, quantity,image,name,price } = req.body;
    const cart = await Cart.findOne({ userId });

    if (cart) {
        const itemIndex = cart.items.findIndex(item => item.productId === productId);

        if (itemIndex > -1) {
            let item = cart.items[itemIndex];
            item.quantity = quantity;
            cart.items[itemIndex] = item;
        } else {
            cart.items.push({ productId, quantity,image,name,price });
        }
        await cart.save();
        res.status(200).send(cart);
    } else {
        const newCart = await Cart.create({
            userId,
            items: [{ productId, quantity,image,name,price }]
        });
        res.status(201).send(newCart);
    }
});

app.delete('/cart/:userId/:productId', async (req, res) => {
    const { userId, productId } = req.params;
    const cart = await Cart.findOne({ userId });
    if (cart) {
        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        if (itemIndex > -1) {
            cart.items.splice(itemIndex, 1);
            await cart.save();
            res.status(200).send(cart);
        } else {
            res.status(404).send({ message: 'Item not found' });
        }
    } else {
        res.status(404).send({ message: 'Cart not found' });
    }
});

app.post('/addNeedRequest', async (req, res) => {
    try {
        const { userId, items } = req.body;
        let needRequest = await NeedRequest.findOne({ userId });

        if (needRequest) {
            // If a request already exists for the user, add items to the existing request
            needRequest.items.push(...items);
            await needRequest.save();
            return res.status(200).json(needRequest);
        } else {
            // If no request exists for the user, create a new one
            needRequest = new NeedRequest({ userId, items, });
            await needRequest.save();
            return res.status(201).json(needRequest);
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});


app.get('/api/needRequests/:userId', async (req, res) => {
    try {
        const needRequests = await NeedRequest.find({ userId: req.params.userId });
        res.status(200).json(needRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a need request by ID
app.put('/needRequests/:id', async (req, res) => {
    try {
        const updatedRequest = await NeedRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a need request by ID
app.delete('/needRequests/:id', async (req, res) => {
    try {
        await NeedRequest.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Need request deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/getAllNeedRequests', async (req, res) => {
    try {
        const updatedRequest = await NeedRequest.find();
        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
app.listen(port, () => {
    console.log('Server is running on http://localhost:3000');
});
