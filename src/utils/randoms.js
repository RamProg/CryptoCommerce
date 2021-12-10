"use strict";
const randoms = (top) => {
    const result = {};
    for (let i = 0; i < top; i++) {
        const randomNumber = Math.floor(Math.random() * 1000);
        if (!result[randomNumber.toString()]) {
            result[randomNumber.toString()] = 1;
        }
        else
            result[randomNumber.toString()]++;
    }
    return result;
};
process.on("message", (top) => {
    console.log("number of randoms", top);
    if (process === null || process === void 0 ? void 0 : process.send)
        process.send(randoms(top));
});
