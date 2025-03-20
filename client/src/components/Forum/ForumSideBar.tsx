import React from 'react';
import { useForumStore } from '@/store/forumStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router';

export const ForumSidebar: React.FC = () => {
  const { filter, setFilter } = useForumStore();
  const navigate = useNavigate();
  const categories = [
    { id: 'recipe', name: 'Recipes', icon: '🍳' },
    { id: 'tip', name: 'Cooking Tips', icon: '💡' },
    { id: 'question', name: 'Questions', icon: '❓' },
  ];

  const popularTags = ['healthy', 'quick', 'vegetarian', 'dessert', 'breakfast'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            <Button 
              variant={!filter.category ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setFilter({ category: null })}
            >
              All Posts
            </Button>
            
            {categories.map(category => (
              <Button
                key={category.id}
                variant={filter.category === category.id ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setFilter({ category: category.id })}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Popular Tags</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {popularTags.map(tag => (
              <Badge 
                key={tag}
                variant={filter.tag === tag ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setFilter({ tag: filter.tag === tag ? null : tag })}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button className="w-full" onClick={() => navigate('/forum/new')}>
        Create New Post
      </Button>
    </div>
  );
};