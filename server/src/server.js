import express from 'express';
import { Payment } from './mongo.js';
import { handlePostPayment } from './routes.js';
import bodyParser from 'body-parser';

// Assign environment variables
const port = process.env.PORT || 4000;

/**
 * Setup services
 */

// Initiliase an express server
const app = express();

app.use(bodyParser.json())

// Options to pass to mongodb to avoid deprecation warnings
const options = {
  useNewUrlParser: true
};

// Setup routes to respond to client
app.get("/payments", async (req, res) => {
  console.log("Client request received");
  const payments = await Payment.find().exec();
  res.send(
    `Hello Client! There are ${payments.length} records in the DB`
  );
});

app.post('/payments', handlePostPayment);


app.listen(port, () => console.log(`Listening on port ${port}`));
