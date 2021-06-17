import axios from 'axios';

const URL = 'http://payments:4040/payments'

export function createPayment(body) {
  return axios.post(
    URL,
    body,
  );
}

