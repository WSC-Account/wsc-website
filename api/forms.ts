import type { IncomingMessage, ServerResponse } from "http";
import { handleFormSubmissionRequest } from "../server/form-submissions.js";

export default function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  return handleFormSubmissionRequest(req, res);
}
