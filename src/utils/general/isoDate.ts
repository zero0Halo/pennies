const isoDate = (date?: string | undefined | null) =>
	typeof date === 'string'
		? new Date(date).toISOString()
		: new Date().toISOString();

export default isoDate;
