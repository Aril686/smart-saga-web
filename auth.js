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

    // role tidak sesuai
    if (role && req.session.user.role !== role) {
      return res.status(403).send("Akses ditolak");
    }

    next();
  };
};
