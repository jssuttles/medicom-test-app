/**
 * Given a user get an HTML row with the user data
 * @param {Object} user
 * @return {JQuery<HTMLElement>}
 */
function getUserRow(user) {
  const userRow = window.helpers.getHTMLFromTemplate('userRowTemplate');
  userRow.find('.firstName').text(user.firstName);
  userRow.find('.lastName').text(user.lastName);
  userRow.find('.email').text(user.email);
  userRow.find('.profilePic').text(user.profilePic);
  return userRow;
}

/**
 * Populate the usersTable with data from the server
 * @return {Promise}
 */
function populateUsersTable() {
  const usersTable = $('#usersTable');
  usersTable.empty();
  return window.helpers.get('users')
  .then((users) => {
    users.forEach((user) => usersTable.append(getUserRow(user)));
  }).catch((err) => {
    console.error(err);
  });
}

// on ready, populate the users table
$(() => populateUsersTable());
