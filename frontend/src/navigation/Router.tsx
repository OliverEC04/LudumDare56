import {Route, Routes} from "react-router-dom";
import {Layout} from "./Layout.tsx";
import {Home} from "../pages/Home.tsx";
import {About} from "../pages/About.tsx";
import {routes} from "./appRoutes.ts";

export const Router = () => {
    return <Routes>
        <Route
            path={routes.home}
            element={<Layout/>}
        >
            <Route
                index
                element={<Home/>}
            />
            <Route
                path={routes.about}
                element={<About/>}
            />
        </Route>
    </Routes>;
};