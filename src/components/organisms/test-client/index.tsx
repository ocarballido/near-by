'use client';

import Alert from '@/components/molecules/alert';

const TestClient = () => {
	return (
		<div>
			<Alert
				title="Alert title"
				open={true}
				type="info"
				message="This is the alert message, in case you wonder what I will be rendering"
				dismissible
				onClose={() => console.log('ooooo')}
				onLeave={() => console.log('aaaa')}
			/>
		</div>
	);
};

export default TestClient;
