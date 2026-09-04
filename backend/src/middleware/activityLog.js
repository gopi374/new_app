const { ActivityLog } = require('../models');

const logActivity = (action, entityType = null, getEntityId = null) => {
  return async (req, res, next) => {
    // Intercept response finish to log after request is handled
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        try {
          const userId = req.user ? req.user.userId : null;
          const entityId = typeof getEntityId === 'function' ? getEntityId(req) : (req.params.id || null);
          
          await ActivityLog.create({
            _id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            user_id: userId,
            action,
            entity_type: entityType,
            entity_id: entityId,
            metadata: {
              method: req.method,
              url: req.originalUrl,
              params: req.params,
              query: req.query,
            },
            ip_address: req.ip || req.connection.remoteAddress || null,
            user_agent: req.get('user-agent') || null,
          });
        } catch (err) {
          console.error('[ActivityLog] Best-effort logging failed:', err);
        }
      }
    });
    next();
  };
};

module.exports = { logActivity };
