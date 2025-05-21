const functions = require('@google-cloud/functions-framework');

// Passive logger function
functions.http('passiveLogger', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const ua = req.headers['user-agent'] || 'Unknown';
  const method = req.method;

  console.log(`[Visit] ${new Date().toISOString()} - ${method} request from ${ip} (${ua})`);

  res.status(200).send('Visit logged successfully.');
});
