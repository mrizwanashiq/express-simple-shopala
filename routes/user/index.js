import express from "express"
import passport from "passport"
import roleGrant from "../../utils/roleGrant.js"
import authValidation from "../../validations/user.validation.js"
import validate from "../../middlewares/validate.js"
import catchAsync from "../../utils/catchAsync.js"
import { uploadProfileImage } from "../../utils/s3Upload.js"
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"
import multer from "multer"
import controllers from "./controllers.js"
import { createRoutesFromArray } from "../../utils/route.js"

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secretkey",
}

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    return done(null, jwt_payload)
  })
)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads")
  },
  filename: function (req, file, cb) {
    const extArray = file.mimetype.split("/")
    const extension = extArray[extArray.length - 1]
    cb(null, file.fieldname + "-" + Date.now() + "." + extension)
  },
})

const upload = multer({ storage: storage })
const router = express.Router();
router.get("/", /*passport.authenticate("jwt", { session: false }),*/ controllers.getAll);
router.get("/profile", passport.authenticate("jwt", { session: false }), controllers.getById);
router.post("/login", validate(authValidation.login), controllers.login);
router.post("/register", validate(authValidation.register), controllers.register);
router.patch("/:id?", validate(authValidation.update), passport.authenticate("jwt", { session: false }), controllers.update);
router.delete("/id?", validate(authValidation.id), passport.authenticate("jwt", { session: false }), controllers.delete);

export default router;
