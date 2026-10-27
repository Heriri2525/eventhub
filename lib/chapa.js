// Chapa payment integration for Ethiopian Birr payments

export async function initializePayment({ amount, email, firstName, lastName, tx_ref, callback_url, return_url }) {
  const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
  
  if (!CHAPA_SECRET_KEY) {
    throw new Error('Chapa secret key not configured');
  }

  const response = await fetch('https://api.chapa.co/v1/transaction/initialize', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency: 'ETB',
      email,
      first_name: firstName,
      last_name: lastName,
      tx_ref,
      callback_url,
      return_url,
      customization: {
        title: 'EventHub Ticket Payment',
        description: 'Event ticket purchase',
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Payment initialization failed');
  }

  return await response.json();
}

export async function verifyPayment(tx_ref) {
  const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
  
  if (!CHAPA_SECRET_KEY) {
    throw new Error('Chapa secret key not configured');
  }

  const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Payment verification failed');
  }

  return await response.json();
}
