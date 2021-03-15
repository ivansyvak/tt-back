import { ClientFileRoutes } from "./routes/client-file.routes";
import { ClientRoutes } from "./routes/client.routes";

export const AppRoutes = [...ClientRoutes, ... ClientFileRoutes];
