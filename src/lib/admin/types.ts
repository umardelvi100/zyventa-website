export type VerificationStatus = "pending" | "verified" | "suspended" | "rejected";
export type ProductApprovalStatus = "pending_review" | "approved" | "rejected";
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "returned"
  | "cancelled";
export type NotificationSeverity = "info" | "warning" | "error" | "success";
export type NotificationType =
  | "seller_registration"
  | "seller_verification"
  | "product_approval"
  | "product_rejected"
  | "high_return"
  | "low_stock"
  | "large_order";

export interface ChartPoint {
  label: string;
  value: number;
}

export interface CategoryPoint {
  label: string;
  value: number;
  color: string;
}

export interface AdminSeller {
  id: string;
  companyName: string;
  sellerName: string;
  email: string;
  phone: string;
  logoInitials: string;
  logoColor: string;
  registrationDate: string;
  verificationStatus: VerificationStatus;
  productCount: number;
  activeProducts: number;
  totalSales: number;
  totalRevenueFils: number;
  averageRating: number;
  reviewCount: number;
  commissionFils: number;
  businessCategory: string;
  businessAddress: string;
  vatNumber: string;
  lastActive: string;
  returnRate: number;
  highestSellingProduct: string;
  highestRatedProduct: string;
  lowestRatedProduct: string;
  bestCategory: string;
  monthlyRevenue: ChartPoint[];
  monthlySales: ChartPoint[];
  categoryDistribution: CategoryPoint[];
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  sellerId: string;
  sellerName: string;
  category: string;
  priceFils: number;
  approvalStatus: ProductApprovalStatus;
  submittedDate: string;
  reviewedDate?: string;
  stock: number;
  totalSold: number;
  rating: number;
  reviewCount: number;
  rejectionReason?: string;
}

export interface AdminOrder {
  id: string;
  customerId: string;
  customerName: string;
  sellerId: string;
  sellerName: string;
  products: string[];
  totalFils: number;
  commissionFils: number;
  status: OrderStatus;
  orderDate: string;
  city: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  totalOrders: number;
  totalSpentFils: number;
  lastActive: string;
  city: string;
}

export interface AdminNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  entityId?: string;
  entityType?: "seller" | "product" | "order" | "customer";
  severity: NotificationSeverity;
}
