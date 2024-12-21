import type React from 'react';
import {
	createContext,
	useCallback,
	useContext,
	useState,
	type ReactNode,
} from 'react';

// Define the shape of the context
export interface FormMessagingContextData {
	close: boolean;
	error: string;
	setClose: (arg: boolean) => void;
	setError: (arg: string) => void;
	setSuccess: (arg: string) => void;
	success: string;
}

// Create the context with a default value
export const FormMessagingContext = createContext<
	FormMessagingContextData | undefined
>(undefined);

// Create a provider component
interface FormMessagingProviderProps {
	children: ReactNode;
}

const FormMessagingProvider: React.FC<FormMessagingProviderProps> = ({
	children,
}) => {
	const [error, _setError] = useState('');
	const [success, _setSuccess] = useState('');
	const [close, setClose] = useState(false);
	const setError = useCallback((msg: string) => {
		console.log('setError');
		_setSuccess('');
		setClose(false);
		_setError(msg);
	}, []);
	const setSuccess = useCallback((msg: string) => {
		console.log('setSuccess');
		_setError('');
		setClose(false);
		_setSuccess(msg);
	}, []);

	return (
		<FormMessagingContext.Provider
			value={{ close, error, setClose, setError, setSuccess, success }}
		>
			{children}
		</FormMessagingContext.Provider>
	);
};

export default FormMessagingProvider;

export const useFormMessagingContext = (): FormMessagingContextData => {
	const context = useContext(FormMessagingContext);
	if (!context) {
		throw new Error('useMyContext must be used within a MyProvider');
	}
	return context;
};
