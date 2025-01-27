import Layout from "../components/Layout"

const Dashboard = () => {
  return (
    <Layout>
      <h1 className="mt-4">Dashboard</h1>
      <div className="row">
      
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Sales</h5>
              <p className="card-text">$12,345</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Orders</h5>
              <p className="card-text">1,234</p>
            </div>
          </div>
        </div>
        
      </div>
    </Layout>
    
  );
};

export default Dashboard;
