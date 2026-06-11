export type Subject = {
  id: string;
  name: string;
  color: string;
};

export type SessionType = "stopwatch" | "pomodoro";

export type Session = {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  durationSeconds: number;
  type: SessionType;
  startedAt: Date;
  savedAt: Date;
  pomodoroNumber?: number;
};
