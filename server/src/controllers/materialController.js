import {
  createSubmission,
  getSubmissions,
  getSubmissionById as dbGetSubmissionById,
  reviewSubmission as dbReviewSubmission,
  updateSubmission as dbUpdateSubmission,
  deleteSubmission as dbDeleteSubmission,
} from '../db.js';
import {
  isSupabaseConfigured,
  supabaseCreateSubmission,
  supabaseGetSubmissions,
  supabaseGetSubmissionById,
  supabaseReviewSubmission,
  supabaseUpdateSubmission,
  supabaseDeleteSubmission,
} from '../db/supabase.js';
import { uploadFileToR2, deleteFileFromR2 } from '../storage/r2.js';
import { sendMaterialUploadConfirmation, sendMaterialStatusEmail } from '../services/emailService.js';

// -------------------------------------------------------------
// POST /api/materials/upload - Student Material Upload
// -------------------------------------------------------------
export async function uploadMaterial(req, res) {
  try {
    const {
      courseCode,
      title,
      college,
      department,
      level,
      semester,
      category,
      fileName,
      fileSize,
      fileType,
      authorName,
      authorEmail,
      university,
    } = req.body;

    const resolvedFileName = req.file?.originalname || fileName;
    if (!courseCode || !title || !college || !department || !level || !semester || !category || !resolvedFileName) {
      return res.status(400).json({ error: 'All material fields and target demarcations are required.' });
    }

    let fileUrl = null;
    let fileKey = null;
    let storageProvider = 'local_disk';

    if (req.file) {
      const uploadResult = await uploadFileToR2({
        buffer: req.file.buffer,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        folder: `${college.toLowerCase()}/${courseCode.toLowerCase()}`,
      });
      fileUrl = uploadResult.fileUrl;
      fileKey = uploadResult.fileKey;
      storageProvider = uploadResult.storageProvider;
    }

    const submissionData = {
      userId: req.user?.id || 'guest',
      authorName: req.user?.name || authorName || 'Anonymous Student',
      authorEmail: req.user?.email || authorEmail || '',
      courseCode: courseCode.trim().toUpperCase(),
      title: title.trim(),
      university: university || req.user?.university || 'FUNAAB',
      college: college.trim().toUpperCase(),
      department: department.trim(),
      level: String(level).trim(),
      semester: semester.trim(),
      category: category.trim(),
      fileName: resolvedFileName.trim(),
      fileSize: req.file ? `${(req.file.size / (1024 * 1024)).toFixed(1)} MB` : (fileSize || '2.4 MB'),
      fileType: req.file?.mimetype || fileType || 'application/pdf',
      fileUrl,
      fileKey,
      storageProvider,
      reviewNotes: 'Awaiting faculty verification.',
    };

    let submission = createSubmission(submissionData);

    if (isSupabaseConfigured()) {
      const sbSub = await supabaseCreateSubmission(submission);
      if (sbSub) submission = { ...submission, ...sbSub };
    }

    // Send confirmation email to student contributor if email is available
    if (submissionData.authorEmail) {
      sendMaterialUploadConfirmation({
        to: submissionData.authorEmail,
        name: submissionData.authorName,
        courseCode: submissionData.courseCode,
        title: submissionData.title,
        college: submissionData.college,
        department: submissionData.department,
      }).catch((err) => console.error('[EMAIL DISPATCH ERROR]', err));
    }

    res.status(201).json({
      message: 'Study material uploaded successfully. Sent to administrative desk for review.',
      submission,
    });
  } catch (err) {
    console.error('[MATERIAL UPLOAD ERROR]', err);
    res.status(500).json({ error: 'Failed to process material upload.' });
  }
}

// -------------------------------------------------------------
// POST /api/admin/materials/upload - Admin Direct Upload (Auto-Approved)
// -------------------------------------------------------------
export async function adminUploadMaterial(req, res) {
  try {
    const {
      courseCode,
      title,
      college,
      department,
      level,
      semester,
      category,
      fileName,
      fileSize,
      fileType,
      authorName,
      authorEmail,
      university,
    } = req.body;

    const resolvedFileName = req.file?.originalname || fileName;
    if (!courseCode || !title || !college || !department || !level || !semester || !category || !resolvedFileName) {
      return res.status(400).json({ error: 'All material fields are required.' });
    }

    let fileUrl = null;
    let fileKey = null;
    let storageProvider = 'local_disk';

    if (req.file) {
      const uploadResult = await uploadFileToR2({
        buffer: req.file.buffer,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        folder: `${college.toLowerCase()}/${courseCode.toLowerCase()}`,
      });
      fileUrl = uploadResult.fileUrl;
      fileKey = uploadResult.fileKey;
      storageProvider = uploadResult.storageProvider;
    }

    const submissionData = {
      userId: req.user?.id || 'usr_admin_1',
      authorName: req.user?.name || authorName || 'Institutional Administrator',
      authorEmail: req.user?.email || authorEmail || 'admin@funaab.edu.ng',
      courseCode: courseCode.trim().toUpperCase(),
      title: title.trim(),
      university: university || req.user?.university || 'FUNAAB',
      college: college.trim().toUpperCase(),
      department: department.trim(),
      level: String(level).trim(),
      semester: semester.trim(),
      category: category.trim(),
      fileName: resolvedFileName.trim(),
      fileSize: req.file ? `${(req.file.size / (1024 * 1024)).toFixed(1)} MB` : (fileSize || '3.2 MB'),
      fileType: req.file?.mimetype || fileType || 'application/pdf',
      fileUrl,
      fileKey,
      storageProvider,
      status: 'approved', // Auto-approved directly!
      reviewedBy: 'Administrator',
      reviewedAt: new Date().toISOString(),
      reviewNotes: 'Directly verified and published to repository by Administrator.',
    };

    let submission = createSubmission(submissionData);

    if (isSupabaseConfigured()) {
      const sbSub = await supabaseCreateSubmission(submission);
      if (sbSub) submission = { ...submission, ...sbSub };
    }

    res.status(201).json({
      message: 'Material successfully uploaded and published directly to the project vault.',
      submission,
    });
  } catch (err) {
    console.error('[ADMIN UPLOAD ERROR]', err);
    res.status(500).json({ error: 'Failed to process administrative material upload.' });
  }
}

// -------------------------------------------------------------
// GET /api/materials/submissions - Student view of own submissions
// -------------------------------------------------------------
export async function getUserSubmissions(req, res) {
  const userId = req.user?.id;
  if (isSupabaseConfigured()) {
    const sbSubs = await supabaseGetSubmissions(userId ? { userId } : {});
    if (sbSubs) return res.json({ submissions: sbSubs });
  }
  const submissions = getSubmissions(userId ? { userId } : {});
  res.json({ submissions });
}

// -------------------------------------------------------------
// GET /api/admin/submissions - Admin view of all submissions
// -------------------------------------------------------------
export async function getAdminSubmissions(req, res) {
  const { status, category, query } = req.query;
  if (isSupabaseConfigured()) {
    const sbSubs = await supabaseGetSubmissions({ status, category, query });
    if (sbSubs) return res.json({ submissions: sbSubs });
  }
  const submissions = getSubmissions({ status, category, query });
  res.json({ submissions });
}

// -------------------------------------------------------------
// GET /api/admin/submissions/:id - Single submission details
// -------------------------------------------------------------
export function getSubmissionDetails(req, res) {
  const submission = dbGetSubmissionById(req.params.id);
  if (!submission) return res.status(404).json({ error: 'Submission not found.' });
  res.json({ submission });
}

// -------------------------------------------------------------
// GET /api/materials - Public / Student approved vault materials
// -------------------------------------------------------------
export async function getApprovedMaterials(req, res) {
  try {
    const { college, department, level, category, university } = req.query;
    if (isSupabaseConfigured()) {
      const sbSubs = await supabaseGetSubmissions({
        status: 'approved',
        college,
        department,
        level,
        category,
        university,
      });
      if (sbSubs) return res.json({ materials: sbSubs });
    }
    const submissions = getSubmissions({
      status: 'approved',
      college,
      department,
      level,
      category,
      university,
    });
    res.json({ materials: submissions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
}

// -------------------------------------------------------------
// PUT /api/admin/submissions/:id/review - Review submission
// -------------------------------------------------------------
export async function reviewSubmission(req, res) {
  const { id } = req.params;
  const { status, reviewNotes } = req.body;

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ error: "Status must be 'approved', 'rejected', or 'pending'." });
  }

  const reviewPayload = {
    status,
    reviewer: req.user?.name || 'Administrator',
    reviewNotes: reviewNotes || (status === 'approved' ? 'Verified by Academic Board.' : 'Rejected.'),
  };

  let updated = dbReviewSubmission(id, reviewPayload);

  if (isSupabaseConfigured()) {
    const sbUpdated = await supabaseReviewSubmission(id, reviewPayload);
    if (!updated && sbUpdated) {
      updated = sbUpdated;
    }
  }

  if (!updated) {
    return res.status(404).json({ error: 'Submission not found.' });
  }

  // Notify student contributor about the review decision (approved/rejected)
  const targetEmail = updated.authorEmail || updated.author_email;
  if (targetEmail && ['approved', 'rejected'].includes(status)) {
    sendMaterialStatusEmail({
      to: targetEmail,
      name: updated.authorName || updated.author_name || 'Student',
      courseCode: updated.courseCode || updated.course_code || '',
      title: updated.title || '',
      status,
      reviewer: reviewPayload.reviewer,
      reviewNotes: reviewPayload.reviewNotes,
    }).catch((err) => console.error('[EMAIL DISPATCH ERROR]', err));
  }

  res.json({
    message: `Submission marked as ${status}.`,
    submission: updated,
  });
}

// -------------------------------------------------------------
// PUT /api/admin/submissions/:id - Update material metadata
// -------------------------------------------------------------
export async function updateSubmissionMetadata(req, res) {
  try {
    let updated = dbUpdateSubmission(req.params.id, req.body);
    if (isSupabaseConfigured()) {
      try {
        const sbUpdated = await supabaseUpdateSubmission(req.params.id, req.body);
        if (!updated && sbUpdated) updated = sbUpdated;
      } catch (sbErr) {
        console.error('[Supabase updateSubmissionMetadata error]', sbErr);
      }
    }
    if (!updated) return res.status(404).json({ error: 'Submission not found.' });
    res.json({ message: 'Material details updated successfully.', submission: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// -------------------------------------------------------------
// DELETE /api/admin/submissions/:id - Delete submission & R2 file
// -------------------------------------------------------------
export async function deleteSubmission(req, res) {
  try {
    let existing = dbGetSubmissionById(req.params.id);
    if (!existing && isSupabaseConfigured()) {
      existing = await supabaseGetSubmissionById(req.params.id);
    }
    if (existing?.fileKey) {
      await deleteFileFromR2(existing.fileKey);
    }
    const successLocal = dbDeleteSubmission(req.params.id);
    let successSb = false;
    if (isSupabaseConfigured()) {
      successSb = await supabaseDeleteSubmission(req.params.id);
    }
    if (!successLocal && !successSb) {
      return res.status(404).json({ error: 'Submission not found.' });
    }
    res.json({ message: 'Submission deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
