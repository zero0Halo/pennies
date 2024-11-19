const getIsoDate = (date?: string | undefined | null) => {
	return typeof date === 'string' && date.length > 2
		? new Date(date).toISOString()
		: new Date().toISOString();
};

export default getIsoDate;
