export const getMe = async (req, res) => {
  // verifyFirebaseToken already populated req.user from the DB
  res.json({
    uid: req.user.uid,
    email: req.user.email,
    displayName: req.user.displayName,
    role: req.user.role,
  })
}
