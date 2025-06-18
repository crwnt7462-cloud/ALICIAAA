import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, Megaphone, Heart, MessageSquare, Share, Plus, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertForumPostSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Forum() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts = [] } = useQuery<any[]>({
    queryKey: ["/api/forum/posts"],
  });

  const form = useForm({
    resolver: zodResolver(insertForumPostSchema),
    defaultValues: {
      title: "",
      content: "",
      categoryId: 1,
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/forum/posts", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Discussion créée",
        description: "Votre discussion a été publiée avec succès.",
      });
      setIsDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer la discussion.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    createPostMutation.mutate(data);
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "il y a moins d'1h";
    if (diffInHours < 24) return `il y a ${diffInHours}h`;
    return `il y a ${Math.floor(diffInHours / 24)} jour(s)`;
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Forum Pro</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Communauté vérifiée de professionnels
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">247 en ligne</span>
        </div>
      </div>

      {/* Forum Categories */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button
          variant="outline"
          className="p-4 h-auto text-left hover:border-primary transition-colors"
        >
          <div className="flex items-center space-x-3 mb-2">
            <MessageCircle className="text-primary w-4 h-4" />
            <span className="font-medium">Discussions</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">245 sujets actifs</p>
        </Button>

        <Button
          variant="outline"
          className="p-4 h-auto text-left hover:border-primary transition-colors"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Megaphone className="text-secondary w-4 h-4" />
            <span className="font-medium">Annonces</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">12 nouvelles</p>
        </Button>
      </div>

      {/* Recent Discussions */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Discussions récentes</h3>

        {posts.map((post: any) => (
          <Card key={post.id}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">
                    {post.user?.firstName?.[0] || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium">
                      {post.user?.businessName || `${post.user?.firstName || ''} ${post.user?.lastName || ''}`.trim() || 'Utilisateur'}
                    </span>
                    {post.user?.isVerified && (
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(post.createdAt)}
                    </span>
                  </div>
                  <h4 className="font-medium mb-2">{post.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
                    {post.content}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                      <Heart className="w-3 h-3" />
                      <span>{post.likeCount || 0}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                      <MessageSquare className="w-3 h-3" />
                      <span>{post.replyCount || 0} réponses</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                      <Share className="w-3 h-3" />
                      <span>Partager</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Special AMA Card */}
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold">AMA en direct</h4>
                <p className="text-sm opacity-90">Avec Jean-Marc Maniatis</p>
              </div>
            </div>
            <p className="text-sm opacity-90 mb-3">
              Session Q&A en direct demain à 20h sur les dernières tendances colorimétrie 2024
            </p>
            <Button
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              Me rappeler
            </Button>
          </CardContent>
        </Card>

        {posts.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucune discussion pour le moment</p>
            <p className="text-sm mt-2">Soyez le premier à lancer une discussion !</p>
          </div>
        )}
      </div>

      {/* New Post Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-10">
            <Plus className="w-6 h-6" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle discussion</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Titre</Label>
              <Input {...form.register('title')} placeholder="Sujet de votre discussion" />
            </div>

            <div>
              <Label>Contenu</Label>
              <Textarea
                {...form.register('content')}
                placeholder="Décrivez votre question ou partagez votre expérience..."
                rows={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={createPostMutation.isPending}>
              {createPostMutation.isPending ? "Publication..." : "Publier la discussion"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
