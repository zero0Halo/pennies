import type React from 'react';
import { createContext, useContext, useState, type ReactNode } from 'react';

// Define the shape of the context
interface MyContextType {
	value: string;
	setValue: (newValue: string) => void;
}

// Create the context with a default value
const MyContext = createContext<MyContextType | undefined>(undefined);

// Create a provider component
interface MyProviderProps {
	children: ReactNode;
}

export const MyProvider: React.FC<MyProviderProps> = ({ children }) => {
	const [value, setValue] = useState<string>('default');

	return (
		<MyContext.Provider value={{ value, setValue }}>
			{children}
		</MyContext.Provider>
	);
};

// Custom hook to use the context
export const useMyContext = (): MyContextType => {
	const context = useContext(MyContext);
	if (!context) {
		throw new Error('useMyContext must be used within a MyProvider');
	}
	return context;
};
