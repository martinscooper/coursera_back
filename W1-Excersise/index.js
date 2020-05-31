express = require('express');
morgan = require('morgan')
app = express();


app.use(morgan())
app.use(express.json());


app.use('/dishes', require('./routes/dishRouter'));
app.use('/promotions', require('./routes/promoRouter'));
app.use('/leaders', require('./routes/leaderRouter'));

port = 3000;
localhost = "localhost"
app.listen(port, localhost, () => {
    console.log(`Server running at http://${localhost}:${port}`)
})
