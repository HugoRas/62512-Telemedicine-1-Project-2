import jwt from 'jsonwebtoken';
import { redirect } from '@sveltejs/kit';

const JWT_SECRET = process.env.JWT_SECRET ?? 'oa-monitor-dev-secret';

export async function handle({ event, resolve }) {
	if (event.url.pathname === '/') {
		return resolve(event);
	}

	const token = event.cookies.get('token');

	if (!token) throw redirect(302, '/');

	try {
		jwt.verify(token, JWT_SECRET);
	} catch {
		throw redirect(302, '/');
	}

	return resolve(event);
}
