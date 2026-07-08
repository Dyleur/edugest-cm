import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useActivity } from '../contexts/ActivityContext';
import { notificationsAPI } from '../services/api';
import {
  History, Trash2, Clock, User, FileText, MessageSquare,
  DollarSign, GraduationCap, AlertCircle, LogIn, LogOut,
  Bell, BellRing, MessageCircle, FileUp, Info, CheckCircle, AlertTriangle
} from 'lucide-react';

const actionIcons: Record<string, React.ElementType> = {
  view: FileText,
  message: MessageSquare,
  payment: DollarSign,
  grade: GraduationCap,
  login: LogIn,
  logout: LogOut,
  edit: FileText,
  delete: AlertCircle,
  create: FileText,
};

function getIcon(icon?: string) {
  if (!icon) return Clock;
  return actionIcons[icon] || Clock;
}

const notifIcons: Record<string, React.ElementType> = {
  message: MessageCircle,
  document: FileUp,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
};

function getNotifIcon(type?: string) {
  return notifIcons[type || 'info'] || Bell;
}

export default function ActivityHistory() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { activities, clear } = useActivity();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifLoading, setNotifLoading] = useState(true);

  useEffect(() => {
    if (!user?.idPers) { setNotifLoading(false); return; }
    notificationsAPI.mesNotifications()
      .then(data => {
        const items = Array.isArray(data) ? data : (data?.data || []);
        setNotifications(items);
      })
      .catch(() => {})
      .finally(() => setNotifLoading(false));
  }, [user?.idPers]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (mins < 1) return language === 'fr' ? 'À l\'instant' : 'Just now';
    if (mins < 60) return `${mins} ${language === 'fr' ? 'min' : 'min'}`;
    if (hours < 24) return `${hours} ${language === 'fr' ? 'h' : 'h'}`;

    return d.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-gradient-to-r from-violet-600 to-violet-800 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <History className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{t('settings.activityHistory') || (language === 'fr' ? 'Historique des actions' : 'Activity History')}</h1>
                <p className="text-violet-200 text-sm">
                  {activities.length} {language === 'fr' ? 'actions enregistrées' : 'recorded actions'}
                </p>
              </div>
            </div>
            {activities.length > 0 && (
              <Button variant="secondary" size="sm" className="gap-1.5 bg-white/20 text-white hover:bg-white/30" onClick={clear}>
                <Trash2 className="w-4 h-4" />
                {language === 'fr' ? 'Effacer' : 'Clear'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {activities.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="p-12 text-center">
            <History className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-lg font-medium text-muted-foreground">
              {language === 'fr' ? 'Aucune activité enregistrée' : 'No activity recorded'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {language === 'fr' ? 'Les actions que vous effectuerez apparaîtront ici' : 'Your actions will appear here'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              {language === 'fr' ? 'Activités récentes' : 'Recent Activities'}
            </p>
          </div>
          {activities.map((entry) => {
            const Icon = getIcon(entry.icon);
            const isExpanded = expanded === entry.id;

            return (
              <div
                key={entry.id}
                onClick={() => setExpanded(isExpanded ? null : entry.id)}
                className="animate-fade-in-up"
              >
                <Card className="border-border/50 hover:shadow-sm transition-all duration-200 cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-violet-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground truncate">{entry.action}</p>
                          <span className="text-[10px] text-muted-foreground flex-shrink-0">{formatDate(entry.date)}</span>
                        </div>
                        {isExpanded && (
                          <div className="mt-2 p-2 bg-muted/50 rounded-lg">
                            <p className="text-xs text-muted-foreground">{entry.details}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {new Date(entry.date).toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-4">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-orange-600" />
          {language === 'fr' ? 'Notifications' : 'Notifications'}
          {notifications.filter(n => !n.lu).length > 0 && (
            <Badge className="bg-orange-500 text-white text-xs">
              {notifications.filter(n => !n.lu).length} {language === 'fr' ? 'non lues' : 'unread'}
            </Badge>
          )}
        </h2>
        {notifLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Aucune notification' : 'No notifications'}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {notifications.map((n: any) => {
              const Icon = getNotifIcon(n.typeNotification);
              const isExpanded = expanded === `notif-${n.idNotification}`;
              return (
                <div
                  key={`notif-${n.idNotification}`}
                  onClick={() => {
                    setExpanded(isExpanded ? null : `notif-${n.idNotification}`);
                    if (!n.lu) {
                      notificationsAPI.markAsRead(n.idNotification).catch(() => {});
                      setNotifications(prev => prev.map(x => x.idNotification === n.idNotification ? { ...x, lu: 1 } : x));
                    }
                  }}
                  className="animate-fade-in-up"
                >
                  <Card className={`border-border/50 hover:shadow-sm transition-all duration-200 cursor-pointer ${!n.lu ? 'border-l-4 border-l-orange-500' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          n.typeNotification === 'message' ? 'bg-blue-100'
                            : n.typeNotification === 'document' ? 'bg-teal-100'
                            : n.typeNotification === 'warning' ? 'bg-red-100'
                            : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-4 h-4 ${
                            n.typeNotification === 'message' ? 'text-blue-500'
                              : n.typeNotification === 'document' ? 'text-teal-600'
                              : n.typeNotification === 'warning' ? 'text-red-600'
                              : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm truncate ${!n.lu ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{n.titre}</p>
                            <span className="text-[10px] text-muted-foreground flex-shrink-0">
                              {formatDate(n.dateCreation || n.created_at)}
                            </span>
                            {!n.lu && <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />}
                          </div>
                          {isExpanded && n.message && (
                            <div className="mt-2 p-2 bg-muted/50 rounded-lg">
                              <p className="text-xs text-muted-foreground">{n.message}</p>
                              <p className="text-[10px] text-muted-foreground mt-1">
                                {new Date(n.dateCreation || n.created_at).toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
