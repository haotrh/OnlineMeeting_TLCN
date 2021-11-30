import Axios from "axios";
import https from "https";
import urljoin from "url-join";
import { config } from "../utils/config";

const axios = Axios.create({
  baseURL: urljoin(config.backendUrl, "api"),
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

export default axios;
