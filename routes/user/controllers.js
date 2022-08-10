import UserService from "../../services/user.js";
import passwordHash from "password-hash";
import jwt from "jsonwebtoken";
import httpResponse from "../../utils/httpResponse.js";

const controller = {
  getAll: async (req, res) => {
    try {
      const data = await UserService.getAll();
      return httpResponse.SUCCESS(res, data.data);
    } catch(error){
      return httpResponse.INTERNAL_SERVER_ERROR(res, error);
    }
  },
  
  getById: async (req, res) => {
    try {
      const data = await UserService.getById(req.params.id);
      return httpResponse.SUCCESS(res, data.data);
    } catch(error){
      return httpResponse.INTERNAL_SERVER_ERROR(res, error);
    }
  },

  register: async (req, res) => {
    const hashedPassword = passwordHash.generate(req.body.password);
    req.body.password = hashedPassword;
    req.body.role='vendor';

    const addResponse = await UserService.add(req.body);
    if (addResponse.message === "success") {
      return httpResponse.CREATED(res, addResponse.data);
    } else if (addResponse.message === "failed") {
      return httpResponse.CONFLICT(res, addResponse.data);
    } else {
      return httpResponse.INTERNAL_SERVER(res, addResponse.data);
    }
  },

  login: async (req, res) => {
    const data = await UserService.getByEmail(req.body.email);

    if (data.message === "error" || data.data.length < 1) {
      return httpResponse.NOT_FOUND(res, data.data, "Email is wrong");
    }

    const isVerified = passwordHash.verify(
        req.body.password,
        data.data[0].password
    );

    if (!isVerified) {
      return httpResponse.NOT_FOUND(res, data.data, "Password is wrong");
    }

    delete data.data[0].password;
    const token = await jwt.sign(data.data[0]._doc , "secretkey");
    if(token){
      return httpResponse.SUCCESS(res, token);
    } else {
      return httpResponse.UNAUTHORIZED(res, data.data, "Token is not generated");
    }
  },

  update: async (req, res) => {
    req.body.id = req.params.id;

    const updateResponse = await UserService.update(req.body);
    if (updateResponse.message === "success") {
      return httpResponse.SUCCESS(res, updateResponse.data);
    } else {
      return httpResponse.INTERNAL_SERVER(res, updateResponse.data);
    }
  },

  delete: async (req, res) => {
    const deleteResponse = await UserService.removeById(req.params.id);
    return httpResponse.SUCCESS(res, deleteResponse);
  }
}

export default controller;
