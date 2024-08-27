import express from "express";
const router = express.Router();

import { validateUrl } from "../actions/validateUrl.js";
/*

"HEAD": Similar to GET, but it only retrieves the headers of the resource, not the content. 
This is often used to check the existence of a resource or to obtain metadata without downloading the full content.
*/

router.get('/validateUrl', validateUrl);
    
export default router;