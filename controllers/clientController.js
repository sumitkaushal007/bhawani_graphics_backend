const { validationResult } = require('express-validator');
const crypto = require("crypto");
const { Client, ClientAddress, ClientContactPerson, ClientProduct, sequelize } = require('../models');

// ID generator function inside the same file
function generateClientId(length) {
    const min = 10 ** (length - 1);
    const max = 10 ** length - 1;
    return crypto.randomInt(min, max).toString();
}

exports.getAllClients = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        console.log("Fetching clients with pagination:", { page, limit, offset });

        const { count, rows: clients } = await Client.findAndCountAll({
            limit,
            offset,
            include: [
                { model: ClientAddress, as: 'address' },
                { model: ClientContactPerson, as: 'contactPersons' }
            ],
        });

        const totalPages = Math.ceil(count / limit);

        return res.status(200).json({
            data: clients,
            pagination: {
                totalItems: count,
                currentPage: page,
                totalPages,
                perPage: limit
            }
        });
    } catch (err) {
        console.error("Error fetching clients:", err); // This should log the real reason
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Add this at the top of your controller file
exports.fullTextSearch = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { 
            client_name, 
            contact_no, 
            gst, 
            address, 
            contact_person_name,
            page = 1, 
            limit = 10 
        } = req.query;

        // Validate and sanitize pagination parameters
        const parsedPage = Math.max(1, parseInt(page));
        const parsedLimit = Math.min(Math.max(1, parseInt(limit)), 100);

        // Build WHERE conditions using LIKE instead of FULLTEXT for better compatibility
        const whereConditions = [];
        const replacements = {};

        if (client_name && client_name.trim()) {
            whereConditions.push('c.name LIKE :client_name');
            replacements.client_name = `%${client_name.trim()}%`;
        }
        
        if (contact_no && contact_no.trim()) {
            whereConditions.push('c.mobile_number LIKE :contact_no');
            replacements.contact_no = `%${contact_no.trim().replace(/\D/g, '')}%`;
        }
        
        if (gst && gst.trim()) {
            whereConditions.push('c.gst_number LIKE :gst');
            replacements.gst = `%${gst.trim().toUpperCase().replace(/\s+/g, '')}%`;
        }

        // Handle address search through JOIN
        if (address && address.trim()) {
            whereConditions.push('ca.full_address LIKE :address');
            replacements.address = `%${address.trim()}%`;
        }

        // Handle contact person search through JOIN
        if (contact_person_name && contact_person_name.trim()) {
            whereConditions.push('cp.name LIKE :contact_person_name');
            replacements.contact_person_name = `%${contact_person_name.trim()}%`;
        }

        // Build the main query with proper JOINs
        let fromClause = 'FROM clients c';
        
        // Add JOINs only if needed
        if (address && address.trim()) {
            fromClause += ' LEFT JOIN client_addresses ca ON c.id = ca.client_id';
        }
        
        if (contact_person_name && contact_person_name.trim()) {
            fromClause += ' LEFT JOIN client_contact_persons cp ON c.id = cp.client_id';
        }

        const whereClause = whereConditions.length > 0 ? 
            `WHERE ${whereConditions.join(' AND ')}` : '';

        // Count query
        const countQuery = `
            SELECT COUNT(DISTINCT c.id) as total 
            ${fromClause}
            ${whereClause}
        `;

        const [countResult] = await sequelize.query(countQuery, {
            replacements,
            type: sequelize.QueryTypes.SELECT
        });

        const total = countResult?.total || 0;

        // Main query to get clients with pagination
        const dataQuery = `
            SELECT DISTINCT c.id, c.name, c.mobile_number, c.gst_number, c.description, c.created_at, c.updated_at
            ${fromClause}
            ${whereClause}
            ORDER BY c.created_at DESC
            LIMIT :limit OFFSET :offset
        `;

        replacements.limit = parsedLimit;
        replacements.offset = (parsedPage - 1) * parsedLimit;

        const clients = await sequelize.query(dataQuery, {
            replacements,
            type: sequelize.QueryTypes.SELECT
        });

        // Now fetch related data for each client
        const enrichedClients = await Promise.all(
            clients.map(async (client) => {
                // Fetch address
                const [addresses] = await sequelize.query(
                    'SELECT * FROM client_addresses WHERE client_id = :clientId ORDER BY id ASC LIMIT 1',
                    {
                        replacements: { clientId: client.id },
                        type: sequelize.QueryTypes.SELECT
                    }
                );

                // Fetch contact persons
                const contactPersons = await sequelize.query(
                    'SELECT * FROM client_contact_persons WHERE client_id = :clientId ORDER BY id ASC',
                    {
                        replacements: { clientId: client.id },
                        type: sequelize.QueryTypes.SELECT
                    }
                );

                return {
                    ...client,
                    address: addresses || null,
                    contactPersons: contactPersons || []
                };
            })
        );

        // Return response with matching frontend structure
        return res.json({
            data: enrichedClients,
            pagination: {
                currentPage: parsedPage,    // ✅ Match frontend expectation
                totalPages: Math.ceil(total / parsedLimit),
                perPage: parsedLimit,       // ✅ Match frontend expectation  
                totalItems: total           // ✅ Match frontend expectation
            }
        });

    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({ 
            error: 'Server error occurred during search',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};


exports.createClient = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let t;
    try {
        t = await sequelize.transaction();
        
        const {
            name,
            mobile_number,
            description,
            gst_number,
            client_address,
            contact_persons,
            client_products
        } = req.body;

        // Create client
        const clientObj = {
            client_id: generateClientId(10),
            name,
            mobile_number,
            description,
            gst_number
        };

        const newClient = await Client.create(clientObj, { transaction: t });

        if (!newClient.id) {
            await t.rollback();
            return res.status(500).json({ message: "Failed to create client" });
        }

        // Create client address if provided
        if (client_address) {
            const addressObj = {
                ...client_address,
                client_id: newClient.id
            };
            await ClientAddress.create(addressObj, { transaction: t });
        }

        // Create contact persons if provided
        if (contact_persons?.length > 0) {
            const contactPersonsWithClientId = contact_persons.map(person => ({
                ...person,
                client_id: newClient.id
            }));
            await ClientContactPerson.bulkCreate(contactPersonsWithClientId, { transaction: t });
        }

        // Create client products if provided
        if (client_products?.length > 0) {
            const productsWithClientId = client_products.map(product => ({
                ...product,
                client_id: newClient.id,
                created_at: sequelize.literal('CURRENT_TIMESTAMP'),
                updated_at: sequelize.literal('CURRENT_TIMESTAMP')
            }));
            
            // Changed from bulkCreate to individual creates
            for (const product of productsWithClientId) {
                await ClientProduct.create(product, { transaction: t });
            }
        }

        await t.commit();

        // Fetch the complete client with associations
        const clientWithAssociations = await Client.findByPk(newClient.id, {
            include: [
                { model: ClientAddress, as: 'address' },
                { model: ClientContactPerson, as: 'contactPersons' },
                { model: ClientProduct, as: 'products' }
            ]
        });

        return res.status(201).json({
            message: "Client created successfully",
            data: clientWithAssociations
        });

    } catch (err) {
        // Only rollback if transaction exists and hasn't been committed
        if (t && !t.finished) {
            await t.rollback();
        }
        console.error("Error creating client:", err);
        return res.status(500).json({ 
            message: "Internal server error",
            error: err.message // Include error message for debugging
        });
    }
};

exports.getClientById = async (req, res) => {
    try {
        const clientId = req.params.id;

        const client = await Client.findByPk(clientId, {
            include: [
                { model: ClientAddress, as: 'address' },
                { model: ClientContactPerson, as: 'contactPersons' }
            ]
        });

        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        return res.status(200).json({ data: client });
    } catch (err) {
        console.error("Error fetching client by ID:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateClient = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Begin transaction
    const t = await sequelize.transaction();

    try {
        const clientId = req.params.id;
        const {
            name,
            mobile_number,
            description,
            gst_number,
            client_address,
            contact_persons
        } = req.body;

        // Find client
        const client = await Client.findByPk(clientId);
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        // Update client basic info
        await client.update({
            name: name || client.name,
            mobile_number: mobile_number || client.mobile_number,
            description: description !== undefined ? description : client.description,
            gst_number: gst_number !== undefined ? gst_number : client.gst_number
        }, { transaction: t });

        // Handle client address update (delete old and create new)
        if (client_address) {
            // Delete existing address
            await ClientAddress.destroy({
                where: { client_id: clientId },
                transaction: t
            });

            // Create new address
            const addressObj = {
                ...client_address,
                client_id: clientId
            };

            await ClientAddress.create(addressObj, { transaction: t });
        }

        // Handle contact persons update (delete old and create new)
        if (contact_persons && Array.isArray(contact_persons)) {
            // Delete existing contact persons
            await ClientContactPerson.destroy({
                where: { client_id: clientId },
                transaction: t
            });

            // Create new contact persons if the array is not empty
            if (contact_persons.length > 0) {
                const contactPersonsWithClientId = contact_persons.map(person => ({
                    ...person,
                    client_id: clientId
                }));

                await ClientContactPerson.bulkCreate(contactPersonsWithClientId, { transaction: t });
            }
        }

        // Commit transaction
        await t.commit();

        // Fetch the updated client with associations to return in response
        const updatedClient = await Client.findByPk(clientId, {
            include: [
                { model: ClientAddress, as: 'address' },
                { model: ClientContactPerson, as: 'contactPersons' }
            ]
        });

        return res.status(200).json({
            message: "Client updated successfully",
            data: updatedClient
        });

    } catch (err) {
        // Rollback transaction in case of error
        await t.rollback();
        console.error("Error updating client:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteClient = async (req, res) => {
    // Begin transaction
    const t = await sequelize.transaction();

    try {
        const clientId = req.params.id;

        // Find client first to check if it exists
        const client = await Client.findByPk(clientId);
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        // Delete related records first to maintain referential integrity
        // Delete client address
        await ClientAddress.destroy({
            where: { client_id: clientId },
            transaction: t
        });

        // Delete contact persons
        await ClientContactPerson.destroy({
            where: { client_id: clientId },
            transaction: t
        });

        // Delete the client
        await Client.destroy({
            where: { id: clientId },
            transaction: t
        });

        // Commit transaction
        await t.commit();

        return res.status(200).json({
            message: "Client deleted successfully"
        });

    } catch (err) {
        // Rollback transaction in case of error
        await t.rollback();
        console.error("Error deleting client:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};