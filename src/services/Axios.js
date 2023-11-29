import axios from "axios";
import {LOCAL_IP} from "@env"

export default axios.create({baseURL: `http://${LOCAL_IP}:3001/`})