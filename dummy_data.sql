-- =======================================================
-- SQL SCRIPT: GENERATE DUMMY DATA UNTUK SIS NEXT.JS
-- =======================================================

-- 1. Bersihkan tabel (Hati-hati: ini akan menghapus data lama jika ada)
TRUNCATE TABLE "InvoiceItem" CASCADE;
TRUNCATE TABLE "Invoice" CASCADE;
TRUNCATE TABLE "StockBatch" CASCADE;
TRUNCATE TABLE "PoItem" CASCADE;
TRUNCATE TABLE "PurchaseOrder" CASCADE;
TRUNCATE TABLE "Contact" CASCADE;
TRUNCATE TABLE "User" CASCADE;
TRUNCATE TABLE "Product" CASCADE;
TRUNCATE TABLE "Warehouse" CASCADE;

-- 2. Buat Gudang & User Dummy
INSERT INTO "Warehouse" (id, warehouse_name, location)
VALUES 
  ('WH-001', 'Gudang Pusat Sleman', 'Sleman, DIY'),
  ('WH-002', 'Gudang Cabang Solo', 'Solo, Jateng');

INSERT INTO "User" (id, email, name, role, warehouse_id)
VALUES
  ('USR-01', 'owner@itise.com', 'Bapak Owner', 'OWNER', 'WH-001'),
  ('USR-02', 'gudang@itise.com', 'Andi Operator', 'OPERATOR', 'WH-001');

-- 3. Buat Produk Dummy (Inverter, Panel Surya, Baterai)
INSERT INTO "Product" (id, category, brand, model_name, unit, min_stock, qr_code, created_at, updated_at)
VALUES
  ('PRD-101', 'Inverter', 'Growatt', '10KTL3-X', 'Unit', 5, 'QR-101', NOW(), NOW()),
  ('PRD-102', 'Inverter', 'Huawei', 'SUN2000-5KTL', 'Unit', 3, 'QR-102', NOW(), NOW()),
  ('PRD-201', 'Solar Panel', 'Canadian Solar', '550Wp Mono', 'Pcs', 50, 'QR-201', NOW(), NOW()),
  ('PRD-202', 'Solar Panel', 'Jinko', 'Tiger Pro 400W', 'Pcs', 100, 'QR-202', NOW(), NOW()),
  ('PRD-301', 'Baterai', 'Pylontech', 'US2000C', 'Unit', 10, 'QR-301', NOW(), NOW());

-- 4. Buat Kontak (Supplier & Installer)
INSERT INTO "Contact" (id, name, type)
VALUES
  ('SUP-01', 'PT. Distributor Panel', 'Supplier'),
  ('SUP-02', 'CV. Inverter Mulia', 'Supplier'),
  ('INS-01', 'Teknisi Instalasi A', 'Installer'),
  ('INS-02', 'Teknisi Instalasi B', 'Installer');

-- 5. Simulasi Purchase Orders (PO) - Pengadaan
INSERT INTO "PurchaseOrder" (po_no, supplier_id, date, status, total_est, created_by, created_at, updated_at)
VALUES
  ('PO-2026-001', 'SUP-01', NOW() - INTERVAL '30 days', 'RECEIVED', 150000000, 'Admin', NOW() - INTERVAL '30 days', NOW()),
  ('PO-2026-002', 'SUP-02', NOW() - INTERVAL '15 days', 'RECEIVED', 45000000, 'Admin', NOW() - INTERVAL '15 days', NOW()),
  ('PO-2026-003', 'SUP-01', NOW() - INTERVAL '2 days', 'SENT', 18000000, 'Admin', NOW() - INTERVAL '2 days', NOW());

-- Isi Item PO-001 (Panel Surya) -> Harga Beli Miring (Anggap 2.500.000 / panel)
INSERT INTO "PoItem" (id, po_no, product_id, qty, unit, unit_price, subtotal)
VALUES
  ('POI-01', 'PO-2026-001', 'PRD-201', 40, 'Pcs', 2500000, 100000000),
  ('POI-02', 'PO-2026-001', 'PRD-202', 25, 'Pcs', 2000000, 50000000);

-- Isi Item PO-002 (Inverter) -> Harga Beli normal (Anggap 15.000.000)
INSERT INTO "PoItem" (id, po_no, product_id, qty, unit, unit_price, subtotal)
VALUES
  ('POI-03', 'PO-2026-002', 'PRD-101', 3, 'Unit', 15000000, 45000000);

-- Isi Item PO-003 (Baterai masih DRAFT/SENT)
INSERT INTO "PoItem" (id, po_no, product_id, qty, unit, unit_price, subtotal)
VALUES
  ('POI-04', 'PO-2026-003', 'PRD-301', 2, 'Unit', 9000000, 18000000);

-- 6. SIMULASI STOK BATCH (GUDANG / INVENTORY) hasil Receiving OTOMATIS
-- Hanya barang PO-001 dan PO-002 yang sudah RECEIVED yang dimasukkan Gudang
INSERT INTO "StockBatch" (batch_id, po_no, product_id, warehouse_id, qty_initial, qty_remaining, buy_price, entry_date)
VALUES
  ('BTH-001', 'PO-2026-001', 'PRD-201', 'WH-001', 40, 25, 2500000, NOW() - INTERVAL '29 days'), -- Awal:40, Sisa 25 (15 udah laku)
  ('BTH-002', 'PO-2026-001', 'PRD-202', 'WH-001', 25, 25, 2000000, NOW() - INTERVAL '29 days'), -- Awal:25, Sisa 25
  ('BTH-003', 'PO-2026-002', 'PRD-101', 'WH-001', 3, 1, 15000000, NOW() - INTERVAL '14 days');  -- Awal:3, Sisa 1 (2 udah laku)


-- 7. SIMULASI INVOICES (PENJUALAN -> Menghasilkan Keuntungan!)
-- Modal (HPP): 
-- PRD-201 15 laku x 2.5jt = 37.5jt. Harga Jual: 15 laku x 3jt = 45jt.
-- PRD-101 2 laku x 15jt = 30jt. Harga Jual: 2 laku x 18jt = 36jt.

INSERT INTO "Invoice" (inv_no, date, installer_id, status, total_hpp, total_amount, created_by, created_at, updated_at)
VALUES
  ('INV-2026-001', NOW() - INTERVAL '10 days', 'INS-01', 'PAID', 37500000, 45000000, 'Admin', NOW() - INTERVAL '10 days', NOW()),
  ('INV-2026-002', NOW() - INTERVAL '5 days', 'INS-02', 'PAID', 30000000, 36000000, 'Admin', NOW() - INTERVAL '5 days', NOW());

INSERT INTO "InvoiceItem" (id, inv_no, product_id, qty, unit, sell_price, subtotal, hpp_per_unit, hpp_subtotal)
VALUES
  ('INV-ITM-01', 'INV-2026-001', 'PRD-201', 15, 'Pcs', 3000000, 45000000, 2500000, 37500000),
  ('INV-ITM-02', 'INV-2026-002', 'PRD-101', 2, 'Unit', 18000000, 36000000, 15000000, 30000000);

-- COMPLETE!
