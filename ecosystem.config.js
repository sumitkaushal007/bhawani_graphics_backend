module.exports = {
    apps : [{
      name   : "bhawani_graphics_backend",
      script : "./server.js",
      watch : false,
      error_file: './pm2log/err.log',
      out_file: './pm2log/out.log',
      log_file: './pm2log/combined.log',
      time: true,
      autorestart: true,
      log_date_format: "YYYY-MM-DD HH:mm Z",
      env_dev : {
        "NODE_ENV": "dev"
      },  
      env_prod : {
        "NODE_ENV": "production"
      }
    }]
  }