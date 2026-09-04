const { Report } = require('../models');
const { ApiError } = require('../middleware/errorHandler');

const submitReport = async (req, res, next) => {
  try {
    const { report_type, target_entity, description } = req.body;
    if (!report_type || !target_entity || !description) {
      throw new ApiError(400, 'report_type, target_entity, and description are required');
    }

    const reportId = `rep_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    const report = await Report.create({
      _id: reportId,
      user_id: req.user.userId,
      report_type,
      report_status: 'OPEN',
      target_entity,
      description,
    });

    res.status(201).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

const getOpenReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ report_status: { $in: ['OPEN', 'INVESTIGATING'] } }).sort('-created_at');
    res.status(200).json({
      success: true,
      data: { reports },
    });
  } catch (error) {
    next(error);
  }
};

const resolveReport = async (req, res, next) => {
  try {
    const { report_status, resolution_notes } = req.body;

    const report = await Report.findById(req.params.id);
    if (!report) {
      throw new ApiError(404, 'Report not found');
    }

    report.report_status = report_status || 'RESOLVED';
    report.resolution_notes = resolution_notes || null;
    report.resolved_by = req.user.userId;
    report.resolved_at = new Date();
    await report.save();

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitReport,
  getOpenReports,
  resolveReport,
};
