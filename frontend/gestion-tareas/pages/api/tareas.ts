import type { NextApiRequest, NextApiResponse } from 'next';

const API_URL = 'http://localhost:5000/to-do-list-7a4b6/us-central1/app';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method, body } = req;

    switch (method) {
        case 'GET':
            try {
                const response = await fetch(`${API_URL}/api/tareas`);
                const data = await response.json();
                res.status(200).json(data);
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch tasks' });
            }
            break;
        case 'POST':
            try {
                const response = await fetch(`${API_URL}/api/tareas`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                });
                res.status(201).json(await response.json());
            } catch (error) {
                res.status(500).json({ error: 'Failed to create task' });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
