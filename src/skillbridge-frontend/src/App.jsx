import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Register from "./pages/Register";

function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<h1>Login</h1>}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;