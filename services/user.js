import UserModel from "../models/user.js";
import ProductModel from "../models/product.js";

const UserService = {
  getAll: async () => {
    try {
      const data = await UserModel.aggregate([
        { $match: { is_active: true } },
        { $project: { password: 0 } },
        {
          $lookup: {
            from: "products",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$user_id", "$$userId"] },
                      { $eq: ["$is_active", true] },
                    ],
                  },
                },
              },
            ],
            as: "products",
          },
        },
      ]);

      if (data) {
        const countData = data.map((user) => {
          return {
            ...user,
            products: user.products.length,
          };
        });
        return { message: "success", data: countData };
      } else {
      }
    } catch (error) {
      return { message: "error", data: error.message };
    }
  },

  getById: async (id) => {
    try {
      const data = await UserModel.findById(id).select({ password: 0 });

      if (data) {
        return { message: "success", data: data };
      }
    } catch (error) {
      return { message: "error", data: error.message };
    }
  },

  getByEmail: async (email) => {
    try {
      const query = { email: email };
      const data = await UserModel.find(query);

      if (data) {
        return { message: "success", data: data };
      }
    } catch (error) {
      return { message: "error", data: error.message };
    }
  },

  add: async (body) => {
    try {
      const query = { email: body.email };
      const data = await UserModel.find(query);
      if (data.length > 0) {
        return { message: "failed", data: "User already exist" };
      }

      const savedData = await UserModel.create(body);
      if (savedData) {
        return { message: "success", data: savedData };
      }
    } catch (error) {
      return { message: "error", data: error.message };
    }
  },

  update: async (body) => {
    try {
      const id = body.id;
      delete body.id;
      const updateDate = await UserModel.updateOne(
        { _id: id },
        { $set: body },
        { runValidators: true }
      );
      if (updateDate) {
        return { message: "success", data: updateDate };
      }
    } catch (error) {
      return { message: "error", data: error.message };
    }
  },

  removeById: async (id) => {
    const data = await UserModel.findOne({ _id: id });

    if (data) {
      data.is_active = false;
      const deactivateUser = await data.save();
      if (deactivateUser) {
        await ProductModel.updateMany({ user_id: id }, { is_active: false });

        return { message: "success", data: data };
      }
    }
  },

  userProfile: async (req) => {
    console.log(req);
    try {
      const data = await UserModel.findOne({ _id: req.user.user._id });
      if (data) {
        return { message: "success", data: data };
      }
    } catch (error) {
      throw error;
    }
  },
};

export default UserService;
