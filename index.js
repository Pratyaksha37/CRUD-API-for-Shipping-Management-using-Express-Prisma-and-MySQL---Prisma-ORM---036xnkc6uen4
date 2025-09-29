const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
const { PrismaClient } = require('@prisma/client');
const { verifySecret } = require('./middleware/authMiddleware');

const prisma = new PrismaClient();
app.use(verifySecret);

// POST /api/shipping/create
app.post('/api/shipping/create', async (req, res) => {
  const { userId, productId, count } = req.body;
  if (
    userId === undefined ||
    productId === undefined ||
    count === undefined
  ) {
    return res.status(404).json({ error: 'All fields required' });
  }

  try {
    const shipping = await prisma.shipping.create({
      data: { userId, productId, count, status: 'pending' },
    });
    res.status(201).json(shipping);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/shipping/cancel
app.put('/api/shipping/cancel', async (req, res) => {
  const { shippingId } = req.body;
  if (!shippingId) {
    return res.status(404).json({ error: 'Missing shippingId' });
  }

  try {
    // Check if shipping record exists
    const shipping = await prisma.shipping.findUnique({
      where: { id: shippingId },
    });

    if (!shipping) {
      return res.status(404).json({ error: 'Shipping record not found' });
    }

    const updatedShipping = await prisma.shipping.update({
      where: { id: shippingId },
      data: { status: 'cancelled' },
    });
    res.status(200).json(updatedShipping);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/shipping/get
app.get('/api/shipping/get', async (req, res) => {
  const userId = req.query.userId ? parseInt(req.query.userId) : undefined;

  try {
    let shippings;
    if (userId) {
      shippings = await prisma.shipping.findMany({
        where: { userId },
      });
    } else {
      shippings = await prisma.shipping.findMany();
    }
    res.status(200).json(shippings);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Hidden check for table existence in DB (run on startup)
async function checkTableExistence() {
  try {
    await prisma.$queryRaw`SELECT 1 FROM Shipping LIMIT 1;`;
  } catch (error) {
    console.error('Shipping table does not exist or DB connection failed.');
    process.exit(1);
  }
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 
module.exports = app;