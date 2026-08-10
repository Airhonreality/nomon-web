declare module "neon" {
	import { Pool, PoolClient, type QueryResult, type QueryResultRow } from "pg";

	interface NeonConfig {
		connectionString: string;
		fetchOptions?: RequestInit;
	}

	interface NeonClient {
		query: <T extends QueryResultRow = any>(
			text: string,
			params?: any[],
		) => Promise<QueryResult<T>>;
		queryArray: <T = any>(text: string, params?: any[]) => Promise<T[]>;
		release: () => void;
	}

	function neon(connectionString: string): NeonClient;

	export { neon, type NeonClient, type NeonConfig };
	export default neon;
}
