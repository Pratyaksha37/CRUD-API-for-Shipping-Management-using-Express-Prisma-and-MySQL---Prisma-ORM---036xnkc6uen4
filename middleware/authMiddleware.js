// require('dotenv').config();

// const SECRET_KEY = process.env.SHIPPING_SECRET_KEY;

// function verifySecret(req, res, next) {
//   const key = req.header('SHIPPING_SECRET_KEY');
//   if (!key) {
//     return res.status(403).json({ error: 'SHIPPING_SECRET_KEY is missing or invalid' });
//   }
//   if (key !== SECRET_KEY) {
//     return res.status(403).json({ error: 'Failed to authenticate SHIPPING_SECRET_KEY' });
//   }
//   next();
// }

// module.exports = { verifySecret };

// middleware/authMiddleware.js
require('dotenv').config();

const SECRET_KEY = process.env.SHIPPING_SECRET_KEY;

function verifySecret(req, res, next) {
  const key = req.header('SHIPPING_SECRET_KEY');

  if (!key) {
    return res.status(403).json({ error: 'apiauthkey is missing or invalid' });
  }

  if (key !== SECRET_KEY) {
    return res.status(403).json({ error: 'Failed to authenticate apiauthkey' });
  }

  next();
}

module.exports = { verifySecret };
