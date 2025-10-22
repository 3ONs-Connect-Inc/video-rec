addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  if (request.method === "OPTIONS") {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request.headers.get("Origin") || "*"),
  });
}


  // GET: Serve uploaded file from R2
  if (request.method === "GET" && url.pathname.startsWith("/files/")) {
    const key = url.pathname.replace("/files/", "");

    try {
      const object = await MY_BUCKET.get(key);
      if (!object || !object.body) {
        return new Response("File not found", { status: 404 });
      }

      const extension = key.split('.').pop()?.toLowerCase();

      const contentType =
        object.httpMetadata?.contentType ||
        (extension === "wasm"
          ? "application/wasm"
          : extension === "pdf"
          ? "application/pdf"
          : extension === "step" || extension === "stp"
          ? "application/octet-stream"
          : "application/octet-stream");

      return new Response(object.body, {
        status: 200,
        headers: {
          ...corsHeaders(),
          "Content-Type": contentType,  
        },
      });
    } catch (err) {
      return new Response("Error retrieving file: " + err.message, {
        status: 500,
        headers: corsHeaders(),
      });
    }
  }

// POST: Upload file to R2
if (request.method === "POST" && url.pathname === "/upload") {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file !== "object" || !file.name) {
    return new Response("Invalid file upload", { status: 400 });
  }

  const cleanName = file.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.\-_]/g, "");

  const fileKey = `uploads/${Date.now()}_${cleanName}`;
  const ext = cleanName.split(".").pop();

  let contentType = file.type || "application/octet-stream";
  if (!file.type) {
    if (ext === "step" || ext === "stp") contentType = "application/step";
    else if (ext === "wasm") contentType = "application/wasm";
    else if (ext === "pdf") contentType = "application/pdf";
  }

  // Use arrayBuffer instead of stream()
  const buffer = await file.arrayBuffer();
  await MY_BUCKET.put(fileKey, buffer, {
    httpMetadata: { contentType },
  });

  const publicUrl = `${url.origin}/files/${fileKey}`;
  return new Response(JSON.stringify({ url: publicUrl }), {
    status: 200,
    headers: {
      ...corsHeaders(request.headers.get("Origin") || "*"),
      "Content-Type": "application/json",
    },
  });
}



// DELETE: Remove file from R2
if (request.method === "DELETE" && url.pathname.startsWith("/files/")) {
  const key = url.pathname.replace("/files/", "");
  try {
    await MY_BUCKET.delete(key);
    return new Response("File deleted", {
      status: 200,
      headers: corsHeaders(),
    });
  } catch (err) {
    return new Response("Error deleting file: " + err.message, {
      status: 500,
      headers: corsHeaders(),
    });
  }
}


  return new Response("Invalid request", { status: 400 });
}


function corsHeaders(origin = "*") {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}
