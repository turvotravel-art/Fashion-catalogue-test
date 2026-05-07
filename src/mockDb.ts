import { Product } from './types';

export interface DbOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  status: 'Pending' | 'Paid' | 'Delivered';
  date: string;
  items: { name: string; quantity: number; price: number }[];
}

export interface DbCustomer {
  id: string;
  name: string;
  phone: string;
  totalSpend: number;
  ordersCount: number;
}

export interface DbProduct extends Product {
  stock: number;
  isAvailable: boolean;
  salesCount: number;
  costPrice: number;
}

const initialProducts: DbProduct[] = [
  { id: '1', name: 'Oud Noir Extrait', price: 145000, costPrice: 65000, category: 'Fragrance', image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=800&auto=format&fit=crop', stock: 12, isAvailable: true, salesCount: 45 },
  { id: '2', name: 'Chronograph LX', price: 850000, costPrice: 420000, category: 'Timepieces', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop', stock: 3, isAvailable: true, salesCount: 12 },
  { id: '3', name: 'Saffiano Tote', price: 220000, costPrice: 90000, category: 'Leather Goods', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop', stock: 0, isAvailable: false, salesCount: 89 },
  { id: '4', name: 'Velvet Evening Clutch', price: 95000, costPrice: 35000, category: 'Accessories', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800&auto=format&fit=crop', stock: 24, isAvailable: true, salesCount: 156 },
  { id: '5', name: 'Rose Gold Minimalist', price: 420000, costPrice: 180000, category: 'Timepieces', image: 'https://images.unsplash.com/photo-1580658325817-68cefe1ffa1e?q=80&w=800&auto=format&fit=crop', stock: 8, isAvailable: true, salesCount: 34 },
  { id: '6', name: 'Amber Vanilla Eau', price: 110000, costPrice: 40000, category: 'Fragrance', image: 'https://images.unsplash.com/photo-1594035910387-fea477242680?q=80&w=800&auto=format&fit=crop', stock: 45, isAvailable: true, salesCount: 210 },
];

const initialOrders: DbOrder[] = [
  { id: 'ORD-001', customerName: 'Aisha Bello', customerPhone: '08012345678', totalAmount: 255000, status: 'Paid', date: '2026-05-07', items: [{ name: 'Amber Vanilla Eau', quantity: 1, price: 110000 }, { name: 'Oud Noir Extrait', quantity: 1, price: 145000 }] },
  { id: 'ORD-002', customerName: 'Chinedu Eze', customerPhone: '08123456789', totalAmount: 850000, status: 'Pending', date: '2026-05-06', items: [{ name: 'Chronograph LX', quantity: 1, price: 850000 }] },
  { id: 'ORD-003', customerName: 'Oluwaseun Ade', customerPhone: '07011223344', totalAmount: 145000, status: 'Delivered', date: '2026-05-05', items: [{ name: 'Oud Noir Extrait', quantity: 1, price: 145000 }] },
  { id: 'ORD-004', customerName: 'Ngozi Okoro', customerPhone: '09088776655', totalAmount: 420000, status: 'Paid', date: '2026-05-04', items: [{ name: 'Rose Gold Minimalist', quantity: 1, price: 420000 }] },
  { id: 'ORD-005', customerName: 'Ibrahim Musa', customerPhone: '08055443322', totalAmount: 110000, status: 'Delivered', date: '2026-05-03', items: [{ name: 'Amber Vanilla Eau', quantity: 1, price: 110000 }] },
];

const initialCustomers: DbCustomer[] = [
  { id: 'CUST-001', name: 'Aisha Bello', phone: '08012345678', totalSpend: 255000, ordersCount: 1 },
  { id: 'CUST-002', name: 'Chinedu Eze', phone: '08123456789', totalSpend: 850000, ordersCount: 1 },
  { id: 'CUST-003', name: 'Oluwaseun Ade', phone: '07011223344', totalSpend: 145000, ordersCount: 1 },
  { id: 'CUST-004', name: 'Ngozi Okoro', phone: '09088776655', totalSpend: 420000, ordersCount: 1 },
  { id: 'CUST-005', name: 'Ibrahim Musa', phone: '08055443322', totalSpend: 110000, ordersCount: 1 },
];

export const MOCK_DB = {
  products: [...initialProducts],
  orders: [...initialOrders],
  customers: [...initialCustomers],
  analytics: {
    totalSalesThisMonth: 12500000,
    mostPopularProduct: 'Amber Vanilla Eau',
    salesData: [
      { name: 'Week 1', sales: 2500000 },
      { name: 'Week 2', sales: 3100000 },
      { name: 'Week 3', sales: 4200000 },
      { name: 'Week 4', sales: 2700000 },
    ]
  }
};

export function addOrder(customerName: string, customerPhone: string, items: { name: string; quantity: number; price: number }[], totalAmount: number) {
  const newOrder: DbOrder = {
    id: `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    customerName,
    customerPhone,
    totalAmount,
    status: 'Pending',
    date: new Date().toISOString().split('T')[0],
    items
  };
  MOCK_DB.orders.unshift(newOrder);

  // Update customer CRM
  const existingCustomer = MOCK_DB.customers.find(c => c.phone === customerPhone);
  if (existingCustomer) {
    existingCustomer.totalSpend += totalAmount;
    existingCustomer.ordersCount += 1;
    if (existingCustomer.name !== customerName) existingCustomer.name = customerName; // Update name if changed
  } else {
    MOCK_DB.customers.unshift({
      id: `CUST-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      name: customerName,
      phone: customerPhone,
      totalSpend: totalAmount,
      ordersCount: 1
    });
  }
}
