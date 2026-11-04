export interface PushNotificationPayload {
  to?: string | string[]; // Expo push token(s)
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: 'default' | null;
  priority?: 'default' | 'normal' | 'high';
  badge?: number;
}

export type NotificationType =
  | 'quiz_deadline'
  | 'new_lesson'
  | 'qna_reply'
  | 'teacher_new_doubt'
  | 'teacher_new_submission'
  | 'teacher_new_enrollment';

export class NotificationService {
  private static instance: NotificationService;
  private expoPushToken: string | null = null;
  private isNotificationsEnabled: boolean = true;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Register device with Expo Push Notification Service
   */
  public async registerForPushNotificationsAsync(userId?: number): Promise<string | null> {
    try {
      // In production Expo environment:
      // const { status } = await Notifications.requestPermissionsAsync();
      // const token = (await Notifications.getExpoPushTokenAsync()).data;
      
      const mockToken = `ExponentPushToken[mathnotes_${userId || 'guest'}_${Date.now()}]`;
      this.expoPushToken = mockToken;

      // Sync push token to WordPress user meta
      if (userId) {
        await this.syncPushTokenToWordPress(userId, mockToken);
      }

      console.log('Registered Expo Push Token:', mockToken);
      return mockToken;
    } catch (error) {
      console.warn('Failed to register for push notifications:', error);
      return null;
    }
  }

  public getPushToken(): string | null {
    return this.expoPushToken;
  }

  public toggleNotifications(enabled: boolean) {
    this.isNotificationsEnabled = enabled;
  }

  public areNotificationsEnabled(): boolean {
    return this.isNotificationsEnabled;
  }

  /**
   * Send a push notification via Expo Push API gateway
   */
  public async sendPushNotification(payload: PushNotificationPayload): Promise<boolean> {
    if (!this.isNotificationsEnabled) return false;

    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: payload.to,
          title: payload.title,
          body: payload.body,
          data: payload.data || {},
          sound: payload.sound || 'default',
          priority: payload.priority || 'high',
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error dispatching Expo Push notification:', error);
      return false;
    }
  }

  /**
   * Sync user token to WordPress backend for Tutor LMS hooks
   */
  private async syncPushTokenToWordPress(userId: number, token: string) {
    try {
      await fetch('https://mathnotes.courses/wp-json/mathnotes/v1/user/push-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, push_token: token })
      });
    } catch (err) {
      // Handled silently
    }
  }

  // Pre-configured Notification Builders

  public static buildQuizDeadlineAlert(courseTitle: string, quizTitle: string, hoursRemaining: number): PushNotificationPayload {
    return {
      to: '',
      title: `⏰ Quiz Deadline: ${quizTitle}`,
      body: `You have ${hoursRemaining} hours left to complete this quiz in ${courseTitle}. Test your understanding now!`,
      data: { type: 'quiz_deadline', courseTitle, quizTitle },
      priority: 'high'
    };
  }

  public static buildStudentQNAReplyAlert(courseTitle: string, teacherName: string): PushNotificationPayload {
    return {
      to: '',
      title: `💬 Mentor Replied to Your Doubt!`,
      body: `${teacherName} just replied to your question in ${courseTitle}. Tap to read the explanation.`,
      data: { type: 'qna_reply', courseTitle },
      priority: 'high'
    };
  }

  public static buildTeacherNewDoubtAlert(studentName: string, courseTitle: string, lessonTitle: string): PushNotificationPayload {
    return {
      to: '',
      title: `🙋 New Student Doubt: ${studentName}`,
      body: `Question submitted in "${lessonTitle}" (${courseTitle}). Review and assist your learner.`,
      data: { type: 'teacher_new_doubt', courseTitle, lessonTitle },
      priority: 'high'
    };
  }

  public static buildTeacherNewSubmissionAlert(studentName: string, quizTitle: string, score: number): PushNotificationPayload {
    return {
      to: '',
      title: `📝 Quiz Attempt: ${studentName}`,
      body: `Completed "${quizTitle}" with score ${score}%. Ready for review.`,
      data: { type: 'teacher_new_submission', quizTitle, score },
      priority: 'normal'
    };
  }
}
