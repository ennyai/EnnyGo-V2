import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Clock, ArrowRight, Calendar, User } from "lucide-react";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Training Tips for Ultra-Endurance Events",
      author: "Sarah Johnson",
      date: "June 15, 2024",
      category: "Training",
      excerpt: "Discover the essential training strategies for preparing for your first ultra-endurance event...",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211"
    },
    {
      id: 2,
      title: "Nutrition Strategies for Long Distance Athletes",
      author: "Mike Chen",
      date: "June 12, 2024",
      category: "Nutrition",
      excerpt: "Learn about the best nutrition practices to fuel your long-distance training and events...",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061"
    },
    {
      id: 3,
      title: "Mental Toughness in Endurance Sports",
      author: "Emma Wilson",
      date: "June 10, 2024",
      category: "Mental Health",
      excerpt: "Develop the mental resilience needed to tackle challenging endurance events...",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5"
    }
  ];

  const categories = ["All", "Training", "Nutrition", "Mental Health", "Success Stories"];

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Insights, stories, and tips from the EnnyGo community
        </p>
      </section>

      <section className="flex flex-wrap gap-2 justify-center mb-12">
        {categories.map((category, index) => (
          <Button
            key={category}
            variant={index === 0 ? "default" : "outline"}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {blogPosts.map(post => (
          <Card key={post.id} className="overflow-hidden flex flex-col">
            <div 
              className="h-48 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${post.image})` }}
            />
            <CardHeader>
              <div className="flex items-center gap-4 mb-2">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {post.readTime}
                </span>
              </div>
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {post.excerpt}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {post.date}
                </span>
              </div>
            </CardContent>
            <CardFooter className="pt-6">
              <Button variant="ghost" className="ml-auto gap-2">
                Read More <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>

      <section className="mb-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h2>
              <p className="text-primary-foreground/90">
                Get the latest articles and training tips delivered to your inbox
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/10 border-white/20 placeholder:text-white/60"
              />
              <Button variant="secondary">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Blog; 