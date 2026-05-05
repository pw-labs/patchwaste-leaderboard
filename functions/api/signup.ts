interface Env {
  BUTTONDOWN_API_KEY?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });

  if (!env.BUTTONDOWN_API_KEY) {
    return json(503, { error: 'signup provider not configured' });
  }

  let email = '';
  let studio = '';
  let engine = '';
  let wau = '';

  const ct = request.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    const body = await request.json().catch(() => ({} as Record<string, unknown>));
    email = String((body as Record<string, unknown>).email || '').trim();
    studio = String((body as Record<string, unknown>).studio || '').trim();
    engine = String((body as Record<string, unknown>).engine || '').trim();
    wau = String((body as Record<string, unknown>).wau || '').trim();
  } else {
    const form = await request.formData();
    email = String(form.get('email') || '').trim();
    studio = String(form.get('studio') || '').trim();
    engine = String(form.get('engine') || '').trim();
    wau = String(form.get('wau') || '').trim();
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { error: 'valid email required' });
  }

  const resp = await fetch('https://api.buttondown.email/v1/subscribers', {
    method: 'POST',
    headers: {
      Authorization: `Token ${env.BUTTONDOWN_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email_address: email,
      metadata: { studio, engine, wau },
      tags: ['leaderboard-signup']
    })
  });

  if (resp.status === 201 || resp.status === 200) {
    return json(200, { ok: true });
  }
  if (resp.status === 400) {
    return json(200, { ok: true, already: true });
  }
  return json(502, { error: 'upstream signup failed' });
};
