const express = require("express")
const mongoose = require('mongoose')
const cors = require("cors")
// const http = require('http').Server(app)

const EmployeeModel = require('./models/Employee')

const app = express()
app.use(express.json())
app.use(cors(

))

 mongoose.connect("mongodb://localhost:27017/employee");
// mongoose.connect("mongodb+srv://adityakas1907:YICUmsAh6k5Z2KMb@cluster0.jf8umck.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")



app.post('/register', async (req, res) => {
    const { name, email, workspace, password, captcha } = req.body; // Include captcha in the request body
    try {
        // Check if the email already exists in the database
        const existingEmployee = await EmployeeModel.findOne({ email: email });
        if (existingEmployee) {
            // If email exists, send a response indicating that the email is already registered
            return res.status(409).json({ message: "Email already exists" });
        }
        // If email doesn't exist, create a new employee record
        const newEmployee = await EmployeeModel.create({ name, email, workspace, password, captcha }); // Save captcha
        res.status(201).json(newEmployee);
    } catch (error) {
        // If an error occurs during the process, send an error response
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.post('/login', (req, res) => {
    const {email, password} = req.body;
    EmployeeModel.findOne({email: email})
    .then(user =>{
        if(user){
            if(user.password === password){
                res.json("Success")
            }else{
                res.json("The Password is incorrecrt")
            }
        }else{
            res.json("No Record existed")
        }
    })
 
})

app.listen(3002, () => {
    console.log("Server is Running")
})