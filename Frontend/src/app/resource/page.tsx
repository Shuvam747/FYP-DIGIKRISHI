"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ResourceGrid } from './component/resource-grid';
import { NoContentFound } from './component/nocontentfound';

export interface Resource {
  _id: string;
  title: string;
  description: string;
  category: string;
  resourceType: 'pdf' | 'video' | 'article';
  url: string;
  uploadedBy: string;
  photo: string[];
  file: string[];
  isExpertVerified: boolean;
  language: string;
  votes: number;
  comment: string[];
  createdAt: string;
  updatedAt: string;
}


const getResources = async () => {
  try {
    const response = await axios.get('http://localhost:4000/api/v1/resource');
    return response.data;
  } catch (error) {
    console.error('Error fetching resources:', error);
    return [];
  }
};

export default function ResourcePage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getResources();
        setResources(data);
      } catch (error) {
        setError('Failed to load resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (resources.length === 0) {
    return <NoContentFound />
  }
  return <ResourceGrid resources={resources} />;
}
