import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import MarketplaceLayout from '@/components/MarketplaceLayout';
import { useCart } from '../contexts/CartContext';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useUser } from '../contexts/UserContext';
import ProductForm from '@/components/ProductForm';
import BASE_API_URL from '../utils/config';
import { 
  FaStar, 
  FaStarHalfAlt, 
  FaRegStar, 
  FaSearch, 
  FaShoppingCart, 
  FaEdit, 
  FaPlus,
  FaFilter,
  FaGlobe,
  FaTimes
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Market() {
  // État pour la gestion de la langue
  const [language, setLanguage] = useState('en');
  
  // Traductions
  const translations = {
    en: {
      title: "Ruzizi Market",
      searchPlaceholder: "Search products...",
      searchButton: "Search",
      filtersButton: "Filters",
      allCategories: "All categories",
      sortOptions: {
        recent: "Most recent",
        price_asc: "Price: Low to High",
        price_desc: "Price: High to Low",
        rating: "Best rated"
      },
      resetFilters: "Reset filters",
      noProducts: "No products found",
      resetFiltersPrompt: "Try adjusting your filters or search",
      stock: "Stock",
      details: "Details",
      addToCart: "Add to cart",
      productDetails: "Product details",
      category: "Category",
      price: "Price",
      description: "Description",
      vendor: "Vendor",
      customerReviews: "Customer reviews",
      averageRating: "average",
      noReviews: "No reviews for this product",
      addReview: "Add a review",
      yourRating: "Your rating",
      yourComment: "Your comment",
      submitReview: "Submit review",
      loginToReview: "Log in to leave a review",
      login: "Log in",
      editProduct: "Edit product",
      addProduct: "Add new product",
      limitedStock: "Limited stock",
      previous: "Previous",
      next: "Next",
      loading: "Loading...",
      submitting: "Submitting...",
      close: "Close",
      addedToCart: "Product added to cart!"
    },
    fr: {
      title: "Marché Agricole Africain",
      searchPlaceholder: "Rechercher des produits...",
      searchButton: "Rechercher",
      filtersButton: "Filtres",
      allCategories: "Toutes les catégories",
      sortOptions: {
        recent: "Plus récents",
        price_asc: "Prix: Croissant",
        price_desc: "Prix: Décroissant",
        rating: "Meilleures notes"
      },
      resetFilters: "Réinitialiser les filtres",
      noProducts: "Aucun produit trouvé",
      resetFiltersPrompt: "Essayez de modifier vos filtres ou votre recherche",
      stock: "Stock",
      details: "Détails",
      addToCart: "Ajouter au panier",
      productDetails: "Détails du produit",
      category: "Catégorie",
      price: "Prix",
      description: "Description",
      vendor: "Vendeur",
      customerReviews: "Avis des clients",
      averageRating: "moyenne",
      noReviews: "Aucun avis pour ce produit",
      addReview: "Ajouter un avis",
      yourRating: "Votre note",
      yourComment: "Votre commentaire",
      submitReview: "Envoyer votre avis",
      loginToReview: "Connectez-vous pour laisser un avis",
      login: "Se connecter",
      editProduct: "Modifier le produit",
      addProduct: "Ajouter un nouveau produit",
      limitedStock: "Stock limité",
      previous: "Précédent",
      next: "Suivant",
      loading: "Chargement...",
      submitting: "Envoi...",
      close: "Fermer",
      addedToCart: "Produit ajouté au panier !"
    }
  };

  // Raccourci pour accéder aux traductions courantes
  const t = translations[language];
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState('recent');
  const [loading, setLoading] = useState(true);
  const limit = 8;
  const { cart, setCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useUser();

  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const [showProductFormModal, setShowProductFormModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Fonction pour calculer la note moyenne
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  // Fonction pour afficher les étoiles de notation
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-warning" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-warning" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-warning" />);
      }
    }
    
    return <div className="d-flex">{stars}</div>;
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit, category: selectedCategory, search: query, sort };
      const response = await axiosInstance.get('/all-products.php', { params });
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (productId) => {
    setLoadingReviews(true);
    try {
      const response = await axiosInstance.get('/get-reviews.php', { params: { product_id: productId } });
      setReviews(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory, sort, query]);

  useEffect(() => {
    axiosInstance.get('/categories.php')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  // CORRECTION : Fonction addToCart améliorée avec notification
  const addToCart = (product) => {
    // Créer une copie du produit pour éviter les problèmes de référence
    const productToAdd = { ...product };
    
    // Ajouter au panier
    setCart([...cart, productToAdd]);
    
    // Notification
    toast.success(t.addedToCart, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    fetchReviews(product.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setReviews([]);
    setNewRating(5);
    setNewComment('');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert(language === 'en' 
        ? "You must be logged in to leave a review." 
        : "Vous devez être connecté pour laisser un avis.");
      return;
    }
    if (newComment.trim() === '') {
      alert(language === 'en' 
        ? "Comment cannot be empty." 
        : "Le commentaire ne peut pas être vide.");
      return;
    }
    setSubmittingReview(true);
    try {
      await axiosInstance.post('/add-review.php', {
        product_id: selectedProduct.id,
        user_id: user.id,
        rating: newRating,
        comment: newComment.trim(),
      });
      fetchReviews(selectedProduct.id);
      setNewRating(5);
      setNewComment('');
    } catch (error) {
      console.error(error);
      alert(language === 'en' 
        ? "Error adding review." 
        : "Erreur lors de l'ajout de l'avis.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const openProductForm = () => {
    setEditProduct(null);
    setShowProductFormModal(true);
  };

  const openEditProductForm = (product) => {
    closeModal();
    setEditProduct(product);
    setShowProductFormModal(true);
  };

  const closeProductForm = () => {
    setShowProductFormModal(false);
    setEditProduct(null);
  };

  const handleProductSaved = () => {
    closeProductForm();
    fetchProducts();
  };

  return (
    <MarketplaceLayout openProductForm={openProductForm}>
      <ToastContainer />
      <div className="container mt-4 mb-5">
        {/* Sélecteur de langue */}
        <div className="d-flex justify-content-end mb-3">
          <div className="btn-group">
            <button 
              className={`btn btn-sm ${language === 'en' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
            <button 
              className={`btn btn-sm ${language === 'fr' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setLanguage('fr')}
            >
              FR
            </button>
          </div>
        </div>
        
        {/* Section de recherche et filtres */}
        <div className="bg-light p-4 rounded-4 shadow-sm mb-4">
          <h2 className="mb-4 fw-bold text-primary">
            <FaGlobe className="me-2" />
            {t.title}
          </h2>
          
          <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
            <form className="flex-grow-1" onSubmit={handleSearch}>
              <div className="input-group shadow-sm">
                <input
                  type="text"
                  className="form-control form-control-lg border-primary"
                  placeholder={t.searchPlaceholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btn btn-primary btn-lg" type="submit">
                  <FaSearch /> {t.searchButton}
                </button>
              </div>
            </form>

            <button 
              className="btn btn-outline-primary btn-lg d-lg-none"
              onClick={() => document.getElementById('filterCollapse').classList.toggle('show')}
            >
              <FaFilter /> {t.filtersButton}
            </button>
          </div>

          <div className="collapse d-lg-block" id="filterCollapse">
            <div className="d-flex flex-column flex-md-row gap-3 justify-content-between align-items-center">
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <select 
                  className="form-select w-auto shadow-sm border-primary" 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">{t.allCategories}</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>

                <select 
                  className="form-select w-auto shadow-sm border-primary" 
                  value={sort} 
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="recent">{t.sortOptions.recent}</option>
                  <option value="price_asc">{t.sortOptions.price_asc}</option>
                  <option value="price_desc">{t.sortOptions.price_desc}</option>
                  <option value="rating">{t.sortOptions.rating}</option>
                </select>
              </div>
              
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={() => {
                  setSelectedCategory('');
                  setQuery('');
                  setSort('recent');
                  setPage(1);
                  fetchProducts();
                }}
              >
                <FaTimes /> {t.resetFilters}
              </button>
            </div>
          </div>
        </div>

        {/* Liste de produits */}
        {loading ? (
          <div className="d-flex justify-content-center my-5 py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">{t.loading}</span>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-5 my-5">
            <div className="bg-light p-5 rounded-4">
              <h3 className="text-secondary mb-4">{t.noProducts}</h3>
              <p className="text-muted mb-4">{t.resetFiltersPrompt}</p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSelectedCategory('');
                  setQuery('');
                  setSort('recent');
                  setPage(1);
                  fetchProducts();
                }}
              >
                <FaTimes /> {t.resetFilters}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
              {products.map(product => (
                <div className="col" key={product.id}>
                  <div 
                    className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-hover"
                    onClick={() => openModal(product)}
                  >
                    <div className="position-relative">
                      {product.image ? (
                        <div className="ratio ratio-4x3">
                          <img
                            src={`${BASE_API_URL}/${product.image}`}
                            onError={(e) => (e.target.src = '/images/default-image.png')}
                            className="card-img-top object-fit-cover"
                            alt={product.name}
                          />
                        </div>
                      ) : (
                        <div className="bg-light border ratio ratio-4x3 d-flex align-items-center justify-content-center">
                          <span className="text-muted">No image</span>
                        </div>
                      )}
                      
                      {product.stock < 10 && (
                        <span className="position-absolute top-0 start-0 m-2 badge bg-danger">
                          {t.limitedStock}
                        </span>
                      )}
                      
                      <span className="position-absolute top-0 end-0 m-2 badge bg-primary">
                        {product.category}
                      </span>
                    </div>
                    
                    <div className="card-body">
                      <h5 className="card-title fw-semibold mb-2">{product.name}</h5>
                      <p className="card-text text-muted small mb-3 line-clamp-2">
                        {product.description || 'No description available'}
                      </p>
                      
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="fw-bold text-primary fs-5">
                          {product.price.toLocaleString()} Fbu
                        </div>
                        <div className="text-muted small">
                          <span className="fw-medium">{t.stock}:</span> {product.stock} {product.unity}
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(product);
                          }}
                        >
                          {t.details}
                        </button>
                        
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                        >
                          <FaShoppingCart /> {t.addToCart}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-5">
                <nav>
                  <ul className="pagination">
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setPage(page - 1)}
                      >
                        {t.previous}
                      </button>
                    </li>
                    
                    {[...Array(totalPages).keys()].map(p => (
                      <li 
                        key={p + 1} 
                        className={`page-item ${page === p + 1 ? 'active' : ''}`}
                      >
                        <button 
                          className="page-link" 
                          onClick={() => setPage(p + 1)}
                        >
                          {p + 1}
                        </button>
                      </li>
                    ))}
                    
                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setPage(page + 1)}
                      >
                        {t.next}
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </>
        )}

        {/* Modale Détails Produit */}
        {selectedProduct && (
          <Modal show={showModal} onHide={closeModal} size="lg" centered>
            <Modal.Header closeButton className="bg-light border-bottom-0 pb-0">
              <Modal.Title className="fw-bold text-primary">{selectedProduct.name}</Modal.Title>
            </Modal.Header>
            
            <Modal.Body className="p-4">
              <div className="row">
                <div className="col-md-6 mb-4 mb-md-0">
                  {selectedProduct.image ? (
                    <div className="ratio ratio-1x1 rounded-4 overflow-hidden shadow-sm">
                      <img
                        src={`${BASE_API_URL}/${selectedProduct.image}`}
                        alt={selectedProduct.name}
                        className="object-fit-cover"
                        onError={(e) => (e.target.src = '/images/default-image.png')}
                      />
                    </div>
                  ) : (
                    <div className="bg-light border rounded-4 ratio ratio-1x1 d-flex align-items-center justify-content-center">
                      <span className="text-muted">No image available</span>
                    </div>
                  )}
                </div>
                
                <div className="col-md-6">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <span className="badge bg-primary">{selectedProduct.category}</span>
                      <h2 className="fw-bold mt-2 mb-0">{selectedProduct.price.toLocaleString()} Fbu</h2>
                      <p className="text-muted mb-1">
                        <span className="fw-medium">{t.stock}:</span> {selectedProduct.stock} {selectedProduct.unity}
                      </p>
                    </div>
                    
                    {user?.id === selectedProduct.user_id && (
                      <button 
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => openEditProductForm(selectedProduct)}
                      >
                        <FaEdit /> {t.editProduct}
                      </button>
                    )}
                  </div>
                  
                  <p className="mb-4">
                    {selectedProduct.description || 'No description available'}
                  </p>
                  
                  <div className="d-flex align-items-center mb-3">
                    <span className="fw-medium me-2">{t.vendor}:</span>
                    <span className="badge bg-info text-dark">
                      {selectedProduct.vendor_name || 'Unknown'}
                    </span>
                  </div>
                  
                  <div className="d-grid">
                    {/* CORRECTION : Modification du bouton Add to Cart */}
                    <button 
                      className="btn btn-primary btn-lg"
                      onClick={() => {
                        // Ajouter au panier avant de fermer la modale
                        addToCart(selectedProduct);
                        // Ne pas fermer immédiatement la modale
                        // closeModal(); // Retiré pour laisser l'utilisateur continuer
                      }}
                    >
                      <FaShoppingCart /> {t.addToCart}
                    </button>
                  </div>
                </div>
              </div>
              
              <hr className="my-4" />
              
              <div>
                <h5 className="fw-bold mb-3">
                  {t.customerReviews}
                  {reviews.length > 0 && (
                    <span className="ms-2 badge bg-primary">
                      {calculateAverageRating(reviews)}/5 {t.averageRating}
                    </span>
                  )}
                </h5>
                
                {loadingReviews ? (
                  <div className="text-center py-3">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">{t.loading}</span>
                    </div>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-4 bg-light rounded-3">
                    <p className="text-muted mb-0">{t.noReviews}</p>
                  </div>
                ) : (
                  <div className="mb-4">
                    {reviews.map(r => (
                      <div key={r.id} className="card border-0 shadow-sm rounded-3 mb-3">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="card-title mb-0 fw-bold">{r.user_name}</h6>
                            <small className="text-muted">
                              {new Date(r.created_at).toLocaleDateString()}
                            </small>
                          </div>
                          
                          <div className="d-flex align-items-center mb-2">
                            {renderStars(r.rating)}
                            <span className="ms-2 fw-medium">{r.rating}/5</span>
                          </div>
                          
                          <p className="card-text mb-0">{r.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="bg-light p-4 rounded-3">
                  <h6 className="fw-bold mb-3">{t.addReview}</h6>
                  
                  {user ? (
                    <form onSubmit={submitReview}>
                      <div className="mb-3">
                        <label className="form-label fw-medium">{t.yourRating}</label>
                        <div className="d-flex align-items-center">
                          <select 
                            className="form-select w-auto" 
                            value={newRating} 
                            onChange={e => setNewRating(parseInt(e.target.value))}
                          >
                            {[5, 4, 3, 2, 1].map(star => (
                              <option key={star} value={star}>{star} {star === 1 ? 'star' : 'stars'}</option>
                            ))}
                          </select>
                          <div className="ms-2">
                            {renderStars(newRating)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label fw-medium">{t.yourComment}</label>
                        <textarea 
                          className="form-control" 
                          value={newComment} 
                          onChange={e => setNewComment(e.target.value)} 
                          rows={3}
                          placeholder={language === 'en' 
                            ? "Share your experience with this product..." 
                            : "Partagez votre expérience avec ce produit..."}
                        />
                      </div>
                      
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={submittingReview}
                      >
                        {submittingReview ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {t.submitting}
                          </>
                        ) : (
                          t.submitReview
                        )}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center p-3">
                      <p className="mb-3">
                        <em>{t.loginToReview}</em>
                      </p>
                      <button className="btn btn-outline-primary">
                        {t.login}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Modal.Body>
            
            <Modal.Footer className="bg-light border-top-0">
              <Button variant="outline-secondary" onClick={closeModal}>
                {t.close}
              </Button>
            </Modal.Footer>
          </Modal>
        )}

        {/* Modale Formulaire produit */}
        <Modal show={showProductFormModal} onHide={closeProductForm} size="lg" centered>
          <Modal.Header closeButton className="bg-light">
            <Modal.Title className="fw-bold">
              {editProduct ? t.editProduct : t.addProduct}
            </Modal.Title>
          </Modal.Header>
          
          <Modal.Body>
            <ProductForm
              product={editProduct}
              onSuccess={handleProductSaved}
              onCancel={closeProductForm}
            />
          </Modal.Body>
        </Modal>
      </div>

      {/* Bouton flottant pour ajouter un produit */}
      {user && (
        <button 
          className="btn btn-primary rounded-circle p-3 shadow-lg position-fixed"
          style={{ bottom: '30px', right: '30px', zIndex: 1000 }}
          onClick={openProductForm}
        >
          <FaPlus size={24} />
        </button>
      )}
    </MarketplaceLayout>
  );
}