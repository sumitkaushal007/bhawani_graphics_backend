const { validationResult } = require('express-validator');
const crypto = require("crypto");
const { Client, ClientAddress, ClientContactPerson, sequelize } = require('../models');

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


exports.createClient = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Begin transaction
    const t = await sequelize.transaction();

    try {
        const {
            name,
            mobile_number,
            description,
            gst_number,
            client_address,
            contact_persons
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
        if (contact_persons && Array.isArray(contact_persons) && contact_persons.length > 0) {
            const contactPersonsWithClientId = contact_persons.map(person => ({
                ...person,
                client_id: newClient.id
            }));

            await ClientContactPerson.bulkCreate(contactPersonsWithClientId, { transaction: t });
        }

        // Commit transaction
        await t.commit();

        // Fetch the complete client with associations to return in response
        const clientWithAssociations = await Client.findByPk(newClient.id, {
            include: [
                { model: ClientAddress, as: 'address' },
                { model: ClientContactPerson, as: 'contactPersons' }
            ]
        });

        return res.status(201).json({
            message: "Client created successfully",
            data: clientWithAssociations
        });

    } catch (err) {
        // Rollback transaction in case of error
        await t.rollback();
        console.error("Error creating client:", err);
        return res.status(500).json({ message: "Internal server error" });
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