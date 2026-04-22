import { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        setIsLoading(true);
        try {
            await API.post("/auth/register", { name, email, password, role });
            toast.success("Registration successful. Welcome to Darzi.");
            navigate("/login");
        }
        catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcf9f3] flex items-center justify-center px-6 py-20">
            <div className="max-w-md w-full space-y-12 reveal">
                <div className="text-center space-y-4">
                    <div onClick={() => navigate('/')} className="text-4xl font-serif font-bold italic text-[#051125] cursor-pointer">Darzi.</div>
                    <p className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40">Digital Bespoke Network</p>
                </div>

                <div className="bg-white p-12 rounded-3xl shadow-sm border border-[#051125]/5 space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-serif text-[#051125]">Join the Atelier</h2>
                        <p className="text-sm text-[#45474d]">Experience tailoring redefined for the modern age.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 ml-1">Full Name</label>
                            <input
                                className="input-atelier"
                                placeholder="Alexander Hamilton"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 ml-1">Email Endpoint</label>
                            <input
                                className="input-atelier"
                                placeholder="name@atelier.com"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 ml-1">Secure Password</label>
                            <input
                                className="input-atelier"
                                placeholder="••••••••"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 ml-1">Persona Role</label>
                            <select 
                                className="input-atelier" 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="user">Private Client</option>
                                <option value="tailor">Master Artisan</option>
                            </select>
                        </div>

                        <button 
                            className="btn-fastener btn-primary w-full !text-xs" 
                            disabled={isLoading} 
                            onClick={handleRegister}
                        >
                            {isLoading ? "Creating Profile..." : "Apply for Access"}
                        </button>
                    </div>

                    <div className="pt-4 text-center">
                        <p className="text-xs text-[#45474d] opacity-60">
                            Already a member? <Link to="/login" className="text-[#051125] font-bold border-b border-[#051125]/20">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
