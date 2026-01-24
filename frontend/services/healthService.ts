import axios from 'axios';
import { useConfigStore } from '../stores/configStore';

export interface HealthStatus {
    status: 'UP' | 'DOWN' | 'UNKNOWN';
    service: string;
    timestamp: string;
    checks?: {
        application: { status: string };
        database: { status: string; database?: string; error?: string };
    };
}

const getHealthUrl = (backend: 'java' | 'php'): string => {
    const isProduction = useConfigStore.getState().isProduction();

    if (isProduction) {
        return backend === 'java'
            ? 'https://foka.wi.local:51706/dreamhome/api/health'
            : 'https://foka.wi.local/~s51706/dreamhome-backend/api/health';
    }

    return backend === 'java'
        ? 'http://localhost:8080/api/health'
        : 'http://localhost:8000/api/health';
};

export const checkHealth = async (backend: 'java' | 'php'): Promise<HealthStatus> => {
    const url = getHealthUrl(backend);

    try {
        const config: any = { timeout: 3000 };

        // For PHP production, need withCredentials for Basic Auth
        if (useConfigStore.getState().isProduction() && backend === 'php') {
            config.withCredentials = true;
        }

        const response = await axios.get<HealthStatus>(url, config);
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
