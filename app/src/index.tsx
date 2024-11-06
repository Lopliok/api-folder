import { createRoot } from "react-dom/client"
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import App from "./App"
import React from "react"


const router = createBrowserRouter([
    {
        path: "*",
        element: <App />,
    },
]);

const container = document.getElementById("app")!
const root = createRoot(container)
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);