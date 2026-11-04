import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import {
  ShieldCheck,
  CreditCard,
  Zap,
  Building2,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react-native';
import { Course } from '../../../../shared/types';
import { paymentService } from '../../../../shared/services/paymentService';
import { NotificationService } from '../../../../shared/services/notificationService';

export const CheckoutScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { course }: { course: Course } = route.params || {
    course: {
      id: 101,
      title: 'IIT-JEE Mathematics Masterclass: Limits, Calculus & Deep Neural Foundations',
      price: 2499,
      examTrack: 'IIT_JEE_MAIN',
      instructor: { name: 'Er. Vikramaditya (IIT Delhi Alumni)' },
      totalLessons: 48,
      totalQuizzes: 12
    }
  };

  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Price calculations in INR
  const basePrice = course?.price || 2499;
  const gstAmount = Math.round(basePrice * 0.18);
  const discount = 500;
  const totalAmount = basePrice + gstAmount - discount;

  const handlePayNow = async () => {
    setIsProcessing(true);

    try {
      // 1. Create Order via PaymentService
      const order = await paymentService.createOrder(course.id, totalAmount, 1);

      // 2. Simulate Razorpay Checkout verification
      const verifyResult = await paymentService.verifyPayment({
        courseId: course.id,
        razorpay_order_id: order.orderId,
        razorpay_payment_id: `pay_${Date.now()}`,
        razorpay_signature: 'sig_verified_sandbox_hash'
      });

      if (verifyResult.success) {
        setPaymentSuccess(true);
        // Push notification alert
        NotificationService.getInstance().sendPushNotification({
          to: 'ExponentPushToken[local_active_student]',
          title: '🎉 Enrollment Confirmed!',
          body: `You are officially enrolled in ${course.title}. Start lesson 1 now!`,
          data: { courseId: course.id }
        });
      }
    } catch (err) {
      Alert.alert('Payment Failed', 'Transaction could not be completed. Please retry or choose another method.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Complete Enrollment</Text>
          <Text style={styles.headerSub}>Instant access to lectures, CBT test series & AI mentor</Text>
        </View>

        {/* Course Summary Card */}
        <View style={styles.courseSummaryCard}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{course.examTrack?.replace(/_/g, ' ')}</Text>
          </View>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.instructorText}>By {course.instructor.name}</Text>
          <View style={styles.courseMeta}>
            <Text style={styles.metaItem}>{course.totalLessons} Lessons</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaItem}>{course.totalQuizzes} Mock CBTs</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaItem}>Lifetime Access</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionHeading}>Select Payment Method (India UPI & Cards)</Text>

        <TouchableOpacity
          style={[styles.methodCard, selectedMethod === 'upi' && styles.methodSelected]}
          onPress={() => setSelectedMethod('upi')}
        >
          <View style={styles.methodIconBg}>
            <Zap color="#38BDF8" size={20} />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>UPI (Instant 1-Click Pay)</Text>
            <Text style={styles.methodDesc}>Google Pay • PhonePe • Paytm • BHIM UPI</Text>
          </View>
          <View style={[styles.radioCircle, selectedMethod === 'upi' && styles.radioActive]} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.methodCard, selectedMethod === 'card' && styles.methodSelected]}
          onPress={() => setSelectedMethod('card')}
        >
          <View style={styles.methodIconBg}>
            <CreditCard color="#10B981" size={20} />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>Credit / Debit Card</Text>
            <Text style={styles.methodDesc}>Visa • MasterCard • RuPay • Corporate Cards</Text>
          </View>
          <View style={[styles.radioCircle, selectedMethod === 'card' && styles.radioActive]} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.methodCard, selectedMethod === 'netbanking' && styles.methodSelected]}
          onPress={() => setSelectedMethod('netbanking')}
        >
          <View style={styles.methodIconBg}>
            <Building2 color="#F59E0B" size={20} />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>Net Banking</Text>
            <Text style={styles.methodDesc}>SBI • HDFC • ICICI • Axis • 50+ Indian Banks</Text>
          </View>
          <View style={[styles.radioCircle, selectedMethod === 'netbanking' && styles.radioActive]} />
        </TouchableOpacity>

        {/* Price Breakdown */}
        <View style={styles.pricingCard}>
          <Text style={styles.pricingTitle}>Price Breakdown</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Course Base Tuition</Text>
            <Text style={styles.priceValue}>₹{basePrice}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Mathnotes Early-Bird Scholarship</Text>
            <Text style={[styles.priceValue, styles.greenText]}>-₹{discount}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Govt. GST (18%)</Text>
            <Text style={styles.priceValue}>₹{gstAmount}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>₹{totalAmount}</Text>
          </View>
        </View>

        {/* Trust Badges */}
        <View style={styles.trustBanner}>
          <ShieldCheck color="#10B981" size={18} />
          <Text style={styles.trustText}>
            256-bit SSL Encrypted • Razorpay Secured • 7-Day Money-Back Guarantee
          </Text>
        </View>
      </ScrollView>

      {/* Pay CTA Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerSubText}>Total to Pay</Text>
          <Text style={styles.footerPrice}>₹{totalAmount}</Text>
        </View>
        <TouchableOpacity
          style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
          onPress={handlePayNow}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Lock color="#FFFFFF" size={16} />
              <Text style={styles.payButtonText}>Pay Securely via Razorpay</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      {paymentSuccess && (
        <View style={styles.successOverlay}>
          <View style={styles.successModal}>
            <CheckCircle2 color="#10B981" size={56} />
            <Text style={styles.successTitle}>Payment Successful! 🎉</Text>
            <Text style={styles.successSub}>
              You have unlocked lifetime access to {course.title}.
            </Text>
            <TouchableOpacity
              style={styles.startLearningBtn}
              onPress={() => {
                setPaymentSuccess(false);
                navigation.navigate('CourseDetail', { courseId: course.id });
              }}
            >
              <Text style={styles.startLearningBtnText}>Start Learning Now</Text>
              <ArrowRight color="#FFFFFF" size={18} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
    gap: 16,
  },
  header: {
    gap: 4,
    marginBottom: 4,
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
  },
  headerSub: {
    color: '#94A3B8',
    fontSize: 13,
  },
  courseSummaryCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
  },
  courseTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  instructorText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  metaItem: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
  },
  metaDot: {
    color: '#64748B',
  },
  sectionHeading: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  methodSelected: {
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
  },
  methodIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodInfo: {
    flex: 1,
    gap: 2,
  },
  methodTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  methodDesc: {
    color: '#94A3B8',
    fontSize: 11,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#64748B',
  },
  radioActive: {
    borderColor: '#38BDF8',
    backgroundColor: '#38BDF8',
  },
  pricingCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 10,
  },
  pricingTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    color: '#94A3B8',
    fontSize: 13,
  },
  priceValue: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  greenText: {
    color: '#10B981',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 4,
  },
  totalLabel: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
  },
  totalValue: {
    color: '#38BDF8',
    fontSize: 18,
    fontWeight: '900',
  },
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 6,
  },
  trustText: {
    color: '#94A3B8',
    fontSize: 11,
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerSubText: {
    color: '#94A3B8',
    fontSize: 11,
  },
  footerPrice: {
    color: '#38BDF8',
    fontSize: 22,
    fontWeight: '900',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successModal: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    gap: 14,
    width: '100%',
  },
  successTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
  },
  successSub: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  startLearningBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    width: '100%',
    marginTop: 8,
  },
  startLearningBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
