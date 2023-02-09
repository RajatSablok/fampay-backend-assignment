/**
 * @param {TDateInput} date Date to convert
 * @returns {String} Local IST date string
 * @example
 * ```typescript
 * getLocalStringIST(); // '7/14/2022, 3:56:49 PM' -> Current time
 * getISTDayEndDate(1577808000000); // '12/31/2019, 9:30:00 PM'
 * ```
 */
export const getLocalStringIST = (date?: string | number | Date): string => {
	const dateToConvert = date ? new Date(date) : new Date();
	return dateToConvert.toLocaleString('en-US', {
		timeZone: 'Asia/Kolkata',
	});
};
