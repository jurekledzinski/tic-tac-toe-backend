const changePlayerName1 = (namePlayer1) => {
  const name1 = namePlayer1.split(' ');
  const addCapital1 = name1.map(
    (item) => item.charAt(0).toUpperCase() + item.substr(1)
  );
  const changeName1 = addCapital1.toString().replace(/[,]/g, ' ');
  return changeName1;
};

const changePlayerName2 = (namePlayer2) => {
  const name2 = namePlayer2.split(' ');
  const addCapital2 = name2.map(
    (item) => item.charAt(0).toUpperCase() + item.substr(1)
  );
  const changeName2 = addCapital2.toString().replace(/[,]/g, ' ');
  return changeName2;
};

module.exports = { changePlayerName1, changePlayerName2 };
