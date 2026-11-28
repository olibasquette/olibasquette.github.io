Personal website

Location badge
--------------

The homepage reads a public label from the Cloudflare presence Worker.
In the Worker's dashboard editor, insert the block below inside `fetch`,
before the existing `/pub` path and POST checks. Deploy the Worker.

    if (request.method === "GET" && new URL(request.url).pathname === "/status") {
      const maxAgeHours = 12;
      const cutoff = Math.floor(Date.now() / 1000) - maxAgeHours * 3600;
      const row = await env.DB.prepare(`
        SELECT label FROM presence WHERE id = 1 AND observed_at >= ?
      `).bind(cutoff).first();

      return Response.json({ label: row?.label ?? null }, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store",
        },
      });
    }

The homepage's `data-status-url` is set to
https://presence.olibasquette.workers.dev/status. Open it in a browser to
check for JSON with the current label (or null if no recent fix exists).
The homepage checks on load and about once a minute while open. It shows
"Unavailable" if the request fails or there is no recent fix.

The status URL is public. Only the label is returned. The OwnTracks
password belongs in the Worker's secret settings and on the phone.
