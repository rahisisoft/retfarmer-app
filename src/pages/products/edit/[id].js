// pages/products/edit/[id].jsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductForm from '@/components/ProductForm';
import axiosInstance from '@/utils/axiosInstance';
import UserLayout from '@/components/UserLayout';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      axiosInstance.get(`/product.php?id=${id}`)
        .then(res => setProduct(res.data))
        .catch(err => console.error(err));
    }
  }, [id]);

  return (
    <UserLayout>
      <div className="container mt-4">
        <h3>Edit Product</h3>
        {product ? (
          <ProductForm product={product} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </UserLayout>
  );
}
