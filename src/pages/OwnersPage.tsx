import { useState } from 'react';
import { Plus, Pencil, Trash2, Users, Search, Mail, Phone } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { addOwner, updateOwner, deleteOwner, setSelectedOwner } from '@/redux/slices/ownersSlice';
import { Owner } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function OwnersPage() {
  const dispatch = useAppDispatch();
  const { owners, selectedOwner } = useAppSelector((state) => state.owners);
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  const filteredOwners = owners.filter(
    (owner) =>
      `${owner.firstName} ${owner.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenForm = (owner?: Owner) => {
    if (owner) {
      dispatch(setSelectedOwner(owner));
      setFormData({
        firstName: owner.firstName,
        lastName: owner.lastName,
        email: owner.email,
        phone: owner.phone,
        address: owner.address,
      });
    } else {
      dispatch(setSelectedOwner(null));
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast({
        title: 'Erreur de validation',
        description: 'Le prénom et le nom sont requis.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (selectedOwner) {
        await dispatch(updateOwner({ ...selectedOwner, ...formData })).unwrap();
        toast({
          title: 'Propriétaire modifié',
          description: 'Le propriétaire a été mis à jour avec succès.',
        });
      } else {
        await dispatch(addOwner(formData)).unwrap();
        toast({
          title: 'Propriétaire créé',
          description: 'Le nouveau propriétaire a été ajouté avec succès.',
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
    if (!selectedOwner) return;

    try {
      await dispatch(deleteOwner(selectedOwner.id)).unwrap();
      toast({
        title: 'Propriétaire supprimé',
        description: 'Le propriétaire a été supprimé avec succès.',
      });
      setIsDeleteOpen(false);
      dispatch(setSelectedOwner(null));
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le propriétaire.',
        variant: 'destructive',
      });
    }
  };

  const openDeleteDialog = (owner: Owner) => {
    dispatch(setSelectedOwner(owner));
    setIsDeleteOpen(true);
  };

  return (
    <MainLayout>
      <PageHeader
        title="Propriétaires"
        subtitle="Gérez les propriétaires et locataires de vos locaux"
        action={
          <Button onClick={() => handleOpenForm()} className="gap-2">
            <Plus className="h-4 w-4" />
            Nouveau propriétaire
          </Button>
        }
      />

      {/* Search Bar */}
      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un propriétaire..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Owners Grid */}
      {filteredOwners.length === 0 ? (
        <EmptyState
          icon={<Users className="h-8 w-8 text-muted-foreground" />}
          title="Aucun propriétaire trouvé"
          description={searchQuery ? 'Aucun résultat pour cette recherche.' : 'Commencez par ajouter votre premier propriétaire.'}
          action={
            !searchQuery && (
              <Button onClick={() => handleOpenForm()} className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un propriétaire
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOwners.map((owner) => (
            <div
              key={owner.id}
              className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all animate-fade-in"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-semibold text-lg">
                    {owner.firstName[0]}{owner.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {owner.firstName} {owner.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {owner.localsCount} local{owner.localsCount > 1 ? 'aux' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenForm(owner)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(owner)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{owner.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{owner.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedOwner ? 'Modifier le propriétaire' : 'Nouveau propriétaire'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Ahmed"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Benali"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ahmed.benali@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+212 6 12 34 56 78"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="15 Rue des Oliviers, Casablanca"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                {selectedOwner ? 'Enregistrer' : 'Créer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Supprimer le propriétaire"
        description={`Êtes-vous sûr de vouloir supprimer "${selectedOwner?.firstName} ${selectedOwner?.lastName}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        onConfirm={handleDelete}
      />
    </MainLayout>
  );
}
