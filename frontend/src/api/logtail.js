import { Logtail } from '@logtail/browser';

const sourceToken = import.meta.env.VITE_LOGTAIL_SOURCE_TOKEN || 'bE2dr2UfXL6uYAQ7FV7Akj7z';
const customEndpoint = import.meta.env.VITE_LOGTAIL_ENDPOINT || 'https://s2652046.eu-central-1a.betterstackdata.com';
const isProd = import.meta.env.PROD;

export const logtail = sourceToken !== 'ctn_betterstack_token' ? new Logtail(sourceToken, { endpoint: customEndpoint }) : null;

export const logAdminAction = (action, metadata = {}) => {
  const payload = {
    timestamp: new Date().toISOString(),
    system: 'Club-Trai-Nghiem-SuperAdmin',
    environment: isProd ? 'production' : 'development',
    action,
    ...metadata,
  };

  if (logtail) {
    logtail.info(`[ADMIN_AUDIT] ${action}`, payload);
    fetch(customEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sourceToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: `[ADMIN_AUDIT] ${action}`, ...payload }),
    }).catch(() => {});
  }

  console.log(`🛡️ [Better Stack Logtail] ${action}:`, payload);
  return payload;
};

export const logCrudEvent = (entity, operation, targetId, changes = {}) => {
  const payload = {
    timestamp: new Date().toISOString(),
    entity,
    operation,
    targetId,
    changes,
  };

  if (logtail) {
    logtail.info(`[CRUD_${operation.toUpperCase()}] on ${entity} (#${targetId})`, payload);
    fetch(customEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sourceToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: `[CRUD_${operation.toUpperCase()}] on ${entity} (#${targetId})`, ...payload }),
    }).catch(() => {});
  }

  console.log(`📝 [Better Stack Logtail CRUD] ${operation} ${entity} #${targetId}:`, changes);
  return payload;
};

export const logSystemWarning = (message, error = null) => {
  const payload = {
    timestamp: new Date().toISOString(),
    message,
    error: error ? error.toString() : null,
  };

  if (logtail) {
    logtail.warn(`[SYSTEM_ALERT] ${message}`, payload);
    fetch(customEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sourceToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: `[SYSTEM_ALERT] ${message}`, level: 'warn', ...payload }),
    }).catch(() => {});
  }

  console.warn(`🚨 [Better Stack Logtail ALERT] ${message}`, payload);
  return payload;
};

export default {
  logtail,
  logAdminAction,
  logCrudEvent,
  logSystemWarning,
};
