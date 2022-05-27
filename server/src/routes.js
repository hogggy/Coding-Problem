import { createPayment } from './payment-processor-client.js';
import { Payment } from './mongo.js';

/**
 * Main handler for post /payments
 *
 * This function should:
 * Take in amount and referenceId
 * Create a payment with the payment processor
 * Save a reference to the database
 * Return a representation of the created payment
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function handlePostPayment(req, res) {

    const amount = Number.isInteger(req.body.amount) && req.body.amount > 0 ? req.body.amount : null;
    const referenceId = typeof req.body.referenceId === 'string' ? req.body.referenceId : null;

    const errorStrings = [];
    if (amount == null) {
        errorStrings.push('the field "amount" must be a positive integer');
    }
    if (referenceId == null) {
        errorStrings.push('the field "referenceId" must be a unique string');
    }
    if (errorStrings.length > 0) {
        const badRequestString = `there are 1 or more errors in your json body: `.concat(errorStrings.join('; '));
        res.status(400).send({sucess: false, error: badRequestString});
        return;
    }

    //currently trusting that the payment processer is able to enforce idempotency
    let paymentResponse;
    try {
        paymentResponse = await createPayment(req.body);
    } catch (e) {
        if (e.response.status === 400 && e.response.data.error === 'referenceId must be unique' ) {
            res.status(400).send({success: false, error: 'the field "referenceId" must be a unique string'});
            return;
        }
        console.log('paymentProcessor blew up', e);  //poor man's logger
        res.status(500).send({success: false, error: 'we are unable to process your request at this time'});
        return;
    }

    try {
        const model = await Payment.create({
            uuid: req.body.referenceId,
            externalId: paymentResponse.data.uuid,
            amount: req.body.amount
        });
        console.log(model);
    } catch (e) {
        console.log(e);  //poor man's logger
        res.status(500).send({success: false, error: 'we are unable to process your request at this time'});
        return;
    }

    res.status(200).send({success: true, payment: {
        uuid: req.body.referenceId,
        externalId: paymentResponse.data.uuid,
        amount: req.body.amount
    }});
}


