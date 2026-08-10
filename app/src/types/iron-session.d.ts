declare module "iron-session" {
	import type { IncomingMessage, ServerResponse } from "http";

	interface SessionOptions {
		cookieName?: string;
		password: string;
		cookieOptions?: {
			maxAge?: number;
			secure?: boolean;
			httpOnly?: boolean;
			sameSite?: "lax" | "strict" | "none";
			path?: string;
			domain?: string;
		};
	}

	interface SessionData {
		[key: string]: any;
	}

	interface Session {
		get<T = any>(key: string): T | undefined;
		set<T = any>(key: string, value: T): void;
		delete(key: string): void;
		save(): Promise<void>;
		destroy(): Promise<void>;
		data: SessionData;
	}

	type IronSession = Session;

	function ironSession<T extends SessionData = SessionData>(
		options: SessionOptions,
	): (req: IncomingMessage, res: ServerResponse) => Promise<Session & T>;

	export {
		ironSession,
		type Session,
		type SessionOptions,
		type SessionData,
		type IronSession,
	};
	export default ironSession;
}
