// controllers/search.controller.js
const { Sequelize } = require('sequelize');
const db = require('../models');

// Use the correct model names as defined in your models
const Products = db.Products;  // Use plural as defined in model
const Client = db.Client;

const getSearchSuggestions = async (req, res) => {
  try {
    // Enhanced debug logging
    console.log('=== Search Debug Info ===');
    console.log('Available models in db:', Object.keys(db));
    console.log('Products model exists:', !!Products);
    console.log('Client model exists:', !!Client);
    console.log('Query params:', req.query);
    
    if (!Products || !Client) {
      console.error('Models not properly initialized:', {
        Products: !!Products,
        Client: !!Client,
        availableModels: Object.keys(db)
      });
      throw new Error('Models not properly initialized');
    }

    const { query, type } = req.query;
    const searchQuery = `${query}%`;
    
    console.log('Search parameters:', { query, type, searchQuery });
    
    let results = [];
    
    if (type === 'product') {
      console.log('Executing product search...');
      
      // Test if we can access the model at all
      const productCount = await Products.count();
      console.log('Total products in database:', productCount);
      
      // Execute the search
      results = await Products.findAll({
        where: {
          name: {
            [Sequelize.Op.like]: searchQuery
          }
        },
        attributes: ['id', 'product_id', 'name', 'brand'],
        limit: 10,
        raw: true // Add raw: true for debugging
      });
      
      console.log('Product search results:', results);
      
    } else if (type === 'client') {
      console.log('Executing client search...');
      
      const clientCount = await Client.count();
      console.log('Total clients in database:', clientCount);
      
      results = await Client.findAll({
        where: {
          [Sequelize.Op.or]: [
            { name: { [Sequelize.Op.like]: searchQuery } },
            { mobile_number: { [Sequelize.Op.like]: searchQuery } }
          ]
        },
        attributes: ['id', 'client_id', 'name', 'mobile_number'],
        limit: 10,
        raw: true
      });
      
      console.log('Client search results:', results);
    }
    
    console.log('Final results being sent:', results);
    
    res.json({
      success: true,
      data: results,
      debug: process.env.NODE_ENV === 'development' ? {
        totalResults: results.length,
        searchQuery,
        type
      } : undefined
    });
    
  } catch (error) {
    console.error('Search error details:', {
      message: error.message,
      stack: error.stack,
      modelsAvailable: {
        Products: !!Products,
        Client: !!Client,
        allModels: Object.keys(db)
      },
      queryParams: req.query
    });
    
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        availableModels: Object.keys(db)
      } : undefined
    });
  }
};      

module.exports = {
  getSearchSuggestions
};