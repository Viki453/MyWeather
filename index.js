import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import env from "dotenv";

const app = express();

env.config();

app.use(express.static("public"));

const port = 4000;
var city;
var countrycode;
const APIKey = process.env.API_KEY;


app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req,res) => {
    res.render("greet.ejs");
});


app.post("/submit", (req,res) =>{
    city = req.body.city;
    countrycode = req.body.countrycode;
    res.redirect(`/main?city=${city}&countrycode=${countrycode}`);
});

app.get("/main", async (req,res) => {
    
    try {
        city = req.query.city;
        countrycode = req.query.countrycode;
        const valresponse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${countrycode}&appid=${APIKey}`);
        const prejs = valresponse.data;
        const lat = prejs[0].lat;
        const lon = prejs[0].lon;
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`);
        const data = response.data;
        const len = data.weather.length; 
        const dat = new Date((data.sys.sunrise)*1000);
        console.log(data.weather[0]);
        res.render("main.ejs", {data: data, len: len, dat: dat,city: city});
    } catch (error) {
        console.log(error.message);
        res.render("error.ejs", {error: error});
    }
   
});

app.get("/back", (req, res) => {
    res.redirect("/");
})

app.listen(port, () =>{
    console.log(`running on port ${port}`);
});