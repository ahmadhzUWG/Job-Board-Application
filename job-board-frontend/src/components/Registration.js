import { useEffect } from 'react'
import { useLocation, useNavigate } from "react-router-dom";

function Registration() {
    const location = useLocation();
    const navigate = useNavigate();
    const { email, password } = location.state || {};

    useEffect(() => {
        if (!email || !password) {
            console.log("No registration state available");
            navigate("/", { replace: true }); 
        }
    }, []);

    if (!email || !password) return null;

    return (
        <div>

        </div>
    )
}

export default Registration
