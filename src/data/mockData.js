export const INITIAL_NGOS = [
  {
    id: 'ngo-1',
    name: 'Atchayam Trust',
    darpanId: 'TN/2016/0104829',
    city: 'Erode & Chennai',
    state: 'Tamil Nadu',
    phone: '+91 94877 75888',
    email: 'info@atchayamtrust.org',
    focus: 'Elderly homeless & beggar rehabilitation',
    tier: 'Gold',
    status: 'Verified',
    lat: 13.0827,
    lng: 80.2707,
    shelterCapacity: 120,
    casesResolved: 4500
  },
  {
    id: 'ngo-2',
    name: 'SPYM (Society for Promotion of Youth & Masses)',
    darpanId: 'DL/2010/0034123',
    city: 'New Delhi',
    state: 'Delhi',
    phone: '+91 11 2689 3872',
    email: 'contact@spym.org',
    focus: 'Night shelters, children & destitute adults',
    tier: 'Gold',
    status: 'Verified',
    lat: 28.6139,
    lng: 77.2090,
    shelterCapacity: 350,
    casesResolved: 12000
  },
  {
    id: 'ngo-3',
    name: 'Apna Ghar Ashram (Bharatpur / Pan-India)',
    darpanId: 'RJ/2014/0078912',
    city: 'Jaipur & Delhi NCR',
    state: 'Rajasthan',
    phone: '+91 94140 23456',
    email: 'help@apnagharashram.org',
    focus: 'Helpless, sick, mentally ill destitute rehabilitation',
    tier: 'Gold',
    status: 'Verified',
    lat: 26.9124,
    lng: 75.7873,
    shelterCapacity: 800,
    casesResolved: 28000
  },
  {
    id: 'ngo-4',
    name: 'Koshish (TISS Field Action Project)',
    darpanId: 'MH/2011/0045120',
    city: 'Mumbai',
    state: 'Maharashtra',
    phone: '+91 22 2552 5000',
    email: 'koshish@tiss.edu',
    focus: 'De-criminalization of beggary & holistic family tracing',
    tier: 'Gold',
    status: 'Verified',
    lat: 19.0760,
    lng: 72.8777,
    shelterCapacity: 150,
    casesResolved: 3200
  },
  {
    id: 'ngo-5',
    name: 'Aashray Adhikar Abhiyan',
    darpanId: 'DL/2013/0061245',
    city: 'Delhi',
    state: 'Delhi',
    phone: '+91 11 2382 1178',
    email: 'aaa@delhihomeless.org',
    focus: 'Shelter rights, medical rescue & reintegration',
    tier: 'Silver',
    status: 'Verified',
    lat: 28.6500,
    lng: 77.2300,
    shelterCapacity: 200,
    casesResolved: 5100
  },
  {
    id: 'ngo-6',
    name: 'Snehadeep Trust for the Disabled',
    darpanId: 'KA/2015/0089341',
    city: 'Bengaluru',
    state: 'Karnataka',
    phone: '+91 80 2548 6890',
    email: 'snehadeep@blr.org',
    focus: 'Disabled beggars and abandoned senior citizens',
    tier: 'Silver',
    status: 'Verified',
    lat: 12.9716,
    lng: 77.5946,
    shelterCapacity: 90,
    casesResolved: 1800
  }
];

export const INITIAL_REPORTS = [
  {
    id: 'rep-101',
    personType: 'Elderly Man',
    estimatedAge: '65-70',
    condition: 'Needs medical attention & shelter, difficulty walking',
    location: {
      address: 'Near Old Delhi Railway Station, Gate 2',
      city: 'New Delhi',
      lat: 28.6608,
      lng: 77.2280
    },
    photo: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&auto=format&fit=crop&q=60',
    reportedAt: '2 hours ago',
    status: 'Assigned',
    assignedNGO: 'SPYM',
    reportedBy: 'Citizen Reporter (Aakash M.)',
    urgency: 'High'
  },
  {
    id: 'rep-102',
    personType: 'Mother with Child',
    estimatedAge: '28-30 (Child ~3)',
    condition: 'Hungry, living under flyover, child looks dehydrated',
    location: {
      address: 'Near Guindy Flyover, Anna Salai',
      city: 'Chennai',
      lat: 13.0067,
      lng: 80.2024
    },
    photo: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&auto=format&fit=crop&q=60',
    reportedAt: '4 hours ago',
    status: 'Rescue In Progress',
    assignedNGO: 'Atchayam Trust',
    reportedBy: 'Citizen Reporter (Priya S.)',
    urgency: 'Critical'
  },
  {
    id: 'rep-103',
    personType: 'Elderly Woman',
    estimatedAge: '75+',
    condition: 'Appears confused, memory loss, sitting near temple steps',
    location: {
      address: 'Dadar West, near Kabutar Khana',
      city: 'Mumbai',
      lat: 19.0178,
      lng: 72.8478
    },
    photo: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&auto=format&fit=crop&q=60',
    reportedAt: '6 hours ago',
    status: 'Pending Assignment',
    assignedNGO: null,
    reportedBy: 'Citizen Reporter (Rohan K.)',
    urgency: 'Medium'
  }
];

export const EMERGENCY_NUMBERS = [
  { label: 'Childline (Child Beggars)', number: '1098', desc: 'Ministry of WCD - 24/7 National Emergency' },
  { label: 'Elderline (Homeless Seniors)', number: '14567', desc: 'National Helpline for Senior Citizens' },
  { label: 'National Mental Health Helpline (KIRAN)', number: '1800-599-0019', desc: 'Rehabilitation of mentally ill persons' },
  { label: 'Police Emergency', number: '112', desc: 'Unified Emergency Response Service' }
];
