import axios from "axios";

export default axios.create({
  baseURL: "https://southamerica-east1-crud-firebase-3fd47.cloudfunctions.net/webApi/api/v1",
  headers: {
    "Content-type": "application/json"
  }
});