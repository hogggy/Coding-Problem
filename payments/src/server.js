import express from 'express';
import { ExternalPayment } from './mongo.js';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

// Assign environment variables
const port = process.env.PORT || 4000;

/**
 * Setup services
 */

// Initiliase an express server
const app = express();

app.use(bodyParser.json());

// Options to pass to mongodb to avoid deprecation warnings
const options = {
  useNewUrlParser: true
};

// Setup routes to respond to client
app.get('/payments', async (req, res) => {
  const payments = await ExternalPayment.find()
    .exec();
  res.send(
    `Hello Client! There are ${payments.length} records in the DB`
  );
});

// Setup routes to respond to client
app.post('/payments', async (req, res) => {
  if (!req.body.referenceId) {
    return res.status(400)
      .json({ error: 'referenceId is required' });
  }
  if (!req.body.amount || isNaN(parseInt(req.body.amount))) {
    return res.status(400)
      .json({ error: 'amount is required and must be a number' });
  }
  const existing = await ExternalPayment.findOne()
    .where('referenceId')
    .equals(req.body.referenceId)
    .exec();

  if (existing) {
    return res.status(400)
      .json({ error: 'referenceId must be unique' });
  }

  if (Math.random() * 100 < 30) {
    return res.status(500)
      .json({ error: 'SOMETHING IS VERY WRONG' });
  }

  const newOne = new ExternalPayment({
    amount: req.body.amount,
    referenceId: req.body.referenceId,
    uuid: uuidv4()
  });
  const saved = await newOne.save();

  res.json({
    uuid: saved.uuid,
    referenceId: saved.referenceId,
    amount: saved.amount,
    createdAt: saved.createdAt,
    updatedAt: saved.updatedAt
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
