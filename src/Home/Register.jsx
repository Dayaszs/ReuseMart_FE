import NavigationBar from "../Components/NavigationBar";
import { Helmet } from "react-helmet";

function Register() {
    
    
    return (
        <>
            <div>
                <Helmet>
                    <title>Register - Reusemart</title>
                </Helmet>
            </div>

            <NavigationBar/>
            <div className="home-container">
                <img className='background-image' src="./background.jpg"/>
                <div className='logo-home'>
                    <img style={{ maxWidth: '25%' }} src="./logo.png"/>
                </div>
                <div className="login-content">
                    <h2 className="mb-5">Register</h2>
                    <Form className="w-100">
                        <Form.Group className="mb-3 text-start"  controlId="nama">
                            <Form.Label>Nama</Form.Label>
                            <Form.Control type="text" placeholder="Masukkan nama" />
                        </Form.Group>
                        
                        <Form.Group className="mb-3 text-start"  controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Masukkan email" />
                        </Form.Group>

                        <Form.Group className="mb-3 text-start" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Masukkan password" />
                        </Form.Group>

                        <Form.Group className="mb-3 text-start"  controlId="notelp">
                            <Form.Label>Nomor Telepon</Form.Label>
                            <Form.Control type="text" placeholder="Masukkan Nomor Telepon" />
                        </Form.Group>

                        <Form.Group className="mb-3 text-start" controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Register sebagai organisasi" />
                        </Form.Group>
                     
                        <Button variant="success" type="submit">
                            Register
                        </Button>
                    </Form>
                </div>
            </div>
        </>
    );
}

export default Register;