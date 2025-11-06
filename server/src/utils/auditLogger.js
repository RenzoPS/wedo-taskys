const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../../audit.log');

const logAudit = (operation, entity, entityId, userId, details = {}) => {
    const now = new Date();
    const date = now.toLocaleDateString('es-AR');
    const time = now.toLocaleTimeString('es-AR', { hour12: false });
    const timestamp = `${date} ${time}`;
    
    const logLine = `[${timestamp}] ${operation} ${entity} | ID: ${entityId} | User: ${userId} | Details: ${JSON.stringify(details)}\n`;
    
    fs.appendFile(LOG_FILE, logLine, (err) => {
        if (err) console.error('Error escribiendo en audit.log:', err);
    });
};

module.exports = { logAudit };
