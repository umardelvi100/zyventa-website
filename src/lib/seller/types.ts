export type SellerVerificationStatus = "pending" | "approved" | "rejected" | "suspended";

export type SellerOrderStatus =
  | "pending"
  | "packed"
  | "warehouse_accepted"
  | "ready_for_pickup"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "returned"
  | "cancelled";

export interface SellerOrder {
  id: string;
  customerName: string;
  product: string;
  sku: string;
  quantity: number;
  orderDate: string;
  status: SellerOrderStatus;
  warehouse: string;
  courier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  paymentStatus: "paid" | "pending" | "refunded";
  returnStatus: "none" | "requested" | "approved" | "rejected";
  totalFils: number;
}

export interface SellerProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  priceFils: number;
  stock: number;
  active: boolean;
  rating: number;
  orders: number;
  revenueFils: number;
  approvalStatus: "pending" | "approved" | "rejected";
}

export interface SellerWarehouse {
  id: string;
  name: string;
  location: string;
  manager: string;
  productsStored: number;
  ordersProcessed: number;
  capacityPercent: number;
  status: "active" | "inactive" | "maintenance";
}

export interface SellerInventoryItem {
  id: string;
  productName: string;
  sku: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  incomingStock: number;
  warehouseLocation: string;
  lastUpdated: string;
}

export interface SellerShipment {
  id: string;
  orderId: string;
  customerName: string;
  product: string;
  status: "pending" | "ready" | "in_transit" | "delivered" | "failed";
  courier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  createdAt: string;
}

export interface SellerNotification {
  id: string;
  type: "order" | "approval" | "rejection" | "low_stock" | "review" | "return" | "payment" | "payout" | "delay";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: "info" | "warning" | "success" | "error";
}

export interface SellerReview {
  id: string;
  customerName: string;
  productName: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  replied: boolean;
}

export interface ChartPoint {
  label: string;
  value: number;
}
