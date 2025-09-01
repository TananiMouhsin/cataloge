import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Package, Building, Tags, Users, ShoppingCart, DollarSign, TrendingUp, AlertTriangle, Eye } from 'lucide-react';
import StatCard from '../../components/admin/UI/StatCard';
import Card from '../../components/admin/UI/Card';
import Table from '../../components/admin/UI/Table';
import Modal from '../../components/admin/UI/Modal';
import { AdminCategory, AdminBrand, AdminProduct, AdminOrder } from '../../types';
import { mockCategories, mockBrands, mockProducts, mockOrders, mockDashboardStats } from '../../data/adminData';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard: React.FC = () => {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const recentOrders = mockOrders.slice(0, 5);
  const lowStockProducts = mockProducts.filter(p => p.stock < 10);

  const monthlyOrders = {
    January: 8,
    February: 4,
    March: 12,
    April: 7,
    May: 15,
    June: 9,
  };

  const categoryDistribution = mockCategories.map(category => ({
    name: category.nom,
    count: mockProducts.filter(p => p.id_categorie === category.id_categorie).length
  }));

  const handleViewOrderDetails = (order: AdminOrder) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const orderColumns = [
    { key: 'id_commande', label: 'Order ID' },
    { 
      key: 'date_creation', 
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric' 
      })
    },
    { 
      key: 'prix_total', 
      label: 'Total',
      render: (value: number) => `$${value.toFixed(2)}`
    },
    { 
      key: 'statut', 
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'Completed' ? 'bg-green-100 text-green-800' :
          value === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, order: AdminOrder) => (
        <button
          onClick={() => handleViewOrderDetails(order)}
          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
        >
          <Eye size={16} />
        </button>
      ),
    },
  ];

  const pieChartData = {
    labels: categoryDistribution.map(c => c.name),
    datasets: [
      {
        data: categoryDistribution.map(c => c.count),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const barChartData = {
    labels: Object.keys(monthlyOrders),
    datasets: [
      {
        label: 'Orders',
        data: Object.values(monthlyOrders),
        backgroundColor: '#3B82F6',
        borderColor: '#2563EB',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard title="Categories" value={mockDashboardStats.totalCategories} icon={Tags} color="blue" />
        <StatCard title="Brands" value={mockDashboardStats.totalBrands} icon={Building} color="green" />
        <StatCard title="Products" value={mockDashboardStats.totalProducts} icon={Package} color="purple" />
        <StatCard title="Users" value={mockDashboardStats.totalUsers} icon={Users} color="yellow" />
        <StatCard title="Orders" value={mockDashboardStats.totalOrders} icon={ShoppingCart} color="red" />
        <StatCard title="Revenue" value={`$${mockDashboardStats.totalRevenue.toFixed(2)}`} icon={DollarSign} color="green" trend={{ value: 12.5, isPositive: true }} />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Category Distribution">
          <div className="h-64 flex items-center justify-center">
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </Card>
        <Card title="Orders per Month">
          <div className="h-64">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`$${mockDashboardStats.totalRevenue.toFixed(2)}`} icon={DollarSign} color="green" trend={{ value: 12.5, isPositive: true }} />
        <StatCard title="Orders This Month" value={monthlyOrders.June} icon={Package} color="blue" trend={{ value: 8.2, isPositive: true }} />
        <StatCard title="Low Stock Items" value={lowStockProducts.length} icon={AlertTriangle} color="yellow" />
        <StatCard title="Avg. Order Value" value={`$${(mockDashboardStats.totalRevenue / mockOrders.filter(o => o.statut === 'Completed').length).toFixed(2)}`} icon={TrendingUp} color="purple" trend={{ value: 5.3, isPositive: true }} />
      </div>

      {/* Recent Orders and Low Stock Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Orders">
          <Table
            columns={orderColumns}
            data={recentOrders}
          />
        </Card>

        <Card title="Low Stock Alert">
          {lowStockProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">All products are well stocked!</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id_produit}
                  className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{product.nom}</p>
                    <p className="text-sm text-gray-600">
                      {mockCategories.find(c => c.id_categorie === product.id_categorie)?.nom} • 
                      {mockBrands.find(b => b.id_marque === product.id_marque)?.nom}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-yellow-800">{product.stock} remaining</p>
                    <p className="text-sm text-gray-600">of {product.stock + 10} total</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        title={`Order #${selectedOrder?.id_commande} Details`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Order ID</label>
                <p className="text-gray-900">{selectedOrder.id_commande}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  selectedOrder.statut === 'Completed' ? 'bg-green-100 text-green-800' :
                  selectedOrder.statut === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedOrder.statut}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <p className="text-gray-900">
                  {new Date(selectedOrder.date_creation).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: '2-digit', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total</label>
                <p className="text-gray-900 font-semibold">${selectedOrder.prix_total.toFixed(2)}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Products</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                {selectedOrder.produits.map((item, index) => {
                  const product = mockProducts.find(p => p.id_produit === item.id_produit);
                  return (
                    <div key={index} className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium">{product?.nom || 'Unknown Product'}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantite}</p>
                      </div>
                      <p className="font-semibold">
                        ${((product?.prix || 0) * item.quantite).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
