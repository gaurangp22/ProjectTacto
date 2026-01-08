import "./global.css";

import { createRoot } from "react-dom/client";
import { QueryClient } from "@tanstack/react-query";
import App from "./App";

const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root")!);
root.render(<App queryClient={queryClient} />);
