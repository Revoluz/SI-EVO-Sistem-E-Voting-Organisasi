/**
 * Admin Authentication Middleware
 * Melindungi routes admin dari akses unauthorized
 */

exports.isAdminLogin = (req, res, next) => {
  if (!req.session || !req.session.adminId) {
    return res.redirect('/admin/login');
  }
  next();
};

exports.isAdminSuperUser = (req, res, next) => {
  if (!req.session || !req.session.adminId) {
    return res.redirect('/admin/login');
  }

  if (!req.session.isSuper) {
    return res.status(403).json({
      message: 'Akses ditolak. Hanya super admin yang dapat melakukan aksi ini.',
    });
  }

  next();
};

exports.redirectIfAdminLogin = (req, res, next) => {
  if (req.session && req.session.adminId) {
    return res.redirect('/admin/dashboard');
  }
  next();
};
