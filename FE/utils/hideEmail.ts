export const hideEmail = (email: string) => {
  var hiddenEmail = "";
  for (let i = 0; i < email.length; i++) {
    if (i > 2 && i < email.indexOf("@") - 2) {
      hiddenEmail += "*";
    } else {
      hiddenEmail += email[i];
    }
  }

  return hiddenEmail;
};
