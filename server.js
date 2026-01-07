import express from 'express';
import fetch from 'node-fetch'; // if using Node 18+, fetch is global, you can remove this import
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1️⃣ Root route – shows server is live
app.get('/', (req, res) => {
  res.send('✅ Gemini server is live! Use POST /generate to test AI.');
});

// 2️⃣ HTML test page
app.get('/test', (req, res) => {
  res.send(`
    <h2>Gemini API Test</h2>
    <textarea id="prompt" placeholder="Type something..." style="width:300px;height:100px;"></textarea><br/>
    <button onclick="sendPrompt()">Send</button>
    <pre id="output" style="background:#f4f4f4;padding:10px;"></pre>
    <script>
      async function sendPrompt() {
        const prompt = document.getElementById('prompt').value;
        const res = await fetch('/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
        const data = await res.json();
        document.getElementById('output').textContent = JSON.stringify(data, null, 2);
      }
    </script>
  `);
});

// 3️⃣ POST /generate – calls Gemini API
app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gemini-1.0',
        input: prompt
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
