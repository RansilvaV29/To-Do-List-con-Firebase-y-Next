import type { NextApiRequest, NextApiResponse } from 'next';

const API_URL = 'http://localhost:5000/to-do-list-7a4b6/us-central1/app';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method, query: { id }, body } = req;

    switch (method) {
        case 'GET':
            try {
                const response = await fetch(`${API_URL}/api/tareas/${id}`);
                const data = await response.json();
                res.status(200).json(data);
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch task' });
            }
            break;
        case 'PUT':
            try {
                const response = await fetch(`${API_URL}/api/tareas/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                });
                res.status(200).json(await response.json());
            } catch (error) {
                res.status(500).json({ error: 'Failed to update task' });
            }
            break;
        case 'DELETE':
            try {
                const response = await fetch(`${API_URL}/api/tareas/${id}`, {
                    method: 'DELETE',
                });
                res.status(200).json(await response.json());
            } catch (error) {
                res.status(500).json({ error: 'Failed to delete task' });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
