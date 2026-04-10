export const generateInvoice = (order: any) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const itemsHtml = order.items.map((item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <div style="font-weight: bold; color: #333;">${item.productName || 'Product'}</div>
        <div style="font-size: 10px; color: #666;">${item.productId}</div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity} ${item.unit}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString()}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">₹${(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('');

  const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice - ${order.orderNumber || order._id}</title>
      <style>
        body { font-family: 'Inter', system-ui, sans-serif; padding: 40px; color: #333; line-height: 1.5; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #059467; padding-bottom: 20px; }
        .business-info h1 { margin: 0; color: #059467; font-size: 28px; font-weight: 900; text-transform: uppercase; }
        .invoice-details { text-align: right; }
        .invoice-details h2 { margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 2px; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #999; letter-spacing: 1px; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #f8f8f8; text-align: left; padding: 12px; font-size: 10px; text-transform: uppercase; color: #666; }
        .totals { margin-top: 30px; margin-left: auto; width: 300px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
        .total-row.grand { border-top: 2px solid #059467; margin-top: 10px; padding-top: 15px; font-weight: 900; font-size: 18px; color: #059467; }
        .footer { margin-top: 60px; text-align: center; border-top: 1px solid #eee; padding-top: 20px; font-size: 10px; color: #999; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="business-info">
          <h1>MANA VYAPAR</h1>
          <p style="font-size: 12px; color: #666; margin-top: 5px;">Modern Merchant Solutions</p>
        </div>
        <div class="invoice-details">
          <h2>TAX INVOICE</h2>
          <p style="font-size: 12px; font-weight: bold; margin-top: 5px;">#${order.orderNumber || order._id}</p>
          <p style="font-size: 12px;">Date: ${date}</p>
        </div>
      </div>

      <div style="display: flex; gap: 60px;" class="section">
        <div style="flex: 1;">
          <div class="section-title">Billed To</div>
          <div style="font-weight: bold; font-size: 16px;">${order.customerName || 'Walk-in Client'}</div>
          <div style="font-size: 12px; color: #666; margin-top: 4px;">+91 ${order.customerPhoneNumber || 'N/A'}</div>
        </div>
        <div style="flex: 1;">
          <div class="section-title">Payment Info</div>
          <div style="font-weight: bold; font-size: 14px;">Method: ${order.paymentMethod}</div>
          <div style="font-size: 12px; color: #666; margin-top: 4px;">Status: ${order.paymentStatus || 'COMPLETED'}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Order Manifest</div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Rate</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </div>

      <div class="totals">
        <div class="total-row">
          <span>Subtotal</span>
          <span>₹${order.subtotal?.toLocaleString()}</span>
        </div>
        ${order.couponCode ? `
        <div class="total-row" style="color: #059467; font-weight: bold;">
          <span>Discount (Coupon: ${order.couponCode})</span>
          <span>-₹${(order.discountAmount || 0).toLocaleString()}</span>
        </div>
        ` : ''}
        <div class="total-row">
          <span>Tax (GST)</span>
          <span>₹${(order.tax || 0).toLocaleString()}</span>
        </div>
        <div class="total-row grand">
          <span>Total Payable</span>
          <span>₹${order.totalAmount?.toLocaleString()}</span>
        </div>
      </div>

      <div class="footer">
        <p>This is a computer-generated invoice. No signature required.</p>
        <p>Thank you for choosing Mana Vyapar!</p>
      </div>

      <script>
        window.onload = function() { 
          window.print();
          setTimeout(() => { window.close(); }, 500);
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
