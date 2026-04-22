import { useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        setIsLoading(true);
        try {
            const res = await API.post("/auth/login", { email, password });
            localStorage.setItem("role", res.data.user.role);
            localStorage.setItem("name", res.data.user.name);
            toast.success("Welcome back to the Atelier.");
            navigate("/dashboard");
        }
        catch (error) {
            toast.error(error.response?.data?.message || "Authentication failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcf9f3] flex items-center justify-center px-6">
            <div className="max-w-md w-full space-y-12 reveal">
                <div className="text-center space-y-4">
                    <div onClick={() => navigate('/')} className="text-4xl font-serif font-bold italic text-[#051125] cursor-pointer">Darzi.</div>
                    <p className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40">The Digital Atelier Archive</p>
                </div>

                <div className="bg-white p-12 rounded-3xl shadow-sm border border-[#051125]/5 space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-serif text-[#051125]">Sign In</h2>
                        <p className="text-sm text-[#45474d]">Access your personal tailoring dashboard.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 ml-1">Email Identifier</label>
                            <input
                                className="input-atelier"
                                placeholder="name@atelier.com"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 ml-1">Secret Key / Password</label>
                            <input
                                className="input-atelier"
                                placeholder="••••••••"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button 
                            className="btn-fastener btn-primary w-full !text-xs" 
                            disabled={isLoading} 
                            onClick={handleLogin}
                        >
                            {isLoading ? "Authenticating..." : "Unlock Workspace"}
                        </button>
                    </div>

                    <div className="pt-4 text-center">
                        <p className="text-xs text-[#45474d] opacity-60">
                            New to the Atelier? <Link to="/register" className="text-[#051125] font-bold border-b border-[#051125]/20">Apply for Access</Link>
                        </p>
                    </div>
                </div>
                
                <div className="text-center">
                    <p className="text-[10px] font-bold tracking-widest uppercase opacity-20">© 2024 DARZI. SECURE ENTRY.</p>
                </div>
            </div>
        </div>
    );
}

export default Login;