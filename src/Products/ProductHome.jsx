import NavigationBar from "../Components/NavigationBar";
import '../Home/Home.css';
import './ProductHome.css';
import { Helmet } from "react-helmet";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


function ProductHome() {
    return(
        <>
         <div>
            <Helmet>
                <title>Products - Reusemart</title>
            </Helmet>
        </div>

        <NavigationBar/>

        <div className='product-container'>
            <img img className='background-image' src="./background.jpg"/>
            <div className="search-content">
                <Form className="w-100">
                        <Form.Group className="mb-3 text-start d-flex" controlId="search">
                            <Form.Control type="text" placeholder="Cari Barang" className="me-2 header-font" />
                            <Button variant="success" type="submit">
                            Search
                            </Button>
                        </Form.Group>
                    </Form>
            </div>
            <div className="product-content">
                
                <h5 className="text-start header-font mb-3">Categories</h5>
                <h5 className="text-start header-font mb-3">Products</h5>
            </div>
        </div>
        </>
    )
}

export default ProductHome;