import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Eye, Link, Share2, MoreHorizontal, 
  Palette, Globe, QrCode, Calendar
} from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BookingPage {
  id: number;
  userId: string;
  salonName: string;
  salonDescription?: string;
  pageUrl: string;
  customization: {
    primaryColor: string;
    secondaryColor: string;
    showPrices: boolean;
    requireDeposit: boolean;
  };
  isPublished: boolean;
  views: number;
  bookings: number;
  createdAt: string;
}

export default function BookingPages() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer les pages de réservation
  const { data: pages = [], isLoading } = useQuery({
    queryKey: ["/api/booking-pages"],
  });

  // Mutation pour supprimer une page
  const deletePageMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/booking-pages/${id}`);
      if (!response.ok) throw new Error("Erreur lors de la suppression");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/booking-pages"] });
      toast({ title: "Page supprimée avec succès!" });
    },
    onError: () => {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" });
    }
  });

  // Mutation pour publier/dépublier une page
  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: number; isPublished: boolean }) => {
      const response = await apiRequest("PATCH", `/api/booking-pages/${id}`, { isPublished });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/booking-pages"] });
      toast({ title: "Page mise à jour!" });
    },
  });

  const copyPageUrl = (pageUrl: string) => {
    const fullUrl = `${window.location.origin}/booking/${pageUrl}`;
    navigator.clipboard.writeText(fullUrl);
    toast({ title: "Lien copié dans le presse-papiers!" });
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="grid gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pages de Réservation</h1>
          <p className="text-gray-600">
            {pages.length} page{pages.length > 1 ? 's' : ''} créée{pages.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button 
          onClick={() => setLocation("/page-builder")}
          className="gradient-bg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Créer une nouvelle page
        </Button>
      </div>

      {/* Liste des pages */}
      <div className="grid gap-4">
        {pages.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Globe className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune page créée</h3>
              <p className="text-gray-600 mb-4">
                Créez votre première page de réservation personnalisée pour permettre à vos clients de prendre rendez-vous facilement.
              </p>
              <Button 
                onClick={() => setLocation("/page-builder")}
                className="gradient-bg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer ma première page
              </Button>
            </CardContent>
          </Card>
        ) : (
          pages.map((page: BookingPage) => (
            <Card key={page.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {page.salonName}
                      </h3>
                      <Badge 
                        variant={page.isPublished ? "default" : "secondary"}
                        className={page.isPublished ? "bg-green-600" : ""}
                      >
                        {page.isPublished ? "Publiée" : "Brouillon"}
                      </Badge>
                    </div>
                    
                    {page.salonDescription && (
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {page.salonDescription}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {page.views} vues
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {page.bookings} réservations
                      </div>
                      <div className="flex items-center gap-1">
                        <Palette className="w-4 h-4" />
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: page.customization.primaryColor }}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600 font-mono">
                      {window.location.origin}/booking/{page.pageUrl}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`/booking/${page.pageUrl}`, '_blank')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyPageUrl(page.pageUrl)}
                    >
                      <Link className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setLocation(`/page-builder?edit=${page.id}`)}
                    >
                      <Palette className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant={page.isPublished ? "secondary" : "default"}
                      onClick={() => togglePublishMutation.mutate({
                        id: page.id,
                        isPublished: !page.isPublished
                      })}
                      disabled={togglePublishMutation.isPending}
                    >
                      {page.isPublished ? "Dépublier" : "Publier"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {/* Statistiques */}
      {pages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Total vues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pages.reduce((sum: number, page: BookingPage) => sum + page.views, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Total réservations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {pages.reduce((sum: number, page: BookingPage) => sum + page.bookings, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Taux de conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {pages.reduce((sum: number, page: BookingPage) => sum + page.views, 0) > 0
                  ? Math.round((pages.reduce((sum: number, page: BookingPage) => sum + page.bookings, 0) / pages.reduce((sum: number, page: BookingPage) => sum + page.views, 0)) * 100)
                  : 0
                }%
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}