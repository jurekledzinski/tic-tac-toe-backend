const Result = require('../models/results');
const OnlinePlayers = require('../models/onlinePlayers');
const { changePlayerName1, changePlayerName2 } = require('../helpers/helpers');

const getResults = async (req, res, next) => {
  const { option, page, numItems, sortValue, sortName } = req.query;
  const key = `${sortName}`;
  const objSort = { [key]: sortValue };

  try {
    const count = await Result.where({ option }).countDocuments();

    const resultData = await Result.find({ option })
      .select(['-__v', '-email1', '-email2'])
      .limit(Number(numItems))
      .skip(Number(page) * Number(numItems))
      .sort(sortName === 'default' ? {} : objSort);

    if (Number(page) === 0 || Number(page) < count) {
      return res.status(200).json({ result: resultData, count });
    }
  } catch (err) {
    next(err);
  }
};

const addSinglePlayer = async (req, res, next) => {
  const { email1, namePlayer1, namePlayer2, option } = req.body;

  const email1Low = email1.toLowerCase();
  const name1 = changePlayerName1(namePlayer1);
  const name2 = changePlayerName2(namePlayer2);

  try {
    const searchPlayer1Exist = await Result.find({
      $or: [{ email1: email1Low }, { namePlayer1: name1 }],
    });

    const searchPlayer1 = await Result.find({
      $and: [{ email1: email1Low, namePlayer1: name1 }, { namePlayer2: name2 }],
    });

    const checkerPlayer1 = searchPlayer1Exist.find(
      (item) => item.email1 === email1Low && item.namePlayer1 === name1
    );

    if (!checkerPlayer1 && searchPlayer1Exist.length) {
      return res.status(401).json({ message1: 'Name or email already exist!' });
    }

    if (searchPlayer1.length === 0) {
      const data = {
        email1: email1Low,
        namePlayer1: name1,
        namePlayer2: name2,
        option: option.toLowerCase(),
        draws: 0,
        wins1: 0,
        wins2: 0,
      };

      const result = await Result.create(data);
      const resultData = {
        id: result._id,
        namePlayer1: result.namePlayer1,
        namePlayer2: result.namePlayer2,
        option: result.option,
      };

      return res.status(200).json({ result: resultData });
    }

    const resultData = {
      id: searchPlayer1[0]._id,
      namePlayer1: searchPlayer1[0].namePlayer1,
      namePlayer2: searchPlayer1[0].namePlayer2,
      option: searchPlayer1[0].option,
    };

    return res.status(200).json({ result: resultData });
  } catch (err) {
    next(err);
  }
};

const addPlayer = async (req, res, next) => {
  const { email1, email2, namePlayer1, namePlayer2, option } = req.body;

  const email1Low = email1.toLowerCase();
  const email2Low = email2.toLowerCase();
  const name1 = changePlayerName1(namePlayer1);
  const name2 = changePlayerName2(namePlayer2);

  try {
    const searchPlayer1Exist = await Result.find({
      $or: [{ email1: email1Low }, { namePlayer1: name1 }],
    });

    const searchPlayer2Exist = await Result.find({
      $or: [{ email2: email2Low }, { namePlayer2: name2 }],
    });

    const searchPlayer1 = await Result.find({
      $and: [
        { email1: email1Low, namePlayer1: name1 },
        { email2: email2Low, namePlayer2: name2 },
      ],
    });

    const searchPlayer2 = await Result.find({
      $and: [
        { email1: email2Low, namePlayer1: name2 },
        { email2: email1Low, namePlayer2: name1 },
      ],
    });

    const arrPlayers = [...searchPlayer1, ...searchPlayer2];

    const checkerPlayer1 = searchPlayer1Exist.find(
      (item) => item.namePlayer1 === name1 && item.email1 === email1Low
    );

    const checkerPlayer2 = searchPlayer2Exist.find(
      (item) => item.namePlayer2 === name2 && item.email2 === email2Low
    );

    if (!checkerPlayer1 && searchPlayer1Exist.length) {
      return res.status(401).json({ message1: 'Name or email already exist!' });
    }

    if (!checkerPlayer2 && searchPlayer2Exist.length) {
      return res.status(401).json({ message2: 'Name or email already exist!' });
    }

    if (arrPlayers.length === 0) {
      const data = {
        email1: email1Low,
        email2: email2Low,
        namePlayer1: name1,
        namePlayer2: name2,
        option: option.toLowerCase(),
        draws: 0,
        wins1: 0,
        wins2: 0,
      };

      const result = await Result.create(data);
      const resultData = {
        id: result._id,
        namePlayer1: result.namePlayer1,
        namePlayer2: result.namePlayer2,
        option: result.option,
      };

      return res.status(200).json({ result: resultData });
    }

    const resultData = {
      id: arrPlayers[0]._id,
      namePlayer1: arrPlayers[0].namePlayer1,
      namePlayer2: arrPlayers[0].namePlayer2,
      option: arrPlayers[0].option,
    };

    return res.status(200).json({ result: resultData });
  } catch (err) {
    next(err);
  }
};

const addResult = async (req, res, next) => {
  const id = req.params.id;
  const { draws, name1, wins1, wins2 } = req.body;

  try {
    const resultData = await Result.findOne({
      _id: id,
    });

    if (name1 === resultData.namePlayer1) {
      resultData.draws = draws ? resultData.draws + 1 : resultData.draws;
      resultData.wins1 = wins1 ? resultData.wins1 + 1 : resultData.wins1;
      resultData.wins2 = wins2 ? resultData.wins2 + 1 : resultData.wins2;

      await resultData.save();
    } else {
      resultData.wins1 = wins2 ? resultData.wins1 + 1 : resultData.wins1;
      resultData.wins2 = wins1 ? resultData.wins2 + 1 : resultData.wins2;
      resultData.draws = draws ? resultData.draws + 1 : resultData.draws;

      await resultData.save();
    }

    return res.status(200).end();
  } catch (err) {
    next(err);
  }
};

const addPlayerMultiplayer = async (req, res, next) => {
  const { email, idSocket, name, option } = req.body;

  const email1Low = email.toLowerCase();
  const name1 = changePlayerName1(name);

  try {
    const searchPlayer1Exist = await Result.find({
      $or: [
        { email1: email1Low },
        { email2: email1Low },
        { namePlayer1: name1 },
        { namePlayer2: name1 },
      ],
    });

    const searchOnline = await OnlinePlayers.find({
      $or: [
        { $and: [{ name: name1 }, { email: email1Low }] },
        { $or: [{ email: email1Low }, { name: name1 }] },
      ],
    }).select(['-__v', '-option']);

    const checkerPlayer = searchPlayer1Exist.find(
      (item) =>
        (item.email1 === email1Low && item.namePlayer1 === name1) ||
        (item.email2 === email1Low && item.namePlayer2 === name1)
    );

    const checkOnlinePlayer = searchOnline.find(
      (item) => item.email === email1Low && item.name === name1
    );

    if (
      (!checkerPlayer && searchPlayer1Exist.length) ||
      (!checkOnlinePlayer && searchOnline.length)
    ) {
      return res.status(401).json({ message: 'Name or email already exist!' });
    }

    if (!searchOnline.length) {
      const data = {
        available: true,
        email: email1Low,
        idSocket,
        name: name1,
        disable: false,
        option: option.toLowerCase(),
      };

      const result = await OnlinePlayers.create(data);

      const resultData = {
        id: result._id,
        name: result.name,
      };
      return res.status(200).json({ result: resultData });
    }

    const resultData = {
      id: searchOnline[0]._id,
      name: searchOnline[0].name,
    };

    return res.status(200).json({ result: resultData });
  } catch (err) {
    next(err);
  }
};

const updatePlayerAvailable = async (req, res, next) => {
  const { available, id } = req.params;
  try {
    const flag = Boolean(Number(available));
    const resultData = await OnlinePlayers.findOneAndUpdate(
      { _id: id },
      { available: flag },
      { new: true, fields: '_id' }
    );
    return res.status(200).json({ result: resultData });
  } catch (err) {
    next(err);
  }
};

const removePlayerOnline = async (req, res, next) => {
  const id = req.params.id;
  try {
    await OnlinePlayers.findOneAndDelete({ idSocket: id });
    return res.status(200).end();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addPlayer,
  addPlayerMultiplayer,
  addSinglePlayer,
  addResult,
  getResults,
  removePlayerOnline,
  updatePlayerAvailable,
};
