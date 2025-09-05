import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();
console.log('🔥 generate.js route loaded');

const token = process.env.REPLICATE_API_TOKEN;  
async function pollPrediction(id) {
  const url = `https://api.replicate.com/v1/predictions/${id}`;

  while (true) {
    const res = await fetch(url, {
      headers: { 'Authorization': `Token ${token}` }
    });
    const data = await res.json();


    if (data.status === 'succeeded') return data;
    if (data.status === 'failed') throw new Error('Prediction failed');

    await new Promise(r => setTimeout(r, 2000));
  }
}
router.get('/', (req, res) => {
  res.send('GET /api/generate OK');
});

router.post('/', async (req, res) => {
console.log('➡️ /api/generate route called');

  const { prompt } = req.body;
  try {
    const createRes = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: 'ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4',
        input: { prompt },
  

      })
    });

    if (!createRes.ok) {
      const errorDetail = await createRes.text();
      throw new Error(`Create prediction failed: ${createRes.status} ${errorDetail}`);
    }

    const createData = await createRes.json();

    const result = await pollPrediction(createData.id);
const image = Array.isArray(result.output) ? result.output[0] : (result.output || '');

res.status(200).json({ output: image });
  } catch (err) {
    console.log("Generation failed"+  err.message );

  }
});

export default router;





