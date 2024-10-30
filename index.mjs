import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { generate } from './utils.js';

dotenv.config();

const app = express();
app.use(express.json());

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

/**
 * Handles the generation of combinations based on input items and length.
 * This function processes incoming POST requests to the '/generate' endpoint, validates input,
 * generates valid combinations of items, and stores them in a MySQL database.
 *
 * @param {Object} req - The request object containing the following properties:
 *   @param {Array<number>} req.body.items - An array where each element represents
 *   the number of items corresponding to prefixes.
 *   @param {number} req.body.length - The length of the combinations to generate.
 *
 * @param {Object} res - The response object used to send responses back to the client.
 *
 * The function performs the following actions:
 * 1. Validates the request body to ensure both items and length are provided.
 * 2. Establishes a connection to the MySQL database and begins a transaction.
 * 3. Calls the utility function to generate valid combinations of items.
 * 4. Inserts each item from the generated combinations into the 'items' table.
 * 5. Inserts the generated combinations into the 'combinations' table and retrieves its unique ID.
 * 6. Stores the response containing the ID and combinations in the 'responses' table.
 * 7. Commits the transaction if all operations succeed; rolls back if any error occurs.
 * 8. Sends a JSON response back to the client with the unique ID and the generated combinations.
 * 9. Handles errors by logging them and returning an appropriate error response.
 */

app.post('/generate', async (req, res) => {
    const { items, length } = req.body;

    if (!items || !length) {
        return res.status(400).json({ error: 'Invalid payload' });
    }

    let connection;

    try {
        const combinations = generate(items, length);

        connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction();

        try {
            for (const item of combinations.flat()) {
                await connection.execute('INSERT INTO items (name) VALUES (?)', [item]);
            }

            const [combinationResult] = await connection.execute('INSERT INTO combinations (combination) VALUES (?)', [JSON.stringify(combinations)]);
            const combinationId = combinationResult.insertId;

            await connection.execute('INSERT INTO responses (response) VALUES (?)', [JSON.stringify({ id: combinationId, combination: combinations })]);

            await connection.commit();
            res.json({ id: combinationId, combination: combinations }); // Send response
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error', details: error.message });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
