// pages/products/new.jsx
import ProductForm from '@/components/ProductForm';

export default function NewProductPage() {
  return <ProductForm />;
}

// pages/products/edit/[id].jsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductForm from '@/components/ProductForm';
import axiosInstance from '@/utils/axiosInstance';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      axiosInstance.get(`/get-product.php?id=${id}`)
        .then(res => setProduct(res.data))
        .catch(err => console.error(err));
    }
  }, [id]);

  if (!product) return <p className="text-center mt-4">Loading...</p>;

  return <ProductForm product={product} />;
}
