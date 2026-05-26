const blacklist = new Map();

const add = (token, exp) => {
  blacklist.set(token, exp);
};

const has = (token) => {
  return blacklist.has(token);
};

const cleanup = () => {
  const now = Math.floor(Date.now() / 1000);
  for (const [token, exp] of blacklist) {
    if (exp < now) blacklist.delete(token);
  }
};

setInterval(cleanup, 15 * 60 * 1000);

module.exports = { add, has };
