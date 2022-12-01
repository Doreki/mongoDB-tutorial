const addSum = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof a !== "number" || typeof b !== "number") {
        reject("a,b must be numbers");
      }
      resolve(a + b);
    }, 3000);
  });
};

addSum(10, 20)
  .then((sum1) => addSum(sum1, 1))
  .then((sum1) => addSum(sum1, 1))
  .then((sum1) => addSum(sum1, 1))
  .then((sum1) => addSum(sum1, 1))
  .then((sum) => console.log({ sum }))
  .catch((error) => console.log({ error }));

const totalSum = async () => {
  let sum = await addSum(10, 10);
  console.log({ sum });
};

totalSum();
