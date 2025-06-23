import app from "./src/server";


Bun.serve({
    fetch: app.fetch,
    port: 8000
})
console.log(`app running on port 8000`)
