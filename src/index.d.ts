import { MUser, MVendor } from "./models/interfaces/model.interface";

declare global {
    namespace Express {
      interface Request {
        user?: MUser;
        vendor?: MVendor
      }
    }
}