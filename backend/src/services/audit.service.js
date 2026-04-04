import { AuditLog } from "../models/AuditLog.models.js";

/**
 * createAuditLog: Utility to record a system action.
 * Designed to be called non-blocking (without 'await' in main path) for speed.
 */
export const createAuditLog = async ({
  userId,
  merchantId,
  action,
  resourceId,
  resourceType,
  metadata = {},
  req = null // Pass request object to capture network context
}) => {
  try {
    const logEntry = new AuditLog({
      userId,
      merchantId,
      action,
      resourceId,
      resourceType,
      metadata,
      ipAddress: req?.ip || req?.headers?.['x-forwarded-for'],
      userAgent: req?.headers?.['user-agent']
    });

    await logEntry.save();
    return logEntry;
  } catch (error) {
    // We log to console here so the error doesn't crash the main process
    console.error(`[Audit Log Error]: Failed to record ${action}. Exception:`, error.message);
  }
};

/**
 * getMerchantAuditLogs: Fetches the activity feed for a specific shop.
 */
export const getMerchantAuditLogs = async (merchantId, filters = {}) => {
  const { page = 1, limit = 20, action } = filters;

  const query = { merchantId };
  if (action) query.action = action;

  return await AuditLog.find(query)
    .populate("userId", "fullname phone role") // Show who did the action
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
};

