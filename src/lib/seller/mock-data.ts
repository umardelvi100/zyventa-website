import type {
  SellerOrder,
  SellerProduct,
  SellerWarehouse,
  SellerInventoryItem,
  SellerShipment,
  SellerNotification,
  SellerReview,
  ChartPoint,
} from "./types";

export const MOCK_SELLER_ORDERS: SellerOrder[] = [
  { id: "ORD-7821", customerName: "Ahmed Al Rashidi", product: "Nourisil MD Scar Gel 30ml", sku: "SKU-NSG-001", quantity: 2, orderDate: "2026-07-30", status: "pending", warehouse: "DXB Central Hub", courier: "Aramex", trackingNumber: "ARX-882341", estimatedDelivery: "2026-08-03", paymentStatus: "paid", returnStatus: "none", totalFils: 17800 },
  { id: "ORD-7820", customerName: "Fatima Al Mansoori", product: "Calmi Relax Tablets 60s", sku: "SKU-CRT-002", quantity: 1, orderDate: "2026-07-29", status: "packed", warehouse: "SHJ Warehouse A", courier: "DHL", trackingNumber: "DHL-994421", estimatedDelivery: "2026-08-02", paymentStatus: "paid", returnStatus: "none", totalFils: 8900 },
  { id: "ORD-7819", customerName: "Mohammed Al Hashimi", product: "Vitamin C Serum 50ml", sku: "SKU-VCS-003", quantity: 3, orderDate: "2026-07-29", status: "shipped", warehouse: "DXB Central Hub", courier: "FedEx", trackingNumber: "FDX-661234", estimatedDelivery: "2026-08-01", paymentStatus: "paid", returnStatus: "none", totalFils: 26700 },
  { id: "ORD-7818", customerName: "Sara Al Zaabi", product: "Paracetamol 500mg x100", sku: "SKU-PCM-004", quantity: 1, orderDate: "2026-07-28", status: "delivered", warehouse: "ABU Hub", courier: "Noon Express", trackingNumber: "NEX-774412", estimatedDelivery: "2026-07-31", paymentStatus: "paid", returnStatus: "none", totalFils: 3500 },
  { id: "ORD-7817", customerName: "Khalid Al Nuaimi", product: "Sunscreen SPF 50 100ml", sku: "SKU-SUN-005", quantity: 2, orderDate: "2026-07-28", status: "out_for_delivery", warehouse: "DXB Central Hub", courier: "Aramex", trackingNumber: "ARX-882200", estimatedDelivery: "2026-07-30", paymentStatus: "paid", returnStatus: "none", totalFils: 11800 },
  { id: "ORD-7816", customerName: "Layla Al Shamsi", product: "Nourisil MD Scar Gel 30ml", sku: "SKU-NSG-001", quantity: 1, orderDate: "2026-07-27", status: "returned", warehouse: "SHJ Warehouse A", courier: "Aramex", trackingNumber: "ARX-880099", estimatedDelivery: "2026-07-29", paymentStatus: "refunded", returnStatus: "approved", totalFils: 8900 },
  { id: "ORD-7815", customerName: "Omar Al Farsi", product: "Collagen Booster 30caps", sku: "SKU-CLG-006", quantity: 2, orderDate: "2026-07-27", status: "warehouse_accepted", warehouse: "DXB Central Hub", courier: "DHL", trackingNumber: "DHL-991100", estimatedDelivery: "2026-08-01", paymentStatus: "paid", returnStatus: "none", totalFils: 23600 },
  { id: "ORD-7814", customerName: "Noor Al Mansoori", product: "Rose Water Toner 200ml", sku: "SKU-RWT-007", quantity: 4, orderDate: "2026-07-26", status: "ready_for_pickup", warehouse: "SHJ Warehouse A", courier: "FedEx", trackingNumber: "FDX-660001", estimatedDelivery: "2026-07-31", paymentStatus: "paid", returnStatus: "none", totalFils: 31600 },
  { id: "ORD-7813", customerName: "Hessa Al Mazrouei", product: "Vitamin D3 1000IU 90s", sku: "SKU-VD3-008", quantity: 1, orderDate: "2026-07-25", status: "cancelled", warehouse: "ABU Hub", courier: "-", trackingNumber: "-", estimatedDelivery: "-", paymentStatus: "refunded", returnStatus: "none", totalFils: 6500 },
  { id: "ORD-7812", customerName: "Tariq Al Rashid", product: "Hyaluronic Acid Cream 50ml", sku: "SKU-HAC-009", quantity: 1, orderDate: "2026-07-25", status: "delivered", warehouse: "DXB Central Hub", courier: "Aramex", trackingNumber: "ARX-877811", estimatedDelivery: "2026-07-28", paymentStatus: "paid", returnStatus: "none", totalFils: 14900 },
];

export const MOCK_SELLER_PRODUCTS: SellerProduct[] = [
  { id: "p1", name: "Nourisil MD Scar Gel 30ml", sku: "SKU-NSG-001", category: "Medicines", priceFils: 8900, stock: 142, active: true, rating: 4.7, orders: 284, revenueFils: 2527600, approvalStatus: "approved" },
  { id: "p2", name: "Calmi Relax Tablets 60s", sku: "SKU-CRT-002", category: "Medicines", priceFils: 8900, stock: 89, active: true, rating: 4.8, orders: 196, revenueFils: 1744400, approvalStatus: "approved" },
  { id: "p3", name: "Vitamin C Serum 50ml", sku: "SKU-VCS-003", category: "Cosmetics", priceFils: 8900, stock: 67, active: true, rating: 4.6, orders: 158, revenueFils: 1406200, approvalStatus: "approved" },
  { id: "p4", name: "Paracetamol 500mg x100", sku: "SKU-PCM-004", category: "Medicines", priceFils: 3500, stock: 8, active: true, rating: 4.3, orders: 412, revenueFils: 1442000, approvalStatus: "approved" },
  { id: "p5", name: "Sunscreen SPF 50 100ml", sku: "SKU-SUN-005", category: "Cosmetics", priceFils: 5900, stock: 54, active: true, rating: 4.5, orders: 103, revenueFils: 607700, approvalStatus: "approved" },
  { id: "p6", name: "Collagen Booster 30caps", sku: "SKU-CLG-006", category: "Consumables", priceFils: 11800, stock: 23, active: true, rating: 4.4, orders: 67, revenueFils: 790600, approvalStatus: "approved" },
  { id: "p7", name: "Rose Water Toner 200ml", sku: "SKU-RWT-007", category: "Cosmetics", priceFils: 7900, stock: 0, active: false, rating: 4.2, orders: 45, revenueFils: 355500, approvalStatus: "approved" },
  { id: "p8", name: "Vitamin D3 1000IU 90s", sku: "SKU-VD3-008", category: "Medicines", priceFils: 6500, stock: 112, active: true, rating: 4.6, orders: 88, revenueFils: 572000, approvalStatus: "approved" },
  { id: "p9", name: "Hyaluronic Acid Cream 50ml", sku: "SKU-HAC-009", category: "Cosmetics", priceFils: 14900, stock: 31, active: true, rating: 4.9, orders: 52, revenueFils: 774800, approvalStatus: "approved" },
  { id: "p10", name: "Retinol Night Serum 30ml", sku: "SKU-RNS-010", category: "Cosmetics", priceFils: 18900, stock: 5, active: true, rating: 4.7, orders: 28, revenueFils: 529200, approvalStatus: "pending" },
];

export const MOCK_SELLER_WAREHOUSES: SellerWarehouse[] = [
  { id: "w1", name: "DXB Central Hub", location: "Al Quoz Industrial, Dubai", manager: "Saeed Al Falasi", productsStored: 7, ordersProcessed: 1284, capacityPercent: 68, status: "active" },
  { id: "w2", name: "SHJ Warehouse A", location: "Sajaa Industrial, Sharjah", manager: "Reem Al Qaisi", productsStored: 4, ordersProcessed: 632, capacityPercent: 42, status: "active" },
  { id: "w3", name: "ABU Hub", location: "Mussafah Industrial, Abu Dhabi", manager: "Majid Al Bloushi", productsStored: 3, ordersProcessed: 287, capacityPercent: 24, status: "maintenance" },
];

export const MOCK_SELLER_INVENTORY: SellerInventoryItem[] = [
  { id: "i1", productName: "Nourisil MD Scar Gel 30ml", sku: "SKU-NSG-001", currentStock: 142, reservedStock: 18, availableStock: 124, incomingStock: 200, warehouseLocation: "DXB Central Hub", lastUpdated: "2026-07-30" },
  { id: "i2", productName: "Calmi Relax Tablets 60s", sku: "SKU-CRT-002", currentStock: 89, reservedStock: 7, availableStock: 82, incomingStock: 0, warehouseLocation: "SHJ Warehouse A", lastUpdated: "2026-07-30" },
  { id: "i3", productName: "Vitamin C Serum 50ml", sku: "SKU-VCS-003", currentStock: 67, reservedStock: 12, availableStock: 55, incomingStock: 100, warehouseLocation: "DXB Central Hub", lastUpdated: "2026-07-29" },
  { id: "i4", productName: "Paracetamol 500mg x100", sku: "SKU-PCM-004", currentStock: 8, reservedStock: 3, availableStock: 5, incomingStock: 500, warehouseLocation: "ABU Hub", lastUpdated: "2026-07-30" },
  { id: "i5", productName: "Sunscreen SPF 50 100ml", sku: "SKU-SUN-005", currentStock: 54, reservedStock: 6, availableStock: 48, incomingStock: 0, warehouseLocation: "SHJ Warehouse A", lastUpdated: "2026-07-29" },
  { id: "i6", productName: "Collagen Booster 30caps", sku: "SKU-CLG-006", currentStock: 23, reservedStock: 4, availableStock: 19, incomingStock: 50, warehouseLocation: "DXB Central Hub", lastUpdated: "2026-07-28" },
  { id: "i7", productName: "Rose Water Toner 200ml", sku: "SKU-RWT-007", currentStock: 0, reservedStock: 0, availableStock: 0, incomingStock: 150, warehouseLocation: "DXB Central Hub", lastUpdated: "2026-07-27" },
  { id: "i8", productName: "Vitamin D3 1000IU 90s", sku: "SKU-VD3-008", currentStock: 112, reservedStock: 9, availableStock: 103, incomingStock: 0, warehouseLocation: "SHJ Warehouse A", lastUpdated: "2026-07-30" },
  { id: "i9", productName: "Hyaluronic Acid Cream 50ml", sku: "SKU-HAC-009", currentStock: 31, reservedStock: 5, availableStock: 26, incomingStock: 75, warehouseLocation: "DXB Central Hub", lastUpdated: "2026-07-30" },
  { id: "i10", productName: "Retinol Night Serum 30ml", sku: "SKU-RNS-010", currentStock: 5, reservedStock: 2, availableStock: 3, incomingStock: 100, warehouseLocation: "SHJ Warehouse A", lastUpdated: "2026-07-29" },
];

export const MOCK_SELLER_SHIPMENTS: SellerShipment[] = [
  { id: "sh1", orderId: "ORD-7821", customerName: "Ahmed Al Rashidi", product: "Nourisil MD Scar Gel 30ml", status: "pending", courier: "Aramex", trackingNumber: "ARX-882341", estimatedDelivery: "2026-08-03", createdAt: "2026-07-30" },
  { id: "sh2", orderId: "ORD-7820", customerName: "Fatima Al Mansoori", product: "Calmi Relax Tablets 60s", status: "ready", courier: "DHL", trackingNumber: "DHL-994421", estimatedDelivery: "2026-08-02", createdAt: "2026-07-29" },
  { id: "sh3", orderId: "ORD-7819", customerName: "Mohammed Al Hashimi", product: "Vitamin C Serum 50ml", status: "in_transit", courier: "FedEx", trackingNumber: "FDX-661234", estimatedDelivery: "2026-08-01", createdAt: "2026-07-29" },
  { id: "sh4", orderId: "ORD-7818", customerName: "Sara Al Zaabi", product: "Paracetamol 500mg x100", status: "delivered", courier: "Noon Express", trackingNumber: "NEX-774412", estimatedDelivery: "2026-07-31", createdAt: "2026-07-28" },
  { id: "sh5", orderId: "ORD-7813", customerName: "Hessa Al Mazrouei", product: "Vitamin D3 1000IU 90s", status: "failed", courier: "-", trackingNumber: "-", estimatedDelivery: "-", createdAt: "2026-07-25" },
];

export const MOCK_SELLER_NOTIFICATIONS: SellerNotification[] = [
  { id: "n1", type: "order", title: "New order received", message: "ORD-7821: 2× Nourisil MD Scar Gel from Ahmed Al Rashidi", timestamp: "2026-07-30T09:14:00Z", read: false, severity: "info" },
  { id: "n2", type: "low_stock", title: "Low stock alert", message: "Paracetamol 500mg x100 has only 8 units remaining", timestamp: "2026-07-30T08:00:00Z", read: false, severity: "warning" },
  { id: "n3", type: "return", title: "Return request approved", message: "ORD-7816 return from Layla Al Shamsi has been processed", timestamp: "2026-07-29T14:22:00Z", read: false, severity: "info" },
  { id: "n4", type: "payout", title: "Payout processed", message: "AED 2,340 has been transferred to your bank account", timestamp: "2026-07-28T10:00:00Z", read: false, severity: "success" },
  { id: "n5", type: "review", title: "New 5-star review", message: "Hyaluronic Acid Cream received a 5-star review from a verified buyer", timestamp: "2026-07-28T08:45:00Z", read: true, severity: "success" },
  { id: "n6", type: "payment", title: "Payment received", message: "Payment of AED 267 received for ORD-7819", timestamp: "2026-07-27T16:10:00Z", read: true, severity: "success" },
  { id: "n7", type: "delay", title: "Warehouse delay", message: "ABU Hub is experiencing processing delays — 1–2 day impact expected", timestamp: "2026-07-27T11:00:00Z", read: true, severity: "warning" },
  { id: "n8", type: "approval", title: "Product approved", message: "Vitamin C Serum 50ml has been approved and is now live", timestamp: "2026-07-25T09:30:00Z", read: true, severity: "success" },
];

export const MOCK_SELLER_REVIEWS: SellerReview[] = [
  { id: "r1", customerName: "Ahmed K.", productName: "Hyaluronic Acid Cream 50ml", rating: 5, title: "Amazing results!", body: "Used it for two weeks and my skin texture improved significantly. Will buy again.", date: "2026-07-28", verified: true, replied: false },
  { id: "r2", customerName: "Sara M.", productName: "Vitamin C Serum 50ml", rating: 4, title: "Good product", body: "Works well but takes a few weeks to see results. Packaging was secure.", date: "2026-07-26", verified: true, replied: true },
  { id: "r3", customerName: "Mohammed R.", productName: "Calmi Relax Tablets 60s", rating: 5, title: "Excellent quality", body: "Very effective and fast delivery. Highly recommend.", date: "2026-07-24", verified: true, replied: false },
  { id: "r4", customerName: "Layla A.", productName: "Nourisil MD Scar Gel 30ml", rating: 3, title: "Average results", body: "Expected faster results. The gel itself is good quality but slow acting.", date: "2026-07-22", verified: true, replied: true },
  { id: "r5", customerName: "Omar F.", productName: "Sunscreen SPF 50 100ml", rating: 5, title: "Best sunscreen I've tried", body: "Non-greasy, light texture. Perfect for daily use in Dubai heat.", date: "2026-07-20", verified: true, replied: false },
  { id: "r6", customerName: "Noor H.", productName: "Collagen Booster 30caps", rating: 2, title: "Disappointed", body: "Did not notice much difference after a full month. Expected better.", date: "2026-07-18", verified: false, replied: false },
];

export const SELLER_MONTHLY_REVENUE: ChartPoint[] = [
  { label: "Aug", value: 188000 },
  { label: "Sep", value: 224000 },
  { label: "Oct", value: 198000 },
  { label: "Nov", value: 261000 },
  { label: "Dec", value: 312000 },
  { label: "Jan", value: 276000 },
  { label: "Feb", value: 243000 },
  { label: "Mar", value: 289400 },
  { label: "Apr", value: 318000 },
  { label: "May", value: 344000 },
  { label: "Jun", value: 372000 },
  { label: "Jul", value: 394000 },
];

export const SELLER_MONTHLY_ORDERS: ChartPoint[] = [
  { label: "Aug", value: 42 },
  { label: "Sep", value: 58 },
  { label: "Oct", value: 51 },
  { label: "Nov", value: 73 },
  { label: "Dec", value: 89 },
  { label: "Jan", value: 76 },
  { label: "Feb", value: 64 },
  { label: "Mar", value: 82 },
  { label: "Apr", value: 91 },
  { label: "May", value: 98 },
  { label: "Jun", value: 108 },
  { label: "Jul", value: 114 },
];

export const SELLER_MONTHLY_RETURNS: ChartPoint[] = [
  { label: "Aug", value: 2 },
  { label: "Sep", value: 3 },
  { label: "Oct", value: 4 },
  { label: "Nov", value: 2 },
  { label: "Dec", value: 5 },
  { label: "Jan", value: 3 },
  { label: "Feb", value: 2 },
  { label: "Mar", value: 4 },
  { label: "Apr", value: 3 },
  { label: "May", value: 2 },
  { label: "Jun", value: 3 },
  { label: "Jul", value: 2 },
];

export const CATEGORY_REVENUE: ChartPoint[] = [
  { label: "Medicines", value: 52 },
  { label: "Cosmetics", value: 36 },
  { label: "Consumables", value: 12 },
];
