function getUserRow(user) {
  const userRow = window.helpers.getHTMLFromTemplate('userRowTemplate');
  userRow.find('.firstName').text(user.firstName);
  userRow.find('.lastName').text(user.lastName);
  userRow.find('.email').text(user.email);
  userRow.find('.profilePic').text(user.profilePic);
  return userRow;
}

function populateUsersTable() {
  const usersTable = $('#usersTable');
  usersTable.empty();
  return window.helpers.get('users')
  .then((users) => {
    users.forEach(user => usersTable.append(getUserRow(user)));
  }).catch((err) => {
    console.error(err);
  });
}

$(() => {
  populateUsersTable();
});
