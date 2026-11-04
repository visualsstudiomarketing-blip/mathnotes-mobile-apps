import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  StyleSheet
} from 'react-native';
import {
  GraduationCap,
  ShieldCheck,
  DollarSign,
  Bell,
  Mail,
  LogOut,
  ChevronRight
} from 'lucide-react-native';
import { AuthService } from '../shared/services/authService';
import { NotificationService } from '../shared/services/notificationService';

export const TeacherProfileScreen: React.FC = () => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const auth = AuthService.getInstance();
  const notif = NotificationService.getInstance();
  const session = auth.getSession();

  const handleToggle = (val: boolean) => {
    setPushEnabled(val);
    notif.toggleNotifications(val);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' }}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{session?.user.name || 'Webxpro Digital'}</Text>
          <Text style={styles.role}>Senior Mathematics Mentor</Text>
          <View style={styles.badgeRow}>
            <ShieldCheck color="#10B981" size={13} />
            <Text style={styles.badgeText}>Verified Tutor LMS Instructor</Text>
          </View>
        </View>
      </View>

      {/* Payout & Earnings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financials & Payouts</Text>
        <View style={styles.card}>
          <View style={styles.payoutRow}>
            <div>
              <Text style={styles.payoutLabel}>Total Platform Earnings</Text>
              <Text style={styles.payoutAmount}>$4,850.00</Text>
            </div>
            <View style={styles.payoutBadge}>
              <Text style={styles.payoutBadgeText}>Active Revenue Share</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Push Notification Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alerts & Notifications</Text>
        <View style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingText}>
              <Bell color="#10B981" size={18} />
              <div>
                <Text style={styles.itemTitle}>New Doubt & Submission Alerts</Text>
                <Text style={styles.itemDesc}>Instant notifications when students submit work</Text>
              </div>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={handleToggle}
              trackColor={{ false: '#334155', true: '#059669' }}
              thumbColor={pushEnabled ? '#10B981' : '#94A3B8'}
            />
          </View>
        </View>
      </View>

      {/* Educator Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Educator Support</Text>
        <View style={styles.card}>
          <View style={styles.supportItem}>
            <Mail color="#38BDF8" size={18} />
            <div>
              <Text style={styles.itemTitle}>Teacher Partnerships & Help</Text>
              <Text style={styles.supportEmail}>teachers@mathnotes.courses</Text>
            </div>
          </View>
        </View>
      </View>

      {/* Sign Out */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => auth.signOut()}>
          <LogOut color="#EF4444" size={18} />
          <Text style={styles.logoutText}>Sign Out from Teacher Portal</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#131B2E',
    margin: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
  },
  role: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  badgeText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#131B2E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    overflow: 'hidden',
  },
  payoutRow: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payoutLabel: {
    color: '#94A3B8',
    fontSize: 12,
  },
  payoutAmount: {
    color: '#10B981',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 2,
  },
  payoutBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  payoutBadgeText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  itemTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  itemDesc: {
    color: '#64748B',
    fontSize: 11,
  },
  supportEmail: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
  },
  logoutSection: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 14,
    paddingVertical: 12,
    gap: 8,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700',
  },
});

