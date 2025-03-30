import NavigationBar from "../Components/NavigationBar";
import '../Home/Home.css';
import './ProductHome.css';
import { Helmet } from "react-helmet";


function ProductHome() {
    return(
        <>
         <div>
            <Helmet>
                <title>Products - Reusemart</title>
            </Helmet>
        </div>

        <NavigationBar/>

        <div className='home-container'>
            <img img className='background-image' src="./background.jpg"/>
            <div className="product-content">
                <h3 className="text-start header-font">Categories</h3>
                    <br />
                <h3 className="text-start header-font">Products</h3>
            </div>
        </div>
        </>
    )
}

export default ProductHome;