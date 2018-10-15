const prepareData = (data, onSubmit) => {
  const { price, fulfillment } = data;

  const cleanPrice = `${price},`.replace(/,/g, '').replace(/\$/g, '');
  const offerData = {
    ...data,
    price: Number(cleanPrice) || 0,
    fulfillment: String(fulfillment),
  };
  onSubmit({ data: offerData });
  return new Promise(() => {}); // submission will be resolved in saga
};

export default prepareData;
