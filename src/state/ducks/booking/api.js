import axios from 'axios';
import { ERROR_ADDRESS_UNKNOWN } from 'ducks/addresses/api';
import { BASE_URL } from 'env';

const api = {
  addAddressToOrder({ orderId, ...address }) {
    return axios.post(`${BASE_URL}/orders/${orderId}/address`, address)
      .then(res => res.data)
      .catch(err => err.response.status === 400
        ? Promise.reject(ERROR_ADDRESS_UNKNOWN)
        : Promise.reject(err));
  },

  startBooking({ productId, priceModelId, canOffer }) {
    return axios.post(`${BASE_URL}/product/${productId}/booking`, { priceModelId, canOffer })
      .then(res => res.data)
      .catch(({ response: { status, statusText, data } }) =>
        Promise.reject({ status, statusText, data }));
  },

  submit({ bookingId, ...body }) {
    return axios.post(`${BASE_URL}/booking/${bookingId}/submit`, { ...body })
      .then(res => res.data)
      .catch(({ response: { status, statusText, data } }) =>
        Promise.reject({ status, statusText, data }));
  },

  getShippingOptions() {
    return axios.get(`${BASE_URL}/prices/shippingrates`)
      .then(res => res.data)
      .catch(({ response: { status, statusText, data } }) =>
        Promise.reject({ status, statusText, data }));
  },
};

export default api;
