import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import crypto from "crypto"
import fs from "fs"
const app = new Hono()
app.use(prettyJSON())



const articles: any = []

app.post("/create", async (c) => {
    const body = await c.req.json()
    const id = crypto.randomBytes(4).toString("hex")
    if (!body.title) {
        return c.json({ error: "provide article title" }, 400)
    }
    else if (!body.author) {
        return c.json({ error: "provide article author" }, 400)
    }
    else if (!body.tags) {
        return c.json({ error: "provide article tags" }, 400)
    }
    else if (!Array.isArray(body.tags)) {
        return c.json({ error: "tags must be a string" }, 400)
    }
    else if (!body.content) {
        return c.json({ error: "provide article content" }, 400)
    }
    else if (!body.cover) {
        return c.json({ error: "provide article cover" }, 400)

    }
    try {
        const article = {
            id: id,
            title: body.title,
            author: body.author,
            tags: body.tags,
            content: body.content,
            release: new Date().toISOString(),
            cover: body.cover
        }
        articles.push(article)
        fs.writeFileSync("./test.txt", JSON.stringify(articles, null, 2))
        return await c.json({ message: "success" })

    } catch (e: any) {
        console.log(e)
        return c.json(`an eror occured`, 500)

    }
})

app.get("/getarticle/:id", async (c) => {
    const id = c.req.param("id");
    if (!id) return c.json("id reequired", 401)
    try {
        const art = articles.find((p: any) => p.id === id);
        if (!art) {
            return c.json({ error: "No article found" }, 404);
        }
        return c.json(art, 200);
    } catch (e) {
        console.error(e);
        return c.json({ error: "An error occurred" }, 500);
    }
});

app.get("/getallarticles", async (c) => {
    try {
        return c.json(articles, 200)
    } catch (e: any) {
        console.log(e)
        return c.json("an error occured", 500)
    }
})

app.get("/", (c) => {
    return c.text("hello world")
})


export default app;