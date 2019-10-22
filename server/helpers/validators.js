module.exports = {
  isValidEmail: function (email) {
    const atIndex = email.indexOf("@");

    return email.length && atIndex > 0 && atIndex < email.length;
  },
  isValidPassword: function (password) {
    return password.length > 0 && password.length < 257;
  },
  isNotEmpty: function (item) {
    return item.length > 0;
  },
  isNumber: function (item) {
    return /^\d+$/.test(item);
  }  
};
