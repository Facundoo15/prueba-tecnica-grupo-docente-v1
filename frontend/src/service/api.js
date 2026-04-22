const API_URL = '/api/appointments';

export const appointmentService = {
    async getAll(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_URL}?${queryParams}`);
        if (!response.ok) throw new Error('Error al obtener citas');
        return response.json();
    },

    async create(data) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!response.ok) throw result;
        return result;
    },

    async update(id, data) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!response.ok) throw result;
        return result;
    },

    async delete(id) {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            const result = await response.json();
            throw result;
        }
        return true;
    }
};