import { cleanEnv, str, url } from "envalid";

export default cleanEnv(process.env, {
  BOT_TOKEN: str(),
  GENIUS_ACCESS_TOKEN: str(),
  STORAGE_URL: url(),
});
