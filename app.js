require('dotenv').config();
const { parse } = require('csv-parse');
const express = require("express");
const puppeteer = require('puppeteer');
const fs = require('fs');
const app = express();
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
const axios = require("axios");
// const db = require('./config/db');

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/img', express.static(__dirname + 'public/img'));

// Routes
app.get('', (req, res)=> {
    res.render('index');
})

app.get('/', (req, res)=> {
    res.render('index');
})

// Returns web scraping data
app.get('/menu', async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://caldining.berkeley.edu/menus/?location=Crossroads');
    
    let data = await page.evaluate(() => {
        let data = {0: [], 1: [], 2: []};
        [...document.getElementsByClassName('recipes-main-wrap')].forEach((mealElement, index) => {
            for (var i=0;i<3;i++) {
                data[index].push(mealElement.getElementsByClassName('recipe-name')[0].children[i].innerText);
            }
        });
        return data
    })
    await browser.close();
    res.send(data);
})

app.post('/reminders', (req, res) => {
    var data = {};
    // Sets all reminders as Incomplete
    if (req.body.choice == "load") {
        fs.createReadStream('./public/csv/reminders.csv')
        .pipe(parse({delimiter: ',', from_line: 2}))
        .on("data", (row) => {
            data[row[0]] = {id: row[0], title: row[1], status: row[2]}
        })
        .on('end', () => {
            res.send(data);
        })
        .on("error", (error)=> {
            console.log(error.message);
        })
    }
    // sets a specific reminder to Complete
    else if (req.body.choice == "complete") {   
        let data = [
            ['id', 'title', 'status'], [0, '50 Bicep Curl', 'Incomplete'],
            [1, '100 Squats', 'Incomplete'], [2, 'Face Moisturizer', 'Incomplete'],
            [3, '2 Vitamins', 'Incomplete']];
        for (const row of data) {
            if (row[0] == Number(req.body.id)) {
                row[2] = 'Complete';
            }
        }
        let csvData = data.map(d=> d.join(',')).join('\n');
        fs.writeFileSync('public/csv/reminders.csv', csvData);
        res.send('Success');
    }
    // Sets all reminders' statuses to Incomplete
    else {
        let data = [
            ['id', 'title', 'status'], [0, '50 Bicep Curl', 'Incomplete'],
            [1, '100 Squats', 'Incomplete'], [2, 'Face Moisturizer', 'Incomplete'],
            [3, '2 Vitamins', 'Incomplete']];

        let csvData = data.map(d=> d.join(',')).join('\n');
        fs.writeFileSync('public/csv/reminders.csv', csvData);
        res.send('Success');
    }  
})

app.get('/news', (req, res) => {
    newsapi.v2.topHeadlines({
        country: 'us',
        q: '',
        language: 'en'
    }).then(response => {
        res.send(response);
    })
})

app.get('/weather', (req, res) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${37.867876}&lon=${-122.255469}&appid=${process.env.OPENWEATHER_API_KEY}&units=imperial`
    axios.get(url)
    .then(response => {
        var data = {data: []};
        for (const day of response.data.list) {
            data.data.push({temp: day.main.temp, status: day.weather[0].main, date: day.dt_txt})
        }
        res.send(data);
    })
    .catch(error => console.log(error))
})

app.listen(2023, ()=> {console.log("App is running.")});