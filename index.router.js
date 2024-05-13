import auth from "./src/modules/auth/auth.router.js";
import learnguide from "./src/modules/learnguide/learnguide.router.js";
import user from "./src/modules/user/user.router.js";
import { asyncHandler } from "./src/utils/errorhandling.js";
import { handelerror } from "./src/utils/errorhandling.js";

export const bootstrap = (app, express) => {
  app.use(express.json());
  app.use("/auth", auth);
  app.use("/user", user);
  app.use("/learnguide",learnguide)
  app.use(asyncHandler);
  app.use(handelerror);
};
