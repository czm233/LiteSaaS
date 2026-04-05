const JWT_SECRET = process.env.JWT_SECRET || 'litesaas-jwt-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export { JWT_SECRET, JWT_EXPIRES_IN };
