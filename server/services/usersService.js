/**
 * Service layer for the Users
 */

function saveUser(user) {
  return new Promise((resolve, reject) => {
    user.save().then((doc) => {
      resolve({
        data: doc
      });
    }).catch((err) => {
      reject({
        code: 400,
        message: 'Cannot save the user',
        errObj: err
      });
    });
  });
}

module.exports = {
  saveUser
};
