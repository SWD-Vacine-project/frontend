// Thêm import này
import { Navigate } from "react-router-dom";

interface User {
    customerId: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    role: string;
  }
  
interface ProtectedRouteProps {
  requiredRole?: string;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  requiredRole, 
  children 
}) => {
  const storedUser = sessionStorage.getItem("user");
  let user: User | null = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    sessionStorage.removeItem("user");
  }

  if (!user) {
    return <Navigate to="/signIn" replace />;
  }

  if (requiredRole && user.role.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to="/" replace />;
  }
  

  return <>{children}</>;
};

export default ProtectedRoute;