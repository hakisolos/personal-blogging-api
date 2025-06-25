/** @format */

import { redis } from 'bun';
import crypto from 'crypto';

export async function newArticle(obj: string): Promise<string> {
	const id = crypto.randomBytes(4).toString('hex');
	try {
		await redis.set(id, obj);
		return id;
	} catch (e: any) {
		console.error(e);
		throw new Error('Failed to save article');
	}
}

export async function delArticle(id: string) {
	if (!id) throw new Error('Article ID is required');
	try {
		await redis.del(id);
	} catch (e) {
		console.error(e);
		throw new Error('Failed to delete article');
	}
}

export async function getArticle(id: string) {
	if (!id) throw new Error('Article ID is required');
	try {
		const article = await redis.get(id);
		if (!article) throw new Error('Article not found');
		return article;
	} catch (e) {
		console.error(e);
		throw e;
	}
}
