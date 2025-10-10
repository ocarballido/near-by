import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types';

export enum ClientType {
	SERVER = 'server',
	SPA = 'spa',
}

type SupabaseLike = {
	auth: SupabaseClient<Database>['auth'];
	storage: SupabaseClient<Database>['storage'];
	from: SupabaseClient<Database>['from'];
};

export class SassClient {
	private client: SupabaseLike;
	private clientType: ClientType;

	constructor(client: SupabaseLike, clientType: ClientType) {
		this.client = client;
		this.clientType = clientType;
	}
	// private client: SupabaseClient<Database, 'public', Database['public']>;
	// private clientType: ClientType;

	// constructor(
	// 	client: SupabaseClient<Database, 'public', Database['public']>,
	// 	clientType: ClientType
	// ) {
	// 	this.client = client;
	// 	this.clientType = clientType;
	// }

	// private client: SupabaseClientCompat;
	// private clientType: ClientType;

	// constructor(client: SupabaseClientCompat, clientType: ClientType) {
	// 	this.client = client;
	// 	this.clientType = clientType;
	// }

	async loginEmail(email: string, password: string) {
		return this.client.auth.signInWithPassword({
			email: email,
			password: password,
		});
	}

	async registerEmail(email: string, password: string) {
		const { data, error } = await this.client.auth.signUp({
			email,
			password,
		});
		if (error) return { data: null, error };

		// 2. Si salió bien, pedimos creación de la subscripción
		// const userId = data.user?.id;
		// if (userId) {
		// 	fetch('/api/subscription/create-subscription', {
		// 		method: 'POST',
		// 		headers: { 'Content-Type': 'application/json' },
		// 		body: JSON.stringify({ userId }),
		// 	}).catch((e) => {
		// 		console.error('No se pudo crear la suscripción:', e);
		// 	});
		// }

		return { data, error: null };
	}

	async signInWithMagicLink(email: string) {
		const { data, error } = await this.client.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${
					typeof window !== 'undefined' ? window.location.origin : ''
				}/auth/callback?redirect=/app`,
			},
		});

		return { data, error };
	}

	async exchangeCodeForSession(code: string) {
		return this.client.auth.exchangeCodeForSession(code);
	}

	async resendVerificationEmail(email: string) {
		return this.client.auth.resend({
			email: email,
			type: 'signup',
		});
	}

	async logout() {
		const { error } = await this.client.auth.signOut({
			scope: 'local',
		});
		if (error) throw error;
		if (this.clientType === ClientType.SPA) {
			window.location.href = '/';
		}
	}

	async uploadFile(myId: string, filename: string, file: File) {
		filename = filename.replace(/[^0-9a-zA-Z!\-_.*'()]/g, '_');
		filename = myId + '/' + filename;
		return this.client.storage.from('files').upload(filename, file);
	}

	async getFiles(myId: string) {
		return this.client.storage.from('files').list(myId);
	}

	async deleteFile(myId: string, filename: string) {
		filename = myId + '/' + filename;
		return this.client.storage.from('files').remove([filename]);
	}

	async shareFile(
		myId: string,
		filename: string,
		timeInSec: number,
		forDownload: boolean = false
	) {
		filename = myId + '/' + filename;
		return this.client.storage
			.from('files')
			.createSignedUrl(filename, timeInSec, {
				download: forDownload,
			});
	}

	getSupabaseClient() {
		return this.client;
	}
}
