const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;
const routes = require('./routes');

require('./models/index');



app.use('/api', routes);

app.use(cors());
app.use(express.json());

app.get('/hello', (req, res) => {
    res.json({ message: 'Hello worlds' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});