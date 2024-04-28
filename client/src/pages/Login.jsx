import { useContext } from "react";
import {Alert, Button, Form, Row, Col, Stack} from "react-bootstrap"
import { AuthContext } from "../context/AuthContext";
//Elementos do boostrap
const Login = () => {
    const {
        loginUser,
        loginError,
        LoginInfo,
        updateLoginInfo,
        isLoginLoading
    } = useContext(AuthContext);

    return <>
    <Form onSubmit = {loginUser}>
        <Row style={{
            height: "100vh",
            justifyContent: "center",
            paddingTop: "10%"
        }}>
            <Col xs={6}>
                <Stack gap={3}>
                    <h2>Autenticação</h2>
                    <Form.Control type="email" placeholder="Email" onChange = {(e) =>
                     updateLoginInfo({ ...LoginInfo, email: e.target.value 
                    })} />
                    <Form.Control type="password" placeholder="Password" onChange = {(e) =>
                        updateLoginInfo({ ...LoginInfo, password: e.target.value 
                    })} />
                    <Button variant="primary" type="submit">
                        {isLoginLoading?"Logando..." : "Login" }
                    </Button>
                    {loginError?.error && (
                        <Alert variant="danger">
                        <p>{loginError?.message}</p>
                        </Alert>
                    )}
                    
                    
                </Stack>
            </Col>
        </Row>
    </Form>
    </>;
}
 
export default Login;