import NavigationBar from "../Components/NavigationBar";
import FooterBar from '../Components/FooterBar';
import { Helmet } from "react-helmet";
import { useLocation } from 'react-router-dom';


const DetailProduct = () => {

    return ( 
        <>
            <div>
                <Helmet>
                    <title>Products - Reusemart</title>
                </Helmet>
            </div>

            <NavigationBar/>
            <FooterBar/>
        </>
    );
}
 
export default DetailProduct;