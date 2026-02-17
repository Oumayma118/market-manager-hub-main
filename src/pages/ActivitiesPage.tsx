import { useState } from 'react';
import { Plus, Pencil, Trash2, Briefcase, Search } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { addActivity, updateActivity, deleteActivity, setSelectedActivity } from '@/redux/slices/activitiesSlice';
import { Activity, ACTIVITY_TYPES, ActivityType } from '@/types';
import { useToast } from '@/hooks/use-toast';

const typeColors: Record<ActivityType, string> = {
  boutique: 'bg-blue-100 text-blue-800',
  restaurant: 'bg-orange-100 text-orange-800',
  service: 'bg-green-100 text-green-800',
  artisanat: 'bg-amber-100 text-amber-800',
  autre: 'bg-gray-100 text-gray-800',
};

export default function ActivitiesPage() {
  const dispatch = useAppDispatch();
  const { activities, selectedActivity } = useAppSelector((state) => state.activities);
  const { locals } = useAppSelector((state) => state.locals);
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'boutique' as ActivityType,
    description: '',
    localId: '',
  });

  const filteredActivities = activities.filter(
    (activity) =>
      activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenForm = (activity?: Activity) => {
    if (activity) {
      dispatch(setSelectedActivity(activity));
      setFormData({
        name: activity.name,
        type: activity.type,
        description: activity.description,
        localId: activity.localId || '',
      });
    } else {
      dispatch(setSelectedActivity(null));
      setFormData({
        name: '',
        type: 'boutique',
        description: '',
        localId: '',
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: 'Erreur de validation',
        description: 'Le nom de l\'activité est requis.',
        variant: 'destructive',
      });
      return;
    }

    const local = locals.find((l) => l.id === formData.localId);

    const activityData = {
      ...formData,
      localNumber: local?.number,
    };

    try {
      if (selectedActivity) {
        await dispatch(updateActivity({ ...selectedActivity, ...activityData })).unwrap();
        toast({
          title: 'Activité modifiée',
          description: 'L\'activité a été mise à jour avec succès.',
        });
      } else {
        await dispatch(addActivity(activityData)).unwrap();
        toast({
          title: 'Activité créée',
          description: 'La nouvelle activité a été ajoutée avec succès.',
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
    if (!selectedActivity) return;

    try {
      await dispatch(deleteActivity(selectedActivity.id)).unwrap();
      toast({
        title: 'Activité supprimée',
        description: 'L\'activité a été supprimée avec succès.',
      });
      setIsDeleteOpen(false);
      dispatch(setSelectedActivity(null));
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'activité.',
        variant: 'destructive',
      });
    }
  };

  const openDeleteDialog = (activity: Activity) => {
    dispatch(setSelectedActivity(activity));
    setIsDeleteOpen(true);
  };

  return (
    <MainLayout>
      <PageHeader
        title="Activités commerciales"
        subtitle="Gérez les types d'activités de vos locaux"
        action={
          <Button onClick={() => handleOpenForm()} className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle activité
          </Button>
        }
      />

      {/* Search Bar */}
      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une activité..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Activities Table */}
      {filteredActivities.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-8 w-8 text-muted-foreground" />}
          title="Aucune activité trouvée"
          description={searchQuery ? 'Aucun résultat pour cette recherche.' : 'Commencez par ajouter votre première activité.'}
          action={
            !searchQuery && (
              <Button onClick={() => handleOpenForm()} className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter une activité
              </Button>
            )
          }
        />
      ) : (
        <div className="data-table overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Type</th>
                <th>Description</th>
                <th>Local associé</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map((activity) => (
                <tr key={activity.id} className="animate-fade-in">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{activity.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge-status ${typeColors[activity.type]}`}>
                      {ACTIVITY_TYPES.find((t) => t.value === activity.type)?.label}
                    </span>
                  </td>
                  <td className="text-muted-foreground max-w-xs truncate">
                    {activity.description}
                  </td>
                  <td className="text-muted-foreground">{activity.localNumber || '-'}</td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenForm(activity)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(activity)}>
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
              {selectedActivity ? 'Modifier l\'activité' : 'Nouvelle activité'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'activité *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Boutique Textile"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type d'activité</Label>
              <Select
                value={formData.type}
                onValueChange={(value: ActivityType) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description de l'activité..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="localId">Local associé</Label>
              <Select
                value={formData.localId}
                onValueChange={(value) => setFormData({ ...formData, localId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un local" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun</SelectItem>
                  {locals.map((local) => (
                    <SelectItem key={local.id} value={local.id}>
                      {local.number} - {local.centerName}
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
                {selectedActivity ? 'Enregistrer' : 'Créer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Supprimer l'activité"
        description={`Êtes-vous sûr de vouloir supprimer "${selectedActivity?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        onConfirm={handleDelete}
      />
    </MainLayout>
  );
}
