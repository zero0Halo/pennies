const displayAmount = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
});

export default (amount: number) => displayAmount.format(amount);
