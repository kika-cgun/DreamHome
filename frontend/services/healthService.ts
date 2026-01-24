import axios from 'axios';

export interface HealthStatus {
    status: 'UP' | 'DOWN' | 'UNKNOWN';
    service: string;
    timestamp: string;
    checks?: {
        application: { status: string };
        database: { status: string; database?: string; error?: string };
    };
}

const JAVA_URL = 'http://localhost:8080/api/health';
const PHP_URL = 'http://localhost:8000/api/health';

export const checkHealth = async (backend: 'java' | 'php'): Promise<HealthStatus> => {
    const url = backend === 'java' ? JAVA_URL : PHP_URL;

    try {
        const response = await axios.get<HealthStatus>(url, { timeout: 3000 });
        return response.data;
    } catch {
        return {
            status: 'DOWN',
            service: backend === 'java' ? 'DreamHome Java Backend' : 'DreamHome PHP Backend',
            timestamp: new Date().toISOString(),
        };
    }
};

export const checkBothBackends = async (): Promise<{ java: HealthStatus; php: HealthStatus }> => {
    const [java, php] = await Promise.all([
        checkHealth('java'),
        checkHealth('php'),
    ]);
    return { java, php };
};
