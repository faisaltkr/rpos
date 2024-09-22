// src/i18n.js
import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    dashboard: 'Dashboard',
    invoiceNo: 'Invoice No',
    salesDate: 'Sales Date',
    customer: 'Customer',
    address: 'Address',
    code: 'Code',
    name: 'Name',
    secondName: 'Second Name (Arabic)',
    tax: 'TAX.%',
    qty: 'Qty',
    uom: 'UOM',
    sRate: 'S.Rate',
    grossAmt: 'Gross Amt',
    netAmt: 'Net Amt',
    vatAmt: 'VAT.Amt',
    total: 'Total',
    save: 'Save',
    clear: 'Clear',
    cancel: 'Cancel',
    deleteAllRows: 'Delete All Rows',
    discount: 'Discount',
    charges: 'Charges',
    roundOff: 'Round Off',
    grandTotal: 'Grand Total',
    warehouse: 'Warehouse',
    remarks: 'Remarks',
    balance: 'Balance',
    suggestions: {
      code: 'Code',
      name: 'Name',
      sellingPrice: 'Selling Price',
      purchasePrice: 'Purchase Price',
      stock: 'Stock'
    },
    genWarehouse: 'GEN.WAREHOUSE',
    SalesMan:"Sales Man"
  },
  ar: {
    dashboard: 'لوحة القيادة',
    invoiceNo: 'رقم الفاتورة',
    salesDate: 'تاريخ البيع',
    customer: 'العميل',
    address: 'عنوان',
    code: 'رمز',
    name: 'اسم',
    secondName: 'الاسم الثاني (بالعربية)',
    tax: 'ضريبة%',
    qty: 'الكمية',
    uom: 'الوحدة',
    sRate: 'سعر البيع',
    grossAmt: 'المبلغ الإجمالي',
    netAmt: 'صافي المبلغ',
    vatAmt: 'ضريبة القيمة المضافة',
    total: 'الإجمالي',
    save: 'حفظ',
    clear: 'مسح',
    cancel: 'إلغاء',
    deleteAllRows: 'حذف جميع الصفوف',
    discount: 'خصم',
    charges: 'الرسوم',
    roundOff: 'التقريب',
    grandTotal: 'الإجمالي الكلي',
    warehouse: 'مستودع',
    remarks: 'ملاحظات',
    balance: 'رصيد',
    suggestions: {
      code: 'رمز',
      name: 'اسم',
      sellingPrice: 'سعر البيع',
      purchasePrice: 'سعر الشراء',
      stock: 'المخزون'
    },
    genWarehouse: 'المستودع العام',
    SalesMan:'رجل المبيعات'
  }
};

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});

export default i18n;
