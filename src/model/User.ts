import DAOFactory from "../DAO/DAOFactory";
import DAOInterface from "../DAO/DAOInterface";
import persistanceType from "../DAO/config";

const DAO: DAOInterface = new DAOFactory().getDAO(persistanceType);

const table = "users";

export default class User {
  username: string;
  password: string;
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  static validatePassword(user, password) {
    return user.password === password;
  }

  static findOne = async (username): Promise<object> => {
    try {
      const response = await DAO.getOneByUsername(table, username);
      if (response) return response[0];
      else return response;
    } catch (error) {
      console.log(error);
    }
    return {};
  };

  static getUserById = async (id): Promise<object> => {
    try {
      const response = await DAO.getOne(table, id);
      if (response?.length) return response[0];
      else return {};
    } catch (error) {
      console.log(error);
    }
    return {};
  };

  static findOrCreate = async (id): Promise<object> => {
    try {
      const response = await User.getUserById(id);
      if (!Object.values(response)) {
        const newUser = new User ("", "");
        await newUser.save();
        return newUser;
      }
      return response
    } catch (error) {}
    return {}
  };

  save = async () => {
    try {
      const response = await DAO.addElement(table, this);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
}
