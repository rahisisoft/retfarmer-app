import axiosInstance from "../utils/axiosInstance";
import { useState, useEffect } from 'react';
import MarketplaceLayout from "@/components/MarketplaceLayout";
import ProductForm from "@/components/ProductForm";
import ProductList from "@/components/ProductList";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchProducts();
    }, [search, page]);

    const fetchProducts = async () => {
        try {
            //const response = await axiosInstance.get(`/all-products.php?search=${search}&page=${page}`);
            const response = await axiosInstance.get(`/all-products.php?search=${search}&page=${page}`);
            setProducts(response.data);
        } catch (err) {
            console.error("Failed to fetch products.");
        }
    };

    /*const fetchProducts = () => {
      axiosInstance
        .post("/all-seller-products.php",{id:sellerId})
        .then((res) => setProducts(res.data))
        .catch((err) => console.error("Error fetching products:", err));
    };*/

    return (
      <MarketplaceLayout>
            <div className="container mt-4">
                <input className="form-control mb-3" type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <ProductForm/>
            </div>
      </MarketplaceLayout>
    );
}
