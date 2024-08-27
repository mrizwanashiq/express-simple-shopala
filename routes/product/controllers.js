import ProductService from "../../services/product.js"
import httpResponse from "../../utils/httpResponse.js";

const controller = {
  getAll: async (req, res) => {
    const data = await ProductService.getAll(req.user._id)

    if (data.message === "success") {
      return httpResponse.SUCCESS(res, data.data)
    } else {
      return httpResponse.INTERNAL_SERVER_ERROR(res, data.data)
    }
  },
  
  getById: async (req, res) => {
    const data = await ProductService.getById(req.params.id)

    if (data.message === "success") {
      return httpResponse.SUCCESS(res, data.data)
    } else {
      return httpResponse.INTERNAL_SERVER_ERROR(res, data.data)
    }
  },

  post: async (req, res) => {
    req.body.user_id = req.user._id
    if (req.files) {
      // assign url to req.body.image and req.body.brand_logo
      req.body.image = `${req.protocol}://${req.get("host")}/${req.files.image[0].filename}`
      req.body.brand_logo = `${req.protocol}://${req.get("host")}/${req.files.brand_logo[0].filename}`
    }
    const data = await ProductService.add(req.body)

    if (data.message === "success") {
      return httpResponse.CREATED(res, data.data)
    } else {
      return httpResponse.INTERNAL_SERVER_ERROR(res, data.data)
    }
  },

  update: async (req, res) => {
    req.body.id = req.params.id

    const data = await ProductService.update(req.body)

    if (data.message === "success") {
      return httpResponse.SUCCESS(res, data.data)
    } else {
      return httpResponse.INTERNAL_SERVER_ERROR(res, data.data)
    }
  },

  delete: async (req, res) => {
    const data = await ProductService.removeById(req.params.id)

    if (data.message === "success") {
      return httpResponse.SUCCESS(res, data.data)
    } else {
      return httpResponse.INTERNAL_SERVER_ERROR(res, data.data)
    }
  }
}

export default controller
