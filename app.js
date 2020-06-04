const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
var https = require('https');

const app = express();
const port = 3000;


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members:[{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME:  firstName,
                LNAME:  lastName
            }

        }]
    };

    var jsonData = JSON.stringify(data);

    const url = "https://us10.api.mailchimp.com/3.0/lists/b9a8753acf"

    const options = {
        method: "POST",
        auth: "luis1:8fb44364594a0f47a1bbdad7589a070b-us10"
    }

    const request = https.request(url, options, function (response) {
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || port, function (req, res) {
    console.log("Server is running on port 3000");
});


// api Key
// 8fb44364594a0f47a1bbdad7589a070b-us10

// List ID
// b9a8753acf