import NavigationBar from "../Components/NavigationBar";
import './Home.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Helmet } from "react-helmet";

function Login() {
    
    
    return (
        <>
            <div>
                <Helmet>
                    <title>Login - Reusemart</title>
                </Helmet>
            </div>

            <NavigationBar/>
            <div className="home-container">
                <img className='background-image' src="./background.jpg"/>
                    <div className='logo-home'>
                        <img style={{ maxWidth: '25%' }} src="./logo.png"/>
                    </div>
                <div className="login-content">
                    <h2 className="mb-5">Login</h2>
                    <Form className="w-100">
                        <Form.Group className="mb-3 text-start"  controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Masukkan email" />
                        </Form.Group>

                        <Form.Group className="mb-3 text-start" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Masukkan password" />
                        </Form.Group>
                     
                        <Button variant="success" type="submit">
                            Login
                        </Button>
                    </Form>
                </div>
            </div>
        </>
    );
}

export default Login;