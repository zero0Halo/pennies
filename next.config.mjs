/** @type {import('next').NextConfig} */
const nextConfig = {
	productionBrowserSourceMaps: true, // Ensures better stack traces
	async rewrites() {
		return [
			{ source: '/api/accounts/update', destination: '/api/accounts/create' },
		];
	},
};

export default nextConfig;
