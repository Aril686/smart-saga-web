/**
 * Authentication module for handling user verification and token management.
 * @module auth
 */

module.exports = function auth(role) {
  return (req, res, next) => {

    // belum login
    if (!req.session || !req.session.user) {
      return res.redirect("/");
    }

    // role tidak sesuai (mendukung string tunggal atau array of roles)
    if (role) {
      const roles = Array.isArray(role) ? role : [role];
      if (!roles.includes(req.session.user.role)) {
        return res.status(403).send("Akses ditolak");
      }
    }

    next();
  };
};
