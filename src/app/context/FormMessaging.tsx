import {
	useFormMessagingContext,
	type FormMessagingContextData,
} from './FormMessagingProvider';

export default function FormMessaging() {
	const { close, error, setClose, success }: FormMessagingContextData =
		useFormMessagingContext();

	const jsx = true && (
		<div className="fixed top-0  left-1/2 transform -translate-x-1/2 z-50">
			<div
				className={`alert alert-${error?.length ? 'error' : 'success'} my-6 text-white font-bold shadow-xl`}
			>
				<button
					className="btn btn-xs text-xs text-white x"
					onClick={() => setClose(true)}
					type="button"
				/>
				<span>{error?.length ? error : success}</span>
			</div>
		</div>
	);

	if (close) return null;

	if (!error && !success) return null;

	if (error || success) return jsx;
}
