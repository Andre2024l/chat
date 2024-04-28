import { useContext } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const CustomNavBar = () => { // Renamed local NavBar to CustomNavBar
    const {user, logoutUser} = useContext(AuthContext);
    return <Navbar bg="dark" className="mb-4" style={{ height: "3.75rem" }}>
            <Container>
                <h2>
                   <Link to="/" className="link-light text-decoration-none">Rede Social</Link> 
                </h2>
                { user && <span className="text-warning">Usuário: {user?.name}</span>}
                <Nav>
                    <Stack direction="horizontal" gap="3">
                        {
                            user && (<><Link onClick={()=> logoutUser()}
                            to="/login" className="link-light text-decoration-none">Sair do Sistema</Link> 
                            </>)
                        }
                        {
                            !user && (<>
                             <Link to="/login" className="link-light text-decoration-none">Login</Link> 
                             <Link to="/register" className="link-light text-decoration-none">Registro</Link> 
                            </>)
                        }
                       </Stack>
                </Nav>
            </Container>
        </Navbar>;
}
 
export default CustomNavBar;
