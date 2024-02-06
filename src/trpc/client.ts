// this is used to connect the backend endpoints and types into our frontend through the providers

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "./";

export const trpc = createTRPCReact<AppRouter>({});
