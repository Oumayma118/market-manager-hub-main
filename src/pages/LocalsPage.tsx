import { useState } from 'react';
import { Plus, Pencil, Trash2, Store, Search, Filter } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { addLocal, updateLocal, deleteLocal, setSelectedLocal } from '@/redux/slices/localsSlice';
import { Local } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function LocalsPage() {
  const dispatch = useAppDispatch();
  const { locals, selectedLocal } = useAppSelector((state) => state.locals);
  const { centers } = useAppSelector((state) => state.centers);
  const { owners } = useAppSelector((state) => state.owners);
  const { activities } = useAppSelector((state) => state.activities);
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState({
    number: '',
    size: 0,
    status: 'available' as 'available' | 'rented',
    centerId: '',
    ownerId: '',
    activityId: '',
    monthlyRent: 0,
  });

  const filteredLocals = locals.filter((local) => {
    const matchesSearch =
      local.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      local.centerName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || local.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenForm = (local?: Local) => {
    if (local) {
      dispatch(setSelectedLocal(local));
      setFormData({
        number: local.number,
        size: local.size,
        status: local.status,
        centerId: local.centerId,
        ownerId: local.ownerId || '',
        activityId: local.activityId || '',
        monthlyRent: local.monthlyRent,
      });
    } else {
      dispatch(setSelectedLocal(null));
      setFormData({
        number: '',
        size: 0,
        status: 'available',
        centerId: '',
        ownerId: '',
        activityId: '',
        monthlyRent: 0,
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.number.trim() || !formData.centerId) {
      toast({
        title: 'Erreur de validation',
        description: 'Le numéro et le centre sont requis.',
        variant: 'destructive',
      });
      return;
    }

    const center = centers.find((c) => c.id === formData.centerId);
    const owner = owners.find((o) => o.id === formData.ownerId);
    const activity = activities.find((a) => a.id === formData.activityId);

    const localData = {
      ...formData,
      centerName: center?.name,
      ownerName: owner ? `${owner.firstName} ${owner.lastName}` : undefined,
      activityName: activity?.name,
    };

    try {
      if (selectedLocal) {
        await dispatch(updateLocal({ ...selectedLocal, ...localData })).unwrap();
        toast({
          title: 'Local modifié',
          description: 'Le local a été mis à jour avec succès.',
        });
      } else {
        await dispatch(addLocal(localData)).unwrap();
        toast({
          title: 'Local créé',
          description: 'Le nouveau local a été ajouté avec succès.',
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
    if (!selectedLocal) return;

    try {
      await dispatch(deleteLocal(selectedLocal.id)).unwrap();
      toast({
        title: 'Local supprimé',
        description: 'Le local a été supprimé avec succès.',
      });
      setIsDeleteOpen(false);
      dispatch(setSelectedLocal(null));
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le local.',
        variant: 'destructive',
      });
    }
  };

  const openDeleteDialog = (local: Local) => {
    dispatch(setSelectedLocal(local));
    setIsDeleteOpen(true);
  };

  return (
    <MainLayout>
      <PageHeader
        title="Locaux"
        subtitle="Gérez les locaux de vos centres commerciaux"
        action={
          <Button onClick={() => handleOpenForm()} className="gap-2">
            <Plus className="h-4 w-4" />
            Nouveau local
          </Button>
        }
      />

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un local..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="rented">Loué</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Locals Table */}
      {filteredLocals.length === 0 ? (
        <EmptyState
          icon={<Store className="h-8 w-8 text-muted-foreground" />}
          title="Aucun local trouvé"
          description={searchQuery || statusFilter !== 'all' ? 'Aucun résultat pour ces filtres.' : 'Commencez par ajouter votre premier local.'}
          action={
            !searchQuery && statusFilter === 'all' && (
              <Button onClick={() => handleOpenForm()} className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un local
              </Button>
            )
          }
        />
      ) : (
        <div className="data-table overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Centre</th>
                <th>Taille</th>
                <th>Loyer mensuel</th>
                <th>Propriétaire</th>
                <th>Activité</th>
                <th>Statut</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLocals.map((local) => (
                <tr key={local.id} className="animate-fade-in">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                        <Store className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{local.number}</span>
                    </div>
                  </td>
                  <td className="text-muted-foreground">{local.centerName}</td>
                  <td>{local.size} m²</td>
                  <td className="font-medium">{local.monthlyRent.toLocaleString()} DH</td>
                  <td className="text-muted-foreground">{local.ownerName || '-'}</td>
                  <td className="text-muted-foreground">{local.activityName || '-'}</td>
                  <td>
                    <StatusBadge status={local.status} />
                  </td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenForm(local)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(local)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedLocal ? 'Modifier le local' : 'Nouveau local'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number">Numéro *</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="A-101"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Taille (m²)</Label>
                <Input
                  id="size"
                  type="number"
                  min="0"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="centerId">Centre commercial *</Label>
              <Select
                value={formData.centerId}
                onValueChange={(value) => setFormData({ ...formData, centerId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un centre" />
                </SelectTrigger>
                <SelectContent>
                  {centers.map((center) => (
                    <SelectItem key={center.id} value={center.id}>
                      {center.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyRent">Loyer mensuel (DH)</Label>
                <Input
                  id="monthlyRent"
                  type="number"
                  min="0"
                  value={formData.monthlyRent}
                  onChange={(e) => setFormData({ ...formData, monthlyRent: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'available' | 'rented') => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="rented">Loué</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerId">Propriétaire</Label>
              <Select
                value={formData.ownerId}
                onValueChange={(value) => setFormData({ ...formData, ownerId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un propriétaire" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun</SelectItem>
                  {owners.map((owner) => (
                    <SelectItem key={owner.id} value={owner.id}>
                      {owner.firstName} {owner.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="activityId">Activité</Label>
              <Select
                value={formData.activityId}
                onValueChange={(value) => setFormData({ ...formData, activityId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une activité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucune</SelectItem>
                  {activities.map((activity) => (
                    <SelectItem key={activity.id} value={activity.id}>
                      {activity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                {selectedLocal ? 'Enregistrer' : 'Créer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Supprimer le local"
        description={`Êtes-vous sûr de vouloir supprimer le local "${selectedLocal?.number}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        onConfirm={handleDelete}
      />
    </MainLayout>
  );
}
