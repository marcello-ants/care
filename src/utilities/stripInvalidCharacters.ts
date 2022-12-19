const allKeyBoardRegex = /[^a-zA-Z0-9\t\n ./?;:"'`,!@#$%^&*()[\]{}_+=|\\-]/g;
const stripInvalidCharacters = (values: string) => {
  return values.replace(allKeyBoardRegex, '');
};

export default stripInvalidCharacters;
