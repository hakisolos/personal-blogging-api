/** @format */

import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import crypto from 'crypto';
import { newArticle, delArticle, getArticle } from './controllers';

const app = new Hono();
app.use(prettyJSON());

app.post('/create', async c => {
	const body = await c.req.json();

	if (!body.title) return c.json({ error: 'provide article title' }, 400);
	if (!body.author) return c.json({ error: 'provide article author' }, 400);
	if (!body.tags) return c.json({ error: 'provide article tags' }, 400);
	if (!Array.isArray(body.tags)) return c.json({ error: 'tags must be an array' }, 400);
	if (!body.content) return c.json({ error: 'provide article content' }, 400);
	if (!body.cover) return c.json({ error: 'provide article cover' }, 400);

	try {
		const article = {
			title: body.title,
			author: body.author,
			tags: body.tags,
			content: body.content,
			release: new Date().toISOString(),
			cover: body.cover,
		};
		const id = await newArticle(JSON.stringify(article));
		return c.json({ message: 'success', id }, 200);
	} catch (e: any) {
		console.error(e);
		return c.json({ error: 'an error occurred' }, 500);
	}
});

app.get('/getarticle/:id', async c => {
	const id = c.req.param('id');
	if (!id) return c.json({ error: 'ID required' }, 400);

	try {
		const art = await getArticle(id);
		if (!art) {
			return c.json({ error: 'No article found' }, 404);
		}
		return c.json(JSON.parse(art), 200);
	} catch (e) {
		console.error(e);
		return c.json({ error: 'An error occurred' }, 500);
	}
});

app.get('/', c => c.text('hello world'));

export default app;