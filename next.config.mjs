/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return [
			{ source: '/api/accounts/update', destination: '/api/accounts/create' },
		];
	},
};

export default nextConfig;
