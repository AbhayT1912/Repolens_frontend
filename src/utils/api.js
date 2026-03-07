const API_URL = import.meta.env.VITE_API_URL;

class ApiClient {
    constructor() {
        this.listeners = new Set();
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify(data) {
        this.listeners.forEach(l => l(data));
    }

    async request(endpoint, options = {}) {
        const url = `${API_URL}${endpoint}`;
        const startTime = Date.now();

        try {
            // 🔐 GET CLERK TOKEN
            let token = null;

            if (window.Clerk && window.Clerk.session) {
                token = await window.Clerk.session.getToken();
            }

            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                    ...options.headers,
                },
            });

            const data = await response.json();
            const duration = Date.now() - startTime;

            this.notify({
                timestamp: new Date().toLocaleTimeString(),
                endpoint,
                method: options.method || 'GET',
                status: response.status,
                requestData: options.body ? JSON.parse(options.body) : null,
                responseData: data,
                duration,
                success: response.ok
            });

            if (!response.ok) {
                const error = new Error(data.message || `API Error: ${response.status}`);
                error.status = response.status;
                throw error;
            }

            return data;
        } catch (error) {
            this.notify({
                timestamp: new Date().toLocaleTimeString(),
                endpoint,
                method: options.method || 'GET',
                status: error.status || 'ERROR',
                error: error.message,
                success: false
            });
            throw error;
        }
    }

    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    async post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async patch(endpoint, body) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    }

    async download(endpoint, fallbackFilename = 'repo-report.pdf') {
        const url = `${API_URL}${endpoint}`;
        const startTime = Date.now();

        try {
            let token = null;
            if (window.Clerk && window.Clerk.session) {
                token = await window.Clerk.session.getToken();
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            const duration = Date.now() - startTime;

            if (!response.ok) {
                let message = `Download failed: ${response.status}`;
                try {
                    const data = await response.json();
                    message = data?.message || message;
                } catch (_) {
                    // ignore non-json body
                }

                this.notify({
                    timestamp: new Date().toLocaleTimeString(),
                    endpoint,
                    method: 'GET',
                    status: response.status,
                    error: message,
                    success: false,
                    duration,
                });

                const error = new Error(message);
                error.status = response.status;
                throw error;
            }

            const blob = await response.blob();
            const disposition = response.headers.get('content-disposition') || '';
            const filenameMatch = disposition.match(/filename="?([^"]+)"?/i);
            const filename = filenameMatch?.[1] || fallbackFilename;

            const blobUrl = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = blobUrl;
            anchor.download = filename;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            window.URL.revokeObjectURL(blobUrl);

            this.notify({
                timestamp: new Date().toLocaleTimeString(),
                endpoint,
                method: 'GET',
                status: response.status,
                responseData: { downloaded: true, filename },
                success: true,
                duration,
            });
        } catch (error) {
            this.notify({
                timestamp: new Date().toLocaleTimeString(),
                endpoint,
                method: 'GET',
                status: error.status || 'ERROR',
                error: error.message,
                success: false,
            });
            throw error;
        }
    }
}

export const api = new ApiClient();
