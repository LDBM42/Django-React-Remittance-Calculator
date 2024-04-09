// We need an authorization tocken before we can access this route
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

// if we have a tocken and it's not expired we set it to true
// if it is expired we refresh the tocken
// this is a frondend protection before the backend protection

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        // if there is any error we set the authorization to false
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
        // get the refresh tocken
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            // send a response to this route with the refresh tocken
            // this automatically handle the baseURL from the api page
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                // if success we refresh the tocken
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                // if we can't refresh the tocken
                // we dont allow the access
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    };

    // this checks if we need to refresh the tocken
    // or if we are ready to go
    const auth = async () => {
        // get the access tocken
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        // if we have a tocken we check if it's expired
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        // divided by 1000 to get the date 
        // in seconds instead of miliseconds
        const now = Date.now() / 1000;
        // if it's expired we refresh the tocken
        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    };

    // while is authorized we show a Loading message
    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    // if we are authorized we return what is wrapped in children
    // otherwise we redirect to the component login
    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;