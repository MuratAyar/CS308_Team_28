#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Define the path to the .env file
const envPath = path.join(__dirname, '.env');

// Default environment variables
const envVars = {
  PORT: '8080',
  NODE_ENV: 'development',
  MONGODB_URI: 'mongodb+srv://mertsaglam349:Mert2003@mern.pmbfe.mongodb.net/',
  JWT_SECRET: 'your_jwt_secret_key_twoeight_secure',
  JWT_EXPIRY: '7d',
  EMAIL_USER: 'twoeight.mail@gmail.com',
  EMAIL_PASS: '',
  CORS_ORIGIN: 'http://localhost:5173',
  API_URL: 'http://localhost:8080',
  UPLOAD_DIR: './uploads',
  INVOICE_DIR: './invoices',
  IMAGE_DIR: './images'
};

// Check if the .env file already exists
if (fs.existsSync(envPath)) {
  console.log('.env file already exists. Do you want to overwrite it? (yes/no)');
  rl.question('', (answer) => {
    if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
      createEnvFile();
    } else {
      console.log('Setup cancelled. Existing .env file was not modified.');
      rl.close();
    }
  });
} else {
  createEnvFile();
}

function createEnvFile() {
  askQuestions(0, Object.keys(envVars), () => {
    // Generate the .env file content
    let envFileContent = '';
    
    // Add Server Configuration
    envFileContent += '# Server Configuration\n';
    envFileContent += `PORT=${envVars.PORT}\n`;
    envFileContent += `NODE_ENV=${envVars.NODE_ENV}\n\n`;
    
    // Add MongoDB Connection
    envFileContent += '# MongoDB Connection\n';
    envFileContent += `MONGODB_URI=${envVars.MONGODB_URI}\n\n`;
    
    // Add JWT Authentication
    envFileContent += '# JWT Authentication\n';
    envFileContent += `JWT_SECRET=${envVars.JWT_SECRET}\n`;
    envFileContent += `JWT_EXPIRY=${envVars.JWT_EXPIRY}\n\n`;
    
    // Add Email Configuration
    envFileContent += '# Email Configuration (Gmail)\n';
    envFileContent += `EMAIL_USER=${envVars.EMAIL_USER}\n`;
    envFileContent += `EMAIL_PASS=${envVars.EMAIL_PASS}\n\n`;
    
    // Add CORS Configuration
    envFileContent += '# CORS Configuration\n';
    envFileContent += `CORS_ORIGIN=${envVars.CORS_ORIGIN}\n\n`;
    
    // Add API Configuration
    envFileContent += '# API Configuration\n';
    envFileContent += `API_URL=${envVars.API_URL}\n\n`;
    
    // Add File Storage Configuration
    envFileContent += '# File Storage\n';
    envFileContent += `UPLOAD_DIR=${envVars.UPLOAD_DIR}\n`;
    envFileContent += `INVOICE_DIR=${envVars.INVOICE_DIR}\n`;
    envFileContent += `IMAGE_DIR=${envVars.IMAGE_DIR}\n`;
    
    // Write the .env file
    fs.writeFileSync(envPath, envFileContent);
    
    console.log('\n.env file has been created successfully!');
    console.log(`File location: ${envPath}`);
    
    // Close the readline interface
    rl.close();
  });
}

function askQuestions(index, keys, callback) {
  if (index >= keys.length) {
    callback();
    return;
  }
  
  const key = keys[index];
  
  // Skip asking about some variables
  if (key === 'NODE_ENV' || key === 'UPLOAD_DIR' || key === 'INVOICE_DIR' || key === 'IMAGE_DIR') {
    askQuestions(index + 1, keys, callback);
    return;
  }
  
  rl.question(`Enter ${key} (default: ${envVars[key]}): `, (answer) => {
    // If the user provided a value, update the default
    if (answer.trim() !== '') {
      envVars[key] = answer.trim();
    }
    
    // Move to the next question
    askQuestions(index + 1, keys, callback);
  });
}
