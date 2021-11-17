const randoms = (top: number) => {
  const result = {};
  for (let i = 0; i < top; i++) {
    const randomNumber = Math.floor(Math.random() * 1000);
    if (!result[randomNumber.toString()]) {
      result[randomNumber.toString()] = 1;
    } else result[randomNumber.toString()]++;
  }
  return result;
};

process.on("message", (top: number) => {
  console.log("number of randoms", top);

  if (process?.send) process.send(randoms(top));
});
