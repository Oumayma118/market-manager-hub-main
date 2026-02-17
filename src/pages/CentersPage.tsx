import { useState } from 'react';
import { Plus, Pencil, Trash2, Building2, Search } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { addCenter, updateCenter, deleteCenter, setSelectedCenter } from '@/redux/slices/centersSlice';
import { Center } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function CentersPage() {
  const dispatch = useAppDispatch();
  const { centers, loading, selectedCenter } = useAppSelector((state) => state.centers);
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    totalLocals: 0,
    availableLocals: 0,
  });

  const filteredCenters = centers.filter(
    (center) =>
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenForm = (center?: Center) => {
    if (center) {
      dispatch(setSelectedCenter(center));
      setFormData({
        name: center.name,
        address: center.address,
        description: center.description,
        totalLocals: center.totalLocals,
        availableLocals: center.availableLocals,
      });
    } else {
      dispatch(setSelectedCenter(null));
      setFormData({
        name: '',
        address: '',
        description: '',
        totalLocals: 0,
        availableLocals: 0,
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.address.trim()) {
      toast({
        title: 'Erreur de validation',
        description: 'Le nom et l\'adresse sont requis.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (selectedCenter) {
        await dispatch(updateCenter({ ...selectedCenter, ...formData })).unwrap();
        toast({
          title: 'Centre modifié',
          description: 'Le centre a été mis à jour avec succès.',
        });
      } else {
        await dispatch(addCenter(formData)).unwrap();
        toast({
          title: 'Centre créé',
          description: 'Le nouveau centre a été ajouté avec succès.',
        });
      }
      setIsFormOpen(false);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedCenter) return;
    
    try {
      await dispatch(deleteCenter(selectedCenter.id)).unwrap();
      toast({
        title: 'Centre supprimé',
        description: 'Le centre a été supprimé avec succès.',
      });
      setIsDeleteOpen(false);
      dispatch(setSelectedCenter(null));
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le centre.',
        variant: 'destructive',
      });
    }
  };

  const openDeleteDialog = (center: Center) => {
    dispatch(setSelectedCenter(center));
    setIsDeleteOpen(true);
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner size="lg" text="Chargement des centres..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Centres commerciaux"
        subtitle="Gérez vos centres commerciaux et marchés"
        action={
          <Button onClick={() => handleOpenForm()} className="gap-2">
            <Plus className="h-4 w-4" />
            Nouveau centre
          </Button>
        }
      />

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un centre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 max-w-md"
        />
      </div>

      {/* Centers Grid */}
      {filteredCenters.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-8 w-8 text-muted-foreground" />}
          title="Aucun centre trouvé"
          description={searchQuery ? 'Aucun résultat pour cette recherche.' : 'Commencez par ajouter votre premier centre commercial.'}
          action={
            !searchQuery && (
              <Button onClick={() => handleOpenForm()} className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un centre
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCenters.map((center) => {
            const occupancy = center.totalLocals > 0
              ? Math.round(((center.totalLocals - center.availableLocals) / center.totalLocals) * 100)
              : 0;
            return (
              <div
                key={center.id}
                className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all animate-fade-in"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenForm(center)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(center)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-display text-lg font-semibold mb-1">{center.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{center.address}</p>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{center.description}</p>
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Locaux totaux</span>
                    <span className="font-medium">{center.totalLocals}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Disponibles</span>
                    <span className="font-medium text-success">{center.availableLocals}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Occupation</span>
                      <span className="font-medium">{occupancy}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-secondary transition-all"
                        style={{ width: `${occupancy}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedCenter ? 'Modifier le centre' : 'Nouveau centre'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du centre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Centre Commercial Al Massira"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Avenue Mohammed V, Casablanca"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description du centre..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalLocals">Nombre total de locaux</Label>
                <Input
                  id="totalLocals"
                  type="number"
                  min="0"
                  value={formData.totalLocals}
                  onChange={(e) => setFormData({ ...formData, totalLocals: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availableLocals">Locaux disponibles</Label>
                <Input
                  id="availableLocals"
                  type="number"
                  min="0"
                  max={formData.totalLocals}
                  value={formData.availableLocals}
                  onChange={(e) => setFormData({ ...formData, availableLocals: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                {selectedCenter ? 'Enregistrer' : 'Créer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Supprimer le centre"
        description={`Êtes-vous sûr de vouloir supprimer "${selectedCenter?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        onConfirm={handleDelete}
      />
    </MainLayout>
  );
}
