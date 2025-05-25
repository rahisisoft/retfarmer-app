// components/ProductList.js
export default function ProductList({ products, setPage, page }) {
    return (
        <>
            <ul className="list-group mb-3">
                {products.map(product => (
                    <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            {product.name} - ${product.price}
                        </div>
                        <div>
                            {product.image_url && <img src={product.image_url} alt="Product" width="50" height="50" className="me-2" />}
                            <button className="btn btn-sm btn-warning">Upload</button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="d-flex justify-content-between">
                <button className="btn btn-secondary" onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                <button className="btn btn-secondary" onClick={() => setPage(page + 1)}>Next</button>
            </div>
        </>
    );
}