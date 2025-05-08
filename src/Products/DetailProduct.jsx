import NavigationBar from "../Components/NavigationBar";
import FooterBar from '../Components/FooterBar';
import { Helmet } from "react-helmet";
import { useLocation } from 'react-router-dom';
import { PulseLoader } from "react-spinners";


const DetailProduct = () => {

    return ( 
        <>
                <Helmet>
                    <title>Products - Reusemart</title>
                </Helmet>

                <div className="min-h-screen">
                    <PulseLoader></PulseLoader>
                </div>
        </>
    );
}
 
export default DetailProduct;