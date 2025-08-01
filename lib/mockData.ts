// Placeholder mock data for the admin panel

export interface Magazine {
  id: string;
  title: string;
  category: string;
  publisher: string;
  coverImageUrl: string;
  issueDate: string;
  description?: string;
  status?: 'active' | 'inactive' | 'draft';
}

export const magazines: Magazine[] = [
  {
    id: '1',
    title: 'Tech Insights Monthly',
    category: 'Technology',
    publisher: 'Digital Media Corp',
    coverImageUrl: 'https://placehold.co/300x400/2563eb/ffffff?text=Tech+Insights',
    issueDate: '2024-01-15',
    description: 'Latest trends in technology and innovation',
    status: 'active'
  },
  {
    id: '2',
    title: 'Fashion Trends Weekly',
    category: 'Fashion',
    publisher: 'Style Publications',
    coverImageUrl: 'https://placehold.co/300x400/dc2626/ffffff?text=Fashion+Trends',
    issueDate: '2024-01-10',
    description: 'Exclusive fashion insights and style guides',
    status: 'active'
  },
  {
    id: '3',
    title: 'Health & Wellness Today',
    category: 'Health',
    publisher: 'Wellness Media',
    coverImageUrl: 'https://placehold.co/300x400/059669/ffffff?text=Health+Wellness',
    issueDate: '2024-01-08',
    description: 'Your guide to healthy living and wellness',
    status: 'active'
  },
  {
    id: '4',
    title: 'Business Strategy Quarterly',
    category: 'Business',
    publisher: 'Corporate Press',
    coverImageUrl: 'https://placehold.co/300x400/7c3aed/ffffff?text=Business+Strategy',
    issueDate: '2024-01-05',
    description: 'Strategic insights for modern businesses',
    status: 'active'
  },
  {
    id: '5',
    title: 'Travel Adventures',
    category: 'Travel',
    publisher: 'Wanderlust Media',
    coverImageUrl: 'https://placehold.co/300x400/ea580c/ffffff?text=Travel+Adventures',
    issueDate: '2024-01-12',
    description: 'Discover amazing destinations worldwide',
    status: 'active'
  },
  {
    id: '6',
    title: 'Culinary Arts Monthly',
    category: 'Food',
    publisher: 'Gourmet Publications',
    coverImageUrl: 'https://placehold.co/300x400/be123c/ffffff?text=Culinary+Arts',
    issueDate: '2024-01-03',
    description: 'Fine dining and culinary excellence',
    status: 'active'
  },
  {
    id: '7',
    title: 'Sports & Fitness',
    category: 'Sports',
    publisher: 'Athletic Media',
    coverImageUrl: 'https://placehold.co/300x400/0891b2/ffffff?text=Sports+Fitness',
    issueDate: '2024-01-07',
    description: 'Sports news and fitness tips',
    status: 'active'
  },
  {
    id: '8',
    title: 'Science Discovery',
    category: 'Science',
    publisher: 'Research Publications',
    coverImageUrl: 'https://placehold.co/300x400/65a30d/ffffff?text=Science+Discovery',
    issueDate: '2024-01-14',
    description: 'Latest scientific discoveries and research',
    status: 'active'
  },
  {
    id: '9',
    title: 'Art & Culture',
    category: 'Arts',
    publisher: 'Cultural Media',
    coverImageUrl: 'https://placehold.co/300x400/9333ea/ffffff?text=Art+Culture',
    issueDate: '2024-01-09',
    description: 'Exploring art, culture, and creativity',
    status: 'active'
  },
  {
    id: '10',
    title: 'Environmental Focus',
    category: 'Environment',
    publisher: 'Green Media',
    coverImageUrl: 'https://placehold.co/300x400/16a34a/ffffff?text=Environmental+Focus',
    issueDate: '2024-01-11',
    description: 'Environmental awareness and sustainability',
    status: 'active'
  },
  {
    id: '11',
    title: 'Finance & Investment',
    category: 'Finance',
    publisher: 'Financial Press',
    coverImageUrl: 'https://placehold.co/300x400/c2410c/ffffff?text=Finance+Investment',
    issueDate: '2024-01-06',
    description: 'Financial insights and investment strategies',
    status: 'active'
  },
  {
    id: '12',
    title: 'Education Today',
    category: 'Education',
    publisher: 'Academic Media',
    coverImageUrl: 'https://placehold.co/300x400/1d4ed8/ffffff?text=Education+Today',
    issueDate: '2024-01-13',
    description: 'Educational trends and learning resources',
    status: 'active'
  },
  {
    id: '13',
    title: 'Lifestyle & Leisure',
    category: 'Lifestyle',
    publisher: 'Lifestyle Publications',
    coverImageUrl: 'https://placehold.co/300x400/e11d48/ffffff?text=Lifestyle+Leisure',
    issueDate: '2024-01-04',
    description: 'Lifestyle tips and leisure activities',
    status: 'active'
  },
  {
    id: '14',
    title: 'Automotive World',
    category: 'Automotive',
    publisher: 'Auto Media',
    coverImageUrl: 'https://placehold.co/300x400/475569/ffffff?text=Automotive+World',
    issueDate: '2024-01-02',
    description: 'Latest in automotive industry and reviews',
    status: 'active'
  },
  {
    id: '15',
    title: 'Home & Garden',
    category: 'Home',
    publisher: 'Home Publications',
    coverImageUrl: 'https://placehold.co/300x400/84cc16/ffffff?text=Home+Garden',
    issueDate: '2024-01-16',
    description: 'Home improvement and gardening tips',
    status: 'active'
  }
];

export interface User {
  id: string;
  email: string;
  name: string;
  subscriptionStatus: 'active' | 'inactive' | 'trial';
  subscriptionEndDate: string;
  joinDate?: string;
  lastLogin?: string;
  magazinesRead?: number;
}

export const users: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    subscriptionStatus: 'active',
    subscriptionEndDate: '2024-12-31',
    joinDate: '2023-01-15',
    lastLogin: '2024-01-20',
    magazinesRead: 45
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    subscriptionStatus: 'active',
    subscriptionEndDate: '2024-11-30',
    joinDate: '2023-03-22',
    lastLogin: '2024-01-19',
    magazinesRead: 32
  },
  {
    id: '3',
    email: 'mike.wilson@example.com',
    name: 'Mike Wilson',
    subscriptionStatus: 'trial',
    subscriptionEndDate: '2024-02-15',
    joinDate: '2024-01-10',
    lastLogin: '2024-01-20',
    magazinesRead: 8
  },
  {
    id: '4',
    email: 'sarah.johnson@example.com',
    name: 'Sarah Johnson',
    subscriptionStatus: 'inactive',
    subscriptionEndDate: '2023-12-31',
    joinDate: '2022-08-14',
    lastLogin: '2023-12-28',
    magazinesRead: 67
  },
  {
    id: '5',
    email: 'david.brown@example.com',
    name: 'David Brown',
    subscriptionStatus: 'active',
    subscriptionEndDate: '2024-10-15',
    joinDate: '2023-06-08',
    lastLogin: '2024-01-18',
    magazinesRead: 23
  },
  {
    id: '6',
    email: 'emma.davis@example.com',
    name: 'Emma Davis',
    subscriptionStatus: 'trial',
    subscriptionEndDate: '2024-02-28',
    joinDate: '2024-01-05',
    lastLogin: '2024-01-20',
    magazinesRead: 5
  },
  {
    id: '7',
    email: 'robert.miller@example.com',
    name: 'Robert Miller',
    subscriptionStatus: 'active',
    subscriptionEndDate: '2024-09-20',
    joinDate: '2023-04-12',
    lastLogin: '2024-01-19',
    magazinesRead: 41
  },
  {
    id: '8',
    email: 'lisa.garcia@example.com',
    name: 'Lisa Garcia',
    subscriptionStatus: 'inactive',
    subscriptionEndDate: '2023-11-30',
    joinDate: '2022-12-03',
    lastLogin: '2023-11-25',
    magazinesRead: 28
  },
  {
    id: '9',
    email: 'thomas.anderson@example.com',
    name: 'Thomas Anderson',
    subscriptionStatus: 'active',
    subscriptionEndDate: '2024-08-10',
    joinDate: '2023-07-19',
    lastLogin: '2024-01-20',
    magazinesRead: 56
  },
  {
    id: '10',
    email: 'amanda.white@example.com',
    name: 'Amanda White',
    subscriptionStatus: 'trial',
    subscriptionEndDate: '2024-03-10',
    joinDate: '2024-01-12',
    lastLogin: '2024-01-20',
    magazinesRead: 12
  },
  {
    id: '11',
    email: 'chris.lee@example.com',
    name: 'Chris Lee',
    subscriptionStatus: 'active',
    subscriptionEndDate: '2024-07-25',
    joinDate: '2023-05-30',
    lastLogin: '2024-01-17',
    magazinesRead: 38
  },
  {
    id: '12',
    email: 'jessica.taylor@example.com',
    name: 'Jessica Taylor',
    subscriptionStatus: 'inactive',
    subscriptionEndDate: '2023-10-15',
    joinDate: '2022-09-20',
    lastLogin: '2023-10-10',
    magazinesRead: 34
  },
  {
    id: '13',
    email: 'kevin.martinez@example.com',
    name: 'Kevin Martinez',
    subscriptionStatus: 'active',
    subscriptionEndDate: '2024-06-30',
    joinDate: '2023-08-05',
    lastLogin: '2024-01-20',
    magazinesRead: 29
  },
  {
    id: '14',
    email: 'rachel.clark@example.com',
    name: 'Rachel Clark',
    subscriptionStatus: 'trial',
    subscriptionEndDate: '2024-02-20',
    joinDate: '2024-01-08',
    lastLogin: '2024-01-19',
    magazinesRead: 7
  },
  {
    id: '15',
    email: 'daniel.rodriguez@example.com',
    name: 'Daniel Rodriguez',
    subscriptionStatus: 'active',
    subscriptionEndDate: '2024-05-15',
    joinDate: '2023-02-28',
    lastLogin: '2024-01-20',
    magazinesRead: 63
  }
];

export const categories = [
  { id: 1, name: 'Technology' },
  { id: 2, name: 'Health' },
  { id: 3, name: 'Lifestyle' },
]; 