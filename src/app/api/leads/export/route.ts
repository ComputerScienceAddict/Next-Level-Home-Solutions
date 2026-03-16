import { NextResponse } from 'next/server';

const NICHEDATA_API_URL = 'https://customers-api.nichedata.ai/notices';

export async function GET() {
  try {
    const token = process.env.NICHEDATA_API_TOKEN;
    
    if (!token) {
      return new NextResponse('API token not configured', { status: 500 });
    }

    const response = await fetch(NICHEDATA_API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch leads: ${response.status}`, { 
        status: response.status 
      });
    }

    const data = await response.json();
    const notices = data.data || [];

    // Generate CSV header
    const csvHeaders = [
      'ID',
      'Type',
      'State',
      'County',
      'City',
      'Zip Code',
      'Address',
      'Sale Status',
      'Date of Sale',
      'Property Type',
      'Year Built',
      'Beds',
      'Baths',
      'Created At',
      'Updated At',
    ];

    // Generate CSV rows from attributes
    const csvRows = notices.map((notice: any) => {
      const attrs = notice.attributes || {};
      const propDetails = attrs.propertyDetails || {};
      
      return [
        attrs._id || '',
        attrs.recordType || '',
        attrs.state || '',
        attrs.county || '',
        attrs.city || '',
        attrs.zipCode || '',
        attrs.address || '',
        attrs.saleStatus || '',
        attrs.dateOfSale || '',
        propDetails.propertyType || '',
        propDetails.yearBuilt || '',
        propDetails.beds || '',
        propDetails.bathsTotal || '',
        attrs.createdAt || '',
        attrs.updatedAt || '',
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
    });

    // Combine header and rows
    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting leads to CSV:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
