import { ResourceCard } from "./resource-card"


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

interface ResourceGridProps {
  resources: Resource[]
}

export function ResourceGrid({ resources }: ResourceGridProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-800 mb-8">Resources</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <ResourceCard key={resource._id} resource={resource} />
        ))}
      </div>
    </div>
  )
}

