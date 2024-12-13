import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  CreditCard, 
  DollarSign, 
  // CashStack, 
  TrendingUp 
} from 'lucide-react';

const AnalyticsTab = () => {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulating data fetch - replace with actual API call
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch order data');
        }
        const data = await response.json();
        const processedData = processOrderData(data);
        setOrderData(processedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processOrderData = (data) => {
    // Analyze payment methods
    const paymentMethodStats = data.reduce((acc, order) => {
      acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + order.total;
      return acc;
    }, {});

    // Analyze products
    const productStats = data.reduce((acc, order) => {
      order.items.forEach(item => {
        const productId = item.product?._id || 'Unknown';
        const existingProduct = acc.find(p => p.productId === productId);
        
        if (existingProduct) {
          existingProduct.totalRevenue += item.price * item.quantity;
          existingProduct.quantity += item.quantity;
        } else {
          acc.push({
            productId,
            productName: `Product ${productId}`,
            totalRevenue: item.price * item.quantity,
            quantity: item.quantity
          });
        }
      });
      return acc;
    }, []);

    // Total profits
    const totalProviderProfit = data.reduce((sum, order) => sum + (order.providerProfit || 0), 0);
    const totalPlatformProfit = data.reduce((sum, order) => sum + (order.platformProfit || 0), 0);

    return {
      paymentMethodStats: Object.entries(paymentMethodStats).map(([method, total]) => ({
        method,
        total
      })),
      productStats: productStats.sort((a, b) => b.totalRevenue - a.totalRevenue),
      totalProviderProfit,
      totalPlatformProfit
    };
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) return <div className="text-center py-10">جارٍ التحميل...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">إجمالي أرباح المزود</h3>
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-green-600">
            ${orderData.totalProviderProfit.toLocaleString()}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">أرباح المنصة</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-blue-600">
            ${orderData.totalPlatformProfit.toLocaleString()}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">طرق الدفع</h3>
            <CreditCard className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {orderData.paymentMethodStats.length}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">دفع كاش</h3>
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-orange-600">
            ${orderData.paymentMethodStats.find(p => p.method === 'cash')?.total.toLocaleString() || '0'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              تحليل المنتجات
            </h2>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={orderData.productStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="productName" 
                  stroke="#666" 
                  tickLine={false} 
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis 
                  stroke="#666" 
                  tickLine={false} 
                  axisLine={{ stroke: '#e0e0e0' }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255,255,255,0.9)', 
                    borderRadius: '10px', 
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
                  }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'الإيراد']}
                />
                <Legend />
                <Bar 
                  dataKey="totalRevenue" 
                  fill="#3B82F6" 
                  barSize={40} 
                  radius={[10, 10, 0, 0]} 
                />
                <Bar 
                  dataKey="quantity" 
                  fill="#10B981" 
                  barSize={40} 
                  radius={[10, 10, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              تحليل طرق الدفع
            </h2>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={orderData.paymentMethodStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                >
                  {orderData.paymentMethodStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'الإجمالي']}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  formatter={(value) => `${value} - $${orderData.paymentMethodStats.find(p => p.method === value)?.total.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;