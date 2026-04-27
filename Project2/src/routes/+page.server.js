import { fail, redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'oa-monitor-dev-secret';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString().trim() ?? '';
		const password = data.get('password')?.toString().trim() ?? '';

		if (username !== 'admin' || password !== '123456') {
			return fail(400, { error: 'Forkert brugernavn eller adgangskode' });
		}

		const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1d' });

		cookies.set('token', token, {
			path: '/',
			httpOnly: true,
			maxAge: 60 * 60 * 24,
			sameSite: 'strict'
		});

		throw redirect(302, '/home');
	}
};
