import { useEffect } from "react";
import { useLocation } from "react-router";

const routeTitles = {
    "/": "Jangoro",
    "/login": "Login",
    "/signup": "Sign Up",
    "/account": "Account",
    "/billing": "Billing",
    // "/companies": "Companies",
    // "/tasks": "Tasks",
};

export function PageTitleUpdater() {
    const location = useLocation();

    useEffect(() => {
        const link = location.pathname ? location.pathname : "/";
        document.title = routeTitles[link] || "Jangoro";
    }, [location.pathname]);

    return null; // This component only updates the title
}

export default PageTitleUpdater;
